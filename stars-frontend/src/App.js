import React, { useEffect } from 'react'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import './App.sass'
import { connect } from 'react-redux'
import Layout from './Layout'
import Dashboard from './pages/Dashboard'
import Main from './pages/Main'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import Auth from './pages/Auth'
import Loading from './components/UI/Loading'

function App(props) {

  useEffect(() => {}, [props.isAuthenticated, props.isLoaded])

  var routers = (
    <Switch>
      <Route exact path='/auth' component={Auth} />
      <Route exact path='/' component={Main} />
      <Route exact path='/404' component={NotFound} />
      <Route path='/profile/:id' component={Profile} />
      <Redirect from='/dashboard' to='/auth' />
      <Redirect from='/settings' to='/auth' />
      <Redirect from='*' to='/404' />
    </Switch>
  )

  if (!props.isAuthenticated) {
    routers = (
      <Switch>
        <Route exact path='/dashboard' component={Dashboard} />
        <Route exact path='/' component={Main} />
        <Route exact path='/settings' component={Settings} />
        <Route exact path='/404' component={NotFound} />
        <Route path='/profile/:id' component={Profile} />
        <Redirect to='/' />
        <Redirect from='*' to='/404' />
      </Switch>
    )
  }

    if (!props.isLoaded) return <Loading />
    return (
      <Layout>
        { routers }
      </Layout>
    )
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.firebase.auth.isEmpty,
    isLoaded: state.firebase.auth.isLoaded
  }
}

export default connect(mapStateToProps, null)(withRouter(App))
