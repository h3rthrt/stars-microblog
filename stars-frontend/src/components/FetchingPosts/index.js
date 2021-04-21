import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import 
	{	getUserPosts, 
		getMoreUserPosts, 
		getUserLikePosts, 
		getMoreUserLikePosts,
		getAllPosts,
		getMoreAllPosts
	} 
	from '../../redux/actions/postsActions'
import useInfiniteScroll from '../../useInfiniteScroll'
import Post from '../Post'

function FetchingPosts(props) {

	const references = [
		//get posts 
		[ props.getUserPosts, props.getUserLikePosts, props.getAllPosts ], 
		//get more posts 
		[ props.getMoreUserPosts, props.getMoreUserLikePosts, props.getMoreAllPosts ] 
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
		props.isFetching,
		props.uid,
		props.lastPost,
		props.complete,
		props.userId,
	)
	
	useEffect(() => {
		getRefFunction(props.uid, props.userId)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.reference])

	return (
		<div className="fetch-posts" style={{ marginTop: 28 }}>
			{ 
				!!props.posts.length &&
				props.posts.map((post, index) => {
					if (props.posts.length === index + 1)  {
						return <Post ref={lastElementRef} post={post} key={index} />
					} else {
						return <Post post={post} key={index} />
					}
				})
			}
			{ props.isFetching && !props.complete && <p>Загрузка...</p> }
			{ 
				!!!props.posts.length && !props.isFetching &&
					<center><h3>Тут пусто, но это пока временно...</h3></center> 
			}
		</div>
	)
}

function mapStateToProps(state) {
	return {
		posts: state.posts.posts,
		lastPost: state.posts.lastPost,
		complete: state.posts.complete,
		isFetching: state.posts.isFetching,
		displayName: state.firebase.auth.displayName,
		userId: state.firebase.auth.uid
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getUserPosts: (uid, userId) => dispatch(getUserPosts(uid, userId)),
		getMoreUserPosts: (uid, lastPost, userId) => dispatch(getMoreUserPosts(uid, lastPost, userId)),
		getUserLikePosts: (uid, userId) => dispatch(getUserLikePosts(uid, userId)),
		getMoreUserLikePosts: (uid, lastPost, userId) => dispatch(getMoreUserLikePosts(uid, lastPost, userId)),
		getAllPosts: (uid, userId) => dispatch(getAllPosts(uid, userId)),
		getMoreAllPosts: (uid, lastPost, userId) => dispatch(getMoreAllPosts(uid, lastPost, userId)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FetchingPosts))