import React, { Component } from "react";
import RoomList from "./components/RoomList.js";
import TopBar from "./components/TopBar.js";
import MessageList from "./components/MessageList.js";
import User from "./components/User.js";
import "./App.css";

import * as firebase from "firebase";

//  Initialize Firebase
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
			activeRoom: "",
			user: undefined,
			adminUser: '6vq91i02nrg1ozlyQHWun9wowns1'
		};

		this.activateRoom = this.activateRoom.bind(this);
		this.deactivateRoom = this.deactivateRoom.bind(this);
		this.authenticateUser = this.authenticateUser.bind(this);
	}

	activateRoom(room) {
		this.setState({
			activeRoom: room
		});
	}

	deactivateRoom() {
		console.log("I was pressed");
		this.setState({
			activeRoom: ""
		});
	}

	authenticateUser(user) {
		this.setState({
			user: user
		});
	}

	render() {
		return (
			<div id="main-container">
				<TopBar
					firebase={firebase}
					authenticateUser={this.authenticateUser}
					user={this.state.user}
					deactivateRoom={this.deactivateRoom}
					authenticateUser={this.authenticateUser}
				/>
				<div id="body">
					<section id="side-bar-container">
						<RoomList
							firebase={firebase}
							activateRoom={this.activateRoom}
							activeRoom={this.state.activeRoom}
							adminUser={this.state.adminUser}
							user={this.state.user}
						/>
						<User
							firebase={firebase}
							authenticateUser={this.authenticateUser}
							user={this.state.user}
							getUserPic={this.getUserPic}
						/>
					</section>
					<MessageList
						firebase={firebase}
						activeRoom={this.state.activeRoom}
						adminUser={this.state.adminUser}
						user={this.state.user}
					/>
				</div>
			</div>
		);
	}
}

export default App;
