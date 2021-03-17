import React from 'react'
import '../Modal.sass'
import Button from '../../UI/Button'

export default function WarningMsg(props) {
	return (
		<div className="modal">
			<div className="modal__dialog">
				<div className="modal__main">
					<h3 style={{textAlign: 'center'}}>{ props.msg }</h3>
					<div className="warning-btns">
						<Button onClick={() => props.onShow()} cls="gray button-s">{ props.cancel || "Отменить" }</Button>
						<Button onClick={() => {props.action(); props.onShow()}} cls="red button-s">{ props.accept || "Принять" }</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
