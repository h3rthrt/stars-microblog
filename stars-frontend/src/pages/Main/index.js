import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Tags from '../../components/PopularTags'
import './Main.sass'

function Main(props) {
	useEffect(() => {
		// props.loadPosts()
	}, [])


	return (
		<div className="container container__main">
			<div className="container__left">
				{/* { renderPosts() } */}
			</div>
			<div className="container__right">
				<Tags />
			</div>
		</div>
	)
}

function mapStateToProps(state) {
	return {
		// postsList: state.posts.postsList
	}
}

function mapDispatchToProps(dispatch) {
	return {
		// loadPosts: () => dispatch(loadPosts())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
