import { LOAD_TAGS_SUCCESS } from "./actionsTypes"


export function loadPopularTags() {
	return async (dispatch, getState, {getFirebase, getFirestore}) => {
		const firestore = getFirestore()
		firestore.collection('posts').limit(200).get().then(async (querySnapshot) => {
			let tagsMass = []
			let tags = []
			Promise.all(querySnapshot.docs.map(async (doc, index) => {
				let data = await doc.data()
				if (!!data.tags && data.tags.length > 0) {
					tagsMass.push(data.tags)
				}
				return true
			})).then(() => {
				for (let mass in tagsMass) {
					tagsMass[mass].forEach((tag) => {
						tags.push({
							name: tag,
							count: 1
						})
					})
				}
				dispatch({ tags: tags, type: LOAD_TAGS_SUCCESS })
			})
		})

	}
}