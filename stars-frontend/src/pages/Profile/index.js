import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { loadProfilePosts } from '../../redux/actions/actions'
import Post from '../../components/Post'
import User from '../../components/User'
import './Profile.sass'

function Profile(props) {

	useEffect(() => {
		props.loadProfilePosts('posts')
		document.getElementById('posts').classList.add("active")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
				<User username="user1106" />
			</div>
		</div>
	)
}

function mapStateToProps(state) {
	return {
		postsList: state.post.postsList
	}
}

function mapDispatchToProps(dispatch) {
	return {
		loadProfilePosts: (payload) => dispatch(loadProfilePosts(payload))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
