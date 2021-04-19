import { UPLOAD_ON_PROGRESS, UPLOAD_LOADED, UPLOAD_RESET, LOAD_PROFILE_PHOTO } from './actionsTypes'
import notification from './notificationActions'

const titleSuccess = 'Запись успешно опубликована'
const titleDanger = 'Ошибка публикации записи'

export function upload(files, username, uid, forPosts = false, post) {
	return (dispatch, getState, {getFirebase, getFirestore}) => {
		dispatch(uploadOnProgress(true))
		const firebase = getFirebase()
		const firestore = getFirestore()
		var totalEach = 0
		if(forPosts) {
			post.user = firestore.doc('users/' + uid)
			post.createdAt = firestore.Timestamp.now()
			// if post without images
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
			const user = firebase.auth().currentUser
			const storagePath = `${username}/${!forPosts ? 'profilePhoto' : 'media'}`
			const dbPath = 'users'
			if (forPosts) file = file.file
			firebase.uploadFile(storagePath, file, dbPath, {
				metadataFactory: (uploadRes, firebase, metadata, downloadURL) => {
					if(!forPosts) { 
						user.updateProfile({
							'photoURL': downloadURL
						})
						firebase.updateAuth({
							'photoURL': downloadURL
						})
						dispatch(loadProfilePhoto(downloadURL))
						return { photoURL: downloadURL }
					} else {
						post.photoURL.push(downloadURL)
						return { media: firestore.FieldValue.arrayUnion(downloadURL) }
					}
				}, documentId: user.uid
			})
			.then(() => {
				totalEach++
				if(forPosts && totalEach === files.length) {
					firestore.collection('posts').add(post)
						.then(() => {
							dispatch(notification('Success', titleSuccess, 'Ура!'))
							dispatch(uploadComplete(true))
							dispatch(uploadOnProgress(false))
						})
						.catch((error) => {
							dispatch(notification('Danger', titleDanger, error.message))
						})
				} else if (!forPosts) {
					dispatch(notification('Success', 'Успешно!', 'Изображение профиля успешно изменено.'))
					dispatch(uploadComplete(true))
					dispatch(uploadOnProgress(false))
				}
			})
			.catch((err) => {
				dispatch(notification('Danger', titleDanger, `Ошибка загрузки медиа на сервер. ${err}`))
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
		photoURL: data
	}
}