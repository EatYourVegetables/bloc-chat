import React, {Component} from 'react';
import './../styles/UserStyle.css';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        this.props.authenticateUser(undefined);
    }

    authenticate(user){
        this.props.authenticateUser(user);
    }

    getUserPic() {
        const userPic = {
            background: 'url(' + this.props.user.photoURL + ') center',
            backgroundSize: 'cover',
        }
        return userPic;
    }
    
    render(){
        
        return(
            (this.props.user !== undefined)
            ? <div id="user-container">
                <div id="user-info-container">
                    <div className="user-pic" style={this.getUserPic()}></div>
                    <div id="user-username" >{this.props.user === undefined
								? ""
								: this.props.user.displayName}</div>
                </div>
                    <div id="user-google-button-container-sign-out" onClick={() => this.signOut()}>
                        <div className="user-google-text" id="sign-out">Sign out</div>
                    </div>
            </div>


            :<div id="user-container">
                <div id="user-sign-in">
                    <div id="user-google-button-container" onClick={() => this.signIn()}>
                        <div id="user-google-logo"></div>
                        <div className="user-google-text">Sign in with Google</div>
                    </div>
                </div>
            </div>
            
        );
    }
}

export default User;