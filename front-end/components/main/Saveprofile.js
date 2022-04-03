import React, { useState } from 'react'
import { Button, Image, TextInput, View } from 'react-native'
import firebase from 'firebase';
require("firebase/firestore")
require("firebase/firebase-storage")

export default function Saveprofile(props, {navigation}) {

    console.log(props.route.params.image)

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;

        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot);
            })
        }

        const taskError = snapshot => {
            console.log(snapshot);
        }
    
        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    const savePostData = (downloadUrl) => {

        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection('userProfile')
            .add({
                downloadUrl,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function (){
                props.navigation.popToTop()
            }))
    }

    return (
        <View style={{flex:1}}>
            <Image source={{uri: props.route.params.image}} />
            <Button title="Save" onPress={() => uploadImage()} />
        </View>
    )
}
