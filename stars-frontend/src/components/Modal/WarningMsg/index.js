import React from 'react'
import '../Modal.sass'
import Button from '../../UI/Button'

export default function WarningMsg(props) {
	return (
		<div className="modal">
			<div className="modal__dialog">
				<div className="modal__main">
					<h2>{ props.msg }</h2>
					<Button onClick={() => props.onShow()} cls="gray button-l">{ props.cancel || "Отменить" }</Button>
					<Button onClick={() => {props.action(); props.onShow()}} cls="red button-l">{ props.accept || "Принять" }</Button>
				</div>
			</div>
		</div>
	)
}
