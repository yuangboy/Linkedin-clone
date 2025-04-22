import { View, Text, ScrollView, Pressable, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import UserProfile from '../../../components/UserProfile';
import ConnectionRequest from '../../../components/ConnectionRequest';
import { useRouter } from 'expo-router';




const index = () => {


  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [users, setUsers] = useState();
  const [connectionRequests, setConnectionRequests] = useState([]);
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

  useEffect(() => {

    if (userId) {
      fetchUsers();
    }
  },
    [userId]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL_LOCAL}:3000/users/${userId}`);

      const userData = response.data.users;
      setUsers(userData);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {

    if (userId) {
      fetchFriendRequests();
    }
  }, [userId]);


  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(`http://${process.env.EXPO_PUBLIC_API_URL_LOCAL}:3000/connection-request/${userId}`);


      if (response.status === 200) {

        const connectionRequestsData = response.data?.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.profileImage
        }));

        setConnectionRequests(connectionRequestsData);
      }

    } catch (err) {
      console.log("error: ", err);
    }
  }

  console.log(connectionRequests);





  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>

      <Pressable onPress={() => router.push("/network/connections")}
        style={{ marginTop: 10, marginHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Manage My Network</Text>
        <AntDesign name="arrowright" size={24} color="black" />
      </Pressable>


      <View style={{ borderColor: "#E0E0E0", borderWidth: 2, marginVertical: 10 }} />

      <View
        style={{ marginTop: 10, marginHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Invitation (0)</Text>
        <AntDesign name="arrowright" size={24} color="black" />
      </View>
      <View style={{ borderColor: "#E0E0E0", borderWidth: 2, marginVertical: 10 }} />


      <View>
        {connectionRequests?.map((item, index) => (
          <ConnectionRequest item={item} key={index}
            setConnectionRequests={connectionRequests}
            userId={userId}
          />
        ))}
      </View>



      <View style={{ marginHorizontal: 15 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text>Développez votre réseau plus rapidement</Text>
          <Entypo name="cross" size={24} color="black" />
        </View>
        <Text>Trouvez et contactez les bonnes personnes, et voyez qui a consulté votre profil</Text>

        <View style={{ backgroundColor: "#FFC72C", width: 140, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 25, marginTop: 10 }}>
          <Text style={{ textAlign: "center", color: "white", fontWeight: "600" }}>Essayer Premium</Text>
        </View>
      </View>

      <FlatList
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item._id}
        data={users} renderItem={({ item, key }) => <UserProfile userId={userId} key={key} item={item} />}
        scrollEnabled={false}
      >

      </FlatList>

    </ScrollView>
  )
}

export default index