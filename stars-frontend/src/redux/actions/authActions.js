import { LOGIN_SUCCESS, LOGIN_SIGNOUT, LOGIN_CLEAR } from "./actionsTypes"
import notification from "./notificationActions"

const title = "Ошибка авторизации"

export function signIn(email, password, isLogin, name, blogname) {
	return (dispatch, getState, {getFirebase, getFirestore}) => {
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
						dispatch(notification('Danger', title, error.message))
						dispatch({ type: LOGIN_CLEAR })
					})
				})
				.catch((error) => {
					dispatch(notification('Danger', title, error.message))
					dispatch({ type: LOGIN_CLEAR })
				})
		} else {
			firebase.auth().signInWithEmailAndPassword(email, password)
				.then(() => {
					dispatch(notification('Success', 'Вы успешно авторизованы', 'Ура!'))
					dispatch(loginSuccess())
				})
				.catch((error) => {
					dispatch(notification('Danger', title, error.message))
					dispatch({ type: LOGIN_CLEAR })
				})
		}
	}
}

export function signOut() {
	return (dispatch, getState, {getFirebase, getFirestore}) => {
		const firebase = getFirebase()
		firebase.auth().signOut().then(() => {
			dispatch(notification('Warning', 'Вы вышли с аккаунта', 'Еще увидимся?'))
			dispatch({ type: LOGIN_SIGNOUT })
		})
	}
}

export function errorClear() {
	return (dispatch, getState, {getFirebase, getFirestore}) => {
		dispatch({ type: LOGIN_CLEAR })
	}
}

export function loginSuccess() {
	return {
		type: LOGIN_SUCCESS
	}
}