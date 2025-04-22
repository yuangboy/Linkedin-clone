import { View, Text, Image,ScrollView } from 'react-native'
import React,{useState,useEffect} from 'react'
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr');

const connections = () => {

  
  const [connections,setConnections]=useState([]);
  const [userId, setUserId] = useState("");

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

    useEffect(()=>{
      if(userId){
        fetchConnections();
      }
    },[userId]);

    const fetchConnections=async()=>{
      try{
        const response=await axios.get(`http://10.0.2.2:3000/connections/${userId}`);
        setConnections(response.data.connections);
      }catch(err){
            console.log(err);         
      }
    }

    console.log(connections);


  return (
    <View style={{flex:1,backgroundColor:"white"}}>

      <View style={{flexDirection:"row",alignItems:"center", justifyContent:"space-between",
        marginTop:10, marginHorizontal:12}}>
        <Text style={{fontWeight:"500"}}>{connections.length} Connections</Text>
        <View style={{flexDirection:"row",alignItems:"center", gap:10}}>
        <AntDesign name="search1" size={22} color="black" />
        <Octicons name="three-bars" size={22} color="black" />
        </View>

       
      </View>

      <View style={{height:2, borderColor:"#E0E0E0",borderWidth:2,marginTop:12}}/>

      <View style={{marginHorizontal:10,marginTop:10}}>
      {
            connections.map((item,index)=>(
             
              <View style={{flexDirection:"row",alignItems:"center",
                gap:10, marginVertical:10
              }} key={index}>
              <Image style={{width:48, height:48, borderRadius:24}}
              source={{uri:item?.profileImage}}
              />
              <View style={{flexDirection:"column",gap:2,flex:1}}>
                <Text style={{fontSize:15,fontWeight:"500"}}>{item?.name}</Text>
                <Text style={{color:"gray"}}>B.Tech | computer Science Technology</Text>
                {/* <Text>Connected on {moment(item?.createdAt).format("MMMM Do, YYYY")} </Text> */}
                <Text>Connecté le {moment('2025-04-20T15:30:00Z').format('D MMMM YYYY')}</Text>
              </View>


              <View style={{flexDirection:"row"}}>
              <MaterialCommunityIcons name="dots-vertical" size={20} color="black" />
              <Feather name="send" size={20} color="black" />
              </View>

            </View>
              
            ))}
      </View>


    </View>
  )
}

export default connections