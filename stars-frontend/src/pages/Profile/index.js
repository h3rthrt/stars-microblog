import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { loadProfile } from '../../redux/actions/profileActions'
import User from './User'
import Spinner from '../../components/UI/Spinner'
import FetchingPosts from '../../components/FetchingPosts'
import './Profile.sass'

const Profile = (props) => {
	const [ active, setActive ] = useState('posts')

	useEffect(() => {
		props.loadProfile(props.location.pathname.slice(9))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[props.location])

	function activeBtn(id) {
		if (id === 'posts') return setActive('posts')
		if (id === 'likes') return setActive('likes')
	}

	function renderPosts() {
		return (
			<div className="container container__main">
				<div className="container__left">
					<div className="select-type">
						<button
							id="posts"
							className={ active === 'posts' ? 'active' : '' }
							onClick={() => {
								activeBtn('posts')
							}}
						>
							записи
						</button>
						<button
							id="likes"
							className={ active === 'likes' ? 'active' : '' }
							onClick={() => {
								activeBtn('likes')
							}}
						>
							нравится
						</button>
					</div>
					<FetchingPosts 
						uid={props.uid} 
						reference={ active === 'posts' ? 'getUserPosts' : 'getUserLikePosts' } 
						referenceMore={ active === 'posts' ? 'getMoreUserPosts' : 'getMoreUserLikePosts' }  
					/>
				</div>
				<div className="container__right">
					<User username={props.username} blogname={props.blogname} photoURL={props.photoURL} />
				</div>
			</div>
		)
	}
	
	if (!!props.username && props.isLoaded && props.isFound) return renderPosts()
	if (!props.isFound && props.isLoaded && !!!props.username) {
		return (
			<div className="container">
				<div>Пользователь не найден</div>
			</div>
		)
	}
	return <Spinner />
}

function mapStateToProps(state) {
	return {
		uid: state.profile.uid,
		posts: state.posts.posts,
		username: state.profile.username,
		blogname: state.profile.blogname,
		displayName: state.firebase.auth.displayName,
		photoURL: state.profile.photoURL,
		desc: state.profile.desc,
		followers: state.profile.followers,
		following: state.profile.following,
		media: state.profile.media,
		isLoaded: state.firebase.profile.isLoaded,
		isFound: state.profile.isFound
	}
}

function mapDispatchToProps(dispatch) {
	return {
		loadProfile: (username) => dispatch(loadProfile(username))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile))