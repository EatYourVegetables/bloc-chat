import React, {Component} from 'react';
import './../styles/MessageListStyle.css';

class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
        };
        this.messagesRef = this.props.firebase.database().ref('messages');
        this.messageArray = [];
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


   render(){
       return(
        <section id="messages-container">
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
        </section>
       );
   }
}

export default MessageList;