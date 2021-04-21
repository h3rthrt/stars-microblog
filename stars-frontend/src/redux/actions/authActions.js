import { LOGIN_SUCCESS, LOGIN_SIGNOUT, LOGIN_CLEAR, CLEAR_POSTS } from "./actionsTypes"
import notification from "./notificationActions"

const title = "Ошибка авторизации"

export function signIn(email, password, isLogin, name, blogname) {
	return (dispatch, getState, {getFirebase, getFirestore}) => {
		const firebase = getFirebase()
		const firestore = getFirestore()

		const data = {
			username: name,
			blogname: blogname,
			email: email,
			photoURL: null,
			desc: null,
			theme: false
		}

		if (isLogin) {
			firebase.auth().createUserWithEmailAndPassword(email, password)
				.then(() => {
					const user = firebase.auth().currentUser
					user.updateProfile({
						displayName: `${name}`
					})
					.then(() => {
						firestore.collection('users').doc(user.uid).set(data)
						.then(() => {
							firebase.updateAuth({
								'displayName': name
							})
							dispatch(loginSuccess())
						})
						.catch((err) => {
							dispatch(notification('Danger', title, err.message))
							dispatch({ type: LOGIN_CLEAR })
						})
					})
				})
				.catch((error) => {
					dispatch(notification('Danger', title, error.message))
					dispatch({ type: LOGIN_CLEAR })
				})
		} else {
			firebase.auth().signInWithEmailAndPassword(email, password)
				.then(() => {
					dispatch(notification('Success', 'Добро пожаловать в сити 17', 'Вы успешно авторизованы'))
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
			dispatch({ type: CLEAR_POSTS })
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