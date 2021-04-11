import { LOAD_USER_LIKE_POSTS_SUCCESS, LOAD_USER_POSTS_SUCCESS } from "./actionsTypes"

export function getUserPosts(username, length) {
	return (dispatch, getState, {getFirebase, getFirestore}) => {
		const firestore = getFirestore()
		firestore.collection("posts")
			.where('username', '==', username)
			.orderBy("createdAt", "desc")
			.limit(25)
			.get()
			.then((querySnapshot) => {
				var notes = []
				console.log(querySnapshot)
				querySnapshot.forEach((doc) => {
					var dataPost = doc.data()
					dataPost.uid = doc.id
					dataPost.createdAt = dataPost.createdAt.toDate().toDateString() + 
									' at ' + 
									dataPost.createdAt.toDate().toLocaleTimeString('ru-RU')
					console.log(dataPost)
					notes.push(dataPost)
				})
				dispatch(addNotesUser(notes, length, LOAD_USER_POSTS_SUCCESS))
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

function addNotesUser(notes, length, type) {
	return {
		userPosts: notes,
		userPostsLength: length,
		type: type
	}
}

