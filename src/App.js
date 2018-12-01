import React, { Component } from 'react';
import RoomList from './components/RoomList.js';
import MessageList from './components/MessageList.js';
import User from './components/User.js';
import './App.css';

import * as firebase from 'firebase';

// src = "https://www.gstatic.com/firebasejs/5.5.9/firebase.js"

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAIb5MzkimzuqxI4_5TnbisNu2Qw_iRGek",
  authDomain: "bloc-chat-7c44b.firebaseapp.com",
  databaseURL: "https://bloc-chat-7c44b.firebaseio.com",
  projectId: "bloc-chat-7c44b",
  storageBucket: "bloc-chat-7c44b.appspot.com",
  messagingSenderId: "531678326303"
};
firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRoom: '',
      user: undefined
    };

    this.activateRoom = this.activateRoom.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
  }

  activateRoom(room){
    this.setState({
      activeRoom: room
    })
  }

  authenticateUser(user){
    this.setState({
      user: user
    })
  }

  render() {
    return(
      <div id="body">
        <section id="side-bar-container">
          <RoomList
            firebase = {firebase}
            activateRoom = {this.activateRoom}
            activeRoom = {this.state.activeRoom}
          />
          <User
          firebase = {firebase}
          authenticateUser = {this.authenticateUser}
          user = {this.state.user}
          />
        </section>
        <MessageList
          firebase = {firebase}
          activeRoom = {this.state.activeRoom}
        />
      </div>
    );
  }
}

export default App;
