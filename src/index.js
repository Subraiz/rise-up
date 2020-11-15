import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import firebase from "firebase/app";

var firebaseConfig = {
  apiKey: "AIzaSyAr4zsliXOTVlatnnptO9WEQDV4-DeFnAA",
  authDomain: "rise-up-1824c.firebaseapp.com",
  databaseURL: "https://rise-up-1824c.firebaseio.com",
  projectId: "rise-up-1824c",
  storageBucket: "rise-up-1824c.appspot.com",
  messagingSenderId: "115354686549",
  appId: "1:115354686549:web:bfd4c7433fbab9a46d30dc",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
