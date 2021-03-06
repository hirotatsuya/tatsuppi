import React, { Component } from 'react'
import { Route, Switch, Link } from 'react-router-dom'

import Home from './Home'
import Input from './Input'
import Todo from './Todo'
import ForgotPassword from './ForgotPassword'
import CreateAccount from './CreateAccount'
import UpdatePassword from './UpdatePassword'
import UpdateAccount from './UpdateAccount'
import Settings from './Settings'
import Chat from './Chat'
import Match from './Match'
import Contact from './Contact'
import TodoGroup from './TodoGroup'
import Image from './Image'

const styles = {
  root: {
    padding: '65px 1vw 1vh',
    width: '98vw',
  }
}

const NoMatch = location => (
  <div style={styles.root}>
    <span>{location.pathname}というURLは見つかりません</span>
  </div>
)

export default class Routes extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { loginFlag } = this.props

    return (
      <div>
        {loginFlag ?
          <Switch>
            <Route path='/home' component={Home} />
            <Route path='/input' component={Input} />
            <Route path='/todo' component={Todo} />
            <Route path='/updatepassword' component={UpdatePassword} />
            <Route path='/updateaccount' component={UpdateAccount} />
            <Route path='/settings' component={Settings} />
            <Route path='/chat' component={Chat} />
            <Route path='/match' component={Match} />
            <Route path='/contact' component={Contact} />
            <Route path='/todogroup' component={TodoGroup} />
            <Route path='/image' component={Image} />
            <Route render={() => (<Link to='#' />)} />
          </Switch> :
          <Switch>
            <Route path='/forgotpassword' component={ForgotPassword} />
            <Route path='/createaccount' component={CreateAccount} />
            <Route render={() => (<Link to='#' />)} />
          </Switch>}
      </div>
    )
  }
}
