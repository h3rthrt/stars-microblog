import {
	LOAD_POSTS_COMPLETE,
	LOAD_POSTS_SUCCESS,
	LOAD_MORE_POSTS_SUCCESS,
	SET_IS_FETCHING,
	SET_IS_MORE_FETCHING,
	REMOVE_POST,
	RESTORE_POST
} from './actionsTypes'
import notification from './notificationActions'

/**
	* Получение объекта с полной информацией о посте
	* 
	* @param {object} doc - запрос к посту
	* @param {object} usersCollection - запрос к коллекции пользователей
	* @param {object} postsCollection - запрос к коллекции постов
	* @param {object} likesCollection - запрос к коллекции лайков
	* @param {string} userId - uid авторизованого пользователя
	* @returns {object}
*/
async function getPostData(doc, usersCollection, postsCollection, likesCollection, userId) {
	let dataPost = doc.data()
	dataPost.postId = doc.id
	dataPost.createdAt =
		dataPost.createdAt.toDate().toLocaleDateString('ru-RU') +
		' ' +
		dataPost.createdAt.toDate().toLocaleTimeString('ru-RU')
	// fetch ref post data
	if (dataPost.repost) {
		dataPost.repostId = doc.id
		await postsCollection.doc(dataPost.postRef.id).get().then(async (doc) => {
			let docData = await doc.data()
			dataPost.postId = doc.id
			dataPost.header = docData.header
			dataPost.notes = docData.notes
			dataPost.photoURL = docData.photoURL
			dataPost.tags = docData.tags
			dataPost.text = docData.text
			dataPost.authorId = docData.user.id
			await usersCollection.doc(docData.user.id).get().then(async (doc) => {
				let docData = await doc.data()
				dataPost.author = docData.blogname
				dataPost.authorUsername = docData.username 
			})
		})
	}
	// fecth user info
	await usersCollection.doc(dataPost.user.id)
		.get()
		.then(async (doc) => {
			let docData = await doc.data()
			dataPost.blogname = docData.blogname
			dataPost.authorPhoto = docData.photoURL
			dataPost.username = docData.username
		})
	// fecth likes
	await likesCollection
			.where('userRef', '==', usersCollection.doc(userId))
			.where('postRef', '==', postsCollection.doc(dataPost.postId))
			.get().then(async (doc) => {
				doc.forEach((snapshot) => {
					dataPost.liked = snapshot.exists
				})
			})
	// fecth reposts
	await postsCollection
			.where('user', '==', usersCollection.doc(userId))
			.where('postRef', '==', postsCollection.doc(dataPost.postId))
			.where('repost', '==', true)
			.get().then(async (doc) => {
				doc.forEach((snapshot) => {
					dataPost.reposted = snapshot.exists
				})
			})
			if (!!!dataPost.reposted) dataPost.reposted = false
	return dataPost
}

/**
	* Получение постов пользователя
	* 
	* @param {string} uid - uid пользователя, по которому необходимо вернуть посты 
	* @param {string} userId - uid авторизованого пользователя
*/
export function getUserPosts(uid, userId) {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		let lastPost
		postsCollection
			.where('user', '==', usersCollection.doc(uid))
			.orderBy('createdAt', 'desc')
			.limit(10)
			.get()
			.then(async (querySnapshot) => {
				Promise.all(
					querySnapshot.docs.map((doc) => {
						return getPostData(doc, usersCollection, postsCollection, likesCollection, userId)
					})
				)
					.then((notes) => {
						lastPost = querySnapshot.docs[querySnapshot.docs.length - 1]
						dispatch(addPosts(notes, lastPost))
					})
					.catch((err) => {
						dispatch(notification('Danger', 'Ошибка загрузки постов пользователя.', `${err}`))
					})
		})
	}
}

/**
	* Получение постов пользователя относительно последнего поста 
	* 
	* @param {string} uid - uid пользователя, по которому необходимо вернуть посты 
	* @param {object} lastPost - запрос последнего поста
	* @param {string} userId - uid авторизованого пользователя
*/
export function getMoreUserPosts(uid, lastPost, userId) {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_MORE_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		postsCollection
			.where('user', '==', usersCollection.doc(uid))
			.orderBy('createdAt', 'desc')
			.startAt(lastPost)
			.limit(10)
			.get()
			.then((querySnapshot) => {
				Promise.all(
					querySnapshot.docs.map((doc) => {
						return getPostData(doc, usersCollection, postsCollection, likesCollection, userId)
					})
				).then((notes) => {
					const lastNote = querySnapshot.docs[querySnapshot.docs.length - 1]
					if (!!notes.length) notes.shift()
					if (!!!notes.length) {
						dispatch({ type: LOAD_POSTS_COMPLETE })
					} else {
						dispatch(addMorePosts(notes, lastNote))
					}
				})
			})
	}
}

/**
	* Получение понравившихся постов пользователя
	* 
	* @param {string} uid - uid пользователя, по которому необходимо вернуть посты 
	* @param {string} userId - uid авторизованого пользователя
*/
export function getUserLikePosts(uid, userId) {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		let lastPost
		likesCollection
			.where('userRef', '==', usersCollection.doc(uid))
			.orderBy('likedAt', 'desc')
			.limit(10)
			.get()
			.then((querySnapshot) => {
				Promise.all(querySnapshot.docs.map(async (doc) => {
					let docData = doc.data()
					let notes
					await postsCollection.doc(docData.postRef.id).get().then(async (querySnapshot) => {
						if (querySnapshot.exists) {
							return await getPostData(querySnapshot, usersCollection, postsCollection, likesCollection, userId)
						}
					})
					.then((data) => {
						notes = data
					})
					.catch((err) => {
						dispatch(notification('Danger', 'Ошибка загрузки постов пользователя.', `${err}`))
					})
					return notes
				})).then((notes) => {
					lastPost = querySnapshot.docs[querySnapshot.docs.length - 1]
					dispatch(addPosts(notes, lastPost))
				}).catch((err) => {
					dispatch(notification('Danger', 'Ошибка загрузки постов пользователя.', `${err}`))
				})
			})
	}
}

/**
	* Получение понравившихся постов пользователя относительно последнего поста 
	* 
	* @param {string} uid - uid пользователя, по которому необходимо вернуть посты 
	* @param {object} lastPost - запрос последнего поста
	* @param {string} userId - uid авторизованого пользователя
*/
export function getMoreUserLikePosts(uid, lastPost, userId) {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_MORE_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		likesCollection.where('userRef', '==', usersCollection.doc(uid))
			.orderBy('likedAt', 'desc')
			.startAt(lastPost)
			.limit(10)
			.get()
			.then((querySnapshot) => {
			Promise.all(querySnapshot.docs.map(async (doc) => {
				let docData = doc.data()
				await postsCollection.doc(docData.postRef.id).get().then(async (querySnapshot) => {
					if (querySnapshot.exists) {
						return await getPostData(querySnapshot, usersCollection, postsCollection, likesCollection, userId)
					}
				})
				.then((notes) => {
					if (!!notes.length) notes.shift()
					if (!!!notes.length) {
						dispatch({ type: LOAD_POSTS_COMPLETE })
					} else {
						const lastNote = querySnapshot.docs[querySnapshot.docs.length - 1]
						dispatch(addMorePosts(notes, lastNote))
					}
				})
			}))
		})
	}
}

/**
	* Получение всех постов
	* 
	* @param {string} uid - uid пользователя, по которому необходимо вернуть посты 
	* @param {string} userId - uid авторизованого пользователя
*/
export function getAllPosts(uid = null, userId) {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		let lastPost
		postsCollection
			.orderBy('createdAt', 'desc')
			.where('repost', '==', false)
			.limit(10)
			.get()
			.then(async (querySnapshot) => {
				// first fetching posts
				Promise.all(
					querySnapshot.docs.map((doc) => {
						return getPostData(doc, usersCollection, postsCollection, likesCollection, userId)
					})
				)
				.then((notes) => {
					lastPost = querySnapshot.docs[querySnapshot.docs.length - 1]
					dispatch(addPosts(notes, lastPost))
				})
				.catch((err) => {
					dispatch(notification('Danger', 'Ошибка загрузки постов пользователя.', `${err}`))
				})
			})
	}
}

/**
	* Получение всех постов относительно последнего поста 
	* 
	* @param {string} uid - uid пользователя, по которому необходимо вернуть посты 
	* @param {object} lastPost - запрос последнего поста
	* @param {string} userId - uid авторизованого пользователя
*/
export function getMoreAllPosts(uid = null, lastPost, userId) {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_MORE_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		postsCollection
			.orderBy('createdAt', 'desc')
			.where('repost', '==', false)
			.startAt(lastPost)
			.limit(10)
			.get()
			.then((querySnapshot) => {
				Promise.all(
					querySnapshot.docs.map((doc) => {
						return getPostData(doc, usersCollection, postsCollection, likesCollection, userId)
					})
				).then((notes) => {
					const lastNote = querySnapshot.docs[querySnapshot.docs.length - 1]
					if (!!notes.length) notes.shift()
					if (!!!notes.length) {
						dispatch({ type: LOAD_POSTS_COMPLETE })
					} else {
						dispatch(addMorePosts(notes, lastNote))
					}
				})
			})
	}
}


/**
	* Получение искомых постов
	* 
	* @param {string} uid - uid пользователя, по которому необходимо вернуть посты 
	* @param {string} userId - uid авторизованого пользователя
	* @param {string} value - строка относительно которой нужно найти посты
*/
export function getSearchPosts(uid = null, userId, value) {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		let lastPost
		postsCollection
			.orderBy('createdAt', 'desc')
			.where('repost', '==', false)
			.where("tags", "array-contains", value)
			.limit(5)
			.get()
			.then(async (querySnapshot) => {
				// first fetching posts
				Promise.all(
					querySnapshot.docs.map((doc) => {
						return getPostData(doc, usersCollection, postsCollection, likesCollection, userId)
					})
				)
				.then((notes) => {
					lastPost = querySnapshot.docs[querySnapshot.docs.length - 1]
					dispatch(addPosts(notes, lastPost))
				})
				.catch((err) => {
					dispatch(notification('Danger', 'Ошибка загрузки постов пользователя.', `${err}`))
				})
			})
	}
}

/**
	* Получение искомых постов относительно последнего поста 
	* 
	* @param {string} uid - uid пользователя, по которому необходимо вернуть посты 
	* @param {object} lastPost - запрос последнего поста
	* @param {string} userId - uid авторизованого пользователя
	* @param {string} value - строка относительно которой нужно найти посты
*/
export function getMoreSearchPosts(uid = null, lastPost, userId, value) {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_MORE_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		postsCollection
			.orderBy('createdAt', 'desc')
			.where('repost', '==', false)
			.where("tags", "array-contains", value)
			.startAt(lastPost)
			.limit(5)
			.get()
			.then((querySnapshot) => {
				Promise.all(
					querySnapshot.docs.map((doc) => {
						return getPostData(doc, usersCollection, postsCollection, likesCollection, userId)
					})
				).then((notes) => {
					const lastNote = querySnapshot.docs[querySnapshot.docs.length - 1]
					if (!!notes.length) notes.shift()
					if (!!!notes.length) {
						dispatch({ type: LOAD_POSTS_COMPLETE })
					} else {
						dispatch(addMorePosts(notes, lastNote))
					}
				})
			})
	}
}

/**
	* Получение искомых постов пользователя
	* 
	* @param {string} uid - uid пользователя, по которому необходимо вернуть посты 
	* @param {string} userId - uid авторизованого пользователя
	* @param {string} value - строка относительно которой нужно найти посты
*/
export function getUserSearchPosts(uid, userId, value) {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		let lastPost
		postsCollection
			.orderBy('createdAt', 'desc')
			.where('user', '==', usersCollection.doc(uid))
			.where("tags", "array-contains", value)
			.limit(5)
			.get()
			.then(async (querySnapshot) => {
				// first fetching posts
				Promise.all(
					querySnapshot.docs.map((doc) => {
						return getPostData(doc, usersCollection, postsCollection, likesCollection, userId)
					})
				)
				.then((notes) => {
					lastPost = querySnapshot.docs[querySnapshot.docs.length - 1]
					dispatch(addPosts(notes, lastPost))
				})
				.catch((err) => {
					dispatch(notification('Danger', 'Ошибка загрузки постов пользователя.', `${err}`))
				})
			})
	}
}

/**
	* Получение искомых постов пользователя относительно последнего поста 
	* 
	* @param {string} uid - uid пользователя, по которому необходимо вернуть посты 
	* @param {object} lastPost - запрос последнего поста
	* @param {string} userId - uid авторизованого пользователя
	* @param {string} value - строка относительно которой нужно найти посты
*/
export function getMoreUserSearchPosts(uid, lastPost, userId, value) {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_MORE_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		postsCollection
			.orderBy('createdAt', 'desc')
			.where('user', '==', usersCollection.doc(uid))
			.where("tags", "array-contains", value)
			.startAt(lastPost)
			.limit(5)
			.get()
			.then((querySnapshot) => {
				Promise.all(
					querySnapshot.docs.map((doc) => {
						return getPostData(doc, usersCollection, postsCollection, likesCollection, userId)
					})
				).then((notes) => {
					const lastNote = querySnapshot.docs[querySnapshot.docs.length - 1]
					if (!!notes.length) notes.shift()
					if (!!!notes.length) {
						dispatch({ type: LOAD_POSTS_COMPLETE })
					} else {
						dispatch(addMorePosts(notes, lastNote))
					}
				})
			})
	}
}

/**
	* Получение постов блогов на которые подписан пользователь 
	* 
	* @param {object} uid - uid пользователя, по которому необходимо вернуть посты 
	* @param {object} userId - uid авторизованого пользователя
	* @param {array} followingRefs - список uid блогов на которые подписан пользователь
*/
export function getDashboardPosts(uid = null, userId, followingRefs) {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		dispatch({ type: SET_IS_FETCHING })
		const firestore = getFirestore()
		let usersCollection = firestore.collection('users')
		let postsCollection = firestore.collection('posts')
		let likesCollection = firestore.collection('likes')
		let notesMass = []
		let lastPostsMass
		let userRef = await usersCollection.doc(userId)
		followingRefs.push(userRef)
		await Promise.all(followingRefs.map(async (userRef) => {
			let notes = await postsCollection
				.orderBy('createdAt', 'desc')
				.where('user', '==', userRef)
				.get()
				.then(async (querySnapshot) => {
					await Promise.all(
						querySnapshot.docs.map(async (doc) => {
							return await getPostData(doc, usersCollection, postsCollection, likesCollection, userId)
						})
					)
					.then(async (notes) => {
						lastPostsMass = await querySnapshot.docs[querySnapshot.docs.length - 1]
						for (let note in notes) {
							notesMass.push(notes[note])
						}
					})
					.catch((err) => {
						dispatch(notification('Danger', 'Ошибка загрузки постов', `${err}`))
					})
					return notesMass
				})
			return notes
		}))
		dispatch(addPosts(notesMass, lastPostsMass))
	}
}

/**
	* Удаление поста 
	* 
	* @param {string} uid - uid удаляемого поста 
	* @param {boolean} repost - если пользователь удаляет репостнутый пост то по идее должно быть true..
*/
export function removePost(uid, repost = false) {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		const firestore = getFirestore()
		let postRef = firestore.collection('posts').doc(uid)
		let post
		const getPost = new Promise(async (resolve, reject) => {
			await postRef.get().then(async (query) => {
				post = await query.data()
				resolve(post)
			}).catch((err) => {
				reject(err)
			})
		})
		await getPost.then((post) => {
			postRef.delete()
				.then(() => {
					dispatch(addRemovePost(uid, post))
				})
				.catch((err) => {
					dispatch(notification('Danger', 'Ошибка удаления поста.', `${err}`))
				})
		}).catch((err) => {
			dispatch(notification('Danger', 'Ошибка удаления поста.', `${err}`))
		})
		
	}
}

/**
	* Восстановление поста 
	* 
	* @param {string} uid - uid восстанавливаемого поста 
	* @param {object} post - объект с полной информацией о посте
*/
export function restorePost(uid, post) {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		const firestore = getFirestore()
		firestore.collection('posts').doc(uid).set(post)
			.then(() => {
				dispatch(removeRestoredPost(uid))
				dispatch(notification('Success', 'Успешно', 'Пост успешно восстановлен'))
			})
			.catch((err) => {
				dispatch(notification('Danger', 'Ошибка восстановления поста.', `${err}`))
			})
	}
}

function addPosts(notes, lastNote) {
	return {
		posts: notes,
		lastPost: lastNote,
		type: LOAD_POSTS_SUCCESS
	}
}

function addMorePosts(notes, lastNote) {
	return {
		posts: notes,
		lastPost: lastNote,
		type: LOAD_MORE_POSTS_SUCCESS
	}
}

function removeRestoredPost(uid) {
	return {
		uid: uid,
		type: RESTORE_POST
	}
}

function addRemovePost(uid, post) {
	return {
		uid: uid,
		post: post,
		type: REMOVE_POST
	}
}