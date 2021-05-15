import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tags from '../../components/PopularTags'
import CreateNote from '../../components/Modal/CreatePost'
import FetchingPosts from '../../components/FetchingPosts'
import Spinner from '../../components/UI/Spinner'
import './Dashboard.sass'

function Dashboard(props) {
	const [showCreateNote, setShowCreateNote] = useState(false)

	useEffect(() => {

	}, [props.blogname])

	if (!!!props.followingRefs) return <Spinner />
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
				{ !!props.followingRefs.length ? 
					<FetchingPosts 
						uid={props.uid} 
						reference={ 'getDashboardPosts' } 
					/> : <center><h3>Твои подписки пусты..</h3></center>
				}
			</div>
			<div className="container__right--tags">
				<Tags />
			</div>
		</div>
	)
}

function mapStateToProps(state) {
	return {
		blogname: state.firebase.profile.blogname,
		username: state.firebase.auth.displayName,
		uid: state.firebase.auth.uid,
		isLoaded: state.firebase.profile.isLoaded,
		photoURL: state.firebase.auth.photoURL,
		followingRefs: state.auth.followingRefs
	}
}

function mapDispatchToProps(dispatch) {
	return {
		// loadPosts: () => dispatch(loadPosts())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
