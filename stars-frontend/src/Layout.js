import React from 'react'
import Nav from './components/Navigation'

function Layout(props) {
    return (
        <div className="wrapper">
            <Nav/>
            <h1 className="headerLocation">Лента</h1>
            <main>
                {props.children}
            </main>
        </div>
    )
}

export default Layout
