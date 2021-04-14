import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { loadProfile } from '../../redux/actions/profileActions'
import { getUserPosts, getMoreUserPosts, getUserLikePosts } from '../../redux/actions/notesActions'
import Post from '../../components/Post'
import User from './User'
import Spinner from '../../components/UI/Spinner'
import useInfiniteScroll from '../../useInfiniteScroll'
import './Profile.sass'

const Profile = (props) => {

	const [lastElementRef] = useInfiniteScroll(
		!!props.notes.length ? props.getMoreUserPosts : () => {},
		props.isFetching,
		props.username,
		props.userLastNote,
		props.userNotesComplete
	);
	const [ loadData, setLoadData ] = useState(true)
	const [ active, setActive ] = useState('posts')

	useEffect(() => {
		// first data load profile
		if (!loadData) return
		props.loadProfile(props.location.pathname.slice(9))
		if (props.isLoaded && loadData && props.username) {
			if (props.notes.length === 0) props.getUserPosts(props.username)
			setLoadData(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[props.isLoaded, props.username])

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
					{ 
						props.notes.map((post, index) => {
							if (props.notes.length === index + 1)  {
								return <Post ref={lastElementRef} post={post} key={index} />
							} else {
								return <Post post={post} key={index} />
							}
						})
					}
					{ props.isFetching && !props.userNotesComplete && <p>Загрузка...</p> }
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
	if (props.username === '') {
		return (
			<div className="container">
				<div>Пользователь не найден</div>
			</div>
		)
	}
	if (props.username && !loadData) return renderPosts()
}

function mapStateToProps(state) {
	return {
		notes: state.notes.userPosts,
		userLastNote: state.notes.userLastPost,
		userNotesComplete: state.notes.userPostsComplete,
		isFetching: state.notes.isFetching,
		username: state.profile.username,
		blogname: state.profile.blogname,
		photoURL: state.profile.photoURL,
		desc: state.profile.desc,
		followers: state.profile.followers,
		following: state.profile.following,
		media: state.profile.media,
		isLoaded: state.firebase.profile.isLoaded
	}
}

function mapDispatchToProps(dispatch) {
	return {
		loadProfile: (username) => dispatch(loadProfile(username)),
		getUserPosts: (username) => dispatch(getUserPosts(username)),
		getMoreUserPosts: (username, lastPost) => dispatch(getMoreUserPosts(username, lastPost)),
		getUserLikePosts: (username, first) => dispatch(getUserLikePosts(username, first))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile))