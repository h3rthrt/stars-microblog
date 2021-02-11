import React, { useEffect, useRef, useState } from 'react'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import './App.sass'
import { connect } from 'react-redux'
import { authState } from './redux/actions/actions'
import Layout from './Layout'
import Dashboard from './pages/Dashboard'
import Main from './pages/Main'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import Auth from './pages/Auth'
import Loading from './components/UI/Loading'

function App(props) {
  const loadingAppTimeout = useRef()
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    if(!props.isAuthenticated) {
      loadingAppTimeout.current = setTimeout(() => {
        props.authState()
        if (props.isAuthenticated) {
          setLoader(false)
        }
      }, 500)
    } else {
      setLoader(false)
    }
    return () => {
      clearTimeout(loadingAppTimeout.current)
    }
  },[props])

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

  if (props.isAuthenticated) {
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

  if (loader) {
    return <Loading />
  } else {
    return (
      <Layout>
        { routers }
      </Layout>
    )
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.uid,
    username: state.profile.username
  }
}

function mapDispatchToProps(dispath) {
  return {
    authState: () => dispath(authState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App))
