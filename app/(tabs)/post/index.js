import {
  View, Text, Image, ScrollView,
  Pressable, TextInput, Alert
} from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';

const index = () => {

  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [userId, setUserId] = useState("");
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





  const handleImagePicker = async () => {
    const pickImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickImage.canceled) {
      setImage(pickImage.assets[0].uri); // on ne fait rien d'autre ici
    }
  };


  const handlePost = async () => {
    try {
      let uploadedImageUrl = image;

      if (image && !image.includes("s3.amazonaws.com")) {
        // Si c’est une image locale, on l’upload
        const response = await axios.post(`http://${process.env.EXPO_PUBLIC_API_URL_LOCAL}:3000/generate-presigned-url`);
        const presignedUrl = response.data.url;
        const publicUrl = presignedUrl.split('?')[0];

        const uploadResult = await FileSystem.uploadAsync(presignedUrl, image, {
          httpMethod: 'PUT',
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          headers: {
            'Content-Type': 'image/jpeg',
          },
        });

        if (uploadResult.status === 200) {
          uploadedImageUrl = publicUrl;
        } else {
          Alert.alert('Erreur', `Échec de l'upload sur S3 : code ${uploadResult.status}`);
          return;
        }
      }

      if (userId) {
        const response = await axios.post(`http://${process.env.EXPO_PUBLIC_API_URL_LOCAL}:3000/create`, {
          description,
          imageUrl: uploadedImageUrl,
          userId,
        });

        if (response.status === 201) {
          // setDescription("");
          // setImage("");
          Alert.alert('Succès', 'Post créé avec succès');
          router.replace("/(tabs)/home");
        }
      }

    } catch (err) {
      console.log('error creating the post', err);
      Alert.alert('Erreur', err.message);
    }
  };


  return (
    <ScrollView>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginVertical: 12 }}>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>

          <Entypo name="circle-with-cross" size={24} color="black" />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image style={{ width: 40, height: 40, borderRadius: 20 }}
              source={{ uri: "https://randomuser.me/api/portraits/men/25.jpg" }}
            />
            <Text style={{ fontWeight: "500" }}>Anonyme</Text>
          </View>
        </View>


        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginRight: 8 }}>


          <Entypo name="back-in-time" size={24} color="black" />
          <Pressable
            onPress={handlePost}
            style={{ padding: 10, backgroundColor: "#0072b1", borderRadius: 20, width: 80 }}>
            <Text style={{ textAlign: "center", fontWeight: "bold", color: "white" }}>Post</Text>
          </Pressable>
        </View>

      </View>

      <TextInput value={description} onChangeText={(text) => setDescription(text)}
        placeholder='de quoi veux-tu parler'
        placeholderTextColor={"black"}
        style={{
          marginHorizontal: "10",
          fontSize: 15,
          fontWeight: "500",
          marginTop: 10
        }}
        multiline={true}
        numberOfLines={10}
        textAlignVertical='top'
      />

      {
        image && (
          <Image source={{ uri: image }} style={{ width: "100%", height: 200, marginVertical: 10 }} />
        )
      }

      <Pressable style={{ flexDirection: "column", marginRight: "auto", marginLeft: "auto" }}>

        <Pressable
          onPress={handleImagePicker}
          style={{
            width: 40, height: 40, marginTop: 15, backgroundColor: "#E0E0E0", borderRadius: 20,
            justifyContent: "center", alignItems: "center"
          }}>
          <MaterialIcons name="perm-media" size={24} color="black" />
        </Pressable>

        <Text>Media</Text>

      </Pressable>

    </ScrollView>
  )
}

export default index;
