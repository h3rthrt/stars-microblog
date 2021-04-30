import React from 'react'
import { connect } from 'react-redux'
import Tags from '../../components/PopularTags'
import FetchingPosts from '../../components/FetchingPosts'

function Search(props) {
	return (
		<div className="container container__main">
			<div className="container__left">
				<FetchingPosts 
					uid={props.uid} 
					reference={ 'getDashboardPosts' } 
				/>
			</div>
			<div className="container__right">
				<Tags />
			</div>
		</div>
	)
}

function mapStateToProps(state) {
	return {
		uid: state.firebase.auth.uid
	}
}

export default connect(mapStateToProps)(Search)
