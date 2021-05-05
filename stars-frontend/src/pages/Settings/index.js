import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Settings.sass'
import { connect } from 'react-redux'
import { signOut } from '../../redux/actions/authActions'
import { clearPhoto, replaceDescription, replaceBlogname } from '../../redux/actions/profileActions'
import { setTheme } from '../../redux/actions/settingsAction'
import Spinner from '../../components/UI/Spinner'
import PhotoUser from '../Profile/User/PhotoUser'

function Settings(props) {
    const buttons = [
        {icon: 'palette', text: 'Сменить цветовую тему', onClick: () => props.setTheme(props.uid, props.theme)},
        // {icon: 'user', text: 'Сведения об учетной записи'},
        // {icon: 'key', text: 'Изменение пароля'},
        {icon: 'heart-broken', text: 'Отключить свою учетную запись'},
        {icon: 'sign-out-alt', text: 'Выйти с аккаунта', onClick: () => props.signOut()}
    ]
    const [ blogname, setBlogname ] = useState(props.blogname)
    const [ desc, setDesc ] = useState(props.desc || 'нет описания')
    const [ editName, setEditName ] = useState(false)
    const [ editDesc, setEditDesc ] = useState(false)
    
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

    function blognameHandler(event) {
        setBlogname(event.target.value)

    }

    function descHandler(event) {
        setDesc(event.target.value)

    }

    if(!props.isLoaded) {
        return <Spinner />
    } else {
        return (
            <div className="container container__main">
                <div className="settings">
                    <div className="settings__profile-info">
                        <PhotoUser photoURL={props.photoURL} username={props.username} />
                        <div className="settings__block">
                            {
                                !editName ?
                                <div className="settings__username">{ blogname }</div> : 
                                <input className="settings__username" value={ blogname } onChange={ (event) => blognameHandler(event) }></input>
                            }
                            <button onClick={() => setEditName(!editName)}>
                                <FontAwesomeIcon icon={ !editName ? "pen" : "check" } />
                            </button>
                        </div>
                        <div className="settings__block">
                            {
                                !editDesc ?
                                <div className="settings__desc"> { desc || 'нет описания' }</div> : 
                                <input className="settings__desc" value={ desc } onChange={ (event) => descHandler(event) }></input>
                            }
                            <button onClick={ () => setEditDesc(!editDesc) }>
                                <FontAwesomeIcon icon={ !editDesc ? "pen" : "check" } />
                            </button>
                        </div>
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
        isLoaded: state.firebase.profile.isLoaded,
        desc: state.firebase.profile.desc,
        theme: state.firebase.profile.theme
    }
    
}

function mapDispatchToProps(dispatch) {
    return{
        signOut: () => dispatch(signOut()),
        clearPhoto: () => dispatch(clearPhoto()),
        setTheme: (uid, theme) => dispatch(setTheme(uid, theme)),
        replaceDescription: (desc) => dispatch(replaceDescription(desc)),
        replaceBlogname: (blogname) => dispatch(replaceBlogname(blogname))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
