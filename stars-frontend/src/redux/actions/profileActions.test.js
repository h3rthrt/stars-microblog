// import configureMockStore from 'redux-mock-store'
// import { createStore, compose, combineReducers } from 'redux'
// import { reactReduxFirebase, firebaseStateReducer } from 'react-redux-firebase'
// import { firebaseConfig } from '../../api/firebase'
// import rootReducer from '../reducers/rootReducer'
// import thunk from 'redux-thunk'
// import * as actions from './profileActions'
// import * as types from './actionsTypes'

// const createStoreWithMiddleware = compose(
// 	reactReduxFirebase(firebaseConfig)
//   )(createStore)
// const store = createStoreWithMiddleware(combineReducers({ firebase: firebaseStateReducer }))
// const mockStore = configureMockStore(store)
// console.log(store)

// describe('async actions', () => {
//   it('test loading user profile', () => {
	  	
// 		const expectedActions = [

// 		]

// 		const username = 'user1106'

// 		const store = mockStore(rootReducer)
// 		console.log(store)
// 		return store.dispatch(actions.loadProfile(username)).then(() => {

// 		})
// 	})
// })