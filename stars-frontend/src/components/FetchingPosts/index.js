import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import 
	{	getUserPosts, 
		getMoreUserPosts, 
		getUserLikePosts, 
		getMoreUserLikePosts
	} 
	from '../../redux/actions/postsActions'
import useInfiniteScroll from '../../useInfiniteScroll'
import Post from '../Post'

function FetchingPosts(props) {

	const references = [
		//get posts 
		[ props.getUserPosts, props.getUserLikePosts ], 
		//get more posts 
		[ props.getMoreUserPosts, props.getMoreUserLikePosts ] 
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
		props.complete
	)
	
	useEffect(() => {
		getRefFunction(props.uid)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.reference])

	return (
		<div className="fetch-posts" style={{marginTop: 28}}>
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
		displayName: state.firebase.auth.displayName
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getUserPosts: (uid) => dispatch(getUserPosts(uid)),
		getMoreUserPosts: (uid, lastPost) => dispatch(getMoreUserPosts(uid, lastPost)),
		getUserLikePosts: (uid) => dispatch(getUserLikePosts(uid)),
		getMoreUserLikePosts: (uid, lastPost) => dispatch(getMoreUserLikePosts(uid, lastPost))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FetchingPosts))