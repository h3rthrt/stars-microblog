import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import './App.sass'
import Layout from './Layout'
import Home from './pages/Home'
import Main from './pages/Main'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Layout>
      <Switch>
        <Route path='/home' component={Home} />
        <Route exact path='/' component={Main} />
        <Route path='/profile' component={Profile} />
        <Route path='/settings' component={Settings} />
        <Route path='/404' component={NotFound} />
        <Redirect from='*' to='/404' />
      </Switch>
    </Layout>
  )
}

export default App
