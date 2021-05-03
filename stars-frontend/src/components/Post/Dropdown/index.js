import React, { useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { removePost } from '../../../redux/actions/postsActions'

function Dropdown(props) {

	const dropdownRef = useRef()
	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			props.onShow();
		}
	}

	function removePostHandler() {
		props.removePost(props.postId)
		props.remove()
		props.onShow()
	}
	
	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		}
	})

	if (!props.show) return null
	return (
		<div ref={ dropdownRef } className="post__dropdown">
			<span>
				<h4>Дата публикации</h4>
				{ props.createdAt }
			</span>
			{
				props.username === props.displayName || (props.repost && props.username === props.displayName) ?
				<button onClick={ () => removePostHandler() } >
					Удалить
				</button> : null
			}
			<button onClick={ () => props.onShow() } >
				Закрыть
			</button>
		</div> 
	)
}

function mapStateToProps(state) {
	return {
		displayName: state.firebase.auth.displayName
	}
}

function mapDispatchToProps(dispatch) {
	return {
		removePost: (uid) => dispatch(removePost(uid))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Dropdown)
