// @flow

import React, { Component } from 'react';
import {RED, DARK, BLUE, LIGHT_BLUE, BEIGE} from "./constants"
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  TextInput
} from 'react-native';
import Network from "./networker"


type Props = {
    onClose? : () => void
}

class Overlay<T> extends Component<Props, T> {

    render() {
        return (
            <View style={styles.overlayStyle}>
                {this.renderInner()}
            </View>
        )
    }

    renderInner() {
        return undefined
    }

}

export class JoinOverlay extends Overlay<{topic: string, pw : string}> {

    constructor(p : Props) {
        super(p)
        this.state = {
            topic: "",
            pw: ""
        }
    }

    renderInner() {
        return (
            <View style={styles.inner}>
                <View style={{height: 20}} />
                <TextInput placeholder="name of the list" placeholderTextColor="white"
                    onChangeText={(txt)=>{
                        this.setState({topic: txt})
                    }}
										style={styles.ti}
                />
                <TextInput placeholder="password" placeholderTextColor="white" 
                    onChangeText={(txt) => {
                        this.setState({pw: txt})
                    }}
										style={styles.ti}
                 />
                <View style={{height: 20}} />
                <Button title="create" color={LIGHT_BLUE} 
                    onPress={() => {
                        Network.setTopic(this.state.topic)
                        Network.setPw(this.state.pw)
                        Network.sendCreate()
                        Network.sendJoin()
                    }} 
                />
                <View style={{height: 10}} />                    
                <Button title="join" color={LIGHT_BLUE}  
                    onPress={() => {
                        Network.setTopic(this.state.topic)
                        Network.setPw(this.state.pw)
                        Network.sendJoin()
                    }} 
                />
                <View style={{height: 70}} />    
                <TouchableOpacity onPress={() => {
                    if(this.props.onClose)
                        this.props.onClose()
                 }}>
                    <Text style={{color: "white"}} >
                        close
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

}

export class ListOverlay extends Overlay<{}> {

    renderInner() {
        //TODO: render inner list of carts.
        return (
            <View style={styles.inner}>
                
            </View>
        )
    }

}

// position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'

const styles = StyleSheet.create({
    overlayStyle: {
    position: 'absolute', 
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    },
    inner: {
        elevation: 20,
        width: "63%",
        height: "47%",
        backgroundColor: DARK,
        padding: "10%"     
    },
    ti: {
	color: "white"
    }
});
  
