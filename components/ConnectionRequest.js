import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';

const ConnectionRequest = ({ item, connectionRequests, setConnectionRequests, userId }) => {


    const acceptConnection = async (requestId) => {
        try {
            const response = await fetch("http://10.0.2.2:3000/connection-accept", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    senderId: requestId,
                    recipientId: userId
                })

            });

            if (response.ok) {
                setConnectionRequests(connectionRequests.filter((request) =>
                    request._id !== requestId
                ));
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View style={{ marginHorizontal: 15, marginVertical: 5 }}>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                <Image
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    source={{ uri: item?.image }}
                />
                <Text style={{ width: 200 }}>{item?.name}vous invite à vous connecter</Text>


                <View style={{
                    width: 36, height: 36, borderRadius: 18, backgroundColor: "#E0E0E0",
                    justifyContent: "center", alignItems: "center"
                }}>
                    <Feather name="x" size={22} color="black" />
                </View>

                <Pressable
                    onPress={() => acceptConnection(item._id)}
                >
                    <View style={{
                        width: 36, height: 36, borderRadius: 18, backgroundColor: "#E0E0E0",
                        justifyContent: "center", alignItems: "center"
                    }}>
                        <Ionicons name="checkmark-outline" size={22} color="#0072b1" />
                    </View>
                </Pressable>


            </View>



        </View>
    )
}

export default ConnectionRequest