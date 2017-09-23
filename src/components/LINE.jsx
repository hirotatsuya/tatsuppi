import React, { Component } from 'react'
import firebase from 'firebase'

import {
  FlatButton,
} from 'material-ui'

const styles = {
  root: {
    padding: '65px 1vw 1vh',
    width: '98vw',
  },
  error: {
    color: 'red',
  },
  center: {
    textAlign: 'center',
  },
  full: {
    width: '100vw',
  },
}

export default class UpdateAccount extends Component {

  render() {
    return (
      <div style={styles.root}>
        <FlatButton
          label='LINEの友達の追加'
          href='https://line.me/R/ti/p/%40ond8714j'
          style={styles.full}
        />
      </div>
    )
  }
}
