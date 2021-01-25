import React from 'react'
import './Button.sass'

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
		</button>
	)
}

export default Button
