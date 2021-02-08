import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Settings.sass'
import { connect } from 'react-redux'
import { logout } from '../../redux/actions/actions'

function Settings(props) {
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

    return (
        <div className="container">
            <div className="settings">
                <div className="settings__profileInfo">
                    { 
                        props.photoURL && props.photoURL === null
                        ? <img alt="" src={ props.photoURL } />
                        : <img alt="" src="/img/defaultPhoto.svg" />
                    }
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

function mapStateToProps(state) {
    return {
        photoURL: state.auth.photoURL,
        blogname: state.auth.blogname
    }
    
}

function mapDispatchToProps(dispath) {
    return{
        logout: () => dispath(logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
