import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.FacebookAuthProvider();

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;

      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }

      setUser(signedInUser);
    })
    .catch(error => {
      console.log(error);
      console.log(error.message);
    })
  }

  const handleFbLogin = () => {
    firebase.auth().signInWithPopup(fbProvider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;

      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }

      setUser(signedInUser);
    })
    .catch(error => {
      console.log(error);
      console.log(error.message);
    })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const isSignedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        error: '',
        success: false
      }
      setUser(isSignedOutUser);
    })
    .catch(error => {
      console.log(error);
    })
  }
  const handleSubmit = (e) => {
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true
        setUser(newUserInfo);
        updateUserName(user.name);
      })
      .catch(error => {
        // Handle Errors here.
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        // ...
      });
    }

    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true
        setUser(newUserInfo);
        console.log('sign in user info', res.user)
      })
      .catch(error => {
        // Handle Errors here.
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        // ...
      });
    }
    e.preventDefault();
  }
  const handleBlur = (e) => {
    let isFieldValid = true;
    if(e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length >= 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function() {
      console.log('user name updated successfully')
    }).catch(function(error) {
      console.log(error);
    });
  }
  return (
    <div className="App">
      {
        user.isSignedIn
        ?<button onClick={handleSignOut}>Sign out</button>
        :<button onClick={handleSignIn}>Sign in with Google</button>
      }
      <br/>
      {
        user.isSignedIn
        ?<button onClick={handleSignOut}>Sign in with Facebook</button>
        :<button onClick={handleFbLogin}>Sign in with Facebook</button>
      }
      
      {
        user.isSignedIn && <div>
          <h2>Welcome, {user.name}</h2>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      <h1> Our own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign up</label>
      <form onSubmit={handleSubmit}>
        { newUser && <input type="text" name="name" id="" placeholder="Your Name" onBlur={handleBlur}/>}
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Enter your email" required/>
        <br/>
        <input type="password" name="password" onBlur={handleBlur} placeholder="Password" required/>
        <br/>
        <input type="submit" value={newUser ? "Sign up" : "Sign in"}/>
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      { user.success && <p style={{color: 'green'}}>User {newUser ?'Created' : 'Logged In'} Succesfully</p>}


    </div>
  );
}

export default App;
