import React, { Component } from "react";
import "./../styles/TopBarStyle.css";

class TopBar extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

signIn() {
	const provider = new this.props.firebase.auth.GoogleAuthProvider();

	this.props.firebase.auth().signInWithPopup(provider).then((result) => {
		// This gives you a Google Access Token. You can use it to access the Google API.
		const token = result.credential.accessToken;
		// The signed-in user info.
		const user = result.user;
		this.authenticate(user);
		// ...
	}).catch(function (error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// The email of the user's account used.
		var email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		var credential = error.credential;
		// ...
	});
}

signOut() {
	this.props.firebase.auth().signOut();
	this.props.authenticateUser(undefined);
}

authenticate(user) {
	this.props.authenticateUser(user);
}

  render() {
	  return (
			<section id="top-bar-container">
				<div id="top-logo-container">
					<div id="top-logo-graphic" />
					<div id="top-logo-text">QuikChat</div>
				</div>
				<div id="top-options-container">
					<div id="top-user-container">
						Welcome,
						<div id="top-user">
							{this.props.user === undefined
								? "Guest"
								: this.props.user.displayName}
						</div>
					</div>
					<div id="top-home-container">
						<button id="top-home" 
							onClick={() => this.props.deactivateRoom()}/>
					</div>
					<div id="top-sign-in-out-container">
						{this.props.user === undefined
									? <button id="top-sign-in"
										onClick={() => this.signIn()} />
									: <button id="top-sign-out"
										onClick={() => this.signOut()} />}
						
					</div>
				</div>
			</section>
		);
	}
}

export default TopBar;
