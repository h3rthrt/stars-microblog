import { UPLOAD_ON_PROGRESS, UPLOAD_LOADED, UPLOAD_RESET, LOAD_PROFILE_PHOTO } from './actionsTypes'
import notification from './notificationActions'

const titleSuccess = 'Запись успешно опубликована'
const titleDanger = 'Ошибка публикации записи'

export function upload(files, username, uid, forFirestore = false, post, blogname) {
	return (dispatch, getState, {getFirebase, getFirestore}) => {
		dispatch(uploadOnProgress(true))
		const firebase = getFirebase()
		const firestore = getFirestore()
		var totalEach = 0
		if(forFirestore) {
			post.username = username
			post.blogname = blogname
			const date = new Date()
			post.data =
				("00" + (date.getMonth() + 1)).slice(-2) + "/" +
				("00" + date.getDate()).slice(-2) + "/" +
				date.getFullYear() + " " +
				("00" + date.getHours()).slice(-2) + ":" +
				("00" + date.getMinutes()).slice(-2) + ":" +
				("00" + date.getSeconds()).slice(-2);
			if(files.length === 0)
				firestore.collection('posts').add(post)
				.then(() => {
					dispatch(notification('Success', titleSuccess, 'Ура!'))
					dispatch(uploadComplete(true))
					dispatch(uploadOnProgress(false))
				})
				.catch((error) => {
					dispatch(notification('Danger', titleDanger, error.message))
				})
		}
		files.forEach((file) => {
			const storagePath = `${username}/${!forFirestore ? 'profilePhoto' : 'media'}`
			const dbPath = `users/${uid}/${!forFirestore ? 'photoURL' : 'media'}`
			if (forFirestore)
				file = file.file
			firebase.uploadFile(storagePath, file, dbPath, {
				metadataFactory: (uploadRes, firebase, metadata, downloadURL) => {
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
						post.photoURL.push(downloadURL)
					}
					return { fileUrl: downloadURL }
				}
			})
			.then(() => {
				totalEach++
				if(forFirestore && totalEach === files.length) {
					firestore.collection('posts').add(post)
						.then(() => {
							dispatch(notification('Success', titleSuccess, 'Ура!'))
							dispatch(uploadComplete(true))
							dispatch(uploadOnProgress(false))
						})
						.catch((error) => {
							dispatch(notification('Danger', titleDanger, error.message))
						})
				} else if (!forFirestore) {
					dispatch(uploadComplete(true))
					dispatch(uploadOnProgress(false))
				}
			})
			.catch(() => {
				dispatch(notification('Danger', titleDanger, 'Ошибка загрузки медиа на сервер'))
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