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
  TextInput,
  FlatList,
} from 'react-native';


// need some kind of local file for all the topics the user joined.
type Props = {
    data : string[],
    onDeleteEntry : (string) => void
}
export class Content extends Component<Props> {

    constructor(p : Props) {
        super(p)
    }

    data() {
        return this.props.data.map((e, idx) => {return {key: e + String(idx), name: e}})
    }

    renderAItem(item : any) {
        return(
            <TouchableOpacity style={styles.listItem} >
                <Text style={{width: "80%", fontSize: 24}}>
                    {item.name}
                </Text>
                <TouchableOpacity onPress={() => {
                    this.props.onDeleteEntry(item.name)
                }}>
                    <Text style={{fontSize: 24}}>
                        remove
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    render() {
        return <FlatList
        data={this.data()}
        ItemSeparatorComponent={_ => (
            <View style={{height: 1}} />
          )}
        renderItem={({item, separators}) => this.renderAItem(item)}
        />
    }
}



// position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'

const styles = StyleSheet.create({
    listItem: {
        backgroundColor: "white",
        height: 40,
        flexDirection: "row",
    }
});
  