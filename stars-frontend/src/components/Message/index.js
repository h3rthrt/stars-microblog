import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { delError } from '../../redux/actions/actions'
import './Message.sass'

function Message(props) {
    const [showError, setShowError] = useState(false)
    useEffect(() => {
        if(props.error)
            setShowError(true)
    }, [props.error])

    let cls = ['message']
    props.color ? cls.push(props.color) : cls.push('primary')

    if (props.error && showError) {
        return(
            <div className={ cls.join(' ') } id="message">
                <div className="message__text">{ props.error }</div>
                <button onClick={ () => setShowError(false) }>
                    <FontAwesomeIcon icon="times" className="times"/>
                </button>
            </div>
        )
    } else {
        return null
    }
}

function mapStateToProps(state) {
    return {
        error: state.auth.error
    }
}

function mapDispatchToProps(dispath) {
    return {
        delError: () => dispath(delError())
    }
}

export default connect (mapStateToProps, mapDispatchToProps)(Message)
