import React, { Component } from "react";
import "./../styles/HomeStyle.css";

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return <section className="message-list-container">
				<div id="home-container">
					<div id="home-wrapper">
						<div id="home-logo-container">
							<div id="home-logo-graphic" />
							<h1 id="home-logo">QuikChat</h1>
						</div>
						<div id="home-content">
							<h2 id="header">Welcome! 👋</h2>
							<p className="home-text">
								QuikChat is a little web app I made to improve my ReactJs
								and design skills. I hope you enjoy using it as much as I
								enjoyed making it!
							</p>
							<h3 className="sub-header">
								<i className="icon ion-md-information-circle-outline" id="home-info" />
								How to use
							</h3>
							<p className="home-text">
								When you're ready to start chatting, sign in (optional, but
								recommended) and select a room from the navigation menu on
								the left. messages are updated in real time so you can chat
								with a friend or with a complete stranger.
							</p>
							<h3 className="sub-header">
								<i className="icon ion-md-people" id="home-people" />
								Users
							</h3>
							<p className="home-text">
								To fully experince the app, you need to sign in with Google (bottom left or top right). Once signed in, you will have access to special rooms just for users and you will also be able to create public and private rooms, edit/delete your messages and rooms using the
								<i className="icon ion-md-create" style={{ color: "rgba(0, 0, 0, 0.5)", margin: "0 10px" }} />
								and
								<i className="icon ion-md-trash" style={{ color: "rgba(0, 0, 0, 0.5)", margin: "0 10px" }} />
								icons. Those are the basics, the rest is for you to figure out and discover as you use the app!
							</p>
							<h3 className="sub-header">
								<i className="icon ion-md-clipboard" id="home-rules" />
								Rules
							</h3>
							<p className="home-text">
								Please refrain from vulgar, crude and mean
								language. Have fun, be nice and be respectful. 
								Do not post links to NSFW content.
								Lastly, do not spam. No one likes a spammer.
							</p>
						</div>
					</div>
				</div>
			</section>;
	}
}

export default Home;
