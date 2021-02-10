import axios from '../../api/axios'
import firebase from '../../api/firebase'

import {
	LOAD_POSTS_SUCCESS,
	LOAD_POSTS_ERROR,
	LOAD_POPULAR_TAGS_ERROR,
	LOAD_POPULAR_TAGS_SUCCESS,
	LOAD_PROFILE_SUCCESS,
	LOAD_PROFILE_ERROR,
	AUTH_SUCCESS,
	AUTH_LOGOUT,
	AUTH_ERROR,
	UPLOAD_ON_PROGRESS,
	UPLOAD_LOADED
} from './actionsTypes'

// Load posts

export function loadPosts() {
	return async (dispatch) => {
		try {
			let posts = []
			await axios.get('posts').then((response) => (posts = response.data))
			dispatch(loadPostsSuccess(posts))
		} catch (e) {
			dispatch(loadPostsError(e))
		}
	}
}

export function loadProfilePosts(payload) {
	return async (dispatch) => {
		try {
			let posts = []
			await axios.get(`${payload}?nickname=user1106`).then((response) => (posts = response.data))
			dispatch(loadPostsSuccess(posts))
		} catch (e) {
			dispatch(loadPostsError(e))
		}
	}
}

export function loadPostsSuccess(posts) {
	return {
		type: LOAD_POSTS_SUCCESS,
		posts: posts
	}
}

export function loadPostsError(e) {
	return {
		type: LOAD_POSTS_ERROR,
		error: e
	}
}

// Load popular tags

export function loadPopularTags() {
	return async (dispatch) => {
		try {
			let tags = []
			await axios.get('tags').then((response) => (tags = response.data))
			dispatch(loadPopularTagsSuccess(tags))
		} catch (e) {
			dispatch(loadPopularTagsError(e))
		}
	}
}

export function loadPopularTagsSuccess(tags) {
	return {
		type: LOAD_POPULAR_TAGS_SUCCESS,
		tags: tags
	}
}

export function loadPopularTagsError(e) {
	return {
		type: LOAD_POPULAR_TAGS_ERROR,
		error: e
	}
}

// Load profile

export function loadProfile(username) {
	return async (dispatch) => { 
		await firebase.database().ref().child('users')
		.orderByChild('username').equalTo(username)
			.on('child_added', (snapshot) => {
				let data = snapshot.val()
				dispatch(loadProfileDataSuccess(data))
			}, (error) => {
				console.log('not found')
				dispatch(loadProfileDataError(error))
			})
	}
}

export function loadProfileDataSuccess(data) {
	return {
		type: LOAD_PROFILE_SUCCESS,
		username: data.username,
		blogname: data.blogname,
		photoURL: data.photoURL || null,
		desc: data.desc || null,
		followers: data.followers || null,
		following: data.following || null,
		media: data.media || null
	}
}

export function loadProfileDataError(e) {
	return {
		type: LOAD_PROFILE_ERROR,
		error: e
	}
}

//auth

export function authUser(email, password, isLogin, name, blogname) {
	return async dispatch => {
		if (isLogin) {
			await firebase.auth().createUserWithEmailAndPassword(email, password)
				.then(() => {
					var user = firebase.auth().currentUser
					user.updateProfile({
					displayName: `${name}`
					}).then(async function() {
						await firebase.database().ref('users/' + user.uid).set({
							username: name,
							blogname: blogname,
							email: email,
							photoURL: null,
							desc: null,
							followers: [],
							following: [],
							media: []
						})
						dispatch(authSuccess(user.uid, name, blogname, null))
					}).catch(function(e) {
						dispatch(delError())
						dispatch(authError(e.message))
					})
				})
				.catch((error) => {
					dispatch(delError())
					dispatch(authError(error.message))
				})
		} else {
			await firebase.auth().signInWithEmailAndPassword(email, password)
				.catch((error) => {
					dispatch(delError())
					dispatch(authError(error.message))
				})
		}
	}
}

export function authSuccess(uid, username, blogname, photoURL) {
	return {
		type: AUTH_SUCCESS,
		uid,
		username,
		blogname,
		photoURL
	}
}

export function authError(e) {
	return {
		type: AUTH_ERROR,
		error: e
	}
}

export function delError() {
	return {
		type: AUTH_ERROR,
		error: null
	}
}

export function logout() {
	firebase.auth().signOut()
	return {
		type: AUTH_LOGOUT
	}
}

//auth state

export function authState() {
	return async dispatch => {
		await firebase.auth().onAuthStateChanged(async (userState) => {
			if (userState) {
				await firebase.database().ref('/users/' + userState.uid).once('value')
					.then((snapshot) => {
						const username = snapshot.val().username || 'anonymous'
						const blogname = snapshot.val().blogname || 'nameless'
						const photoURL = snapshot.val().photoURL || 'null' 
						dispatch(authSuccess(userState.uid, username, blogname, photoURL))
					})
				} else {
					dispatch(logout())
				}
		}, (error) => {
			console.log(error)
		})
	}
}

//upload photo

export function uploadPhoto(files, username) {
	return async dispatch => {
		await files.forEach((file) => {
			const path = `${username}/${file.name}`
			const ref = firebase.storage().ref(path)
			const task = ref.put(file)
			task.on('state_changed', () => {
				dispatch(uploadOnProgress())
			}, error => {
				authError(error)
			}, () => {
				task.snapshot.ref.getDownloadURL()
					.then((url) => {
						firebase.database()
						.ref()
						.child('users')
						.orderByChild('username')
						.equalTo(username)
						.on('child_added', (snapshot) =>{
							snapshot.ref.update({
								'photoURL': url
							})
						})
					})
				dispatch(uploadComplete())
			})
		})

	}
}

export function uploadOnProgress() {
	return {
		type: UPLOAD_ON_PROGRESS,
		upload: true
	}
}

export function uploadComplete() {
	return {
		type: UPLOAD_LOADED,
		upload: false
	}
}