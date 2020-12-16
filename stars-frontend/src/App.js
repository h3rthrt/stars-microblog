import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import './App.sass'
import Layout from './Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Layout>
      <Switch>
        <Route exact path='/home' component={Home} />
        <Route path='/404' component={NotFound} />
        <Redirect from='*' to='/404' />
      </Switch>
    </Layout>
  )
}

export default App
