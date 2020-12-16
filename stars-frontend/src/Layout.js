import React from 'react'
import Nav from './components/Navigation'

function Layout(props) {
    return (
        <div className="wrapper">
            <Nav/>
            <main>
                {props.children}
            </main>
        </div>
    )
}

export default Layout
