import { UPLOAD_ON_PROGRESS, UPLOAD_LOADED, UPLOAD_RESET, LOAD_PROFILE_PHOTO } from './actionsTypes'

export function upload(files, username, uid, forFirestore = false, post, blogname) {
	return (dispatch, getState, {getFirebase, getFirestore}) => {
		dispatch(uploadOnProgress(true))
		const firebase = getFirebase()
		const firestore = getFirestore()
		if(forFirestore) {
			post.username = username
			post.blogname = blogname
			if(files.length === 0)
				firestore.collection('posts').add(post)
				.then(() => {
					dispatch(uploadComplete(true))
					dispatch(uploadOnProgress(false))
				})
				.catch((error) => {
					console.log(error)
				})
		}
		files.forEach((file) => {
			const storagePath = `${username}/${!forFirestore ? 'profilePhoto' : 'media'}`
			const dbPath = `users/${uid}/${!forFirestore ? 'photoURL' : 'media'}`
			if (forFirestore)
				file = file.file
			firebase.uploadFile(storagePath, file, dbPath, {
				metadataFactory: (uploadRes, firebase, metadata, downloadURL) => {
					//for firebase
					if(!forFirestore) { 
						const user = firebase.auth().currentUser
						user.updateProfile({
							'photoURL': downloadURL
						})
						firebase.updateAuth({
							'photoURL': downloadURL
						})
						dispatch(loadProfilePhoto(downloadURL))
					} else {
					//for firestore posts
						post.photoURL = downloadURL
					}
					return { fileUrl: downloadURL }
				}
			})
			.then(() => {
				if(forFirestore)
					firestore.collection('posts').add(post)
				dispatch(uploadComplete(true))
				dispatch(uploadOnProgress(false))
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