import { View, Text, Pressable, Image, TextInput, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import {
  AntDesign, Ionicons, Entypo, Feather,
  FontAwesome, EvilIcons, SimpleLineIcons
} from "@expo/vector-icons";

export default function profile() {

  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const router = useRouter();

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


  const [isEditing, setIsEditing] = useState(false);
  const [userDescription, setUserDescription] = useState("");

  const handleSaveDescription = async () => {
    try {
      const response = await axios.put(`http://${process.env.EXPO_PUBLIC_API_URL_LOCAL}:3000/profile/${userId}`, {
        userDescription
      });

      if (response.status === 200) {
        await fetchUserProfile();
      }
      setIsEditing(false);


    } catch (error) {
      console.log("Errot saving user description", error);

    }
  }


  const logout = () => {
    clearAuthToken();
  }

  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("auth token cleared");
    router.replace("/(authenticate)/Login");
  };


  return (
    <View>

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


      <Image
        style={{ width: "100%", height: 130 }}
        source={{ uri: "https://images.unsplash.com/photo-1503264116251-35a269479413" }}

      />

      <View style={{ position: "absolute", top: 130, left: 10 }}>
        <Image
          style={{ width: 120, height: 120, borderRadius: 60 }}
          source={{ uri: user?.profileImage }}
        />

        <View>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>{user?.name}</Text>
          <Pressable onPress={() => setIsEditing(!isEditing)}>
            <Text>{user?.userDescription ? "Edit" : "Add Bio"}</Text>
          </Pressable>

          <View>
            {
              isEditing ? (
                <>

                  <TextInput value={userDescription}
                    placeholder='Entrer votre description'
                    onChangeText={(text) => setUserDescription(text)} />
                  <Button onPress={handleSaveDescription} title="Save" />
                </>

              ) : (
                <>
                  <Text>{user?.userDescription}</Text>
                </>
              )
            }
          </View>

          <Text style={{ marginTop: 12, fontWeight: "500" }}>Clone Application Likedin </Text>
          {/* <Text style={{}}></Text> */}

        </View>


        <View style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10
        }}>
          <Pressable
            style={{
              backgroundColor: "#0072b1",
              paddingVertical: 4,
              paddingHorizontal: 10,
              borderRadius: 25
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Open to</Text>
          </Pressable>

          <Pressable
            style={{
              backgroundColor: "#0072b1",
              paddingVertical: 4,
              paddingHorizontal: 10,
              borderRadius: 25
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Add Section</Text>
          </Pressable>
        </View>

        <View
          style={{ marginHorizontal: 10, marginTop: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>Analytics</Text>
          <Text style={{ fontSize: 15, color: "gray" }}>Analytics</Text>

          <View style={{ flexDirection: "row", gap: 7, marginTop: 10 }}>
            <Ionicons name="people" size={24} color="black" />
            <View style={{ marginLeft: 7 }}>
              <Text style={{ fontWeight: "600", fontSize: 15 }}>350 Profile views</Text>
              <Text style={{ fontWeight: "500", fontSize: 15 }}>Discover who's viewed your profile</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 7, marginTop: 10 }}>
            <Entypo name="bar-graph" size={24} color="black" />
            <View style={{ marginLeft: 7 }}>
              <Text style={{ fontWeight: "600", fontSize: 15 }}>1242 postImpressions</Text>
              <Text style={{ fontWeight: "500", fontSize: 15 }}>Checkout wh'os engaing with your posts</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 7, marginTop: 10 }}>
            <Feather name="search" size={24} color="black" />
            <View style={{ marginLeft: 7 }}>
              <Text style={{ fontWeight: "600", fontSize: 15 }}>45 posts appareancend</Text>
              <Text style={{ fontWeight: "500", fontSize: 15 }}>See how often you appaer in search results</Text>
            </View>
          </View>

        </View>





        <Pressable onPress={logout}>
          <Text>Logout</Text>
        </Pressable>

      </View>



    </View>
  )
}