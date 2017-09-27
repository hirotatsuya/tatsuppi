import React, { Component } from 'react'
import firebase from 'firebase'

import {
  FlatButton,
  Card,
  CardHeader,
  CardText,
  CardActions,
  Dialog,
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
} from 'material-ui'

import colors from './colors'

const styles = {
  card: {
    textAlign: 'center',
  },
  button: {
    width: '40vw',
  },
  dialog: {
    width: '100vw',
  },
  tertiary: {
    color: colors.tertiaryColor,
  }
}

export default class Detail extends Component {
  state = {
    dialogFlag: false,
    auth: firebase.auth().currentUser,
  }

  constructor(props) {
    super(props)
  }

  componentWillMount = () => {
    this.setState({
      id: this.props.props.id,
    })
  }

  componentDidMount = () => {
    const { auth, id } = this.state
    this.useRef = firebase.database().ref('use/' + auth.uid + '/' + id)
    this.useRef.on('value', snapshot => {
      this.setState({
        use: snapshot.val(),
      })
    })
  }

  componentWillUnmount = () => {
    this.useRef.off('value')
  }

  /**
   * 使ったお金の削除
   */
  deleteUse = () => {
    const { auth, deleteId, use } = this.state
    this.setState({
      dialogFlag: false,
    })
    firebase.database().ref('use/' + auth.uid + '/' + deleteId).remove().then(() => {
      const state = {
        date: use.date,
        message: 'DELETED INPUT'
      }
      firebase.database().ref('state/' + auth.uid).set(state).then(() => {
        this.changeDetailFlag()
      }, err => {
        console.log(err)
      })
    }, err => {
      console.log(err)
    })
  }

  /**
   * コンポーネントを切り替える処理
   */
  changeDetailFlag = () => {
    this.props.props.changeDetailFlag()
  }

  render() {
    const {
      use,
      id,
      dialogFlag,
    } = this.state

    const deleteActions = [
      <FlatButton
        label='cancel'
        secondary={true}
        onTouchTap={() => this.setState({dialogFlag: false})}
      />,
      <FlatButton
        label='OK'
        primary={true}
        onTouchTap={() => this.deleteUse()}
      />
    ]

    return (
      <div>
        {use !== undefined && use !== null ? <span>
          <Card>
            <CardHeader
              title={use.target}
              subtitle={use.date}
            />
            <CardActions>
              <div style={styles.card}>
                <FlatButton
                  label='EDIT'
                  labelStyle={styles.tertiary}
                  style={styles.button}
                  onTouchTap={() => this.changeDetailFlag()}
                />
                <span> </span>
                <FlatButton
                  label='DELETE'
                  primary={true}
                  style={styles.button}
                  onTouchTap={() => (
                    this.setState({
                      dialogFlag: true,
                      deleteId: id,
                    })
                  )}
                />
              </div>
            </CardActions>
            <CardText>
              <Card>
                <Table
                  selectable={false}
                >
                  <TableBody
                    displayRowCheckbox={false}
                  >
                    <TableRow>
                      <TableRowColumn>money</TableRowColumn>
                      <TableRowColumn>{use.money} yen</TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn>how to pay</TableRowColumn>
                      <TableRowColumn>{use.pay}</TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn>type</TableRowColumn>
                      <TableRowColumn>{use.type}</TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </CardText>
            <CardActions>
              <FlatButton
                label='RETURN'
                secondary={true}
                fullWidth={true}
                onTouchTap={() => this.changeDetailFlag()}
              />
            </CardActions>
          </Card>
        </span> : null}
        <Dialog
          title='DELETE'
          actions={deleteActions}
          modal={true}
          open={dialogFlag}
          contentStyle={styles.dialog}
          onRequestClose={() => this.setState({dialogFlag: false})}
        >
          Are you sure you want to delete ?
        </Dialog>
      </div>
    )
  }
}
