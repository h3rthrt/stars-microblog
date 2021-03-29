import { NOTIFICATION_TYPE_SUCCESS, NOTIFICATION_TYPE_DANGER, NOTIFICATION_TYPE_INFO, NOTIFICATION_TYPE_DEFAULT, NOTIFICATION_TYPE_WARNING } from './actionsTypes'

export default function notification(type = 'Default', title, message){
	switch(type) {
		case 'Success':
			return notificationSuccess(title, message)
		case 'Danger':
			return notificationDanger(title, message)
		case 'Info':
			return notificationInfo(title, message)
		case 'Warning':
			return notificationWarning(title, message)
		case 'Default':
			return notificationDefault(title, message)	
		default:
			return null
	}
}

function notificationSuccess(title, message) {
	return {
		title: title,
		message: message || null,
		type: NOTIFICATION_TYPE_SUCCESS
	}
}

function notificationDanger(title, message) {
	return {
		title: title,
		message: message || null,
		type: NOTIFICATION_TYPE_DANGER
	}
}

function notificationInfo(title, message) {
	return {
		title: title,
		message: message || null,
		type: NOTIFICATION_TYPE_INFO
	}
}

function notificationDefault(title, message) {
	return {
		title: title,
		message: message || null,
		type: NOTIFICATION_TYPE_DEFAULT
	}
}

function notificationWarning(title, message) {
	return {
		title: title,
		message: message || null,
		type: NOTIFICATION_TYPE_WARNING
	}
}