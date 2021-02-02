import firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyC-N3bpwnzf61N1QQzCto-G9V3PA0B-TLs",
    authDomain: "stars-microblog.firebaseapp.com",
    databaseURL: "https://stars-microblog-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "stars-microblog",
    storageBucket: "stars-microblog.appspot.com",
    messagingSenderId: "384816582843",
    appId: "1:384816582843:web:2efd132c1f6567755c199e"
}

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()

export { auth, firebase as default } 