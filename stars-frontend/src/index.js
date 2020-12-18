import React from 'react';
import ReactDOM from 'react-dom';
import './sass/index.sass';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import {
	faSearch,
	faHome,
	faGlobe,
	faUser,
	faCog,
	faReply,
	faHeart,
	faPhotoVideo,
	faFileAudio
} from '@fortawesome/free-solid-svg-icons';
library.add(fab, far, faSearch, faHome, faGlobe, faUser, faCog, faReply, faHeart, faPhotoVideo, faFileAudio);

const app = (
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
