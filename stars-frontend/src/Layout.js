import React from 'react'
import { withRouter } from 'react-router'
import Nav from './components/Navigation'
import ReactNotification from 'react-notifications-component'

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
		<>
			<ReactNotification />
			<div className="wrapper">
				<Nav />
				{renderLocation()}
				<main>{props.children}</main>
			</div>
		</>
	)
}

export default withRouter(Layout)
