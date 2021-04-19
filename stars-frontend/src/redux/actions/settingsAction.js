

export function setTheme(uid, theme) {
	return (dispatch, getState, {getFirebase, getFirestore}) => {
		const firestore = getFirestore()
		firestore.collection('users').doc(uid).update({
			theme: !theme
		})
	}
}