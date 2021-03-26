import React from 'react'
import { withRouter } from 'react-router'
import Nav from './components/Navigation'
import Message from './components/Message'

function Layout(props) {

	const links = [ 
		{to: '/dashboard', name: 'Лента'}, 
		{to: '/', name: 'Поиск'}, 
		{to: '/404', name: 'Страница не найдена :('},
		{to: `/profile/${props.location.pathname.slice(9)}`, 
			name: '@' + props.location.pathname.slice(9)} 
	]

	function renderLocation() {
		return links.map((location, index) => {
			if (location.to === props.location.pathname) {
				return (
                    <h1 className="header-location" key={index}>
                        {location.name}
                    </h1>
                )
			} else {
				return null
			}
		})
    }
    
	return (
		<div className="wrapper">
			<Nav />
			{renderLocation()}
			<main>{props.children}</main>
			<Message color="error" />
		</div>
	)
}

export default withRouter(Layout)
