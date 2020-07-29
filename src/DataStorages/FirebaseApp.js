import * as firebase from 'firebase';

let config = {
    apiKey: "AIzaSyDsJvZ8qvEILK1DrwWPVzJftyRvpprbtdw",
    authDomain: "amin-preuniversity-examination.firebaseapp.com",
    databaseURL: "https://amin-preuniversity-examination.firebaseio.com",
    projectId: "amin-preuniversity-examination",
    storageBucket: "amin-preuniversity-examination.appspot.com",
    messagingSenderId: "652459301860",
    appId: "1:652459301860:web:cd0c80f5952007e0da45f1",
    measurementId: "G-FZN7B9F058"
};
firebase.initializeApp(config);

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();