import React from 'react'
import ReactDOM from 'react-dom'
import './sass/index.sass'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter } from 'react-router-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import rootReducer from './redux/reducers/rootReducer'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import {
	faSearch,
	faHome,
	faGlobe,
	faUser,
	faCog,
	faReply,
	faHeart,
	faPhotoVideo,
	faFileAudio,
	faTimes,
	faSignOutAlt,
	faKey,
	faHeartBroken,
	faUserEdit,
	faCamera,
	faSpinner
} from '@fortawesome/free-solid-svg-icons'
library.add(
	fab,
	far,
	faSearch,
	faHome,
	faGlobe,
	faUser,
	faCog,
	faReply,
	faHeart,
	faPhotoVideo,
	faFileAudio,
	faTimes,
	faSignOutAlt,
	faKey,
	faHeartBroken,
	faUserEdit,
	faCamera,
	faSpinner
)

const composeEnhancers =
	typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
				{
					// Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
				}
			)
		: compose

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
const app = (
	<Provider store={store}>
		<React.StrictMode>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</React.StrictMode>
	</Provider>
)

ReactDOM.render(app, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
