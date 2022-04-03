import React,{ useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button, StatusBar, TouchableOpacity } from 'react-native';
import img from './img.png';
import { LinearGradient } from 'expo-linear-gradient';
import firebase from 'firebase';
import { connect } from 'react-redux';
require('firebase/firestore');

function Profile(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false);
    const [userFollowing, setUserFollowing] = useState(0);
    const [userFollowers, setUserFollowers] = useState(0);
    const [profilePic, setProfilePic] = useState(null);
    const [totalPosts, setTotalPosts] = useState(0);

    useEffect(() => {
        const {currentUser, posts} = props;
        if(props.route.params.uid === firebase.auth().currentUser.uid){
            setUser(currentUser);
            setUserPosts(posts);
            setTotalPosts(posts.length);

            firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection('userProfile')
            .get()
            .then((snapshot) =>{
                let pic = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{id, ...data}
                })
                setProfilePic(pic[0].downloadUrl);
            })

            firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection('userFollowing')
            .get()
            .then((snapshot) =>{
                console.log(snapshot.docs.length)
                setUserFollowing(snapshot.docs.length);
            })

            firebase.firestore()
            .collection("followers")
            .doc(firebase.auth().currentUser.uid)
            .collection('userFollowers')
            .get()
            .then((snapshot) =>{
                setUserFollowers(snapshot.docs.length);
            })
        }
        else{
            firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    setUser(snapshot.data());
                }
                else{
                    console.log("User does not exists")
                }
            })

            firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{id, ...data}
                })
                setUserPosts(posts);
            })
        }
        
        if(props.following.indexOf(props.route.params.uid) > -1){
            setFollowing(true);
        }
        else{
            setFollowing(false);
        }

    }, [props.route.params.uid, props.following])

    const userSignout = () => {
        firebase.auth().signOut()
      }

    const onFollow = () => {
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .set({})

        firebase.firestore()
        .collection("followers")
        .doc(props.route.params.uid)
        .collection("userFollowers")
        .doc(firebase.auth().currentUser.uid)
        .set({})
    }

    const onUnfollow = () => {
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .delete()

        firebase.firestore()
        .collection("followers")
        .doc(props.route.params.uid)
        .collection("userFollowers")
        .doc(firebase.auth().currentUser.uid)
        .delete()
    }

    if(user === null){
        return(
            <View><Text>Loading</Text></View>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor='#222a35'/>

            <Text style={{fontSize:40, color:"#eb4d5b", marginLeft:30, fontWeight:'bold'}}>Profile</Text>

            <View style={styles.containerInfo}>
                <View style={{flexDirection:'row', alignItems:'center', marginBottom:20}}>

                    <TouchableOpacity onPress={() => props.navigation.navigate('AddImage')}>
                        <LinearGradient style={styles.button}
                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                            colors={['#eb4d5b', '#eb8762']}>
                            {profilePic === null ? 
                            <Image source={img} style={styles.profileImg} />
                            :
                            <Image source={{uri: profilePic}} style={styles.profileImg} />
                        }
                        </LinearGradient>
                    </TouchableOpacity>

                        <View style={{flexDirection:'row', marginLeft:20}}>
                            <View style={{flexDirection:'column', alignItems:'center', marginRight:13}}>
                                <Text style={{color:"white", fontSize:25, fontWeight:'bold'}}>{totalPosts}</Text>
                                <Text style={{color:"white", fontSize:17, fontWeight:'bold'}}>Posts</Text>
                            </View>
                            <View style={{flexDirection:'column', alignItems:'center', marginRight:13}}>
                            <Text style={{color:"white", fontSize:25, fontWeight:'bold'}}>{userFollowers}</Text>
                                <Text style={{color:"white", fontSize:17, fontWeight:'bold'}}>Followers</Text>
                            </View>
                            <View style={{flexDirection:'column', alignItems:'center'}}>
                            <Text style={{color:"white", fontSize:25, fontWeight:'bold'}}>{userFollowing}</Text>
                                <Text style={{color:"white", fontSize:17, fontWeight:'bold'}}>Following</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{marginLeft:13, marginBottom:20}}>
                        <Text style={{color:"white", fontSize:22}}>~{user.name}</Text>
                        <Text style={{color:"white", fontSize:17}}>📩 {user.email}</Text>
                    </View>

                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View>
                        {following ? (
                            <Button title="Following"
                                onPress={() => onUnfollow()}
                            />
                            ) : (
                                <Button title="Follow"
                                    onPress={() => onFollow()}
                                />
                        )}
                    </View>
                ): (
                    <View style={{flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>userSignout()}>
                        <LinearGradient style={styles.btn}
                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                            colors={['#eb4d5b', '#eb8762']}>
                            <Text style={{color:'#fff', fontSize:20, fontWeight:'bold'}}>Logout</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <LinearGradient style={styles.btn}
                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                            colors={['#eb4d5b', '#eb8762']}>
                            <Text style={{color:'#fff', fontSize:20, fontWeight:'bold'}}>Add Post</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    </View>
                ) }
            </View>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({item}) => (
                        <View style={styles.containerImage}>
                        <Image
                            style={styles.image}
                            source={{uri: item.downloadUrl}}
                        />
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
        backgroundColor:'#222a35',
        paddingTop:20
    },
    containerInfo: {
        margin: 20,
    },
    containerGallery:{
        flex: 1
    },
    containerImage:{
        flex: 1/3,
        borderColor:'#222a35',
        borderWidth:2
    },
    image:{
        flex:1,
        aspectRatio: 1/1
    },
    profileImg: {
        width:105,
        height:105,
        borderRadius:55
    },
    button:{
        width:110,
        height:110,
        borderRadius:55,
        alignItems:'center',
        justifyContent:'center'
    },
    btn: {
        width:170,
        height:45,
        justifyContent:'center',
        alignItems:'center',
        marginRight:15,
        borderRadius:4,
    }
})

const matchStateToprops = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(matchStateToprops, null)(Profile);