/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {RED, DARK, BLUE, LIGHT_BLUE, BEIGE} from "./src/constants"
import { JoinOverlay, ListOverlay } from "./src/overlay"
import { Content } from "./src/content"
import Network from "./src/networker"

import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  TextInput
} from 'react-native';

type Props = {};
type State = {
  showOverlay: "LIST" | "JOIN" | "NONE",
  currentTopic : string,
  data: {[key: string] : string[]},
  insertItem : string,
}

console.log("\n\n\nJS CODE \n\n\n")

export default class App extends Component<Props, State> {

  constructor(props : Props) {
    super(props)
    this.state = {
      showOverlay: "NONE",
      data: {},
      currentTopic: "",
      insertItem : "",
    }
    Network.onData = (data: string[], topic : string) => {
      const d = this.state.data
      d[this.state.currentTopic] = data
      this.setState({data : d})
    }
    Network.onJoin = (topic : string) => {
      this.setState({currentTopic: topic})
      this.setState({showOverlay: "NONE"})
    }
    Network.onErr = (e) => {
      alert("error")
    }
    Network.init()
  }

  render() {
    //const b = <Button style={styles.plus} title="+" onPress={() => console.log("button") } />
    return (
      <View style={{flex: 1}}>
        <View style={styles.upper}>
          <TouchableOpacity onPress={() => this.setState({showOverlay: "LIST"}) } style={styles.dropdown} >
            <Text style={{fontSize: 40, fontWeight: "bold", color: "black"}} >
              v
            </Text>
          </TouchableOpacity>
          <View style={styles.heading} >
            <Text style={{fontSize: 24, fontWeight: "bold", color: "black"}} >
                {this.state.currentTopic === "" ? "No Topic" : this.state.currentTopic}
              </Text>
          </View>
          <TouchableOpacity onPress={() => this.setState({showOverlay: "JOIN"}) } style={styles.plus} >
            <Text style={{fontSize: 40, fontWeight: "bold", color: "black"}} >
              +
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Content 
            data={this.state.data[this.state.currentTopic] || [] }
            onDeleteEntry={(item : string) => {
              if(this.state.currentTopic === "") return
              const arr : string[] = this.state.data[this.state.currentTopic]
              // const idx = arr.findIndex(e => e === item)
              // if(idx >= 0)
              //   delete arr[idx]
              Network.sendUpdateData(arr.filter(e => e !== item))
            }}
          />
          <View style={{backgroundColor: BLUE, elevation: 20}}>
            <TextInput placeholder="enter item text" placeholderTextColor="white" 
              onChangeText={
                (txt) => this.setState({insertItem: txt})
              } 
            />
            <Button title="add item" onPress={()=>console.log()} color={BLUE} 
              onPress={() => {
                // get the item name
                if(this.state.currentTopic === "") return  // TODO: default topic, don't add items
                const d = this.state.data
                const arr = d[this.state.currentTopic]
                arr.push(this.state.insertItem)
                Network.sendUpdateData(arr)
            }}/>
          </View>
        </View>
        {this.renderOverlay()}
      </View>
    );
  }

  renderOverlay() {
    if(this.state.showOverlay === "JOIN") 
      return <JoinOverlay onClose={() => this.setState({showOverlay: "NONE"})} />
    else if(this.state.showOverlay === "LIST")
      return <ListOverlay onClose={() => this.setState({showOverlay: "NONE"})} />
    return undefined
  }

}

const styles = StyleSheet.create({
  upper: {
    //height: "10%",
    flex: 10,
    backgroundColor: BLUE,
    flexDirection: "row"
  },
  content: {
    //height: "90%",
    flex: 90,
    backgroundColor: DARK
  },
  plus: {
    //marginLeft: "40%",
    flex: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heading: {
    //marginLeft: "40%",
    flex: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dropdown: {
    flex: 25,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
