import React,{ useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import image from './img.png';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
require('firebase/firestore');

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if(props.usersFollowingLoaded == props.following.length && props.following.length !== 0){

            props.feed.sort(function(x,y) {
                return x.creation - y.creation;
            })

            setPosts(props.feed);
        }

    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (userId, postId) => {
        setLike(!like);
        firebase.firestore()
        .collection("posts")
        .doc(userId)
        .collection("userPosts")
        .doc(postId)
        .collection("likes")
        .doc(firebase.auth().currentUser.uid)
        .set({})
    }

    const onDislikePress = (userId, postId) => {
        setLike(!like);
        firebase.firestore()
        .collection("posts")
        .doc(userId)
        .collection("userPosts")
        .doc(postId)
        .collection("likes")
        .doc(firebase.auth().currentUser.uid)
        .delete()
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor='#222a35'/>
            <Text style={{fontSize:40, color:"#fff",marginTop:13, fontWeight:'bold', marginRight:150}}>Daily feed's</Text>
            <View style={styles.containerGallery}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({item}) => (
                        <View style={styles.containerElevation}>
                            <View style={{flexDirection:'row', alignItems:'center', marginLeft:10, marginTop:5}}>
                                <Image source={image} style={{width:35, height:35, borderRadius:18, marginRight:5, marginLeft:5, marginVertical:5}}/>
                                <Text style={{fontWeight:'bold', color:'#fff'}}>{item.user.name}</Text>
                            </View>
                                <Entypo name="dots-three-vertical" size={24} color="#fff" style={{marginTop:-35, marginBottom:18, marginLeft:358}} />
                            <Image
                                style={styles.image}
                                source={{uri: item.downloadUrl}}
                            />
                            <Text style={{color:"#fff", fontWeight:'bold', marginLeft:15, marginTop:10}}>{item.user.name} : </Text>
                            <Text style={{color:"#fff", marginBottom:10, marginLeft:15}}>{item.caption}</Text>

                            <View style={{flexDirection:'row', marginLeft:17, marginBottom:10}}>
                                {item.currentUserLike ?
                                    (
                                        <View>
                                        <TouchableOpacity onPress={() => onDislikePress(item.user.uid, item.id)} style={{marginRight:20}}>
                                            <FontAwesome name="heart" size={24} color="red" />
                                        </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <TouchableOpacity onPress={() => onLikePress(item.user.uid, item.id)} style={{marginRight:20}}>
                                            <FontAwesome5 name="heart" size={24} color="#fff" />
                                        </TouchableOpacity>
                                    )
                                }
                                <TouchableOpacity onPress={() => props.navigation.navigate('Comment', {postId: item.id, uid: item.user.uid})}>
                                    <FontAwesome5 name="comment" size={24} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Feather name="send" size={24} color="#fff" style={{marginLeft:20}} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#222a35",
        justifyContent:'center',
        alignItems:'center'
    },
    containerInfo: {
        margin: 20,
    },
    containerGallery:{
        flex: 1,
        backgroundColor:'#14191f',
    },
    containerElevation:{
        backgroundColor:"#222a35",
        marginTop:5
    },
    image:{
        width:390,
        height:390
    }
})

const matchStateToprops = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded
})

export default connect(matchStateToprops, null)(Feed);
