import { 
	LOAD_POSTS_COMPLETE, 
	LOAD_POSTS_SUCCESS,
	LOAD_ADDED_POSTS_SUCCESS, 
	SET_IS_FETCHING,
	CLEAR_POSTS
} from "./actionsTypes"

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

export function getUserPosts(uid) {
	return async (dispatch, getState, {getFirebase, getFirestore}) => {
		dispatch({type: CLEAR_POSTS})
		dispatch({isFetching: true, type: SET_IS_FETCHING})
		let loaded = false
		const firestore = getFirestore()
		const reference = firestore.collection('users').doc(uid)
		let lastPost
		firestore.collection("posts")
			.where('user', '==', reference)
			.orderBy("createdAt", "desc")
			.limit(5)
			.onSnapshot(async (querySnapshot) => {
				if (loaded) {
					Promise.all(querySnapshot.docChanges().docs.map(async (change) => {
						if (change.type === 'added') {
							let userRef = firestore.collection('users')
							return await getPostData(change.doc, userRef)
						}
					})).then((notes) => {
						dispatch({posts: notes, type: LOAD_ADDED_POSTS_SUCCESS})
					})
				} else if (!loaded) {
					Promise.all(querySnapshot.docs.map(async (doc) => {
						let userRef = firestore.collection('users')
						return await getPostData(doc, userRef)
					})).then((notes) => {
						loaded = true
						lastPost = querySnapshot.docs[querySnapshot.docs.length - 1]
						dispatch(addPosts(notes, lastPost, LOAD_POSTS_SUCCESS))
						dispatch({isFetching: false, type: SET_IS_FETCHING})
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
						dispatch(addPosts(notes, lastNote, LOAD_POSTS_SUCCESS))
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

function addPosts(notes, lastNote, type) {
	return {
		posts: notes,
		lastPost: lastNote,
		type: type
	}
}

