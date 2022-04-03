import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import firebase from 'firebase';
require('firebase/firestore');

export default function Feed(props) {
    const [users, setUsers] = useState([]);

    const fetchUsers = (search) => {
        firebase.firestore()
        .collection('users')
        .where('name', '>=', search)
        .get()
        .then((snapshot) => {
            let users = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data}
            });
            setUsers(users);
        })
    }

    return (
        <View style={styles.container}>
            <TextInput placeholder="Search here..." placeholderTextColor="#bfbfbf" style={styles.txt} onChangeText={(search) => fetchUsers(search)} />

            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => props.navigation.navigate('Profile', {uid: item.id})}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        backgroundColor:'#222a35',
    },
    txt: {
        width:370,
        height:45,
        backgroundColor:'#323d4e',
        borderRadius:30,
        paddingLeft:17,
        marginTop:15,
        color:'#fff'
    }
})
