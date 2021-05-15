import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import 
	{	getUserPosts, 
		getMoreUserPosts, 
		getUserLikePosts, 
		getMoreUserLikePosts,
		getAllPosts,
		getMoreAllPosts,
		getDashboardPosts,
		getSearchPosts,
		getMoreSearchPosts
	} 
	from '../../redux/actions/postsActions'
import useInfiniteScroll from '../../useInfiniteScroll'
import Post from '../Post'

function FetchingPosts(props) {

	const references = [
		//get posts 
		[ props.getUserPosts, props.getUserLikePosts, props.getAllPosts, props.getDashboardPosts, props.getSearchPosts ], 
		//get more posts 
		[ props.getMoreUserPosts, props.getMoreUserLikePosts, props.getMoreAllPosts, props.getMoreSearchPosts ] 
	]

	let getRefFunction = () => {}
	let getMoreRefFunction = () => {}
	
	references.forEach((mass) => {
		mass.forEach((func) => {
			if (func.name === props.reference) getRefFunction = func
			if (func.name === props.referenceMore) getMoreRefFunction = func
		})
	})

	const [ lastElementRef ] = useInfiniteScroll(
		!!props.posts.length ? getMoreRefFunction : () => {},
		props.isMoreFetching,
		props.uid,
		props.lastPost,
		props.complete,
		props.userId,
		props.value
	)
	
	useEffect(() => {
		if (getRefFunction.name === 'getDashboardPosts') {
			getRefFunction(props.uid, props.userId, props.followingRefs)
		} else if (getRefFunction.name === 'getSearchPosts' || getRefFunction.name === 'getUserSearchPosts') {
			getRefFunction(props.uid, props.userId, props.value)
		} else {
			getRefFunction(props.uid, props.userId)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.location.pathname, props.reference, props.uid, props.value])

	return (
		<div className={ 'fetch-posts' } style={{ marginTop: 28 }}>
			{ 
				!!!props.posts.length && !props.isFetching &&
					<center><h3>Тут пусто, но это пока временно...</h3></center> 
			}
			{ 
				!props.isFetching ?
				props.posts.map((post, index) => {
					if (props.posts.length === index + 1)  {
						return <Post ref={lastElementRef} post={post} key={index} displayName={ props.displayName } />
					} else {
						return <Post post={post} key={index} displayName={ props.displayName } />
					}
				}) : null
			}
			{ props.isFetching || props.isMoreFetching ? <p>Загрузка...</p> : null }
		</div>
	)
}

function mapStateToProps(state) {
	return {
		posts: state.posts.posts,
		lastPost: state.posts.lastPost,
		complete: state.posts.complete,
		isFetching: state.posts.isFetching,
		isMoreFetching: state.posts.isMoreFetching,
		displayName: state.firebase.auth.displayName,
		userId: state.firebase.auth.uid, 
		followingRefs: state.auth.followingRefs
	}
}

function mapDispatchToProps(dispatch) {
	return {
		// user posts
		getUserPosts: (uid, userId) => dispatch(getUserPosts(uid, userId)),
		getMoreUserPosts: (uid, lastPost, userId) => dispatch(getMoreUserPosts(uid, lastPost, userId)),
		// user like posts
		getUserLikePosts: (uid, userId) => dispatch(getUserLikePosts(uid, userId)),
		getMoreUserLikePosts: (uid, lastPost, userId) => dispatch(getMoreUserLikePosts(uid, lastPost, userId)),
		// all posts
		getAllPosts: (uid, userId) => dispatch(getAllPosts(uid, userId)),
		getMoreAllPosts: (uid, lastPost, userId) => dispatch(getMoreAllPosts(uid, lastPost, userId)),
		// dashboard posts
		getDashboardPosts: (uid, userId, followingRefs) => dispatch(getDashboardPosts(uid, userId, followingRefs)),
		// search posts
		getSearchPosts: (uid, userId, value) => dispatch(getSearchPosts(uid, userId, value)),
		getMoreSearchPosts: (uid, lastPost, userId, value) => dispatch(getMoreSearchPosts(uid, lastPost, userId, value))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FetchingPosts))