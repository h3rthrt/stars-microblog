import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Post from '../../components/Post'
import Tags from '../../components/PopularTags'
import CreateNote from '../../components/Modal/CreatePost'
import './Dashboard.sass'

function Dashboard(props) {
	const [showCreateNote, setShowCreateNote] = useState(false)

	useEffect(() => {
		// props.loadPosts()
	}, [props])

	function renderPosts() {
		return props.postsList.map((post, index) => {
			return <Post key={index} list={post} />
		})
	}

	return (
		<div className="container">
			<CreateNote
				view={showCreateNote} 
				onShow={() => setShowCreateNote(!showCreateNote)}
			/>
			<div className="container__left">
				<div className="create-note" onClick={() => setShowCreateNote(true)}>Создать запись</div>
				{renderPosts()}
			</div>
			<div className="container__right">
				<Tags />
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
		// loadPosts: () => dispatch(loadPosts())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
