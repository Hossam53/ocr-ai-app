import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect } from "react";
import { Button, Image, View, Text } from "react-native";

function ImagePickerComponent({ onSubmit }) {
    const [image, setImage] = useState(null);
    const [text, setText] = useState("");
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            base64: true,
        });

        if (!result.cancelled) {
            setImage(result.uri);
            setText("Loading..");
            const responseData = await onSubmit(result.base64);
            setText(responseData.text);
        }
    };
    return (
        <View>
            <View style={{ marginTop: 20 }}>
                <Button
                    title=" 	📂 Upload    "
                    onPress={pickImage}
                    color="#2FCADB"
                />
            </View>
            {image && (
                <Image
                    source={{ uri: image }}
                    style={{ width: 400, height: 300, resizeMode: "contain" }}
                />
            )}
            <Text>{text}</Text>
        </View>
    );
}
export default ImagePickerComponent;
