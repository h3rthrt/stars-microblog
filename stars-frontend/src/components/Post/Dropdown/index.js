import React, { useRef, useEffect } from 'react'
import { connect } from 'react-redux'

function Dropdown(props) {

	const dropdownRef = useRef()
	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			props.onShow();
		}
	}
	
	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		}
	})

	if (!props.show) return null
	return (
		<div ref={ dropdownRef } className="post__dropdown">
			<span>
				<h4>Дата публикации</h4>
				{ props.createdAt }
			</span>
			{
				props.username === props.displayName &&
				<button onClick={() => {}} >
					Удалить
				</button>
			}
			<button onClick={ () => props.onShow() } >
				Закрыть
			</button>
		</div> 
	)
}

function mapStateToProps(state) {
	return {
		displayName: state.firebase.auth.displayName
	}
}

export default connect(mapStateToProps)(Dropdown)
