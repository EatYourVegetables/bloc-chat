import React, { Component } from "react";
import "./../styles/RoomListStyle.css";

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      value: "",
      hoverRoom: null,
      editValue: "",
      editRoom: "",
    };
    this.roomsRef = this.props.firebase.database().ref("rooms");
    this.handleChange = this.handleChange.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
  }

  componentDidMount() {
    this.roomsRef.on("child_added", snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({
        rooms: this.state.rooms.concat(room)
      });
    });

    this.roomsRef.on("child_removed", snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      let tempArray = this.state.rooms;
      const index = tempArray.findIndex(rooms => rooms.key === room.key);
      if (index > -1) {
        tempArray.splice(index, 1);
        this.setState({
          rooms: tempArray
        });
      }
    });

    this.roomsRef.on("child_changed", snapshot => {
      const room = snapshot.val();

      room.key = snapshot.key;
      let tempArray = this.state.rooms;
      const index = tempArray.findIndex(rooms => rooms.key === room.key);
      tempArray[index] = room;
      this.setState({
        rooms: tempArray
      });
    });
  }

  beginEdit(room) {
    this.props.firebase
      .database()
      .ref("rooms/" + room)
      .once("value")
      .then(snapshot => {
        this.setState({
          editValue: snapshot.val().name,
          editRoom: room
        });
      });
  }

  editRoom(room) {
    this.roomsRef.child(room).update({
      name: this.state.editValue
    });
    this.setState({
      editRoom: "",
      editValue: ""
    });
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  createRoom(newRoom) {
    if (newRoom === "") {
      return;
    } else {
      this.roomsRef.push({
        name: newRoom
      });
      this.setState({
        value: ""
      });
    }
  }

  handleKeyPress(newRoom, e) {
    console.log("this was pressed");
    if (e.key === "Enter") {
      this.createRoom(newRoom);
    }
  }

  removeRoom(room) {
    this.roomsRef.child(room).remove();
  }

  handleEditChange(event) {
    this.setState({
      editValue: event.target.value
    });
  }

  handleEditKeyPress(room, e) {
    if (e.key === "Enter") {
      this.editRoom(room);
    }
  }

  render() {
    return <section id="nav-bar">
				<nav id="room-container">
					{this.state.rooms.map(room => (
						<div
							className="nav-room-container"
							id={this.props.activeRoom === room ? "room-selected" : ""}
							key={room.key}
							onMouseEnter={() => this.setState({ hoverRoom: room.key })}
							onMouseLeave={() => this.setState({ hoverRoom: null })}
						>
							<div
								className="nav-room"
								onClick={() => this.props.activateRoom(room)}
							>
								{this.state.editRoom !== room.key ? (
                  <div className="room-name">
									  {room.name}
                  </div>
								) : (
									<div id="room-edit-container">
										<input
											id="room-edit-input"
											type="text"
											value={this.state.editValue}
											onChange={this.handleEditChange}
											onKeyPress={e =>
												this.handleEditKeyPress(room.key, e)
											}
										/>
										<button
											type="button"
											id="room-edit-send"
											onClick={() => this.editRoom(room.key)}
										>
										</button>
									</div>
								)}
							</div>
							{this.state.hoverRoom !== null &&
							this.state.hoverRoom === room.key ? (
								<div id="room-button-container">
									<button
										className="message-edit"
										value="Edit"
										onClick={() => this.beginEdit(room.key)}
									/>
									<button
										className="message-delete"
										value="Delete"
										onClick={() => this.removeRoom(room.key)}
									/>
								</div>
							) : (
								<div />
							)}
						</div>
					))}
				</nav>
				<div id="room-form-container">
					<input type="text" id="room-new-room-input" value={this.state.value} onChange={this.handleChange} onKeyPress={e => this.handleKeyPress(this.state.value, e)} placeholder="Create a new room" />
					<input type="button" id="room-new-room-button" value="Submit" onClick={() => this.createRoom(this.state.value)} />
				</div>
			</section>;
  }
}

export default RoomList;
