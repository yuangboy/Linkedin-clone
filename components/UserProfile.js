import { View, Text, Image, Dimensions, Pressable } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';

export default function UserProfile({ item, userId }) {

    const [connectionSet, setConnectionSet] = useState(false);
    const sendConnectionRequest = async (userId, selectedUserId) => {
        try {
            const response = await axios.post("http://10.0.2.2:3000/connection-request", {
                currentUserId: userId,
                selectedUserId: selectedUserId
            });

            if (response.status === 200) {
                setConnectionSet(true);
                console.log("Connection request sent successfully");
            }

            console.log(response);
        } catch (error) {
            console.log("Error sending connection request", error);
        }
    }


    return (
        <View style={{
            flex: 1,
            borderRadius: 9, marginHorizontal: 16, boderColor: "#E0E0E0",
            borderWidth: 1, marginVertical: 10,
            justifyContent: "center",
            alignItems: "center",
            height: Dimensions.get("window").height / 4,
            width: (Dimensions.get("window").width - 80) / 2

        }}>

            <View>
                <Image
                    style={{ width: 70, height: 70, borderRadius: 45, resizeMode: "cover" }}
                    source={{ uri: item?.profileImage }} />
            </View>

            <View style={{ marginTop: 10 }}>
                <Text style={{
                    textAlign: "center", fontSize: 16, fontWeight: "600",
                }}>{item?.name}</Text>
                <Text
                    style={{ textAlign: "center", marginLeft: 1, marginTop: 2 }}
                >Engeneer Graduate | Linkedin member</Text>
            </View>


            <Pressable
                onPress={() => { sendConnectionRequest(userId, item?._id) }}
                style={{
                    borderColor: connectionSet || item?.connections.includes(userId) ? "gray" : "#0072b1",
                    borderRadius: 25,
                    marginTop: 7, paddingHorizontal: 15, paddingVertical: 4,
                    marginLeft: "auto", marginRight: "auto", borderWidth: 1
                }}>
                <Text style={{ fontWight: "600", color: "#0072b1" }}>
                    { connectionSet || item?.connections.includes(userId) ? "En attente" : "Connect"}
                    </Text>
            </Pressable>

            

        </View>
    )
}