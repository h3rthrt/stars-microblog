import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import './App.sass'
import { connect } from 'react-redux'
import Layout from './Layout'
import Home from './pages/Home'
import Main from './pages/Main'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import Auth from './pages/Auth'

function App(props) {

  var routers = (
    <Switch>
      <Route path='/auth' component={Auth} />
      <Route exact path='/' component={Main} />
      <Route path='/404' component={NotFound} />
      <Redirect from='*' to='/404' />
    </Switch>
  )

  if (props.isAuthenticated) {
    routers = (
      <Switch>
        <Route path='/home' component={Home} />
        <Route exact path='/' component={Main} />
        <Route path='/profile/:id' component={Profile} />
        <Route path='/settings' component={Settings} />
        <Route path='/404' component={NotFound} />
        <Redirect to='/' />
        <Redirect from='*' to='/404' />
      </Switch>
    )
  }
  return (
    <Layout>
      { routers }
    </Layout>
  )
}

function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.auth.token
  }
}

export default connect(mapStateToProps)(App)
