import React from 'react'
import Button from '../../UI/Button'
import { connect } from 'react-redux'
import { restorePost } from '../../../redux/actions/postsActions'

function RestorePost(props) {
	function restorePostHandler() {
		props.removePosts.forEach((removePost) => {
			if (removePost.uid === props.postId) {
				props.restorePost(props.postId, removePost.post)
				props.restore()
			}
		})
	}


	return (
		<div className="post__right--remove">
			<span>Пост удален</span>
			<Button
				cls="button-s"
				color="blue"
				onClick={ () => restorePostHandler() }
			>
				Восстановить
			</Button>
		</div>
	)
}

function mapStateToProps(state) {
	return {
		removePosts: state.posts.removePosts
	}
}

function mapDispatchToProps(dispatch) {
	return {
		restorePost: (uid, post) => dispatch(restorePost(uid, post))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RestorePost)