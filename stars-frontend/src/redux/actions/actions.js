import axios from '../../api/axios'
import {
	LOAD_POSTS_SUCCESS,
	LOAD_POSTS_ERROR,
	LOAD_POPULAR_TAGS_ERROR,
	LOAD_POPULAR_TAGS_SUCCESS,
	LOAD_PROFILE_SUCCESS,
	LOAD_PROFILE_ERROR,
	AUTH_SUCCESS,
	AUTH_LOGOUT
} from './actionsTypes'

// Load posts

export function loadPosts() {
	return async (dispatch) => {
		try {
			var posts = []
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
			var posts = []
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
			var tags = []
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
			var profileData = []
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

export function auth(email, password, isLogin) {
	return async dispatch => {
		const authData = {
			email, password, 
			returnSecureTocken: true
		}
		var url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC-N3bpwnzf61N1QQzCto-G9V3PA0B-TLs'
		if (isLogin) {
			url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC-N3bpwnzf61N1QQzCto-G9V3PA0B-TLs'
		}
		const response = await axios.post(url, authData)
		const data = response.data
		const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000)
		localStorage.setItem('token', data.idToken)
		localStorage.setItem('userId', data.localId)
		localStorage.setItem('expirationDate', expirationDate)
		dispatch(authSuccess(data.idToken))
		// if (data.expiresIn) {
		// 	dispatch(autoLogout(data.expiresIn))
		// }
	}
}

export function authSuccess(token) {
	return {
		type: AUTH_SUCCESS,
		token
	}
}

export function logout() {
	localStorage.removeItem('token')
	localStorage.removeItem('userId')
	localStorage.removeItem('expirationDate')
	return {
		type: AUTH_LOGOUT
	}
}

export function autoLogout(time) {
	return dispatch => {
		setTimeout(() => {
			dispatch(logout())
		}, time * 1000)
	}
}