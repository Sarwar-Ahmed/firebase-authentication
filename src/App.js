import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
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

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const isSignedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: ''
      }
      setUser(isSignedOutUser);
    })
    .catch(error => {
      console.log(error);
    })
  }
  const handleSubmit = () => {

  }
  const handleBlur = (e) => {
    let isFormValid = true;
    if(e.target.name === 'email'){
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length >= 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFormValid = isPasswordValid && passwordHasNumber;
    }
    if(isFormValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  return (
    <div className="App">
      {
        user.isSignedIn
        ?<button onClick={handleSignOut}>Sign out</button>
        :<button onClick={handleSignIn}>Sign in</button>
      }
      {
        user.isSignedIn && <div>
          <h2>Welcome, {user.name}</h2>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      <h1> Our own Authentication</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" id="" placeholder="Your Name" onBlur={handleBlur}/>
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Enter your email" required/>
        <br/>
        <input type="password" name="password" onBlur={handleBlur} placeholder="Password" required/>
        <br/>
        <input type="submit" value="Submit"/>
      </form>

    </div>
  );
}

export default App;
