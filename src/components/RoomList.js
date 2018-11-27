import React, {Component} from 'react';

class RoomList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: []
        };
        console.log(this.props);
        this.roomsRef = this.props.firebase.database().ref('rooms');
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

   render(){
       return(
        <section>
            {this.state.rooms.map((room,index) =>
                <p key = {room.key}>{room.name}</p>
            )}
        </section>
       );
   }
}

export default RoomList;