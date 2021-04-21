import {
	LOAD_PROFILE_SUCCESS,
	LOAD_PROFILE_ERROR,
	PROFILE_NOT_FOUND,
	LOAD_MEDIA_SUCCESS,
	PROFILE_CLEAR_DATA,
	SET_IS_LOADED_PROFILE
} from './actionsTypes'
import notification from './notificationActions'

export function loadProfile(username) {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: PROFILE_CLEAR_DATA })
		dispatch({ type: SET_IS_LOADED_PROFILE })
		const firestore = getFirestore()
		let userCollection = firestore.collection('users')

		userCollection.where('username', '==', username).get().then((querySnapshot) => {
			Promise.all(
				querySnapshot.docs.map((user) => {
					return user
				})
			)
				.then(async (user) => {

					if (!!!user.length) return dispatch({ type: PROFILE_NOT_FOUND })
					let userData = user[0]
					let data = userData.data()
					data.uid = userData.id
					dispatch(loadProfileDataSuccess(data))
					await firestore.collection(`users/${data.uid}/media`).limit(6).get().then(async (querySnapshot) => {
						Promise.all(
							querySnapshot.docs.map(async (media) => {
								return await media.data()
							})
						)
							.then((media) => {
								dispatch({ type: LOAD_MEDIA_SUCCESS, media: media })
							})
							.catch((err) => {
								dispatch(notification('Danger', err.code, err.message))
							})
					})
				})
				.catch((err) => {
					dispatch(notification('Danger', err.code, err.message))
				})
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
