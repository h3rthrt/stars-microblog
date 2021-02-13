import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { loginClear } from '../../redux/actions/authActions'
import './Message.sass'

function Message(props) {
    const [showError, setShowError] = useState(false)
    useEffect(() => {
        if(props.error) {
            var timer = setTimeout(() => props.loginClear(), 4000)
            setShowError(true)
        }
        return() => {
            clearTimeout(timer)
        }
    }, [props])

    let cls = ['message']
    props.color ? cls.push(props.color) : cls.push('primary')

    if (props.error && showError) {
        return(
            <div className={ cls.join(' ') } id="message">
                <div className="message__text">{ props.error }</div>
                <button onClick={ () => props.loginClear() }>
                    <FontAwesomeIcon icon="times" className="times" id="message"/>
                </button>
            </div>
        )
    } else {
        return null
    }
}

function mapStateToProps(state) {
    return {
        error: state.auth.authError
    }
}

function mapDispatchToProps(dispath) {
    return {
        loginClear: () => dispath(loginClear())
    }
}

export default connect (mapStateToProps, mapDispatchToProps)(Message)
