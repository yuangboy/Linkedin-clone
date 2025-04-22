import {Tabs} from "expo-router";
import { View, Text } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function Layout() {
    return (
        <Tabs>

            <Tabs.Screen name="home" 
            options={{
                headerShown:false,
                tabBarLabel:"Home", 
                tabBarLabelStyle: {
                    color:"#008E97"
                },
              tabBarIcon:({focused})=>
                focused ? (
                    <Entypo name="home" size={24} color="black" />
                ): (
                    <AntDesign name="home" size={24} color="black" />
                )
            }}
            
            />


<Tabs.Screen name="network" 
            options={{
                headerShown:false,
                tabBarLabel:"network", 
                tabBarLabelStyle: {
                    color:"#008E97"
                },
              tabBarIcon:({focused})=>
                focused ? (
                    <Ionicons name="people-sharp" size={24} color="black" />
                ): (
                    <Ionicons name="people-outline" size={24} color="black" />
                )

              
            
            }}
            
            />



<Tabs.Screen name="post" 
       
            options={{
                headerShown:false,
                tabBarLabel:"Post", 
                tabBarLabelStyle: {
                    color:"#008E97"
                },
              tabBarIcon:({focused})=>
                focused ? (
                    <AntDesign name="plussquare" size={24} color="black" />
                ): (
                    <AntDesign name="plussquareo" size={24} color="black" />
                )

              
            
            }}
            
            />



        </Tabs>


    );
}