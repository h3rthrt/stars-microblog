import { LOGIN_SUCCESS, LOGIN_SIGNOUT, LOGIN_CLEAR, SUBS_LOAD_SUCCESS } from "./actionsTypes"
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
					dispatch(notification('Success', 'Добро пожаловать', 'Вы успешно авторизованы'))
					dispatch(loginSuccess())
				})
				.catch((error) => {
					dispatch(notification('Danger', title, error.message))
					dispatch({ type: LOGIN_CLEAR })
				})
		}
	}
}

export function loadSubs(uid) {
	return async (dispatch, getState, {getFirebase, getFirestore}) => {
		const firestore = getFirestore()
		const loadFollowers = new Promise(async (resolve, reject) => {
			await firestore.collection(`users/${uid}/followers`).get().then(async (querySnapshot) => {
				Promise.all(querySnapshot.docs.map(async (doc) => {
					let data = await doc.data()
					return data.user
				})).then((followers) => {
					resolve(followers)
				})
			}).catch((err) => {
				reject(err)
			})
		})

		loadFollowers.then(async (followers) => {
			await firestore.collection(`users/${uid}/following`).get().then(async (querySnapshot) => {
				await Promise.all(querySnapshot.docs.map((doc) => {
					let data = doc.data()
					return data.user
				})).then((following) => {
					dispatch({ followers: followers, following: following, type: SUBS_LOAD_SUCCESS })
				}).catch((err) => {
					dispatch(notification('Danger', 'Ошибка', `${err}`))
				})
			})
		})
	}
}

export function signOut() {
	return (dispatch, getState, {getFirebase, getFirestore}) => {
		const firebase = getFirebase()
		firebase.auth().signOut().then(() => {
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