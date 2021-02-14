//импорт тестируемых компонентов
import { authSuccess, authError } from "./actions"
import authReducer from './../reducers/auth'
import firebase from '../../api/firebase'

//инициализация функции авторизации
async function auth(email, pass) {
	//создание глобальной переменной newState
	let newState
	//запрос для авторизации на сервере 
	await firebase.auth().signInWithEmailAndPassword(email, pass)
	//если авторизация прошла успешно
	.then((data) => {
		//с помощью функции authSuccess данные о пользователе 
		//обрабатываются и записываются в хранилище
		const action = authSuccess(data.user.uid, data.user.displayName, null, data.user.photoURL)
		newState = authReducer(null, action)
	})
	//если авторизация прошла с ошбкой
	.catch((e) => {
		//с помощью функции authError данные об ошибке 
		//обрабатываются и записываются в хранилище
		const action = authError(e.message)
		newState = authReducer(null, action)
		//вывод сообщения ошибки в консоль разработчика
		console.log(`Error message: ${newState.error}`)
	})
	return newState
}
//тестирование функции авторизации с корректными данными
it('if user enter correctly data for log in', async() => {
	//инициализация констаны, которая будет хранить результат авторизации
	const state = await auth('user@ya.ru', 'qwerty')
	//проверка авторизации по уникальному идентификатору пользователя
    expect(state.uid).toBeTruthy()
})
//тестирование функции авторизации с некорректными данными
it('if user enter not correctly data for log in', async() => {
	//инициализация констаны, которая будет хранить результат авторизации
	const state = await auth('test4@ya.ru', 'qwerty1')
	//проверка авторизации по уникальному идентификатору пользователя
	expect(state.uid).toBe(undefined)
	//проверка сообщения об ошибке от сервера
	expect(state.error).toBe('There is no user record corresponding to this identifier. The user may have been deleted.')
})