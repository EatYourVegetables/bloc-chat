import React, {Component} from 'react';
import './../styles/UserStyle.css';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            user: undefined
        };
    }

    signIn(){
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

    signOut(){
        this.props.firebase.auth().signOut();
        this.setState({
            authenticated: false,
        })
        this.props.authenticateUser(undefined);
    }

    authenticate(user){
        this.setState({
            authenticated: true,
            user: user
        })
        this.props.authenticateUser(user);
    }

    getUserPic(){
        const userPic = {
            background: 'url(' + this.state.user.photoURL + ') center',
            backgroundSize: 'cover',
        }
        return userPic;
    }
    
    render(){
        
        return(
            (this.state.authenticated)
            ? <div id="user-container">
                <div id="user-info-container">
                    <div id="user-pic" style={this.getUserPic()}></div>
                    <div id="user-username" >{this.state.user.displayName}</div>
                </div>
                <button id="user-sign-out-button" onClick={() => this.signOut()}>Sign Out</button>
            </div>


            :<div id="user-container">
                <div id="user-sign-in">
                    <button id="user-sign-in-button" onClick={() => this.signIn()}>Sign In</button>
                </div>
            </div>
            
        );
    }
}

export default User;