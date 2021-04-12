import { 
	LOAD_USER_ADDED_POSTS_SUCCESS, 
	LOAD_USER_LIKE_POSTS_SUCCESS, 
	LOAD_USER_POSTS_SUCCESS,
	SET_IS_FETCHING
} from "./actionsTypes"

export function getUserPosts(username) {
	return (dispatch, getState, {getFirebase, getFirestore}) => {
		dispatch({isFetching: true, type: SET_IS_FETCHING})
		var loaded = false
		const firestore = getFirestore()
		firestore.collection("posts")
			.where('username', '==', username)
			.orderBy("createdAt", "desc")
			.limit(5)
			.onSnapshot((querySnapshot) => {
				var notes = []
				var query = []
				if (loaded) {
					querySnapshot.docChanges().forEach((change) => {
						if (change.type === 'added') {
							var dataPost = change.doc.data()
							dataPost.uid = change.doc.id
							dataPost.createdAt = dataPost.createdAt.toDate().toDateString() + 
											' at ' + 
											dataPost.createdAt.toDate().toLocaleTimeString('ru-RU')
							notes.push(dataPost)
							dispatch({userPosts: notes, type: LOAD_USER_ADDED_POSTS_SUCCESS})
						}
					})
				} else if (!loaded) {
					querySnapshot.forEach((doc) => {
						var dataPost = doc.data()
						dataPost.uid = doc.id
						dataPost.createdAt = dataPost.createdAt.toDate().toDateString() + 
										' at ' + 
										dataPost.createdAt.toDate().toLocaleTimeString('ru-RU')
						notes.push(dataPost)
						query.push(doc.data())
					})
					var lastNote = query[query.length - 1]
					loaded = true
					dispatch(addNotesUser(notes, lastNote, LOAD_USER_POSTS_SUCCESS))
					dispatch({isFetching: false, type: SET_IS_FETCHING})
				}
			})
	}
}

export function getMoreUserPosts(username, lastPost) {
	return (dispatch, getState, {getFirebase, getFirestore}) => {
		dispatch({isFetching: true, type: SET_IS_FETCHING})
		const firestore = getFirestore()
		firestore.collection("posts")
			.where('username', '==', username)
			.orderBy("createdAt", "desc")
			.startAt(lastPost)
			.limit(5)
			.get()
			.then((querySnapshot) => {
				var notes = []
				var query = []
				querySnapshot.forEach((doc) => {
					var dataPost = doc.data()
					dataPost.uid = doc.id
					dataPost.createdAt = dataPost.createdAt.toDate().toDateString() + 
									' at ' + 
									dataPost.createdAt.toDate().toLocaleTimeString('ru-RU')
					notes.push(dataPost)
					query.push(doc.data())
				})
				var lastNote = query[query.length - 1]
				console.log(notes, lastNote)
				dispatch(addNotesUser(notes, lastNote, LOAD_USER_POSTS_SUCCESS))
				dispatch({isFetching: false, type: SET_IS_FETCHING})
			})
	}
}

export function getUserLikePosts(username, length) {
	return (dispatch, getState, {getFirebase, getFirestore}) => {
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
			dispatch(addNotesUser(notes, length, LOAD_USER_LIKE_POSTS_SUCCESS))
		})	
	}
}

function addNotesUser(notes, lastNote, type) {
	return {
		userPosts: notes,
		lastPost: lastNote,
		type: type
	}
}

