import { LOAD_PROFILE_SUCCESS, LOAD_PROFILE_ERROR, PROFILE_NOT_FOUND } from './actionsTypes'
import notification from './notificationActions'

export function loadProfile(username) {
	return (dispatch, getState, {getFirebase, getFirestore}) => { 
		const firestore = getFirestore()

		firestore.collection('users')
			.where('username', '==', username)
			.get()
			.then((querySnapshot) => {
				if (querySnapshot.exists) return dispatch({ type: PROFILE_NOT_FOUND })
				querySnapshot.forEach((user) => {
					if (user.exists) {
						let data = user.data()
						data.uid = user.id
						dispatch(loadProfileDataSuccess(data))
					} else {
						dispatch({ type: PROFILE_NOT_FOUND })
					}
				})
			})
			.catch((err) => {
				dispatch(notification('Danger', err.code, err.message))
			})
	}
}

export function clearPhoto() {
	return {
		type: 'CLEAR_PHOTO'
	}
}

export function loadProfileDataSuccess(data) {
	return {
		type: LOAD_PROFILE_SUCCESS,
		uid: data.uid,
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