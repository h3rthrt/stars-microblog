import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Settings.sass'
import { connect } from 'react-redux'
import { logout, authLoadBlogname } from '../../redux/actions/actions'
import Spinner from '../../components/UI/Spinner'
import PhotoUser from '../Profile/User/PhotoUser'

function Settings(props) {
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if(!props.blogname) {
            setLoading(true)
            props.authLoadBlogname(props.uid)
        } else if (props.blogname && loading) {
            setLoading(false)
        }
    }, [props, loading])
    const buttons = [
        {icon: 'sign-out-alt', text: 'Выйти с аккаунта', onClick: () => props.logout()},
        {icon: 'user', text: 'Сведения об учетной записи'},
        {icon: 'key', text: 'Изменение пароля'},
        {icon: 'heart-broken', text: 'Отключить свою учетную запись'}
    ]
    
    function renderButtons() {
        return buttons.map((item, index) => {
            return(
                <button key={index} onClick={item.onClick}>
                    <FontAwesomeIcon icon={item.icon} />
                    {item.text}
                </button>
            )
        })
    }

    if(loading) {
        return <Spinner />
    } else {
        return (
            <div className="container">
                <div className="settings">
                    <div className="settings__profileInfo">
                        <PhotoUser photoURL={props.photoURL} username={props.username} />
                        <div className="settings__username">{ props.blogname }</div>
                        <div className="settings__desc">null desc</div>
                    </div>
                    <div className="settings__buttons">
                        { renderButtons() }
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        photoURL: state.auth.photoURL,
        uid: state.auth.uid,
        blogname: state.auth.blogname,
        username: state.auth.username
    }
    
}

function mapDispatchToProps(dispatch) {
    return{
        logout: () => dispatch(logout()),
        authLoadBlogname: (uid) => dispatch(authLoadBlogname(uid))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
