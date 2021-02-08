import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

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
const database = firebase.database()
const storage = firebase.storage()

export { auth, database, storage, firebase as default } 