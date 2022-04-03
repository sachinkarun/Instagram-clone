import React, { Component } from 'react'
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient';

export class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            check: false
        }

        this.onSignUp = this.onSignUp.bind(this)
    }
    
    handleCheckBox(e) {
        this.setState({
          check: e.target.check
        })
    }
    
    onSignUp(){
        const {name, email, password} = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {
            firebase.firestore().collection("users")
            .doc(firebase.auth().currentUser.uid)
            .set({
                name,
                email
            })
            console.log(result)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={{ height:'9%', width:325}}>
                    <Text style={{fontSize:37, color:"#fff", marginLeft:10, marginTop: -20}}>Sign Up</Text>
                </View>
                    
                <View style={{height:'55%'}}>

                    <TextInput placeholder="Name"
                        placeholderTextColor="#bfbfbf"
                        style={styles.input}
                        onChangeText={(name) => this.setState({name})} />

                    <TextInput placeholder="Email"
                        placeholderTextColor="#bfbfbf"
                        style={styles.input}
                        onChangeText={(email) => this.setState({email})} />

                    <TextInput placeholder="Password"
                        placeholderTextColor="#bfbfbf"
                        style={styles.input}
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({password})} />

                        <View style={{flexDirection:'row', marginLeft:8, marginTop:10, marginBottom:10, alignItems:'center'}}>
                            {this.state.check === false ?
                                <View onPress={this.handleCheckBox} check={this.state.check}
                                    style={{marginTop: 25,width:16, height:16, borderColor:'#bfbfbf', borderWidth:1.5, marginRight:10, borderRadius:4}}></View>
                            :
                                <View onPress={this.handleCheckBox} check={this.state.check}
                                    style={{marginTop: 25,width:16, height:16, borderColor:'#bfbfbf', backgroundColor:'#bfbfbf', borderWidth:1.5, marginRight:10, borderRadius:4}}></View>
                            }
                            <Text style={{color:'#bfbfbf', fontSize:15, marginTop: 25}}>I Agree with privacy and policy</Text>
                        </View>

                    <TouchableOpacity onPress={() => this.onSignUp()}>

                    <LinearGradient style={styles.button}
                        start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                        colors={['#eb4d5b', '#eb8762']}>
                        <Text style={{color:'#fff', fontSize:20, fontWeight:'bold'}}>Sign Up</Text>
                    </LinearGradient>
                    </TouchableOpacity>

                    <View style={{flexDirection:'row', justifyContent:'space-evenly', marginTop:35}}>
                        <Text style={{color:'#fff', fontWeight:'bold', fontSize:15}}>Already have an Account?</Text>

                        <TouchableOpacity style={{marginLeft:-40}}
                            onPress={() => this.props.navigation.navigate("Login")}>
                                <Text style={{fontWeight:'bold', color:'#ee3a57', fontSize:15}}>Sign In</Text>
                        </TouchableOpacity>
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
        marginTop:25,
        color:"white"
    },
    button:{
        width:325,
        height:50,
        backgroundColor:'#ee3a57',
        borderRadius:25,
        alignItems:'center',
        justifyContent:'center',
        marginTop:25
    }
})

export default Register;
