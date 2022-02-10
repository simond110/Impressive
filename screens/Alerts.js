import React, {setState, useState} from "react";
import { Animated, Text, View, StyleSheet, Button, SafeAreaView } from "react-native";

export default function Alert() {

  const [state, setstate] = useState({
    visible: false,
    x: new Animated.Value(0),
  })

  const slide = () => {
    Animated.spring(state.x, {
      toValue: 400,
    }).start();
    this.setState({
      visible: true,
    });
  };

return (
    <Animated.View style={{transform: [{ translateX: state.x }]}}> 
      <Text style={styles.alert}>New Match</Text>
    </Animated.View>
  ) 
}

const styles = StyleSheet.create({
  alert: {
    position: 'absolute',
    color: 'white',
    borderRadius: 24,
    backgroundColor: 'yellow',
    padding: 20,
    top: 100,
    right: 30,
    bottom: 'auto',
    left: 'auto',
  }
})