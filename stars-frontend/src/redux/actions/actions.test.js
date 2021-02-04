import { authSuccess, authError } from "./actions"
import authReducer from './../reducers/auth'
import firebase from '../../api/firebase'

async function auth(email, pass) {
	let newState
	await firebase.auth().signInWithEmailAndPassword(email, pass)
	.then((data) => {
		const action = authSuccess(data.user.uid, data.user.displayName, null, data.user.photoURL)
		newState = authReducer(null, action)
	})
	.catch((e) => {
		const action = authError(e.message)
		newState = authReducer(null, action)
		console.log(`Error message: ${newState.error}`)
	})
	return newState
}

it('if user enter correctly data for log in', async() => {
	const state = await auth('test4@ya.ru', 'qwerty')
    expect(state.uid).toBeTruthy()
})

it('if user enter not correctly data for log in', async() => {
	const state = await auth('test4@ya.ru', 'qwerty1')
	expect(state.uid).toBe(undefined)
	expect(state.error).toBe('The password is invalid or the user does not have a password.')
})