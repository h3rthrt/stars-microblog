import {
	LOAD_POSTS_COMPLETE,
	LOAD_POSTS_SUCCESS,
	LOAD_MORE_POSTS_SUCCESS,
	SET_IS_FETCHING,
	SET_IS_MORE_FETCHING
} from './actionsTypes'
import notification from './notificationActions'

async function getPostData(doc, usersCollection, postsCollection, likesCollection, userId) {
	let dataPost = doc.data()
	dataPost.postId = doc.id
	dataPost.createdAt =
		dataPost.createdAt.toDate().toLocaleDateString('ru-RU') +
		' ' +
		dataPost.createdAt.toDate().toLocaleTimeString('ru-RU')
	await usersCollection.doc(dataPost.user.id).get().then(async (doc) => {
		let docData = await doc.data()
		dataPost.blogname = docData.blogname
		dataPost.authorPhoto = docData.photoURL
		dataPost.username = docData.username
	})
	await likesCollection
			.where('userRef', '==', usersCollection.doc(userId))
			.where('postRef', '==', postsCollection.doc(doc.id))
			.get().then(async (doc) => {
				doc.forEach((snapshot) => {
					dataPost.liked = snapshot.exists
				})
			})
	return dataPost
}

export function getUserPosts(uid, userId) {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		let lastPost
		firestore
			.collection('posts')
			.where('user', '==', usersCollection.doc(uid))
			.orderBy('createdAt', 'desc')
			.limit(10)
			.get()
			.then(async (querySnapshot) => {
				Promise.all(
					querySnapshot.docs.map((doc) => {
						return getPostData(doc, usersCollection, postsCollection, likesCollection, userId)
					})
				)
					.then((notes) => {
						lastPost = querySnapshot.docs[querySnapshot.docs.length - 1]
						console.log('user posts')
						dispatch(addPosts(notes, lastPost))
					})
					.catch((err) => {
						dispatch(notification('Danger', 'Ошибка загрузки постов пользователя.', `${err}`))
					})
		})
	}
}

export function getMoreUserPosts(uid, lastPost, userId) {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_MORE_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		firestore
			.collection('posts')
			.where('user', '==', usersCollection.doc(uid))
			.orderBy('createdAt', 'desc')
			.startAt(lastPost)
			.limit(10)
			.get()
			.then((querySnapshot) => {
				Promise.all(
					querySnapshot.docs.map((doc) => {
						return getPostData(doc, usersCollection, postsCollection, likesCollection, userId)
					})
				).then((notes) => {
					const lastNote = querySnapshot.docs[querySnapshot.docs.length - 1]
					if (!!notes.length) notes.shift()
					if (!!!notes.length) {
						dispatch({ type: LOAD_POSTS_COMPLETE })
					} else {
						dispatch(addMorePosts(notes, lastNote))
					}
				})
			})
	}
}

export function getUserLikePosts(uid, userId) {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		let lastPost
		likesCollection.where('userRef', '==', usersCollection.doc(uid))
			.orderBy('likedAt', 'desc')
			.limit(10)
			.get()
			.then((querySnapshot) => {
			Promise.all(querySnapshot.docs.map(async (doc) => {
				let docData = doc.data()
				let notes
				await postsCollection.doc(docData.postRef.id).get().then(async (querySnapshot) => {
					if (querySnapshot.exists) {
						return await getPostData(querySnapshot, usersCollection, postsCollection, likesCollection, userId)
					}
				})
				.then((data) => {
					notes = data
				})
				.catch((err) => {
					dispatch(notification('Danger', 'Ошибка загрузки постов пользователя.', `${err}`))
				})
				return notes
			})).then((notes) => {
				lastPost = querySnapshot.docs[querySnapshot.docs.length - 1]
				dispatch(addPosts(notes, lastPost))
			}).catch((err) => {
				dispatch(notification('Danger', 'Ошибка загрузки постов пользователя.', `${err}`))
			})
		})
	}
}

export function getMoreUserLikePosts(uid, lastPost, userId) {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_MORE_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		likesCollection.where('userRef', '==', usersCollection.doc(uid))
			.orderBy('likedAt', 'desc')
			.startAt(lastPost)
			.limit(10)
			.get()
			.then((querySnapshot) => {
			Promise.all(querySnapshot.docs.map(async (doc) => {
				let docData = doc.data()
				await postsCollection.doc(docData.postRef.id).get().then(async (querySnapshot) => {
					if (querySnapshot.exists) {
						return await getPostData(querySnapshot, usersCollection, postsCollection, likesCollection, userId)
					}
				})
				.then((notes) => {
					if (!!notes.length) notes.shift()
					if (!!!notes.length) {
						dispatch({ type: LOAD_POSTS_COMPLETE })
					} else {
						const lastNote = querySnapshot.docs[querySnapshot.docs.length - 1]
						dispatch(addMorePosts(notes, lastNote))
					}
				})
			}))
		})
	}
}

export function getAllPosts(uid = null, userId) {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		let lastPost
		firestore
			.collection('posts')
			.orderBy('createdAt', 'desc')
			.limit(10)
			.get()
			.then(async (querySnapshot) => {
				// first fetching posts
				Promise.all(
					querySnapshot.docs.map((doc) => {
						return getPostData(doc, usersCollection, postsCollection, likesCollection, userId)
					})
				)
					.then((notes) => {
						lastPost = querySnapshot.docs[querySnapshot.docs.length - 1]
						dispatch(addPosts(notes, lastPost))
					})
					.catch((err) => {
						dispatch(notification('Danger', 'Ошибка загрузки постов пользователя.', `${err}`))
					})
			})
	}
}

export function getMoreAllPosts(uid = null, lastPost, userId) {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_MORE_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		firestore
			.collection('posts')
			.orderBy('createdAt', 'desc')
			.startAt(lastPost)
			.limit(10)
			.get()
			.then((querySnapshot) => {
				Promise.all(
					querySnapshot.docs.map((doc) => {
						return getPostData(doc, usersCollection, postsCollection, likesCollection, userId)
					})
				).then((notes) => {
					const lastNote = querySnapshot.docs[querySnapshot.docs.length - 1]
					if (!!notes.length) notes.shift()
					if (!!!notes.length) {
						dispatch({ type: LOAD_POSTS_COMPLETE })
					} else {
						dispatch(addMorePosts(notes, lastNote))
					}
				})
			})
	}
}

function addPosts(notes, lastNote) {
	return {
		posts: notes,
		lastPost: lastNote,
		type: LOAD_POSTS_SUCCESS
	}
}

function addMorePosts(notes, lastNote) {
	return {
		posts: notes,
		lastPost: lastNote,
		type: LOAD_MORE_POSTS_SUCCESS
	}
}