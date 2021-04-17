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
						dispatch(loadProfileDataSuccess(user.data()))
					} else {
						dispatch({ type: PROFILE_NOT_FOUND })
					}
				})
			})
			.catch((err) => {
				dispatch(notification('Danger', err.code, err.message))
			})

		// firebase.ref().child('users')
		// .orderByChild('username').equalTo(username)
		// 	.on('child_added', (snapshot) => {
		// 		const data = snapshot.val()
		// 		let photoURL = null
		// 		snapshot.ref
		// 		.child('photoURL')
		// 		.on('child_added', (snapshot) => {
		// 			photoURL = Object.values(snapshot.val()).toString()	
		// 		})
		// 		const newData = JSON.parse(
		// 			JSON.stringify(data),
		// 			(key, value) => key === 'photoURL' ? photoURL : value
		// 		)
		// 		dispatch(loadProfileDataSuccess(newData))
		// 	}, (error) => {
		// 		dispatch(notification('Danger', error.code, error.message))
		// 		dispatch(loadProfileDataError(error))
		// 	})
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