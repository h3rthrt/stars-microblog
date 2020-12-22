import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { loadProfile } from '../../redux/actions/actions'
import './User.sass'

function User(props) {

    useEffect(() => {
        props.loadProfile(props.username)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function renderProfileData() {
        return props.profileData.map((item, index) => {
            return (
                <div className="right-block" key={index}>
                    <div className="right-block__user-info">
                        <img alt="" src={item.avatar} />
                        <div className="user-info__block">
                            <h1>{item.username}</h1>
                            <p>{item.desc}</p>
                        </div>
                    </div>
                    <div className="right-block__subs">
                        <h2>Блоги</h2>
                        <hr/>
                        <div className="subs-block">
                            <a href="/">{item.subscriptions.length} в читаемых</a>
                            <a href="/">{item.followers.length} читателя</a>
                        </div>
                    </div>
                    <div className="right-block__media">
                        <h2>Медиа</h2>
                        <hr/>
                        <div className="media-list">
                        { 
                            item.media.map((media, index) => {
                                return (
                                    <a alt="" href="/">
                                        <img alt="" src={media} key={index} />
                                    </a>
                                )
                            }) 
                        }
                        </div>
                    </div>
                </div>
            )
        })
    }

	return (
		renderProfileData()
	)
}

function mapStateToProps(state) {
	return {
		profileData: state.data.profileData
	}
}

function mapDispatchToProps(dispatch) {
	return {
		loadProfile: (payload) => dispatch(loadProfile(payload))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(User)
