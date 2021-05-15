import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Tags from '../../components/PopularTags'
import FetchingPosts from '../../components/FetchingPosts'

function Search(props) {
	const [ isUserSearch, setIsUserSearch ] = useState(false)
	
	useEffect(() => {
		props.location.search.slice(12) === '/search?user' ? setIsUserSearch(true) : setIsUserSearch(false) 
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[props.value, props.location.search])

	return (
		<div className="container container__main">
			<div className="container__left">
				<FetchingPosts 
					uid={props.uid} 
					reference={ isUserSearch ? 'getUserSearchPosts' : 'getSearchPosts' } 
					referenceMore={ isUserSearch ? 'getMoreUserSearchPosts' : 'getMoreSearchPosts' }
					value={ props.value }
				/>
			</div>
			<div className="container__right--tags">
				<Tags />
			</div>
		</div>
	)
}

function mapStateToProps(state) {
	return {
		uid: state.firebase.auth.uid,
		value: state.search.value
	}
}

export default connect(mapStateToProps)(withRouter(Search))
