import {
    View, Text, SafeAreaView, Image, KeyboardAvoidingView,
    TextInput, Pressable, Alert,
    ScrollView
} from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { useRouter } from 'expo-router';



export default function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const router = useRouter();

    const handleRegister = () => {
        const user = {
            name,
            email,
            password,
            profileImage: image
        }

        axios.post(`http://${process.env.EXPO_PUBLIC_API_URL_LOCAL}:3000/register`,user)
            .then(response => {
                console.log(response);
                Alert.alert("Registration successful");
                setEmail("");
                setPassword("");
                setName("");
                setImage("");
            })
            .catch(error => {
                console.log("Error registering user", error);
            })

    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
            <Image
                source={{ uri: "https://www.freepnglogos.com/uploads/linkedin-logo-transparent-png-25.png" }}
                style={{ width: 150, height: 100, resizeMode: "contain" }} />

            <KeyboardAvoidingView>
                <View style={{ alignItems: "center" }}>
                    <Text
                        style={{ fontSize: 17, fontWeight: "bold", color: "#041E42", marginTop: 12 }}
                    >Register to your account</Text>
                </View>


                <View style={{
                    flexDirection: "row", alignItems: "center",
                    gap: 5, backgroundColor: "#E0E0E0",
                    marginTop: 30, borderRadius: 5, paddingVertical: 5
                }}>
                    <Ionicons style={{ marginLeft: 8 }} name="person" size={24} color="black" />
                    <TextInput
                        style={{ color: "gray", marginVertical: 10, width: 300, fontSize: name ? 18 : 18 }}
                        placeholder='Enter your Name'
                        value={name}
                        onChangeText={text => setName(text)}
                    />
                </View>



                <View style={{
                    flexDirection: "row", alignItems: "center",
                    gap: 5, backgroundColor: "#E0E0E0",
                    marginTop: 30, borderRadius: 5, paddingVertical: 5
                }}>
                    <MaterialIcons
                        style={{ marginLeft: 8 }}
                        name="email" size={24} color="black" />
                    <TextInput
                        style={{ color: "gray", marginVertical: 10, width: 300, fontSize: email ? 18 : 18 }}
                        placeholder='Enter your Email' value={email} onChangeText={text => setEmail(text)} />
                </View>

                <View style={{
                    flexDirection: "row", alignItems: "center",
                    gap: 5, backgroundColor: "#E0E0E0",
                    marginTop: 30, borderRadius: 5, paddingVertical: 5
                }}>
                    <AntDesign style={{ marginLeft: 8 }} name="lock" size={24} color="black" />
                    <TextInput
                        style={{ color: "gray", marginVertical: 10, width: 300, fontSize: password ? 18 : 18 }}
                        placeholder='Enter your Password'
                        secureTextEntry={true}
                        value={password}
                        onChangeText={text => setPassword(text)}
                    />
                </View>


                <View style={{
                    flexDirection: "row", alignItems: "center",
                    gap: 5, backgroundColor: "#E0E0E0",
                    marginTop: 30, borderRadius: 5, paddingVertical: 5
                }}>
                    <Ionicons style={{ marginLeft: 8 }} name="image-outline" size={24} color="black" />
                    <TextInput
                        style={{ color: "gray", marginVertical: 10, width: 300, fontSize: image ? 18 : 18 }}
                        placeholder='Enter your Image'
                        value={image}
                        onChangeText={text => setImage(text)}
                    />
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 12, justifyContent: "space-between" }}>
                    <Text>Keep me logged in</Text>
                    <Text>Forgot Password</Text>
                </View>

                <View style={{ marginTop: 30 }}>


                    <Pressable onPress={handleRegister}
                        style={{ width: 200, backgroundColor: "#0072b1", marginRight: "auto", marginLeft: "auto", paddingVertical: 12, borderRadius: 5 }}>
                        <Text style={{
                            textAlign: "center", color: "white",
                            fontSize: 17, fontWeight: "bold"
                        }}>Register</Text>
                    </Pressable>

                    <Pressable onPress={() => router.replace("/")} style={{ marginTop: 12 }}>
                        <Text style={{
                            textAlign: "center", color: "gray",
                            fontSize: 17, fontWeight: "400"
                        }}>Already have an account? Signup</Text>
                    </Pressable>

                </View>







            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}