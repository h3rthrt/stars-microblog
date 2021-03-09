import { UPLOAD_ON_PROGRESS, UPLOAD_LOADED, UPLOAD_RESET, LOAD_PROFILE_PHOTO } from './actionsTypes'

export function uploadPhoto(files, username, uid) {
	return (dispatch, getState, getFirebase) => {
		files.forEach((file) => {
			const firebase = getFirebase()
			const path = `${username}/profilePhoto`
			const dbPath = `users/${uid}/photoURL`
			dispatch(uploadOnProgress(true))
			firebase
			.uploadFile(path, file, dbPath, {
				metadataFactory: (uploadRes, firebase, metadata, downloadURL) => {
					const user = firebase.auth().currentUser
					user.updateProfile({
						'photoURL': downloadURL
					})
					firebase.updateAuth({
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