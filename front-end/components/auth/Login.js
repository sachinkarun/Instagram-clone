import React, { Component } from 'react'
import { View, TextInput, StyleSheet, Text, TouchableOpacity, StatusBar } from 'react-native';
import firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

export class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: ''
        }

        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp(){
        const {email, password} = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            console.log(result)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    render() {

        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor='#222a35'/>
                <View style={{width:325, height:"15%", marginTop:-10}}>
                    <Text style={{fontSize:37, color:"#fff", marginLeft:10}}>Login</Text>
                </View>
    
                    <TextInput placeholder="Email"
                        placeholderTextColor="#bfbfbf"
                        style={styles.input}
                        onChangeText={(email) => this.setState({email})} />

                    <TextInput placeholder="Password"
                        placeholderTextColor="#bfbfbf"
                        style={styles.input}
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({password})} />

                    <TouchableOpacity onPress={() => this.onSignUp()}>

                    <LinearGradient style={styles.button}
                        start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                        colors={['#eb4d5b', '#eb8762']}>
                        <Text style={{color:'#fff', fontSize:20, fontWeight:'bold'}}>Sign In</Text>
                    </LinearGradient>
                    </TouchableOpacity>

                    <View style={{flexDirection:'row', justifyContent:'space-evenly', marginTop:35}}>
                        <Text style={{color:'#fff', fontWeight:'bold', fontSize:15}}>Don't have an Account?</Text>

                        <TouchableOpacity style={{marginLeft:10}}
                            onPress={() => this.props.navigation.navigate("Register")}>
                                <Text style={{fontWeight:'bold', color:'#ee3a57', fontSize:15}}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
        
                <View style={{marginTop:60, alignItems:'center'}}>
                    <Text style={{color:"white", marginBottom:15, fontWeight:'bold'}}>Or Sign in with</Text>
                    <View style={styles.icons}>
                        <FontAwesome name="google" size={35} color="white" />
                        <FontAwesome name="facebook-official" size={35} color="white" />
                        <FontAwesome name="twitter" size={39} color="white" />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#222a35'
    },
    input:{
        width:325,
        height:50,
        borderColor:'#eb4d5b',
        borderWidth:2,
        borderRadius:25,
        paddingLeft:20,
        fontSize:16,
        marginBottom:25,
        color:"white"
    },
    button:{
        width:325,
        height:50,
        backgroundColor:'#ee3a57',
        borderRadius:25,
        alignItems:'center',
        justifyContent:'center'
    },
    icons: {
        flexDirection:'row',
        justifyContent:'space-around',
        width:230
    }
})

export default Login;
