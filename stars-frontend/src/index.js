import React from 'react'
import ReactDOM from 'react-dom'
import './sass/index.sass'
import './fontAwesome'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter } from 'react-router-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import rootReducer from './redux/reducers/rootReducer'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/storage'
import { ReactReduxFirebaseProvider, getFirebase } from 'react-redux-firebase'
import { reduxFirestore, getFirestore } from 'redux-firestore'
import { firebase, fbConfig } from './api/firebase'

const composeEnhancers =
	typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
				{
					// Specify extension’s options like name, 
					// actionsBlacklist, actionsCreators, serialize...
				}
			)
		: compose

const store = createStore(
	rootReducer, 
	composeEnhancers(
		applyMiddleware(thunk.withExtraArgument({getFirebase, getFirestore})),
		reduxFirestore(firebase)
	)
)

const rrfProps = {
	firebase,
	userProfile: 'users',
	config: fbConfig,
	dispatch: store.dispatch
}

const app = (
	<Provider store={store}>
		<ReactReduxFirebaseProvider {...rrfProps}>
			<React.StrictMode>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</React.StrictMode>
		</ReactReduxFirebaseProvider>
	</Provider>
)

ReactDOM.render(app, document.getElementById('root'))

serviceWorker.unregister()