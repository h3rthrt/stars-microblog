import React from 'react'
import { connect } from 'react-redux'
import Spinner from '../../../components/UI/Spinner'
import './User.sass'
import PhotoUser from './PhotoUser'

function User(props) {
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
                </div>
            </div>
            <div className="right-block__subs">
                <h2>Блоги</h2>
                <hr/>
                <div className="subs-block">
                    <a href="/">{ props.following || 0 } в читаемых</a>
                    <a href="/">{ props.followers || 0 } читателя</a>
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
