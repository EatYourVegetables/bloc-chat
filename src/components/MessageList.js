import React, {Component} from 'react';
import './../styles/MessageListStyle.css';

class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            value: ''
        };
        this.messagesRef = this.props.firebase.database().ref('messages');
        this.messageArray = [];
        this.handleChange = this.handleChange.bind(this);
    }
   
    componentDidUpdate(prevProps){
        if (this.props.activeRoom.key !== prevProps.activeRoom.key){
            this.setState({
                messages: []
            });
            this.messageArray = [];
            this.messagesRef.orderByChild("roomId").equalTo(this.props.activeRoom.key).on('child_added', snapshot => {
                const message = snapshot.val();
                message.key = snapshot.key;
                    if (!(this.messageArray.includes(message))) {
                        this.messageArray.push(message);
                    }
                    this.updateMessages();
            });
            
        }
    }

    updateMessages(){
        this.setState({
            messages: this.messageArray
        })
    }

    addMessage(newMessage) {
        if (newMessage === '') {
            return;
        } else if (this.props.user === undefined) {
            this.messagesRef.push({
                content: newMessage,
                roomId: this.props.activeRoom.key,
                sentAt: this.fetchTime(),
                username: "Guest"
            });
            this.setState({
                value: ''
            })
        }
        else{
            this.messagesRef.push({
                content: newMessage,
                roomId: this.props.activeRoom.key,
                sentAt: this.fetchTime(),
                username: this.props.user.displayName
            });
            this.setState({
                value: ''
            })
        }
    }

    fetchTime(){
        let time = '';
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        console.log(hours);
        time = (hours > 12)
                ? (hours - 12) + ":" + minutes + " PM"
                : hours + ":" + minutes + " AM";
        return time;
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    handleKeyPress(newMessage, e){
       if(e.key === 'Enter'){
           this.addMessage(newMessage);
       }
   }


   render(){
       return(
        <section id="message-list-container">
            <div id="messages-container">
                <h1>{this.props.activeRoom.name}</h1>
                    {this.state.messages.map((message) =>
                        <div className="message-container" key={message.key}>
                            <div className="message-top-container">
                                <div className="message-username">{message.username}</div>
                                <div className="message-time-stamp">{message.sentAt}</div>
                            </div>
                            <div className="message-content">{message.content}</div>     
                        </div>
                    )}
            </div>
            <div id="message-input-container">
                <input id = "message-input"
                    type = "text"
                    value = {this.state.value}
                    onChange = {this.handleChange}
                    onKeyPress={(e) => this.handleKeyPress(this.state.value, e)} 
                    placeholder="Type a message..."
                />
                <input id = "message-input-send"
                    type = "button"
                    value = "Send"
                    onClick = {() => this.addMessage(this.state.value)}
                />
            </div>
        </section>
       );
   }
}

export default MessageList;