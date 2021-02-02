import React from 'react'
import './Settings.sass'
import { connect } from 'react-redux'
import { logout } from '../../redux/actions/actions'

function Settings(props) {
    return (
        <div>
            <h2>Настройки аккаунта</h2>
            <button onClick={() => props.logout()}>Выйти</button>
        </div>
    )
}

function mapDispatchToProps(dispath) {
    return{
        logout: () => dispath(logout())
    }
}

export default connect(null, mapDispatchToProps)(Settings)
