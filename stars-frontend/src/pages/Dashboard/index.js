import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Post from '../../components/Post'
import Tags from '../../components/PopularTags'
import CreateNote from '../../components/Modal/CreatePost'
import './Dashboard.sass'

function Dashboard(props) {
	const [showCreateNote, setShowCreateNote] = useState(false)

	useEffect(() => {

	}, [props.blogname])

	function renderPosts() {
		return props.postsList.map((post, index) => {
			return <Post key={index} list={post} />
		})
	}

	return (
		<div className="container container__main">
			{/* modal */}
			<CreateNote
				view={showCreateNote} 
				onClose={() => setShowCreateNote(!showCreateNote)}
				username={props.username}
				blogname={props.blogname}
				uid={props.uid}
				photoURL={props.photoURL}
			/>

			<div className="container__left">
				{ 
					props.isLoaded
					? <div className="post">
						<div className="post__left">
							<img 
							src={ props.photoURL ? props.photoURL : '/img/defaultPhoto.svg' } 
							alt=""
							className="ava" />
						</div>
						<div className="post__right post__create">
							<div className="create-note" onClick={() => setShowCreateNote(true)}>Создать запись</div>
						</div>
					</div>
					: <center><FontAwesomeIcon icon="sync-alt" size="1x" pulse={true} /></center>
				}
				{/* {renderPosts()} */}
			</div>
			<div className="container__right">
				<Tags />
			</div>
		</div>
	)
}

function mapStateToProps(state) {
	return {
		
		// postsList: state.posts.postsList,
		blogname: state.firebase.profile.blogname,
		username: state.firebase.auth.displayName,
		uid: state.firebase.auth.uid,
		isLoaded: state.firebase.profile.isLoaded,
		photoURL: state.firebase.auth.photoURL
	}
}

function mapDispatchToProps(dispatch) {
	return {
		// loadPosts: () => dispatch(loadPosts())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
