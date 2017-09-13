import React, { Component } from 'react'
import firebase from 'firebase'

import {
  AppBar,
  MenuItem,
  Drawer,
  Dialog,
  FlatButton,
} from 'material-ui'

const styles = {
  root: {
    position: 'fixed',
    height: '60px',
    width: '100%',
    backgroundColor: 'pink',
  },
}

export default class Main extends Component {
  state = {
    loginUser: null,
    menuFlag: false,
    logoutDialogFlag: false,
  }

  constructor(props) {
    super(props)
  }

  componentWillMount = () => {
    this.setState({
      loginUser: firebase.auth().currentUser
    })
  }

  componentDidMount = () => {
    firebase.database().ref('users/' + this.state.loginUser.uid).on('value', snapshot => {
      this.setState({
        loginUserName: snapshot.val().name,
      })
    })
  }

  componentWillUnmount = () => {
    firebase.database().ref('users/' + this.state.loginUser.uid).off('value')
  }

  logout = () => {
    firebase.auth().signOut().then(() => {
      this.props.logoutAuth()
    }, err => {
      console.log(err)
    })
    this.setState({
      menuFlag: false,
      logoutDialogFlag: false,
    })
  }

  changeTitle = () => {
    let title = ''
    switch (location.hash.slice(2)) {
      case 'home':
        title = 'HOME'
        break
      case 'createaccount':
        title = 'Create Account'
        break
      case 'forgotpassword':
        title = 'Forgot Password'
        break
      case 'changepassword':
        title = 'Change Password'
        break
      default:
        title = 'default'
        break
    }
    if (title !== 'default') {
      this.setState({
        title: title,
      })
    }
  }

  render() {
    const logoutActions = [
      <FlatButton
        label='cansel'
        onTouchTap={() => this.setState({logoutDialogFlag: false,})}
      />,
      <FlatButton
        label='logout'
        onTouchTap={this.logout}
      />
    ]
    return (
      <div>
        {window.onhashchange=this.changeTitle}
        <AppBar
          title={this.state.title}
          iconClassNameRight='muidocs-icon-navigation-expand-more'
          onLeftIconButtonTouchTap={() => this.setState({menuFlag: !this.state.menuFlag})}
          style={styles.root}
        />
        <Drawer
          docked={false}
          width={200}
          open={this.state.menuFlag}
          onRequestChange={() => this.setState({menuFlag: !this.state.menuFlag})}
        >
          <MenuItem
            onTouchTap={() => (this.setState({menuFlag: false}), location.href='#createaccount')}
          >CreateAccount</MenuItem>
          <MenuItem
            onTouchTap={() => (this.setState({menuFlag: false}), location.href='#forgotpassword')}
          >ForgotPassword</MenuItem>
          <MenuItem
            onTouchTap={() => (this.setState({menuFlag: false}), location.href='#changepassword')}
          >ChangePassword</MenuItem>
          <MenuItem
            onTouchTap={() => this.setState({logoutDialogFlag: true})}
          >Logout</MenuItem>
        </Drawer>
        <Dialog
          title='logout'
          modal={false}
          open={this.state.logoutDialogFlag}
          onRequestClose={() => this.setState({logoutDialogFlag: false})}
          actions={logoutActions}
        >Do you logout? really?
        </Dialog>
      </div>
    )
  }
}
