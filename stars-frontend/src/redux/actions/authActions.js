import { LOGIN_ERROR, LOGIN_SUCCESS, LOGIN_SIGNOUT, LOGIN_CLEAR } from "./actionsTypes"

export function signIn(email, password, isLogin, name, blogname) {
	return (dispatch, getState, getFirebase) => {
		const firebase = getFirebase()
		if (isLogin) {
			firebase.auth().createUserWithEmailAndPassword(email, password)
				.then(() => {
					const user = firebase.auth().currentUser
					user.updateProfile({
					displayName: `${name}`
					}).then(function() {
						firebase.ref('users/' + user.uid).set({
							username: name,
							blogname: blogname,
							email: email,
							photoURL: null,
							desc: null,
							followers: [],
							following: [],
							media: []
						}, () => {
							dispatch({ type: LOGIN_SUCCESS }, user.uid, name, null)
						})
					}).catch(function(e) {
						dispatch({ type: LOGIN_CLEAR })
						dispatch({ type: LOGIN_ERROR }, e)
					})
				})
				.catch((error) => {
					dispatch({ type: LOGIN_CLEAR })
					dispatch({ type: LOGIN_ERROR }, error)
				})
		} else {
			firebase.auth().signInWithEmailAndPassword(email, password)
				.then(() => {
					dispatch({ type: LOGIN_SUCCESS })
				})
				.catch((error) => {
					dispatch({ type: LOGIN_CLEAR })
					dispatch({ type: LOGIN_ERROR, error })
				})
		}
	}
}

export function signOut() {
	return (dispatch, getState, getFirebase) => {
		const firebase = getFirebase()
		firebase.auth().signOut().then(() => {
			dispatch({ type: LOGIN_SIGNOUT })
		})
	}
}

export function loginClear() {
	return (dispatch, getState, getFirebase) => {
		dispatch({ type: LOGIN_CLEAR })
	}
}