import { UPLOAD_ON_PROGRESS, UPLOAD_LOADED, UPLOAD_RESET, LOAD_PROFILE_PHOTO } from './actionsTypes'

export function uploadPhoto(files, username) {
	return (dispatch, getState, getFirebase) => {
		let uid
		files.forEach((file) => {
			const firebase = getFirebase()
			const path = `${username}/${file.name}`
			firebase.ref().child('users')
			.orderByChild('username')
			.equalTo(username)
			.on('value', (snapshot) => {
				uid = Object.keys(snapshot.val()).toString()
			})
			const dbPath = `users/${uid}/photoURL`
			dispatch(uploadOnProgress(true))
			firebase
			.uploadFile(path, file, dbPath, {
				metadataFactory: (uploadRes, firebase, metadata, downloadURL) => {
					const user = firebase.auth().currentUser
					user.updateProfile({
						'photoURL': downloadURL
					})
					dispatch(loadProfilePhoto(downloadURL))
					return { fileUrl: downloadURL }
				}
			})
			.then(() => {
				dispatch(uploadComplete(true))
				dispatch(uploadOnProgress(true))
			})
			.catch((error) => {
				console.log(error)
			})
		})
	}
}

export function uploadOnProgress(upload) {
	return {
		type: UPLOAD_ON_PROGRESS,
		upload
	}
}

export function uploadReset() {
	return {
		type: UPLOAD_RESET
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