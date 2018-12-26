import React, { Component } from "react";
import 'emoji-mart/css/emoji-mart.css';
import "./../styles/MessageListStyle.css";
import { Picker } from 'emoji-mart';
import Home from "./Home.js";

class MessageList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			value: "",
			typing: "",
			hoverMessage: null,
			editValue: "",
			editMessage: "",
			messageHeight: 25,
			emojiActive: false,
			readyToScroll: false,
			newMessages: 0
		};
		this.messagesRef = this.props.firebase.database().ref("messages");
		this.messageArray = [];
		this.handleChange = this.handleChange.bind(this);
		this.handleEditChange = this.handleEditChange.bind(this);
		this.beginEdit = this.beginEdit.bind(this);
		this.count = 0;
		this.innerDivRef = React.createRef();
		this.outerDivRef = React.createRef();
		this.messageHeightRef = React.createRef();
	 	this.lastMessageRef = React.createRef();
		this.scrollableDivRef = React.createRef();
		this.messageInputRef = React.createRef();
		this.onValueAdded = snapshot => {
			const message = snapshot.val();
			message.key = snapshot.key;
			if (!this.messageArray.includes(message)) {
				this.messageArray.push(message);
			}
			this.setState({
				messages: this.messageArray
			});
		};
		this.onValueRemoved = snapshot => {
			const message = snapshot.val();

			message.key = snapshot.key;
			const index = this.messageArray.findIndex(msg => {
				return msg.key === message.key;
			});
			this.messageArray.splice(index, 1);
			this.setState({
				messages: this.messageArray
			});
		};

		this.onValueChanged = snapshot => {
			const message = snapshot.val();

			message.key = snapshot.key;
			const index = this.messageArray.findIndex(msg => {
				return msg.key === message.key;
			});
			this.messageArray[index] = message;
			this.setState({
				messages: this.messageArray
			});
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.activeRoom !== "" &&
			this.props.activeRoom.key !== prevProps.activeRoom.key) {

			this.messagesRef
				.orderByChild("roomId")
				.equalTo(this.props.activeRoom.key)
				.off("child_added", this.onValueAdded);
			this.messagesRef
				.orderByChild("roomId")
				.equalTo(this.props.activeRoom.key)
				.off("child_removed", this.onValueRemoved);
			this.messagesRef
				.orderByChild("roomId")
				.equalTo(this.props.activeRoom.key)
				.off("child_changed", this.onValueChanged);
			this.messageArray = [];
			this.setState({
				messages: []
			});
			this.messagesRef
				.orderByChild("roomId")
				.equalTo(this.props.activeRoom.key)
				.on("child_added", this.onValueAdded);
			this.messagesRef
				.orderByChild("roomId")
				.equalTo(this.props.activeRoom.key)
				.on("child_removed", this.onValueRemoved);
			this.messagesRef
				.orderByChild("roomId")
				.equalTo(this.props.activeRoom.key)
				.on("child_changed", this.onValueChanged);
		}

		if (this.state.readyToScroll) {
			this.scrollToBottom();
		}

		// if(this.state.value !== prevState.value){
		//     this.setState({
		//         typing: 'Guest is typing...'
		//     })
		// }
	}

	addMessage(newMessage) {
		if (newMessage === "") {
			return;
		} else if (this.props.user === undefined) {
			this.messagesRef.push({
				content: newMessage,
				roomId: this.props.activeRoom.key,
				sentAt: this.fetchTime(),
				username: "Guest",
				userPic: "",
				userId: 0
			});
			this.setState({
				value: "",
				typing: "",
				emojiActive: false,
				readyToScroll: true
			});
		} else {
			this.messagesRef.push({
				content: newMessage,
				roomId: this.props.activeRoom.key,
				sentAt: this.fetchTime(),
				username: this.props.user.displayName,
				userPic: this.props.user.photoURL,
				userId: this.props.user.uid
			});
			this.setState({
				value: "",
				typing: "",
				emojiActive: false,
				readyToScroll: true
			});
		}
	}

	beginEdit(message) {
		let height = 25;
		this.messageHeightRef.current !== null
			? (height = this.messageHeightRef.current.clientHeight)
			: (height = 25);

		this.props.firebase
			.database()
			.ref("messages/" + message)
			.once("value")
			.then(snapshot => {
				this.setState({
					editValue: snapshot.val().content,
					editMessage: message,
					messageHeight: height
				});
			});
	}

	editMessage(message) {
		this.messagesRef.child(message).update({
			content: this.state.editValue
		});
		this.setState({
			editMessage: "",
			editValue: ""
		});
	}

	removeMessage(message) {
		this.messagesRef.child(message).remove();
	}

	fetchTime() {
		let time = "";
		const date = new Date();
		const hours = date.getHours() === 0 ? "12" : date.getHours();
		const minutes =
			date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
		time =
			hours > 12
				? hours - 12 + ":" + minutes + " PM"
				: hours + ":" + minutes + " AM";
		return time;
	}

	handleChange(event) {
		this.setState({
			value: event.target.value
		});
	}

	handleEditChange(event) {
		this.setState({
			editValue: event.target.value
		});
	}

	handleKeyPress(newMessage, e) {
		if (e.key === "Enter") {
			this.addMessage(newMessage);
		}
	}

	handleEditKeyPress(message, e) {
		if (e.key === "Enter") {
			this.editMessage(message);
		}
	}

	getUserPic(message) {
		const userPic = {
			background: "url(" + message.userPic + ") center",
			backgroundSize: "cover"
		};
		return userPic;
	}

	toggleEmoji(){
		this.state.emojiActive
			? this.setState({
				emojiActive: false
			})

			: this.setState({
				emojiActive: true
			})
	}

	deactivateEmojiPicker(){
		this.setState({
			emojiActive: false
		})
	}

	addEmoji(emoji){
		console.log(emoji);
		this.setState({
			value: this.state.value + emoji.native
		})
	}

	scrollToBottom(){

		if(this.compareRefPos()){
			this.setState({
				readyToScroll: false
				})
			this.scrollableDivRef.current.scrollTop = this.innerDivRef.current.scrollHeight;
		}else{
			this.setState({
				newMessages: this.state.newMessages + 1
			})
		}
	}

	compareRefPos(){
		const total = Math.abs(this.messageInputRef.current.getBoundingClientRect().top -
			this.lastMessageRef.current.getBoundingClientRect().bottom);
		if(total <= 99){
			return true;
		}
		else{
			return false;
		};
	}

	render() {
		const heightCompared =
			this.innerDivRef.current !== null &&
			this.outerDivRef.current !== null &&
			this.innerDivRef.current.clientHeight >=
				this.outerDivRef.current.clientHeight;

		let emojiPicker = this.state.emojiActive === true
			? <Picker set='emojione'
				onSelect={emoji => this.addEmoji(emoji)}
				title='Pick your emoji…'
				emoji='point_up'
				color='#4d5eb3' />

			: <div />

		return this.props.activeRoom === "" ? <Home /> : <section className="message-list-container">
				<div id="messages-container">
					<div id="message-room-name-container">
						<h1 id="message-room-name">{this.props.activeRoom.name}</h1>
					</div>
					<div ref={this.outerDivRef} id={heightCompared ? "messages-scroll-hider" : "messages-scroll-hider-innactive"}>
						<div ref={this.scrollableDivRef} id={heightCompared ? "messages-container-inner-scroll-hidden" : "messages-container-inner"}>
							<div ref={this.innerDivRef} id="messages" style={heightCompared ? { marginBottom: "57px" } : {}}>
								{this.state.messages.map((message, i, array) => (
									<div
										ref={array.length - 1 === i ? this.lastMessageRef :""}
										className="message-container"
										key={message.key}
										onMouseEnter={() =>
											this.setState({ hoverMessage: message.key })
										}
										onMouseLeave={() =>
											this.setState({ hoverMessage: null })
										}
										onClick={() => this.deactivateEmojiPicker()}
									>
										
										<div className="message-left-container">
											{message.userPic === "" ? (
												<div className="guest-pic" />
											) : (
												<div
													className="user-pic"
													style={this.getUserPic(message)}
												/>
											)}
										</div>
										<div className="message-right-container">
											<div className="message-top-container">
												<div className="message-username">
													{message.username}
												</div>
												<div className="message-options">
													{this.props.user !== undefined &&
													(message.userId === this.props.user.uid ||
														this.props.user.uid === this.props.adminUser) &&
													this.state.hoverMessage !== null &&
													this.state.hoverMessage === message.key ? (
														<div id="message-button-container">
															<button
																className="message-edit"
																value="Edit"
																onClick={() => this.beginEdit(message.key)}
															/>
															<button
																className="message-delete"
																value="Delete"
																onClick={() =>
																	this.removeMessage(message.key)
																}
															/>
														</div>
													) : (
														<div />
													)}
													<div className="message-time-stamp">
														{message.sentAt}
													</div>
												</div>
											</div>
											{this.state.editMessage === message.key ? (
												<div className="message-content">
													<div id="message-edit-container">
														<textarea
															id="message-edit-input"
															type="text"
															value={this.state.editValue}
															onChange={this.handleEditChange}
															onKeyPress={e =>
																this.handleEditKeyPress(message.key, e)
															}
															style={{ height: this.state.messageHeight }}
														/>
														<button
															type="button"
															id="message-edit-send"
															onClick={() => this.editMessage(message.key)}
														>
															Submit
														</button>
													</div>
												</div>
											) : this.state.hoverMessage === message.key ? (
												<div
													ref={this.messageHeightRef}
													className="message-content"
												>
													{message.content}
												</div>
											) : (
												<div className="message-content">
													{message.content}
												</div>
											)}
											{this.state.hoverMessage !== null &&
											this.state.hoverMessage === message.key &&
											this.state.emojiActive === false ? (
												<div className="message-bottom-container">
													<div className="message-like-love-container">
														<div className="message-like" 
															onClick={()=>console.log(this.checkRefPos())}/>
														<div className="message-dislike" />
														<div className="message-fire" />
														<div className="message-heart" />
													</div>
												</div>
											) : (
												<div />
											)}
										</div>
									</div>
								))}
							</div>
						<div id="message-input-container" ref={this.messageInputRef} style={heightCompared ? { position: "absolute", left: 0, bottom: 0, width: "100%"} : {}}>
								<div id="message-input-wrapper">
									<input id="message-input" type="text" value={this.state.value} onChange={this.handleChange} onKeyPress={e => this.handleKeyPress(this.state.value, e)} placeholder="Type a message..." />
									{emojiPicker}
									<button id="message-input-emoji" onClick={() => this.toggleEmoji()} />
									<button id="message-input-send" onClick={() => this.addMessage(this.state.value)}>
										send
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>;
	}
}

export default MessageList;
