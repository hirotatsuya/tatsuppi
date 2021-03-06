import React, { Component } from 'react'
import firebase from 'firebase'
import moment from 'moment'

import {
  FlatButton,
  RaisedButton,
  TextField,
  Dialog,
  Card,
  CardText,
  CardActions,
} from 'material-ui'

const styles = {
  root: {
    padding: '65px 1vw 65px',
    width: '98vw',
  },
  full: {
    width: '100vw',
  },
}

export default class Contact extends Component {
  state = {
    auth: firebase.auth().currentUser,
    dialogFlag: false,
    message: '',
  }

  componentWillMount = () => {
    localStorage.setItem('hash', location.hash.slice(2))
  }

  /**
   * メッセージを送信する処理
   */
  sendMessage = () => {
    const { auth, message } = this.state
    const messageObj = {
      message: message,
      enter_datetime: moment().format(),
      sender_uid: auth.uid,
    }
    firebase.database().ref('message').push(messageObj).then(() => {
      const state = {
        message: 'SEND MESSAGE',
      }
      localStorage.setItem('state', JSON.stringify(state))
      location.href='#home'
    }, err => {
      console.log(err)
    })
  }

  render() {
    const { message, dialogFlag } = this.state

    const disabled = message === ''

    const messageActions = [
      <FlatButton
        label='CANCEL'
        onTouchTap={() => this.setState({dialogFlag: false})}
      />,
      <FlatButton
        label='OK'
        onTouchTap={() => this.sendMessage()}
      />
    ]

    return (
      <div style={styles.root}>
        <Card>
          <CardText>
            <div>Let's send a message to the creator of this application.</div>
            <TextField
              hintText='message'
              floatingLabelText='message'
              multiLine={true}
              fullWidth={true}
              value={message}
              onChange={e => {
                const value = e.target.value
                this.setState({
                  message: value,
                })
              }}
            />
          </CardText>
          <CardActions>
            <RaisedButton
              label='SEND'
              primary={true}
              fullWidth={true}
              disabled={disabled}
              onTouchTap={() => this.setState({dialogFlag: true})}
            />
          </CardActions>
        </Card>
        <Dialog
          title='MESSAGE'
          actions={messageActions}
          open={dialogFlag}
          contentStyle={styles.full}
          onRequestClose={() => this.setState({dialogFlag: false})}
        >
          Are you sure you want to send a message?
        </Dialog>
      </div>
    )
  }
}
