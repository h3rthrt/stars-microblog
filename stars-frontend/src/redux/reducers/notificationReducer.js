import {
	NOTIFICATION_TYPE_SUCCESS,
	NOTIFICATION_TYPE_DANGER,
	NOTIFICATION_TYPE_INFO,
	NOTIFICATION_TYPE_DEFAULT,
	NOTIFICATION_TYPE_WARNING
} from '../actions/actionsTypes'
import { store as notificationStore } from 'react-notifications-component'

const initialState = {
	title: '',
	message: '',
	type: '',
	insert: 'top',
	container: 'top-right',
	animationIn: [ 'animate__animated', 'animate__fadeIn' ],
	animationOut: [ 'animate__animated', 'animate__fadeOut' ],
	dismiss: {
		duration: 4000,
		showIcon: true
	}
}

export default function notificationReducer(state = initialState, action) {
	switch (action.type) {
		case NOTIFICATION_TYPE_SUCCESS:
			return notificationStore.addNotification({
				...initialState,
				title: action.title,
				message: action.message,
				type: 'success'
			})
		case NOTIFICATION_TYPE_DANGER:
			return notificationStore.addNotification({
				...initialState,
				title: action.title,
				message: action.message,
				type: 'danger'
			})
		case NOTIFICATION_TYPE_INFO:
			return notificationStore.addNotification({
				...initialState,
				title: action.title,
				message: action.message,
				type: 'info'
			})
		case NOTIFICATION_TYPE_DEFAULT:
			return notificationStore.addNotification({
				...initialState,
				title: action.title,
				message: action.message,
				type: 'default'
			})
		case NOTIFICATION_TYPE_WARNING:
			return notificationStore.addNotification({
				...initialState,
				title: action.title,
				message: action.message,
				type: 'warning'
			})
		default:
			return state
	}
}
