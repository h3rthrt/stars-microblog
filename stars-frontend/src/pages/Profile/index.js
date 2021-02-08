import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { loadProfile, loadProfilePosts } from '../../redux/actions/actions'
import Post from '../../components/Post'
import User from '../../components/User'
import Spinner from '../../components/UI/Spinner'
import './Profile.sass'

function Profile(props) {
	const [loadData, setLoadData] = useState(true)
	useEffect(() => {
		props.loadProfile(props.location.pathname.slice(9))
		setTimeout(() => {
			setLoadData(false)
		}, 400)
		if (props.username) {
			setLoadData(false)
			document.getElementById('posts').classList.add("active")
		}
    }, [props])

	function renderPosts() {
		return props.postsList.map((post, index) => {
            return (
                <Post list={post} key={index} />
            )
        })
	}

	function activeBtn(id) {
		if (id === 'posts') { 
			document.getElementById('posts').classList.add("active")
			document.getElementById('likes').classList.remove("active")
		} else {
			document.getElementById('posts').classList.remove("active")
			document.getElementById('likes').classList.add("active")
		}
	}

	function renderProfile() {
		return (
			<div className="container">
				<div className="container__left">
					<div className="select-type">
						<button id="posts" onClick={()=> {props.loadProfilePosts('posts'); activeBtn('posts')}}>записи</button>
						<button id="likes" onClick={()=> {props.loadProfilePosts('likes'); activeBtn('likes')}}>нравится</button>
					</div>
					{ renderPosts() }
				</div>
				<div className="container__right">
					<User username={props.username} blogname={props.blogname} photoURL={props.photoURL}/>
				</div>
			</div>
		)
	}

	if (loadData && props.username === '') {
		return <Spinner />
	} else {
		if(props.username) {
			return renderProfile()
		} else if(props.username === '') {
			return(
				<div className="container">
					<div>Пользователь не найден</div>
				</div>
			)
		}
	}
}

function mapStateToProps(state) {
	return {
		postsList: state.post.postsList,
		username: state.profile.username,
		blogname: state.profile.blogname,
		photoURL: state.profile.photoURL,
		desc: state.profile.desc,
		followers: state.profile.followers,
		following: state.profile.following,
		media: state.profile.media
	}
}

function mapDispatchToProps(dispatch) {
	return {
		loadProfile: (username) => dispatch(loadProfile(username)),
		loadProfilePosts: (payload) => dispatch(loadProfilePosts(payload))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile))
