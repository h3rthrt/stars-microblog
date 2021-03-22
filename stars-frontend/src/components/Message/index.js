import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { errorClear } from '../../redux/actions/authActions'
import './Message.sass'

function Message(props) {
    const [showError, setShowError] = useState(false)
    useEffect(() => {
        if(props.authError) {
            var timer = setTimeout(() => props.errorClear(), 4000)
            setShowError(true)
        }
        return() => {
            clearTimeout(timer)
        }
    }, [props])

    let cls = ['message']
    props.color ? cls.push(props.color) : cls.push('primary')

    if (props.authError && showError) {
        return(
            <div className={ cls.join(' ') } id="message">
                <div className="message__text">{ props.authError }</div>
                <button onClick={ () => props.errorClear() }>
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
        authError: state.auth.authError
    }
}

function mapDispatchToProps(dispath) {
    return {
        errorClear: () => dispath(errorClear())
    }
}

export default connect (mapStateToProps, mapDispatchToProps)(Message)
