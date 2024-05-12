import axios from 'axios';
import { apiKey } from '../constants';
import { apiKey1 } from '../constants';

const client = axios.create({
    headers:{
        'x-goog-api-key': apiKey,  //from gemini
        'Content-Type': 'application/json'
    }
})
// const msg11 = `Does this message want to generate an picture, image, art or anything similar ${prompt}. Simply answer with yes or no.`;
const geminiEndpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`;
const dalleEndpoint = 'https://api.openai.com/v1/images/generations';

 export const apiCall = async(prompt, messages)=>{
    try {
        const res = await client.post(geminiEndpoint,{
            "contents":[{
                "role": "user",
                "parts":[{"text": `${prompt}, Does this message want to generate an picture, image, art or anything similar?. Simply answer with yes or no.`}]}]
        });
        console.log('data ', res.data.candidates[0].content.parts[0].text);
        const isArt = res?.data?.candidates[0]?.content?.parts[0].text;
        
        if(isArt.toLowerCase().includes('yes')){
            console.log('dalle api call');
            // return dalleApiCall(prompt,messages||[]);
            // return geminiApiCall(prompt,messages||[]);
            const arrValue = {"role":"assistant", "parts":[{"text": 'Currently we are not able to generate images with current version, go with paid version. Thank you'}] };
            messages.push(arrValue);
            return { success: true, data: messages }
        }else{
            console.log('gemini api call');
            return geminiApiCall(prompt,messages||[]);
        }
        
    } catch (error) {
        console.log('error', error);
        return { success: false, msg: error.message }; // Return error message directly
    }
};


const geminiApiCall = async(prompt,messages)=>{
    console.log(messages);
    try {
        const res = await client.post(geminiEndpoint,{
            "contents":{parts:[{"text": prompt}]}
        });

        let answer = res?.data?.candidates[0]?.content?.parts[0].text;
        console.log(answer);
        const arrValue = {"role":"assistant", "parts":[{"text": answer.trim()}] };
        messages.push(arrValue);
        return { success: true, data: messages }

    } catch (error) {
        console.log('error', error);
        return { success: false, msg: error.message }; // Return error message directly
    }
}


const client1 = axios.create({
    headers:{
        'Authorization': 'Bearer ' + apiKey1,
        'Content-Type': 'application/json'
    }
})
const dalleApiCall = async (prompt, messages) => {
    try {
        const res = await client1.post(dalleEndpoint, {
            "model": "dall-e-3",
            "prompt": prompt,
            "n": 1,
            "size": "1024x1024"
        });
        console.log("Response from DALL-E API:", res.data);
        if (res.data && res.data.data && res.data.data.length > 0) {
            let url = res.data.data[0].url;
            console.log('Got URL of the image:', url);
            messages.push({ role: 'assistant', content: url.trim() });
            return { success: true, data: messages };
        } else {
            console.error("Invalid response from DALL-E API:", res.data);
            return { success: false, msg: "Invalid response from DALL-E API" };
        }
    } catch (error) {
        console.error('Error calling DALL-E API:', error.response ? error.response.data : error.message);
        return { success: false, msg: error.response ? error.response.data : error.message };
    }
};




// import axios from 'axios';
// import { apiKey } from '../constants';

// const client = axios.create({
//     headers:{
//         'Authorization': 'Bearer ' + apiKey,
//         'Content-Type': 'application/json'
//     }
// })

// const chatGptEndpoint = 'https://api.openai.com/v1/chat/completions';
// const dalleEndpoint = 'https://api.openai.com/v1/images/generations';

//  export const apiCall = async(prompt, messages)=>{
//     try {
//         const res = await client.post(chatGptEndpoint,{
//             model: "gpt-3.5-turbo",
//             messages: [{
//                 role:'user',
//                 content: `Does this message want to generate an AI picture, image, art or anything similar ${prompt}. Simply answer with yes or no.`
//             }]
//         });
//         console.log('data ', res.data);
        
//     } catch (error) {
//         console.log('error', error);
//         return { success: false, msg: error.message }; // Return error message directly
//     }
// }