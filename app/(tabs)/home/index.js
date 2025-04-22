import { View, Text, ScrollView, Pressable, TextInput, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { AntDesign, Ionicons, Entypo, Feather, FontAwesome, EvilIcons, SimpleLineIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr');


const index = () => {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);



  useEffect(() => {

    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.log("No token found");
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        setUserId(userId);
        console.log(decodedToken);
        console.log("userId: ", userId);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, []);

  console.log("userId: ", userId);
  useEffect(() => {

    if (userId) {
      fetchUserProfile();
    }
  },
    [userId]);


  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL_LOCAL}:3000/profile/${userId}`);

      const userData = response.data.user;
      setUser(userData);
    } catch (err) {
      console.log(err);
    }
  }

  console.log("user: ", user);

  useEffect(() => {

    const fetchAllPosts = async () => {

      try {
        const reponse = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL_LOCAL}:3000/all`);
        setPosts(reponse.data.posts);
      } catch (error) {
        console.Log(error);
      }

    }
    fetchAllPosts();

  }, [])


  const MAX_LINES = 2;
  const [showfullText, setShowfullText] = useState(false);

  const toogleShowFullText = () => {
    setShowfullText(!showfullText);
  }

  const [isLiked, setIsLiked] = useState(false);

  const handlelikePost = async (postId) => {

    try {

      const response = await axios.post(`http://${process.env.EXPO_PUBLIC_API_URL_LOCAL}:3000/like/${postId}/${userId}`);

      if (response.status === 200) {
        const uplatedPost = response.data.post;
        setIsLiked(uplatedPost.likes.some((like) => like.user === userId));
      }



    } catch (error) {
      console.log("Error liking/unLiking the post", error);
    }

  }


  return (
    <ScrollView >
      <View style={{ padding: 10, flexDirection: "row", alignItems: "center", gap: 4 }}>

        <Pressable onPress={() => router.push("/home/profile")}>
          <Image
            style={{
              width: 30,
              height: 30,
              borderRadius: 15
            }}
            source={{ uri: user?.profileImage }}
          />
        </Pressable>

        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            marginVertical: 10,
            gap: 10,
            backgroundColor: "white",
            height: 30,
            borderRadius: 3,
            flex: 1
          }}
        >
          <AntDesign
            style={{ marginLeft: 10 }}
            name="search1" size={20} color="black" />
          <TextInput

          />


        </Pressable>
        <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
      </View>


      <View>
        {
          posts?.map((item, index) => {


            console.log(item?.user?.profileImage);
            return (<View
              // style={{flexDirection:"row",justifyContent:"space-between",marginHorizontal:10}}
              key={index}>

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 10 }}>
                <Image
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                  source={{ uri: item?.user?.profileImage }} />

                <View style={{ flexDirection: "column", gap: 2 }}>
                  <Text
                    style={{ fontSize: 15, fontWeight: "600" }}
                  >{item?.user?.name}</Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      width: 230,
                      color: "gray",
                      fontSize: 15,
                      fontWeight: "400"
                    }}
                  >Engineer Graduate | linledin Member</Text>

                  <Text>{moment(item?.createdAt).format('D MMMM YYYY')}</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Entypo name="dots-three-vertical" size={24} color="black" />
                  <Feather name="x" size={20} color="black" />
                </View>



              </View>


              <View
                style={{ marginHorizontal: 10, marginBottom: 12, marginTop: 10 }}>
                <Text numberOfLines={showfullText ? undefined : MAX_LINES}>{item?.description}</Text>
                {
                  !showfullText && (
                    <Pressable onPress={toogleShowFullText}>
                      <Text>See more</Text>
                    </Pressable>
                  )}
              </View>

              <Image
                style={{ width: "100%", height: 240 }}
                source={{ uri: item?.imageUrl }}
              />

              {
                item?.likes?.length > 0 && (
                  <View style={{ padding: 10, flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <SimpleLineIcons name="like" size={16} color="#0072b1" />
                    <Text style={{ color: "gray" }}>{item.likes?.length}</Text>
                  </View>
                )

              }


              <View style={{
                height: 2, borderColor: "#E0E0E0",
                borderWidth: 2
              }} />

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginVertical: 10 }}>


                <Pressable onPress={() => handlelikePost(item?._id)}>
                  <AntDesign style={{ textAlign: "center" }} name="like2" size={20}
                    color={isLiked ? "#0072b1" : "gray"} />
                  <Text style={{
                    textAlign: "center", fontSize: 12,
                    color: isLiked ? "#0072b1" : "gray",
                    marginTop: 2
                  }}>Like</Text>
                </Pressable>


                <Pressable>
                  <FontAwesome style={{ textAlign: "center" }} name="comment-o" size={20} color="black" />
                  <Text style={{ textAlign: "center", fontSize: 12, color: "gray", marginTop: 2 }}>Comment</Text>
                </Pressable>
                <Pressable>
                  <EvilIcons style={{ textAlign: "center" }} name="share-apple" size={20} color="black" />
                  <Text style={{ textAlign: "center", fontSize: 12, color: "gray", marginTop: 2 }}>respost</Text>
                </Pressable>
                <Pressable>
                  <Feather style={{ textAlign: "center" }} name="send" size={20} color="black" />
                  <Text style={{ textAlign: "center", fontSize: 12, color: "gray", marginTop: 2 }}>send</Text>
                </Pressable>
              </View>

            </View>





            )
          })
        }

      </View>


    </ScrollView>
  )
}

export default index