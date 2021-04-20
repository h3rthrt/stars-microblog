import {
	LOAD_POSTS_COMPLETE,
	LOAD_POSTS_SUCCESS,
	LOAD_MORE_POSTS_SUCCESS,
	LOAD_ADDED_POSTS_SUCCESS,
	SET_IS_FETCHING,
	CLEAR_POSTS
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
	})
	await likesCollection.where('userRef', '==', usersCollection.doc(userId)).where('postRef', '==', postsCollection.doc(doc.id)).get().then(async (doc) => {
		doc.forEach((snapshot) => {
			dataPost.liked = snapshot.exists
		})
	})
	return dataPost
}

export function getUserPosts(uid) {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: CLEAR_POSTS })
		dispatch({ isFetching: true, type: SET_IS_FETCHING })
		let loaded = false
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		let lastPost
		firestore
			.collection('posts')
			.where('user', '==', usersCollection.doc(uid))
			.orderBy('createdAt', 'desc')
			.limit(15)
			.onSnapshot(async (querySnapshot) => {
				if (loaded) {
					// view changes
					Promise.all(
						querySnapshot.docChanges().map(async (change) => {
							if (change.type === 'added') {
								return await getPostData(change.doc, usersCollection, postsCollection, likesCollection, uid)
							}
						})
					)
						.then((notes) => {
							notes.shift()
							if (!!notes) {
								dispatch({ posts: notes, type: LOAD_ADDED_POSTS_SUCCESS })
							}
						})
						.catch((err) => {
							dispatch(notification('Danger', 'Ошибка загрузки постов пользователя.', `${err}`))
						})
				} else if (!loaded) {
					// first fetching posts
					Promise.all(
						querySnapshot.docs.map((doc) => {
							return getPostData(doc, usersCollection, postsCollection, likesCollection, uid)
						})
					)
						.then((notes) => {
							loaded = true
							lastPost = querySnapshot.docs[querySnapshot.docs.length - 1]
							dispatch(addPosts(notes, lastPost))
							dispatch({ isFetching: false, type: SET_IS_FETCHING })
						})
						.catch((err) => {
							dispatch(notification('Danger', 'Ошибка загрузки постов пользователя.', `${err}`))
						})
				}
			})
	}
}

export function getMoreUserPosts(uid, lastPost) {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ isFetching: true, type: SET_IS_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		firestore
			.collection('posts')
			.where('user', '==', usersCollection.doc(uid))
			.orderBy('createdAt', 'desc')
			.startAt(lastPost)
			.limit(15)
			.get()
			.then((querySnapshot) => {
				Promise.all(
					querySnapshot.docs.map((doc) => {
						return getPostData(doc, usersCollection, postsCollection, likesCollection, uid)
					})
				).then((notes) => {
					const lastNote = querySnapshot.docs[querySnapshot.docs.length - 1]
					if (!!notes.length) notes.shift()
					if (!!!notes.length) {
						dispatch({ type: LOAD_POSTS_COMPLETE })
						dispatch({ isFetching: false, type: SET_IS_FETCHING })
					} else {
						dispatch(addMorePosts(notes, lastNote))
						dispatch({ isFetching: false, type: SET_IS_FETCHING })
					}
				})
			})
	}
}

export function getUserLikePosts(uid) {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: CLEAR_POSTS })
		dispatch({ isFetching: true, type: SET_IS_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		let lastPost
		likesCollection.where('userRef', '==', usersCollection.doc(uid))
			.orderBy('likedAt', 'desc')
			.limit(15)
			.get()
			.then((querySnapshot) => {
			Promise.all(querySnapshot.docs.map(async (doc) => {
				let docData = doc.data()
				let notes
				await postsCollection.doc(docData.postRef.id).get().then(async (querySnapshot) => {
					if (querySnapshot.exists) {
						return await getPostData(querySnapshot, usersCollection, postsCollection, likesCollection, uid)
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
				dispatch({ isFetching: false, type: SET_IS_FETCHING })
			}).catch((err) => {
				dispatch(notification('Danger', 'Ошибка загрузки постов пользователя.', `${err}`))
			})
		})
	}
}

export function getMoreUserLikePosts(uid, lastPost) {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ isFetching: true, type: SET_IS_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		likesCollection.where('userRef', '==', usersCollection.doc(uid))
			.orderBy('likedAt', 'desc')
			.startAt(lastPost)
			.limit(15)
			.get()
			.then((querySnapshot) => {
			Promise.all(querySnapshot.docs.map(async (doc) => {
				let docData = doc.data()
				await postsCollection.doc(docData.postRef.id).get().then(async (querySnapshot) => {
					if (querySnapshot.exists) {
						return await getPostData(querySnapshot, usersCollection, postsCollection, likesCollection, uid)
					}
				})
				.then((notes) => {
					if (!!notes.length) notes.shift()
					if (!!!notes.length) {
						dispatch({ type: LOAD_POSTS_COMPLETE })
						dispatch({ isFetching: false, type: SET_IS_FETCHING })
					} else {
						const lastNote = querySnapshot.docs[querySnapshot.docs.length - 1]
						dispatch(addMorePosts(notes, lastNote))
						dispatch({ isFetching: false, type: SET_IS_FETCHING })
					}
				})
			}))
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
