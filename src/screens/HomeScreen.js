import React from 'react';
import {View, Text, SafeAreaView,TouchableOpacity, StatusBar, } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';

export default function HomeScreen(props) {
  return (
    <SafeAreaView className="flex-1 flex justify-around bg-white">
      <StatusBar backgroundColor='grey'  barStyle="light-content" />
      <View className="space-y-2 ">
        <Text style={{fontSize:wp(12)}} className="text-center font-bold text-grey-700">
          Jarvis
        </Text>
        <Text style={{fontSize:wp(4)}} className="text-center tracking-wider  text-grey-600 font-semibold ">
          The future is here, powered by ai
        </Text>
      </View>
      <View className="justify-center flex-row">
        {/* <Image source={require('../../assets/images/welcome.png')} style={{width:wp(75),height:wp(75)}}/> */}
        <LottieView style={{flex:1,width:wp(75),height:wp(75)}} source={require('../../assets/images/robot.json')} speed={2} autoPlay loop/>
      </View>
      <TouchableOpacity className="bg-emerald-600 mx-5 p-4 rounded-2xl"
        onPress={()=>props.navigation.navigate('Welcome')}
      >
          <Text style={{fontSize:wp(6)}} className="text-center font-bold text-white">Get started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
