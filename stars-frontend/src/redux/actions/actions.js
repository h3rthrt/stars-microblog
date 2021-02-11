import axios from '../../api/axios'
import firebase from '../../api/firebase'

import {
	LOAD_POSTS_SUCCESS,
	LOAD_POSTS_ERROR,
	LOAD_POPULAR_TAGS_ERROR,
	LOAD_POPULAR_TAGS_SUCCESS,
	LOAD_PROFILE_SUCCESS,
	LOAD_PROFILE_ERROR,
	LOAD_PROFILE_PHOTO,
	AUTH_SUCCESS,
	AUTH_LOGOUT,
	AUTH_ERROR,
	AUTH_BLOGNAME,
	AUTH_PHOTO,
	UPLOAD_ON_PROGRESS,
	UPLOAD_LOADED,
	CLEAR_PROFILE_DATA
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

export function clearProfileData() {
	return {
		type: CLEAR_PROFILE_DATA
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
					const user = firebase.auth().currentUser
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
						}, () => {
							dispatch(authSuccess(user.uid, name, null))
						})
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

export function authLoadBlogname(uid) {
	return async dispatch => {
		await firebase.database().ref(`users/${uid}`).on('value', (snapshot) => {
			dispatch(authBlogname(snapshot.val().blogname))
		}, (e) => {
			console.log(e)
		})
	}
}

export function authSuccess(uid, username, photoURL) {
	return {
		type: AUTH_SUCCESS,
		uid,
		username,
		photoURL
	}
}

export function authBlogname(blogname) {
	return {
		type: AUTH_BLOGNAME,
		blogname
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
				dispatch(authSuccess(userState.uid, userState.displayName, userState.photoURL))
				} else {
					dispatch(logout())
					dispatch(clearProfileData())
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
							}, () => {
								const user = firebase.auth().currentUser
								user.updateProfile({
									'photoURL': url
								}).then(() => {
									dispatch(uploadComplete(true))
									dispatch(loadProfilePhoto(url))
									dispatch(loadAuthPhoto(url))
									dispatch(uploadComplete(false))
								}).catch((e) => {
									dispatch(authError(e))
								})
							})
						})
					})
			})
		})

	}
}

export function uploadOnProgress() {
	return {
		type: UPLOAD_ON_PROGRESS
	}
}

export function uploadComplete(complete) {
	return {
		type: UPLOAD_LOADED,
		complete
	}
}

export function loadProfilePhoto(data) {
	return {
		type: LOAD_PROFILE_PHOTO,
		photoURL: data.photoURL
	}
}

export function loadAuthPhoto(url) {
	return {
		type: AUTH_PHOTO,
		photoURL: url
	}
}