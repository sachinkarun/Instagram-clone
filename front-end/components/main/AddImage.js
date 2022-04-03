import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function AddImage({ navigation }) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log(galleryStatus);
      setHasGalleryPermission(galleryStatus.status === 'granted');

    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
        setImage(result.uri);
    }
  };

  if (hasGalleryPermission === false) {
    return <View><Text>please allow to camera and gallery permissions</Text></View>;
  }

  return (
    <View style={{flex:1}}>
        <Button title="Save" onPress={() => navigation.navigate('Saveprofile', {image})} />
        <Button title="Pick Image From Gallery" onPress={() => pickImage()} />
        {image && <Image source={{uri: image}} style={{width:300, height:300}} />}
    </View>
  );
}

const styles = StyleSheet.create({
    fixedRatio: {
        flex:1,
        aspectRatio:1
    }
 });