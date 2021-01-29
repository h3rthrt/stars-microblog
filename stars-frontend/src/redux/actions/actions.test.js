import { authSuccess } from "./actions"
import authReducer from './../reducers/auth'
import axios from '../../api/axios'

async function auth(email, password, isLogin) {
	const authData = {
		email, password, 
		returnSecureTocken: true
	}
	let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC-N3bpwnzf61N1QQzCto-G9V3PA0B-TLs'
	if (isLogin) {
		url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC-N3bpwnzf61N1QQzCto-G9V3PA0B-TLs'
	}
	const response = await axios.post(url, authData)
	const data = response.data.idToken
	return data
}

it('if user enter correctly data for log in', async() => {
	let token = await auth("test@ya.ru", "qwerty", false)
	let action = authSuccess(token)
    const state = {
        token: token ? token : null
	}
	let newState = authReducer(state, action)
    expect(newState.token).toBeTruthy()
})

it('if user enter not correctly data for log in', async() => {
	let token = null
	try {
		token = await auth("test@ya.ru", "qwerty1", false)
	} catch(e) {
		console.log(e)
	}
	let action = authSuccess(token)
    const state = {
        token: token ? token : null
	}
	let newState = authReducer(state, action)
    expect(newState.token).toBe(null)
})