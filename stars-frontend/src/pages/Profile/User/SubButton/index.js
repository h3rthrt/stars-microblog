import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { followOnBlog, unfollowOnBlog } from '../../../../redux/actions/profileActions'
import Button from '../../../../components/UI/Button'
import '../User.sass'
import { INC_FOLLOWERS } from '../../../../redux/actions/actionsTypes'

function SubButton(props) {
	const [ follow, setFollow ] = useState(false)
	const [ disabled, setDisabled ] = useState(false)

	useEffect(() => {
		if (!disabled) {
			props.following.forEach((userId) => {
				if(userId === props.profileId) {
					setFollow(true)
				}
			})
		} else if (disabled) {
			if (follow) {
				props.following.forEach((userId) => {
					console.log(userId === props.profileId)
					if (userId === props.profileId) return
					setDisabled(false)
					props.incFollowers(props.uid, 'unfollow')
					setFollow(prev => {return !prev})
				})
			} else {
				props.following.forEach((userId) => {
					if (userId !== props.profileId) return
					setDisabled(false)
					props.incFollowers(props.uid, 'follow')
					setFollow(prev => {return !prev})
				})
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.following, props.profileId])

	let cls = []
	if (!follow) cls.push('blue')
	if (follow) cls.push('green')

	function clickFollowHandler() {
		setDisabled(true)
		if (follow) {
			props.unfollowOnBlog(props.uid, props.profileId)
		} else {
			props.followOnBlog(props.uid, props.profileId)
		}
	}

	if (props.uid === props.profileId) return null
	return (
		<div className="follow-btn">
			<Button color={ cls.join(' ')} cls="button-s" loading={ disabled } onClick={ () => clickFollowHandler() }> 
				{ follow ? 'Вы подписаны' : 'Подписаться' } 
			</Button>	
		</div>
	)
}

function mapStateToProps(state) {
	return {
		profileId: state.profile.uid,
		uid: state.firebase.auth.uid,
		following: state.auth.following
	}
}

function mapDispatchToProps(dispatch) {
	return {
		followOnBlog: (uid, userId) => dispatch(followOnBlog(uid, userId)),
		unfollowOnBlog: (uid, userId) => dispatch(unfollowOnBlog(uid, userId)),
		incFollowers: (uid, follow) => dispatch({ uid: uid, follow: follow, type: INC_FOLLOWERS })
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SubButton)
