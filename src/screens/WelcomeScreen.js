import React, {useEffect, useRef, useState,NativeEventEmitter} from 'react';
import LottieView from 'lottie-react-native';
import Voice from '@react-native-voice/voice';

import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Features from '../components/Features';
import {dummyMessages} from '../constants';
import { apiCall } from '../api/openAi';
import Tts from 'react-native-tts';

export default function WelcomeScreen(props) {

  const [messages, setMessage] = useState([]);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [result, setResult] =useState('');
  const [textResult, setTextResult] =useState('');
  const ScrollViewRef = useRef();
  const[loading,setLoading]=useState(false);


  const startRecording =async()=>{
    Tts.stop();
    setRecording(true);
    try {
      setResult('');
      await Voice.start('en-US');//US
    } catch (err){
      console.log(err);
    }
  };

  const stopRecording =async()=>{
    try {
      await Voice.stop();
      setRecording(false);
      // fetch results from gpt
      console.log('result from stop recording -----------------------',result);
    } catch (err){
      console.log(err);
    }
  };

const fetchResponse = ()=>{
  if(result.trim().length>0){
    let newMessages = [...messages];
    newMessages.push({
      "role": "user",
      "parts": [{"text": result.trim()}]
  });
    setMessage(newMessages);
    updateScrollView();
    setLoading(true);

    apiCall(result.trim(),newMessages).then((resp)=>{
      console.log('got api data : ',resp);
      setLoading(false);
      if(resp.success){
        setMessage([...resp.data]);
        StartTextToSpeech(resp.data[resp.data.length-1])
        updateScrollView();
        setResult('');
      }else{
        Alert.alert("!!! Error in data fetching 🥺!!! ", resp.message);
      }
    })
    
  }
}
const StartTextToSpeech =(message)=>{
  if(!message.parts[0].text.includes('https')){
    setSpeaking(true);
    Tts.speak(message.parts[0].text, {
      iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
      rate: 1,
    });
  }
  // console.log("my message:: --->",message.parts[0].text)
} 

const updateScrollView=()=>{
  setTimeout(()=>{
    ScrollViewRef?.current?.scrollToEnd({animated: true});
  },200)
}
 
useEffect(()=>{
  if(result.length>0){
    fetchResponse();
  }
},[result]);
  // Set up voice recognition---------------------------------------
  const speechStartHandler = e=>{
    console.log('speech start handler');
  }
  const speechEndHandler = e=>{
    console.log('speech end handler');
    setRecording(false);
  }
  const speechResultsHandler = (e)=>{
    console.log('voice event ',e.value );
    const text = e.value[0];
    setResult(text);
  }
  const speechErrorHandler = e=>{
    console.log('speech error handler ',e );
  }
  useEffect(()=>{
    // voice handler events --------------------------------------------------
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    //tts handlers----------------------------------------------------------
    Tts.addEventListener('tts-start', (event) => console.log("start", event));
    Tts.addEventListener('tts-finish', (event) => {console.log("finish", event);setSpeaking(false)});
    Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));
    return(e)=>{
      // destroy  the voice instance ------------------------------------------------
      Voice.destroy().then(Voice.removeAllListeners());
      Tts.stop();
    }
  },[]);


    
  function clear(){
    Tts.stop();
    setMessage([]);
  };
  const stopSpeaking=()=>{
    Tts.stop();
    setSpeaking(false);
  }
  console.log('final result ',result);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 flex mx-5" >
        {/* bot icon---------------------------------------------------------------------------------- */}
        <View className="flex-row mx-5 justify-center">
          <LottieView
            className="rounded-full"
            style={{width: hp(15), height: hp(15)}}
            source={require('../../assets/images/bot.json')}
            speed={1}
            autoPlay
            loop
          />
        </View>
        
        {/*  features|| messages---------------------------------------------------------------------------------- */}
        {messages.length > 0 ? (
          <View className="flex-1 space-y-2">
            <Text
              style={{fontSize: wp(5)}}
              className="font-semibold ml-1 text-gray-700">
              Assistant
            </Text>
          <TextInput placeholder='Enter query to search...' onSubmitEditing={()=>{setResult(textResult);setTextResult('')}} value={textResult} onChangeText={(text)=>setTextResult(text)} className="border-2 border-cyan-700 w-15 h-9 rounded-full bg-grey-100 rounde mx-9 px-4"></TextInput>

            <View
              style={{height: hp(58)}}
              className="bg-neutral-200 rounded-3xl p-4">
              <ScrollView
                ref={ScrollViewRef}
                bounce={false}
                className="space-y-4"
                showsVerticalScrollIndicator={false}>
                {messages.map((message, index) => {
                  if (message.role == 'assistant') {
                    if (message.parts[0].text.includes('https')) {
                      // it is an ai image-----------------------------------------
                      return (
                        <View key={index} className="flex-row justify-start">
                          <View className="bg-emerald-100 p-2 flex rounded-2xl rounded-tl-none">
                            <Image
                              source={{uri: message.parts[0].text}}
                              className="rounded-2xl"
                              resizeMode="contain"
                              style={{height: wp(60), width: wp(60)}}
                            />
                          </View>
                        </View>
                      );
                    } else {
                      // text response-----------------------------------------
                      return (
                        <View
                          key={index}
                          style={{width: wp(70)}}
                          className="bg-emerald-100 rounded-xl p-2 rounded-tl-none">
                          <Text>{message.parts[0].text}</Text>
                        </View>
                      );
                    }
                  } else {
                    // user input-----------------------------------------
                    return (
                      <View key={index} className="flex-row justify-end">
                        <View
                          style={{width: wp(70)}}
                          className="bg-white rounded-xl p-2 rounded-tr-none">
                          <Text>{message.parts[0].text}</Text>
                        </View>
                      </View>
                    );
                  }
                })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )}


        {/* recording clear and stop button----------------------------------------- */}

        <View className="flex flex-0.5 justify-center items-center ">
          {
            loading?
            <ActivityIndicator size='1000' color="red"  animating/>
            
            :recording ? (
              //recording stop button---------------------------------------
              <TouchableOpacity onPress={stopRecording}>
                <LottieView
                  className="rounded-full"
                  style={{
                    width: hp(15),
                    height: hp(15),
                    shadowColor: 'black',
                    elevation: 5,
                  }}
                  source={require('../../assets/images/recordingMic.json')}
                  speed={0.5}
                  autoPlay
                  loop
                />
              </TouchableOpacity>
            ) : (
              // recording start button----------------------------------------
              <TouchableOpacity onPress={startRecording}>
                <Image
                  className="rounded-full"
                  source={require('../../assets/images/recordingicon.png')}
                  style={{width: hp(15), height: hp(15)}}
                />
              </TouchableOpacity>
            )
          }
          
          {messages.length > 0 && (
            <TouchableOpacity 
            onPress={clear}
            className="flex bg-neutral-400  rounded-3xl p-2 absolute right-10">
              <Text className="text-white font-semibold">Clear</Text>
            </TouchableOpacity>
          )}


          {speaking && (
            <TouchableOpacity 
            onPress={stopSpeaking}
            className="flex bg-red-400  rounded-3xl p-2 absolute left-10">
              <Text className="text-white font-semibold">Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
