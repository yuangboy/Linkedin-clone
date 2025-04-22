import { View, Text, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable } from 'react-native'
import React, { useState,useEffect} from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { useRouter } from 'expo-router';



export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

      useEffect(() => {
        const checkLoginStatus=async()=>{

           try {
              const token=await AsyncStorage.getItem("authToken");
                 if(token){
                router.replace("/(tabs)/home");
                }
           } catch (error) {
              console.log("Error checking login status", error);
           }
        }
        checkLoginStatus();
        
      }, []);


    const handleLogin=async()=>{
        try {
        const user={email,password};
          axios.post(`http://${process.env.EXPO_PUBLIC_API_URL_LOCAL}:3000/login`,user)
          .then(response => {
              const {token}=response.data;
              AsyncStorage.setItem("authToken",token);
              router.replace("/(tabs)/home");
          });
           
        } catch (error) {
            console.log("Error logging in user", error);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
            <Image
                source={require("../../assets/images/linkedin-logo.png")} 
                style={{ width: 150, height: 100, resizeMode: "contain" }} />
            {/* <Image
                source={{ uri: "https://www.freepnglogos.com/uploads/linkedin-logo-transparent-png-25.png" }}
                style={{ width: 150, height: 100, resizeMode: "contain" }} /> */}

            <KeyboardAvoidingView>
                <View style={{ alignItems: "center" }}>
                    <Text
                        style={{ fontSize: 17, fontWeight: "bold", color: "#041E42", marginTop: 12 }}
                    >Login in to your account</Text>
                </View>


                <View style={{ marginTop: 70 }}>

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

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 12, justifyContent: "space-between" }}>
                        <Text>Keep me logged in</Text>
                        <Text>Forgot Password</Text>
                    </View>

                    <View style={{ marginTop: 80 }}>


                        <Pressable
                        onPress={handleLogin}
                        style={{ width: 200, backgroundColor: "#0072b1", marginRight: "auto", marginLeft: "auto", paddingVertical: 12, borderRadius: 5 }}>
                            <Text style={{
                                textAlign: "center", color: "white",
                                fontSize: 17, fontWeight: "bold"
                            }}>Login</Text>
                        </Pressable>

                        <Pressable onPress={() => router.replace("/Register")} style={{ marginTop: 12 }}>
                            <Text style={{
                                textAlign: "center", color: "gray",
                                fontSize: 17, fontWeight: "400"
                            }}>Don't have an account? Sign up</Text>
                        </Pressable>

                    </View>




                </View>


            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}