import { 
	LOAD_POSTS_COMPLETE, 
	LOAD_POSTS_SUCCESS,
	LOAD_MORE_POSTS_SUCCESS,
	LOAD_ADDED_POSTS_SUCCESS, 
	SET_IS_FETCHING,
	CLEAR_POSTS
} from "./actionsTypes"
import notification from './notificationActions'

async function getPostData(doc, collection) {
	let dataPost = doc.data()
	dataPost.uid = doc.id
	dataPost.createdAt = dataPost.createdAt.toDate().toDateString() + 
					' at ' + 
					dataPost.createdAt.toDate().toLocaleTimeString('ru-RU')
	await collection.doc(dataPost.user.id).get().then(async doc => {
		let docData = await doc.data()
		dataPost.blogname = docData.blogname
		dataPost.authorPhoto = docData.photoURL
	})
	return dataPost
}

export function getUserPosts(uid, pathname) {
	return async (dispatch, getState, {getFirebase, getFirestore}) => {
		dispatch({ type: CLEAR_POSTS })
		dispatch({isFetching: true, type: SET_IS_FETCHING})
		let loaded = false
		const firestore = getFirestore()
		const collection = firestore.collection('users')
		let lastPost
		firestore.collection("posts")
			.where('user', '==', collection.doc(uid))
			.orderBy("createdAt", "desc")
			.limit(5)
			.onSnapshot(async (querySnapshot) => {
				if (loaded) {
					// view changes
					Promise.all(querySnapshot.docChanges().map(async (change) => {
						if (change.type === 'added') {
							return await getPostData(change.doc, collection)
						} 
					})).then((notes) => {
						notes.shift()
						if (!!notes) {
							dispatch({posts: notes, type: LOAD_ADDED_POSTS_SUCCESS})
						}
					}).catch((err) => {
						dispatch(notification('Danger', 'Ошибка загрузки постов пользователя.', `${err}`))
					})
				} else if (!loaded) {
					// first fetching posts
					Promise.all(querySnapshot.docs.map((doc) => {
						return getPostData(doc, collection)
					})).then((notes) => {
						loaded = true
						lastPost = querySnapshot.docs[querySnapshot.docs.length - 1]
						dispatch(addPosts(notes, lastPost, pathname))
						dispatch({isFetching: false, type: SET_IS_FETCHING})
					}).catch((err) => {
						dispatch(notification('Danger', 'Ошибка загрузки постов пользователя.', `${err}`))
					})
				}
			})
	}
}

export function getMoreUserPosts(uid, lastPost) {
	return (dispatch, getState, {getFirebase, getFirestore}) => {
		dispatch({isFetching: true, type: SET_IS_FETCHING})
		const firestore = getFirestore()
		let collection = firestore.collection('users')
		firestore.collection("posts")
			.where('user', '==', collection.doc(uid))
			.orderBy("createdAt", "desc")
			.startAt(lastPost)
			.limit(5)
			.get()
			.then((querySnapshot) => {
				Promise.all(querySnapshot.docs.map((doc) => {
					return getPostData(doc, collection)
				})).then((notes) => {
					const lastNote = querySnapshot.docs[querySnapshot.docs.length - 1]
					notes.shift()
					if (!!!notes.length) {
						dispatch({type: LOAD_POSTS_COMPLETE})
						dispatch({isFetching: false, type: SET_IS_FETCHING})
					} else {
						dispatch(addMorePosts(notes, lastNote))
						dispatch({isFetching: false, type: SET_IS_FETCHING})
					}
				})
			})
	}
}

export function getUserLikePosts(username, length) {
	return (dispatch, getState, {getFirebase, getFirestore}) => {
		dispatch({type: CLEAR_POSTS})
		dispatch({isFetching: true, type: SET_IS_FETCHING})
		const firestore = getFirestore()
		firestore.collection("likes")
		.where("username", "==", `${username}`)
		.orderBy("data")
		.startAfter(length)
		.limit(25)
		.get()
		.then((querySnapshot) => {
			var notes = []
			querySnapshot.forEach((doc) => {
				notes.push(doc.data())
			})
			dispatch(addPosts(notes, length, LOAD_POSTS_SUCCESS))
		})	
	}
}

function addPosts(notes, lastNote, pathname) {
	return {
		posts: notes,
		lastPost: lastNote,
		pathname: pathname,
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