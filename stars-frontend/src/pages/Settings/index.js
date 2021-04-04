import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Settings.sass'
import { connect } from 'react-redux'
import { signOut } from '../../redux/actions/authActions'
import { loadProfile, clearPhoto } from '../../redux/actions/profileActions'
import Spinner from '../../components/UI/Spinner'
import PhotoUser from '../Profile/User/PhotoUser'

function Settings(props) {

    function setDataTheme() {
        const html = document.documentElement
        if(html.getAttribute('data-theme') !== 'white') {
            html.setAttribute('data-theme', 'white')
        } else {
            html.removeAttribute('data-theme', 'white')
        }
    }

    const buttons = [
        {icon: 'palette', text: 'Сменить цветовую тему', onClick: () => setDataTheme()},
        {icon: 'user', text: 'Сведения об учетной записи'},
        {icon: 'key', text: 'Изменение пароля'},
        {icon: 'heart-broken', text: 'Отключить свою учетную запись'},
        {icon: 'sign-out-alt', text: 'Выйти с аккаунта', onClick: () => props.signOut()}
    ]

    useEffect(() => {
        props.loadProfile(props.username)
    })
    
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

    if(!props.isLoaded) {
        return <Spinner />
    } else {
        return (
            <div className="container container__main">
                <div className="settings">
                    <div className="settings__profile-info">
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
        photoURL: state.firebase.auth.photoURL,
        uid: state.firebase.auth.uid,
        blogname: state.firebase.profile.blogname,
        username: state.firebase.auth.displayName,
        isLoaded: state.firebase.profile.isLoaded
    }
    
}

function mapDispatchToProps(dispatch) {
    return{
        signOut: () => dispatch(signOut()),
        loadProfile: (username) => dispatch(loadProfile(username)),
        clearPhoto: () => dispatch(clearPhoto())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
