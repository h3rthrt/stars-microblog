import { LOAD_PROFILE_SUCCESS, LOAD_PROFILE_ERROR, PROFILE_NOT_FOUND, LOAD_MEDIA_SUCCESS } from './actionsTypes'
import notification from './notificationActions'

export function loadProfile(username) {
	return (dispatch, getState, {getFirebase, getFirestore}) => { 
		const firestore = getFirestore()

		let userCollection = firestore.collection('users')

		userCollection.where('username', '==', username).get().then((querySnapshot) => {
			querySnapshot.forEach((user) => {
				if (user.exists) {
					let data = user.data()
					data.uid = user.id
					dispatch(loadProfileDataSuccess(data))
					firestore.collection(`users/${user.id}/media`).limit(6).get().then((querySnapshot) => {
						Promise.all(querySnapshot.docs.map((media) => {
							return media.data()
						}))
						.then((media) => {
							dispatch({ type: LOAD_MEDIA_SUCCESS, media: media })
						})
					})
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