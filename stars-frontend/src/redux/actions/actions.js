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
	AUTH_ERROR
} from './actionsTypes'

// Load posts

export function loadPosts() {
	return async (dispatch) => {
		try {
			let posts = []
			await axios.get('posts').then((response) => (posts = response.data))
			dispatch(fetchPostsSuccess(posts))
		} catch (e) {
			dispatch(fetchPostsError(e))
		}
	}
}

export function loadProfilePosts(payload) {
	return async (dispatch) => {
		try {
			let posts = []
			await axios.get(`${payload}?nickname=user1106`).then((response) => (posts = response.data))
			dispatch(fetchPostsSuccess(posts))
		} catch (e) {
			dispatch(fetchPostsError(e))
		}
	}
}


export function fetchPostsSuccess(posts) {
	return {
		type: LOAD_POSTS_SUCCESS,
		posts: posts
	}
}

export function fetchPostsError(e) {
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
			dispatch(fetchPopularTagsSuccess(tags))
		} catch (e) {
			dispatch(fetchPopularTagsError(e))
		}
	}
}

export function fetchPopularTagsSuccess(tags) {
	return {
		type: LOAD_POPULAR_TAGS_SUCCESS,
		tags: tags
	}
}

export function fetchPopularTagsError(e) {
	return {
		type: LOAD_POPULAR_TAGS_ERROR,
		error: e
	}
}

// Load profile

export function loadProfile(payload) {
	return async (dispatch) => {
		try {
			let profileData = []
			await axios.get(`users?blogname=${payload}`).then((response) => (profileData = response.data))
			dispatch(fetchProfileDataSuccess(profileData))
		} catch (e) {
			dispatch(fetchProfileDataError(e))
		}
	}
}

export function fetchProfileDataSuccess(profileData) {
	return {
		type: LOAD_PROFILE_SUCCESS,
		data: profileData
	}
}

export function fetchProfileDataError(e) {
	return {
		type: LOAD_PROFILE_ERROR,
		error: e
	}
}

//auth

export function authUser(email, password, isLogin, name, blogname) {
	return async dispatch => {
		if (isLogin) {
			firebase.auth().createUserWithEmailAndPassword(email, password)
				.then((userCredential) => {
					dispatch(authSuccess(userCredential.user.uid))
				})
				.catch((error) => {
					dispatch(delError())
					dispatch(authError(error.message))
				})
		} else {
			firebase.auth().signInWithEmailAndPassword(email, password)
				.then((userCredential) => {
					dispatch(authSuccess(userCredential.user.uid))
				})
				.catch((error) => {
					dispatch(delError())
					dispatch(authError(error.message))
				})
		}
	}
}

export function authSuccess(uid) {
	return {
		type: AUTH_SUCCESS,
		uid
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
		await firebase.auth().onAuthStateChanged((userState) => {
			console.log(userState)
			if (userState) {
				dispatch(authSuccess(userState.uid))
			} else {
				dispatch(logout())
			}
		})
	}
}