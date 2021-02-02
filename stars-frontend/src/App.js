import React, { useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import './App.sass'
import { connect } from 'react-redux'
import { authState } from './redux/actions/actions'
import Layout from './Layout'
import Home from './pages/Home'
import Main from './pages/Main'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import Auth from './pages/Auth'
import Loading from './components/UI/Loading'

function App(props) {
  useEffect(() => {
    setTimeout(()=> {
      props.authState()
    }, 800)
  },[props])

  var routers = (
    <Switch>
      <Route path='/auth' component={Auth} />
      <Route path='/profile/:id' component={Profile} />
      <Route exact path='/' component={Main} />
      <Route path='/404' component={NotFound} />
      <Redirect from='/home' to='/auth' />
      <Redirect from='/settings' to='/auth' />
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
  if (props.isAuthenticated === '') {
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
    isAuthenticated: state.auth.uid
  }
}

function mapDispatchToProps(dispath) {
  return {
    authState: () => dispath(authState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
