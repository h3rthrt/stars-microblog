import React, { useState } from 'react'
import { connect } from 'react-redux'
import { getFirestore } from 'redux-firestore'
import { SET_LIKE_ON_POST, SET_REPOST_ON_POST } from '../../../redux/actions/actionsTypes'
import '../Post.sass'

function PostButtons(props) {
	const firestore = getFirestore()
	let postQuery = firestore.collection('posts').doc(props.postId)
	let userQuery = firestore.collection('users').doc(props.userId)
	// liked
	// const [ likeState, setLikeState ] = useState(props.liked)
	const [ likeDisabled, setLikeDisabled ] = useState(false)
	let heartCls = [props.liked ? 'footer-post__heart--active' : 'footer-post__heart']
	// reposted
	// const [ repostState, setRepostState ] = useState(props.reposted)
	const [ repostDisabled, setRepostDisabled ] = useState(false)
	let repostCls = [props.reposted ? 'footer-post__repost--active' : 'footer-post__repost']

	async function setLike() {
		if (likeDisabled) return
		setLikeDisabled(true)
		if (props.liked) {
			// setLikeState(false)
			await firestore.collection('likes')
				.where('userRef', '==', userQuery)
				.where('postRef', '==', postQuery)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						doc.ref.delete()
					})
					postQuery.update({
						notes: firestore.FieldValue.increment(-1)
					})
					props.onChangeInc(-1)
					props.setLikeOnPosts(props.postId, false)
					setLikeDisabled(false)
				}).catch((err) => {
					console.error('Не надо так много нажимать на кнопку.. Ошибки..... ' + err)
				})
		} else {
			// setLikeState(true)
			let exists
			await firestore.collection('likes')
				.where('userRef', '==', userQuery)
				.where('postRef', '==', postQuery)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						exists = doc.exists
					})
				})
			if (exists) return
			firestore.collection('likes').add({
				userRef: userQuery,
				postRef: postQuery,
				likedAt: firestore.Timestamp.now()
			}).then(() => {
				postQuery.update({
					notes: firestore.FieldValue.increment(1)
				})
				props.onChangeInc(1)
				props.setLikeOnPosts(props.postId, true)
				setLikeDisabled(false)
			}).catch((err) => {
				console.error('Не надо так много нажимать на кнопку.. Ошибки..... ' + err)
			})
		}
	}

	async function setRepost() {
		if (repostDisabled) return
		setRepostDisabled(true)
		if (props.reposted) {
			// setRepostState(false)
			await firestore.collection('posts')
				.where('user', '==', userQuery)
				.where('postRef', '==', postQuery)
				.where('repost', '==', true)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						doc.ref.delete()
					})
					postQuery.update({
						notes: firestore.FieldValue.increment(-1)
					})
					props.onChangeInc(-1)
					props.setRepostOnPosts(props.postId, false)
					setLikeDisabled(false)
				}).catch((err) => {
					console.error('Не надо так много нажимать на кнопку.. Ошибки..... ' + err)
				})
		} else {
			// setRepostState(true)
			let exists
			await firestore.collection('posts')
				.where('user', '==', userQuery)
				.where('postRef', '==', postQuery)
				.where('repost', '==', true)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						exists = doc.exists
					})
				})
			if (exists) return
			firestore.collection('posts').add({
				user: userQuery,
				postRef: postQuery,
				repost: true,
				createdAt: firestore.Timestamp.now()
			}).then(() => {
				postQuery.update({
					notes: firestore.FieldValue.increment(1)
				})
				props.onChangeInc(1)
				props.setRepostOnPosts(props.postId, true)
				setLikeDisabled(false)
			}).catch((err) => {
				console.error('Не надо так много нажимать на кнопку.. Ошибки..... ' + err)
			})
		}
	}
	
	return (
		<div className="footer-post__right">
			{
				props.displayName !== props.username || props.reposted ?
				<div className={ repostCls.join(' ') } onClick={ async () => await setRepost() }>
					<svg viewBox="0 -1 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M10.5534 0.635199L10.5534 0.635182C10.361 0.468963 10.0625 0.608145 10.0625 0.85987V3.51788V4.01219L9.56823 4.01785C6.91176 4.04826 4.62525 4.33269 3.01397 5.18009C2.21953 5.5979 1.59951 6.14753 1.17459 6.86657C0.748997 7.58676 0.500004 8.50934 0.500004 9.70223C0.500004 11.5478 1.70704 13.4307 3.06103 14.4155L3.06104 14.4155C3.08518 14.4331 3.10564 14.4376 3.12413 14.4375C3.14593 14.4374 3.1706 14.4303 3.192 14.4163C3.21342 14.4022 3.222 14.3879 3.22445 14.3818C3.22448 14.3817 3.22452 14.3816 3.22458 14.3815C3.22547 14.3795 3.22873 14.3722 3.22195 14.3505L3.22195 14.3505C2.45539 11.899 2.56069 10.1105 3.79653 8.97214C4.39013 8.42536 5.19688 8.08018 6.15202 7.86419C7.10904 7.64777 8.25224 7.55288 9.55531 7.53412L10.0625 7.52682V8.03407V10.9531C10.0625 11.2047 10.3607 11.3443 10.5534 11.1778L10.5534 11.1778L16.3973 6.13095C16.3973 6.13094 16.3973 6.13094 16.3973 6.13093C16.5342 6.0127 16.5343 5.79988 16.3973 5.68158C16.3973 5.68157 16.3973 5.68156 16.3973 5.68155L10.5534 0.635199Z" />
					</svg>
				</div> : null
			}
			<div className={ heartCls.join(' ') } onClick={ async () => await setLike() }>
				<svg viewBox="1 1 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M17.5543 4.7395C15.7764 3.29113 13.1323 3.55165 11.5005 5.1613L10.8613 5.79089L10.2222 5.1613C8.59357 3.55165 5.94623 3.29113 4.16835 4.7395C2.13094 6.40188 2.02388 9.38547 3.84717 11.1874L10.1249 17.3841C10.5304 17.7842 11.189 17.7842 11.5945 17.3841L17.8723 11.1874C19.6988 9.38547 19.5917 6.40188 17.5543 4.7395V4.7395Z" />
				</svg>
			</div>
		</div>
	)
}

function mapStateToProps(state) {
	return {
		userId: state.firebase.auth.uid,
		displayName: state.firebase.auth.displayName,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setLikeOnPosts: (postId, liked) => dispatch({ postId: postId, liked: liked, type: SET_LIKE_ON_POST }),
		setRepostOnPosts: (postId, reposted) => dispatch({ postId: postId, reposted: reposted, type: SET_REPOST_ON_POST })
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PostButtons)