import React from 'react'
import './Button.sass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Button(props) {
	var cls = [ 'button' ]
	if (props.color) cls.push(props.color)
	if (props.cls) cls.push(props.cls)

	return (
		<button 
        className={cls.join(' ')} 
		disabled={props.disabled}
		onClick={props.onClick}>
			{props.children}
			{
				props.loading 
					? <FontAwesomeIcon icon="spinner" pulse={'fa-pulse'} /> 
					: null
			}
		</button>
	)
}

export default Button