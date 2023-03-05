const { Configuration, OpenAIApi } = require("openai");
import "react-native-url-polyfill/auto";
import {GPT_KEY} from '@env'


const configuration = new Configuration({
    apiKey: GPT_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateResponse(prompt) {
    console.log(prompt);
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
    });
    console.log("in");

    //console.log(completion.data.choices[0].text);
    return completion.data.choices[0].text;
}

export default generateResponse;
