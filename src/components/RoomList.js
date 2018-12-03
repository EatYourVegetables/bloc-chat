import React, {Component} from 'react';
import './../styles/RoomListStyle.css';

class RoomList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            value: ''
        };
        this.roomsRef = this.props.firebase.database().ref('rooms');
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.roomsRef.on('child_added', snapshot => {
            const room = snapshot.val();
            room.key = snapshot.key;
            this.setState({
                rooms: this.state.rooms.concat(room)
            })
        });
   }

   handleChange(event) {
       this.setState({
           value: event.target.value
       });
   }

   createRoom(newRoom){
       if(newRoom === ''){
           return;
       }
       else{
       this.roomsRef.push({
            name: newRoom
       });
       this.setState({
           value: ''
       })
    }
   }

   handleKeyPress(newRoom, e){
       console.log('this was pressed');
       if(e.key === 'Enter'){
           this.createRoom(newRoom);
       }
   }

   render(){
       return(
        <section id="nav-bar">
            <nav id="room-container">
                    {this.state.rooms.map((room) =>
                        <p className="nav-room" onClick={() => this.props.activateRoom(room)} key = {room.key}>{room.name}</p>
                    )}
            </nav>
                <div id="room-form-container">
                   <input type="text" value={this.state.value} onChange={this.handleChange} 
                    onKeyPress={(e) => this.handleKeyPress(this.state.value, e)} placeholder="Create a new room"/><br/>
                    <input type="button" value="Add room" onClick={() => this.createRoom(this.state.value)} />
                </div>
        </section>
       );
   }
}

export default RoomList;