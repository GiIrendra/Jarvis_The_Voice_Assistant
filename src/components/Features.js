import React from 'react';
import {View, Text, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Features() {
  return (
    <View style={{height: hp(60)}} className="space-y-4">
      <Text style={{fontSize: wp(6.5)}} className="font-semibold text-grey-700">
        Features
      </Text>
      <View className="bg-emerald-200 space-y-2 p-4 rounded-xl ">
        <View className="flex-row item-center space-x-1">
          <Image
            source={require('../../assets/images/gemini.png')}
            style={{height: hp(8), width: hp(8)}}
          />
          <Text style={{fontSize: wp(4.8)}} className="font-bold text-grey-700">

          </Text>
        </View>
        <Text style={{fontSize: wp(3.8)}} className="text-grey-700 font-medium">
        Gemini can provide you with instant and knowledgeable responses,
          assist you with creative ideas on a wide range of topics.
        </Text>
      </View>

      <View className="bg-purple-200 space-y-2 p-4 rounded-xl ">
        <View className="flex-row item-center space-x-1">
          <Image
            source={require('../../assets/images/dalleIcon.png')}
            style={{height: hp(4), width: hp(4)}}
          />
          <Text style={{fontSize: wp(4.8)}} className="font-bold text-grey-700">
            DALL-E
          </Text>
        </View>
        <Text style={{fontSize: wp(3.8)}} className="text-grey-700 font-medium">
          DALL-E can generate imaginative and diverse images from textual
          descriptions, expanding the boundaries of visual creativity.
        </Text>
      </View>

      <View className="bg-cyan-200 space-y-2 p-4 rounded-xl ">
        <View className="flex-row item-center space-x-1">
          <Image
            source={require('../../assets/images/smartaiIcon.png')}
            style={{height: hp(4), width: hp(4)}}
          />
          <Text style={{fontSize: wp(4.8)}} className="font-bold text-grey-700">
            Smart Ai
          </Text>
        </View>
        <Text style={{fontSize: wp(3.8)}} className="text-grey-700 font-medium">
          A powerful voice assistant with the abilities of ChatGPT and Dall-E,
          providing you the best of both worlds
        </Text>
      </View>
    </View>
  );
}
