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
							firebase.updateAuth({
								'displayName': name
							})
							dispatch(loginSuccess())
						})
					}).catch(function(error) {
						dispatch({ type: LOGIN_CLEAR })
						dispatch(loginError(error))
					})
				})
				.catch((error) => {
					dispatch({ type: LOGIN_CLEAR })
					dispatch(loginError(error))
				})
		} else {
			firebase.auth().signInWithEmailAndPassword(email, password)
				.then(() => {
					dispatch(loginSuccess())
				})
				.catch((error) => {
					dispatch({ type: LOGIN_CLEAR })
					dispatch(loginError(error))
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

export function loginSuccess() {
	return {
		type: LOGIN_SUCCESS
	}
}

export function loginError(error) {
	return {
		type: LOGIN_ERROR,
		error
	}
}