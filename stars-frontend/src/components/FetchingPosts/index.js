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
		[ props.getUserPosts ], 
		//get more posts 
		[ props.getMoreUserPosts ] 
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

	// const [seconds, setSeconds] = useState(0)
	// const increment = useRef(null)
	// const wordForm = (num, word) => { 
	// 	let cases = [2, 0, 1, 1, 1, 2]
	// 	return word[( num % 100 > 4 && num % 100 < 20 ) ? 2 : cases[( num % 10 < 5 ) ? num % 10 : 5]]
	// }

	useEffect(() => {
		if (props.location.pathname === props.pathname) return
		getRefFunction(props.uid, props.location.pathname)
		// increment.current = setInterval(() => {
		// 	setSeconds((prev) => prev + 1)
		// }, 1000)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// useEffect(() => {
	// 	if (props.complete) clearInterval(increment.current)
	// 	return () => {
	// 		clearInterval(increment.current)
	// 	}
	// }, [props.complete])
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
			{/* { 
				props.complete && !!props.posts.length && !props.isFetching &&
				<p>Ты просмотрел весь контент за 
					{ 
						` ${seconds} ${wordForm(seconds, ['секунда', 'секунды', 'секунд'])}. ` 
					} 
					{ 
						seconds <= 5 ? 'Спидран выполнен..' : 'Неплохо.'
					}
				</p> 
			} */}
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
		pathname: state.posts.pathname
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getUserPosts: (uid, pathname) => dispatch(getUserPosts(uid, pathname)),
		getMoreUserPosts: (uid, lastPost) => dispatch(getMoreUserPosts(uid, lastPost)),
		getUserLikePosts: (username) => dispatch(getUserLikePosts(username))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FetchingPosts))