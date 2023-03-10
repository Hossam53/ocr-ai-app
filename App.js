import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Button, Image, Linking, StyleSheet, Text, View } from "react-native";
import generateResponse from "./ChatGPT";
import ImagePickerComponent from "./ImagePickerComponent";
import {OCR_KEY} from '@env'

const API_KEY = OCR_KEY;
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;
export var myGlobalVariable;

async function callGoogleVisionAsync(image) {
  const body = {
    requests: [
      {
        image: {
          content: image,
        },
        features: [
          {
            type: "TEXT_DETECTION",
            maxResults: 1,
          },
        ],
      },
    ],
  };
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });


  const parsed = await response.json();

  console.log("Result:", parsed);


  console.log("ronaldo"+parsed.responses[0].fullTextAnnotation.text)

  myGlobalVariable  = generateResponse(parsed.responses[0].fullTextAnnotation.text);
  console.log(myGlobalVariable);
  return myGlobalVariable;
}

function VisionScreen() {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(null);

  const takePictureAsync = async () => {
    const { cancelled, uri, base64 } = await ImagePicker.launchCameraAsync({
      base64: true,
    });
    if (!cancelled) {
      setImage(uri);
      setStatus("Loading...");
      try {
        const result = await callGoogleVisionAsync(base64);
        setStatus(result);
      } catch (error) {
        console.log(error);
        setStatus(`Error: ${error.message}`);
      }
    } else {
      setImage(null);
      setStatus(null);
    }
  };

  return (
      <View style={styles.container}>
        {image && <Image style={styles.image} source={{ uri: image }} />}
        {status && <Text style={styles.text}>{status}</Text>}
        <Button
            onPress={takePictureAsync}
            title="   📷  Camera  "
            color="#EF4444"
        />
        <ImagePickerComponent onSubmit={callGoogleVisionAsync} />




      </View>
  );
}

export default function App() {
  const [permission, request] = ImagePicker.useCameraPermissions({
    get: true,
  });

  const requestPermission = async () => {
    if (permission.status === "denied") {
      request();
      //Linking.openSettings();
    } else {

    }
  };

  if (API_KEY === "<YOUR_API_KEY_HERE>") {
    return (
        <View style={styles.container}>
          <Text>
            You have not setup the API yet. Please add your API key to App.js
          </Text>
        </View>
    );
  }

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
        <View style={styles.container}>
          <Text>
            You have not granted permission to use the camera on this device!
          </Text>
          <Button onPress={requestPermission} title="Request Permission" />
        </View>
    );
  }

  return <VisionScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d3544",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 300,
  },
  text: {
    margin: 5,
    color: "#fff",

  },


});