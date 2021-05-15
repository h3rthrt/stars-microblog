import React from 'react'
import { withRouter } from 'react-router'
import Nav from './components/Navigation'
import ReactNotification from 'react-notifications-component'

function Layout(props) {

	const links = [ 
		{ to: '/dashboard', name: 'Лента', class: 'header-location' }, 
		{ to: '/', name: 'Глобальная', class: 'header-location' }, 
		{ to: '/404', name: 'Страница не найдена :(', class: 'header-location' },
		{ to: `/profile/${props.location.pathname.slice(9)}`, name: '@' + props.location.pathname.slice(9), class: 'header-location--profile' },
		{ to: `/search`, name: 'Поиск', class: 'header-location' } 
	]

	function renderLocation() {
		return links.map((location, index) => {
			if (location.to === props.location.pathname) {
				return (
                    <h1 className={ location.class } key={index}>
                        { location.name }
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
				{ renderLocation() }
				<main>{props.children}</main>
			</div>
		</>
	)
}

export default withRouter(Layout)
