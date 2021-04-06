import { LOAD_USER_POSTS_SUCCESS } from "./actionsTypes"

export function getUserPosts(username, length) {
	return (dispatch, getState, {getFirebase, getFirestore}) => {
		const firestore = getFirestore()
		firestore.collection("posts")
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
				dispatch(addNotesUser(notes, length))
			})		
	}
}

function addNotesUser(notes, length) {
	return {
		userPosts: notes,
		userPostsLength: length,
		type: LOAD_USER_POSTS_SUCCESS
	}
}