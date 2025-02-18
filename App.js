import React, { useState, createContext, useEffect } from 'react';
import { Provider } from 'react-native-paper';
import { NavigationContainer, createSwitchNavigator, createAppContainer, createNavigatorFactory } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import firebase from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

import 'firebase/storage';
import 'firebase/auth';
import 'firebase/firestore';

import StartScreen from './screens/StartScreen.js'
import LoginScreen from './screens/LoginScreen.js'
import RegisterScreen from './screens/RegisterScreen.js'

import Dashboard from './screens/Dashboard.js'
import MessagesScreen from './screens/MessagesScreen.js'
import ChatScreen from './screens/ChatScreen.js'
import SettingsScreen from './screens/SettingsScreen.js'
import ImageScreen from './screens/ImageScreen.js'
import SwipeScreen from './screens/SwipeScreen.js'

import Amplify from 'aws-amplify'
import awsconfig from './src/aws-exports.js'

Amplify.configure(awsconfig)

const AuthContext = createContext(null)
// const [initialState, setInitialState] = useState();

function AuthNavigator() {

  const [user, setUser] = useState(null);

    const addUser = async (value) => {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(value))
        setUser(value)
        const jsonValue = await AsyncStorage.getItem('user')
        console.log("VALUE SET", JSON.parse(jsonValue))
      } catch (e) {
        // saving error
      }
    }

    const getUser = async () => {
      try {
        AsyncStorage.getItem('user').then(value => {
          console.log("VALUE GET", JSON.parse(value))
          if (value != "null") {
            setUser(JSON.parse(value))
          }
        })
      } catch(e) {
        // error reading value
      }
    }

        useEffect(() => {
          getUser()
        }, [])

    function login(a) {
        addUser(a)
        const userRef = store.collection('users').doc(a.email);

        userRef.get().then((doc) => {
            if (doc.exists) {
                console.log("LOGIN")
            } else {
                console.log("REGISTER")
                if (a.picture) {
                    userRef.set({
                        name: a.name || "",
                        email: a.email || "",
                        picture: a.picture.data.url,
                        likes: ["blank"],
                        dislikes: ["blank"],
                        matches: [],
                        conversations: [],
                    })
                } else {
                    console.log("CREATE")
                    userRef.set({
                        name: a.name || "",
                        email: a.email || "",
                        picture: "https://www.edmundsgovtech.com/wp-content/uploads/2020/01/default-picture_0_0.png",
                        likes: ["blank"],
                        dislikes: ["blank"],
                        matches: [],
                        conversations: [],
                    })
                }
            }
        })

    }

    function logout() {
        firebase.auth().signOut()
        addUser(null)
    }

    return user ? (
    <MyTabs 
      user={user} 
      logout={logout}
      onStateChange={(state) =>
        console.log("CHANGED", state)
      }
     />
  ) : (
    <MyStack login={login} />
  )
}

const AuthStack = createStackNavigator();

function MyStack(props) {

  return (
    <NavigationContainer>
      <AuthStack.Navigator screenOptions={{
        headerShown: false
        }}>
        <AuthStack.Screen name="StartScreen" component={StartScreen} options={{ title: 'Impressive' }} initialParams={{login: props.login}} />
        <AuthStack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Impressive - Login' }} initialParams={{login: props.login}} />
        <AuthStack.Screen name="RegisterScreen" component={RegisterScreen} options={{ title: 'Impressive - Register' }} initialParams={{login: props.login}} />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}

const AppStack = createBottomTabNavigator();

function MyTabs(props) {

    return (
      <NavigationContainer>
        <AppStack.Navigator
          initialRouteName="Swipe"
          tabBarOptions={{
            style: {
              padding: 10
            }
          }}
        >

        <AppStack.Screen
          name="Swipe"
          component={SwipeScreen}
          initialParams={{user: props.user}}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <AppStack.Screen
          name="Messages"
          component={MessagesScreen}
          initialParams={{user: props.user}}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="chat" color={color} size={26} />
            ),
          }}
        />
        <AppStack.Screen
          name="ChatScreen"
          component={ChatScreen}
          initialParams={{user: props.user}}
          options={{
            tabBarButton: () => null,
          }}
        />
        <AppStack.Screen
          name="Dashboard"
          component={Dashboard}
          initialParams={{user: props.user}}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-circle" color={color} size={26} />
            ),
          }}
        />
        <AppStack.Screen
          name="Settings"
          component={SettingsScreen}
          initialParams={{user: props.user, logout: props.logout}}
          options={{
            tabBarButton: () => null,
          }}
        />
        <AppStack.Screen
          name="Image"
          component={ImageScreen}
          initialParams={{user: props.user, logout: props.logout}}
          options={{
            tabBarButton: () => null,
          }}
        />
      </AppStack.Navigator>
    </NavigationContainer>
    );
}

var firebaseConfig = {
    apiKey: "AIzaSyDLeiyd8iai6akLcumpP5-A1yxs7t5wflk",
    authDomain: "socially-b729a.firebaseapp.com",
    databaseURL: "https://socially-b729a-default-rtdb.firebaseio.com",
    projectId: "socially-b729a",
    storageBucket: "socially-b729a.appspot.com",
    messagingSenderId: "804187430311",
    appId: "1:804187430311:web:6dad7a05a011fb3a032a82",
    measurementId: "G-P1NKXT7943"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ timestampsInSnapshots: true })
// firebase.analytics();

const storage = firebase.storage();
const store = firebase.firestore();
const authenticate = firebase.auth();

export {
    storage,
    store,
    authenticate,
    AuthNavigator as default
}