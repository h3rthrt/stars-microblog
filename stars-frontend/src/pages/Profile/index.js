import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { loadProfile } from '../../redux/actions/profileActions'
import User from './User'
import Spinner from '../../components/UI/Spinner'
import FetchingPosts from '../../components/FetchingPosts'
import './Profile.sass'

const Profile = (props) => {
	const [ loadData, setLoadData ] = useState(true)
	const [ active, setActive ] = useState('posts')

	useEffect(() => {
		return () => {
			setLoadData(true)
		}
	}, [props.location])

	useEffect(() => {
		// first data load profile
		if (!loadData) return
		props.loadProfile(props.location.pathname.slice(9))
		if (props.isLoaded && loadData) {
			setLoadData(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[props.isLoaded, props.username, props.location, loadData, props.photoURL])

	function renderPosts() {
		return (
			<div className="container container__main">
				<div className="container__left">
					<div className="select-type">
						<button
							id="posts"
							className={active === 'posts' ? 'active' : ''}
							onClick={() => {
								activeBtn('posts')
							}}
						>
							записи
						</button>
						<button
							id="likes"
							className={active === 'likes' ? 'active' : ''}
							onClick={() => {
								activeBtn('likes')
							}}
						>
							нравится
						</button>
					</div>
					<FetchingPosts 
						username={props.username} 
						reference='getUserPosts' 
						referenceMore='getMoreUserPosts' 
					/>
				</div>
				<div className="container__right">
					<User username={props.username} blogname={props.blogname} photoURL={props.photoURL} />
				</div>
			</div>
		)
	}

	function activeBtn(id) {
		if (id === 'posts') return setActive('posts')
		if (id === 'likes') return setActive('likes')
	}
	
	if (loadData) return <Spinner />
	if (!!props.username && !loadData) return renderPosts()
	if (props.username === '' && !props.isFound && !loadData) {
		return (
			<div className="container">
				<div>Пользователь не найден</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
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