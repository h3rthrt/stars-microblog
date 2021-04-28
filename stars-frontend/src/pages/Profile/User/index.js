import React from 'react'
import { connect } from 'react-redux'
import Spinner from '../../../components/UI/Spinner'
import './User.sass'
import PhotoUser from './PhotoUser'
import wordForm from '../../../wordForm'
import SubButton from './SubButton'

function User(props) {
    let following = !!props.following ? props.following.length : 0
    let followers = !!props.followers ? props.followers.length : 0
    return (
        <div className="right-block">
            <div className="right-block__user-info">
                <PhotoUser photoURL={props.photoURL} username={props.username} />
                <div className="user-info">
                    {
                        props.blogname.length <= 10
                            ? <span className="blogname xl">{props.blogname}</span>
                            : <span className="blogname s">{props.blogname}</span>
                    }
                    <p>{props.desc}</p>
                    <SubButton />
                </div>
            </div>
            <div className="right-block__subs">
                <h2>Блоги</h2>
                <hr/>
                <div className="subs-block">
                    <a href="/">{ following } в читаемых</a>
                    <a href="/">{ `${followers} ${wordForm( followers, ['читатель', 'читателя', 'читателей'])}` }</a>
                </div>
            </div>
            <div className="right-block__media">
                <h2>Медиа</h2>
                <hr/>
                <div className="media-list">
                { 
                    !!props.media ?
                    props.media.map((media, index) => {
                        if (!media.photoURL) return null
                        return (
                            <a alt="" href="/" key={ index }>
                                <img alt="" src={ media.photoURL } key={ index } />
                            </a>
                        )
                    }) : <Spinner />
                }
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        username: state.profile.username,
        blogname: state.profile.blogname,
        photoURL: state.profile.photoURL,
        media: state.profile.media,
        desc: state.profile.desc,
        followers: state.profile.followers,
		following: state.profile.following
    }
}

export default connect(mapStateToProps)(User)
