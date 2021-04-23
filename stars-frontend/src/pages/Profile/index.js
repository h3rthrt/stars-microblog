import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { loadProfile } from '../../redux/actions/profileActions'
import User from './User'
import Spinner from '../../components/UI/Spinner'
import FetchingPosts from '../../components/FetchingPosts'
import './Profile.sass'

const Profile = (props) => {
	const [ likes, setLikes ] = useState(false)

	// благодаря данному костылю, при обновлении состояния props.location.pathname сначала выполняется
	// хук useEffect и только потом ренрерится компонент FetchingPosts
	const [ pathname, setPathname ] = useState(props.location.pathname)

	useEffect(() => {
		setLikes(false)
		setPathname(props.location.pathname)
		props.loadProfile(props.location.pathname.slice(9))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[props.location.pathname])

	function renderPosts() {
		return (
			<div className="container container__main">
				<div className="container__left">
					<div className="select-type">
						<button
							id="posts"
							className={ likes ? '' : 'active' }
							onClick={() => {
								setLikes(prev => {return !prev})
							}}
						>
							записи
						</button>
						<button
							id="likes"
							className={ likes ? 'active' : '' }
							onClick={() => {
								setLikes(prev => {return !prev})
							}}
						>
							нравится
						</button>
					</div>
					{ 
						props.location.pathname === pathname ?
						<FetchingPosts 
							uid={props.uid} 
							reference={ !likes ? 'getUserPosts' : 'getUserLikePosts' } 
							referenceMore={ !likes ? 'getMoreUserPosts' : 'getMoreUserLikePosts' }  
						/> : null
					}
				</div>
				<div className="container__right">
					<User />
				</div>
			</div>
		)
	}
	
	if (!!props.username && props.isLoaded && props.isFound) return renderPosts()
	if (!props.isFound && props.found !== undefined && props.isLoaded && !!!props.username) {
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
		isLoaded: state.profile.isLoaded,
		isFound: state.profile.isFound
	}
}

function mapDispatchToProps(dispatch) {
	return {
		loadProfile: (username) => dispatch(loadProfile(username))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile))