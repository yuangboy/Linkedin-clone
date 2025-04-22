const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const AWS = require('aws-sdk');
const {v4:uuidv4}=require("uuid");
dotenv.config();




app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(express.json());


mongoose.connect("mongodb://localhost:27017/linkedin-clone").then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
})



app.get("/", async(req,res)=>{
    res.send("Hello likedin");
})


app.listen(3000,"0.0.0.0", () => {
    console.log("Server is running on port 3000");
});

const User = require("./models/user");
const Post = require("./models/post");
const { error } = require("console");

const s3=new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
})

app.post("/register", async (req, res) => {
    try {
        const { name, email, password, profileImage } = req.body;

        //verifier si l'email existe deja
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("Email already exists");
            return res.status(400).send("Email already exists");
        }


        const newUser =await new User({
            name,
            email,
            password,
            profileImage
        });


        // genere la verification token
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");

        //save
        await newUser.save();

        //envoie le mail de verification 
        sendVerificationEmail(newUser.email, newUser.verificationToken);

        res.status(202).json({
            message: "User created successfully. Please check your email to verify your account",
            user: newUser
        });

    } catch (err) {
        console.log("Error creating user", err);
        res.status(400).send(err);
    }
});

const sendVerificationEmail = async (email, verificationToken) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "albinmpobo@gmail.com",
            pass: "fsmh uycr kafs apls" //replace with your password
        }
    });

    const mailOptions = {
        from: "albinmpobo@gmail.com",
        to: email,
        subject: "Verify your account",
        text: `Please click the following link to verify your account: http://localhost:3000/verify/${verificationToken}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully");
    } catch (error) {
        console.log("Error sending the verification email");
    }

};

app.get("/verify/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            console.log("User not found");
            return res.status(404).send("User not found");
        }
        user.verified = true;
        user.verificationToken = undefined;
        await user.save();
        res.status(200).json({
            message: "User verified successfully"
        })
    } catch (err) {
        console.log("Error verifying user", err);
        res.status(400).send(err);
    }
});


const generateAccessKey = () => {
    const accessKey = crypto.randomBytes(32).toString("hex");
    return accessKey;
}
const accessKey = generateAccessKey();

//endpoint de login

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(404).send("User not found");
        }
        if (!user.verified) {
            console.log("User not verified");
            return res.status(401).send("User not verified");
        }
        if (user.password !== password) {
            console.log("Invalid password");
            return res.status(401).send("Invalid password");
        }

        const token = jwt.sign({ id: user._id }, accessKey);

        res.status(200).json({ token });

    } catch (err) {
        console.log("Error logging in user", err);
        res.status(400).send(err);
    }
});

app.get("/profile/:userId", async (req, res) => {

    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });

    } catch (error) {
        console.log("Error getting user profile", error);
        res.status(400).send(error);
    }
});

app.get("/users/:userId", async (req, res) => {

    try {
        const loggedInUserId = req.params.userId;
        const loggedInUser = await User.findById(loggedInUserId).populate("connections", "_id");

        if (!loggedInUser) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        const connectedUserIds = loggedInUser.connections.map(connection => connection._id);
        const users = await User.find({ _id: { $ne: loggedInUserId, $nin: connectedUserIds } });

        res.status(200).json({ users });

    } catch (error) {
        console.log("Error getting user profile", error);
        res.status(400).json({ message: "Error getting user profile" });
    }

});

// send connection request
app.post("/connection-request", async (req, res) => {
    try {
        const { currentUserId, selectedUserId } = req.body;

        await User.findByIdAndUpdate(selectedUserId, {
            $push: { connectionRequests: currentUserId }
        });

        await User.findByIdAndUpdate(currentUserId, {
            $push: { sentConnectionRequests: selectedUserId }
        });

        res.sendStatus(200);

    } catch (error) {
        res.status(400).json({ message: "Error sending connection request" });
    }
});



//endpoint to show all the connections requests

app.get("/connection-request/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId)
        .populate("connectionRequests", "name email profileImage")
        .lean();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connectionRequests = user.connectionRequests || [];
        res.status(200).json(connectionRequests);

    } catch (error) {
        console.log("Error getting user profile", error);
        res.status(400).json({ message: "Error getting user profile" });
    }
});


//endpoint to accept a connection request

app.post("/connection-accept", async (req, res) => {

    try {

        const { senderId, recipientId } = req.body;
        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);

        sender.connections.push(recipientId);
        recipient.connections.push(senderId);

        recipient.connectionRequests = recipient.connectionRequests.filter((request) => request.toString() !== senderId.toString());
        sender.sentConnectionRequests = sender.sentConnectionRequests.filter((request) => request.toString() !== recipientId.toString());


       await sender.save();
       await recipient.save();

       res.status(200).json({ message: "Connection request accepted successfully" });


    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error accepting connection request" });
    }

});


// point de terminaison pour récupérer toutes les connexions de l'utilisateur


app.get("/connections/:userId",async(req,res)=>{


    try{
        const userId=req.params.userId;
        const user=await User.findById(userId)
        .populate("connections","name profileImage createdAt")
        .exec();
    
        if(!user){
            console.log("User is not found",error);
        }

        res.status(200).json({connections:user.connections})


    }catch(err){
        console.log(err);
    }

});


// endpoint to create post 


app.post("/create",async(req,res)=>{

   try{
      const {description,imageUrl,userId}=req.body;
    
      const newPost=new Post({
        description:description,
        imageUrl:imageUrl,
        user:userId
      });

      await newPost.save();
      res.status(201).json({message:"post created sucessfully"});

   }catch(err){
      console.log("Error creating the post",err);
      res.status(500).json({message:"Error creating the post"});
   }
});

//endpoint to fech all the posts

app.get("/all",async(req,res)=>{

    try{
        const posts=await Post.find().populate("user","name profileImage");
        res.status(200).json({posts});

     }catch(err){
        console.log("Error creating the post",err);
        res.status(500).json({message:"Error featching all the posts"});
     }

});


// Route pour générer une URL signée
app.post('/generate-presigned-url', async (req, res) => {
    try {
      const fileName = `${uuidv4()}.jpg`; // Nom de fichier unique
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `images/${fileName}`, // Dossier `images` dans ton bucket
        Expires: 360, // 60 secondes de validité
        ContentType: 'image/jpeg',
        // ACL: 'public-read',
      };
  
      const url = await s3.getSignedUrlPromise('putObject', params);
      res.json({ url });
    } catch (err) {
      console.error('Erreur génération URL signée :', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });


// endpoint to like a post


app.post("/like/:postId/:userId",async(req,res)=>{

    try{
        const postId=req.params.postId;
        const userId=req.params.userId;

        const post=await Post.findById(postId);
        if(!post){
            return res.status(400).json({message:"Post not found"});
        }
       // check if the user has already liked the post 

       const existingLike=post?.likes.find(
        (like)=>like.user.toString()===userId
       );

       if(existingLike){
        post.likes=post.likes.filter((like)=>like.user.toString() !== userId);
       }else{
         post.likes.push({user:userId});
       }

       await post.save();
       res.status(200).json({message:"Post like/unlike successfull ",post});
       

    }catch(error){
        console.log(error);
        res.status(500).json({message:"Error liking the post"});
    }

});


//endpoint to update usr description

app.put("/profile/:userId",async(req,res)=>{

    try{

        const userId=req.params.userId;
        const {userDescription}=req.body;

        await User.findByIdAndUpdate(userId,{userDescription});
        console.log("User profile uplated successfully");
        res.status(200).json({message:"User profile uplated successfully"});
        

    }catch(error){
         console.log("Error updating user Profile",error);
         res.status(500).json({message:"Error updating user profile"});

    }

});

