import React from 'react'
import { withRouter } from 'react-router'
import Nav from './components/Navigation'

const links = [ 
    {to: '/home', name: 'Лента'}, 
    {to: '/', name: 'Поиск'}, 
    {to: '/profile', name: 'Профиль'},
    {to: '/404', name: 'Страница не найдена :('} 
]

function Layout(props) {
	function renderLocation() {
		return links.map((location) => {
			if (location.to === props.location.pathname) {
				return (
                    <h1 className="headerLocation">
                        {location.name}
                    </h1>
                )
			}
		})
    }
    
	return (
		<div className="wrapper">
			<Nav />
			{renderLocation()}
			<main>{props.children}</main>
		</div>
	)
}

export default withRouter(Layout)
