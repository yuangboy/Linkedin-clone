const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
 
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    likes:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        }
    ],

   
            comments: [
                {
                    user:{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                    },
                    text: String,
                    createdAt: {
                        type: Date,
                        default: Date.now,
                    },
                }
            ],
  
   createdAt: {
        type: Date,
        default: Date.now,
    },
}); 

module.exports = mongoose.model("Post", postSchema);