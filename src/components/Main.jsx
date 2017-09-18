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
    width: '100vw',
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

  /**
   * ログアウト処理
   */
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

  /**
   * ヘッダーのタイトル変更
   */
  changeTitle = () => {
    let title = ''
    switch (location.hash.slice(2)) {
      case 'home':
        title = 'HOME'
        break
      case 'input':
        title = 'Input'
        break
      case 'todo':
        title = 'Todo'
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
        label='CANCEL'
        onTouchTap={() => this.setState({logoutDialogFlag: false,})}
      />,
      <FlatButton
        label='OK'
        onTouchTap={() => this.logout()}
      />
    ]

    const { title, menuFlag, logoutDialogFlag } = this.state

    return (
      <div>
        {window.onhashchange=this.changeTitle}
        <AppBar
          style={styles.root}
          title={title}
          iconClassNameRight='muidocs-icon-navigation-expand-more'
          onLeftIconButtonTouchTap={() => {
            this.setState({
              menuFlag: !menuFlag,
            })
          }}
        />
        <Drawer
          docked={false}
          width={200}
          open={menuFlag}
          onRequestChange={() => {
            this.setState({
              menuFlag: !menuFlag,
            })
          }}
        >
          <MenuItem
            onTouchTap={() => (this.setState({menuFlag: false}), location.href='#home')}
          >HOME</MenuItem>
          <MenuItem
            onTouchTap={() => (this.setState({menuFlag: false}), location.href='#input')}
          >INPUT</MenuItem>
          <MenuItem
            onTouchTap={() => (this.setState({menuFlag: false}), location.href='#changepassword')}
          >CHANGE PASSWORD</MenuItem>
          <MenuItem
            onTouchTap={() => {
              this.setState({
                menuFlag: false,
              }),
              location.href = '#todo'
            }}
          >Todo</MenuItem>
          <MenuItem
            onTouchTap={() => this.setState({logoutDialogFlag: true})}
          >LOGOUT</MenuItem>
        </Drawer>
        <Dialog
          title='LOGOUT'
          modal={false}
          open={logoutDialogFlag}
          actions={logoutActions}
        >ログアウトしてよろしいですか？
        </Dialog>
      </div>
    )
  }
}
