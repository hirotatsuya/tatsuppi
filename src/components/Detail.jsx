import React, { Component } from 'react'
import firebase from 'firebase'

import {
  FlatButton,
  RaisedButton,
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
import DetailEdit from './DetailEdit'

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
    auth: firebase.auth().currentUser,
    dialogFlag: false,
    editFlag: false,
  }

  constructor(props) {
    super(props)
  }

  componentWillMount = () => {
    localStorage.setItem('hash', location.hash.slice(2))
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
      const promise = 
      Promise.all([localStorage.setItem('state', JSON.stringify(state))]).then(() => {
        this.changeDetailFlag()
      })
    }, err => {
      console.log(err)
    })
  }

  /**
   * ホーム画面に遷移する処理
   */
  changeDetailFlag = () => {
    const { props } = this.props
    props.changeDetailFlag()
  }

  /**
   * 詳細と編集を行き来する処理
   */
  changeEditFlag = () => {
    const { editFlag } = this.state
    this.setState({
      editFlag: !editFlag,
    })
  }

  /**
   * 編集画面に遷移する処理
   */
  goToEdit = () => {
    const { id } = this.state
    const props = {
      changeEditFlag: this.changeEditFlag,
      changeDetailFlag: this.changeDetailFlag,
      id: id,
    }
    this.setState({
      props: props,
    })
    this.changeEditFlag()
  }

  /**
   * 詳細情報画面
   */
  DetailInfo = () => {
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
                <RaisedButton
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
                <span> </span>
                <RaisedButton
                  label='EDIT'
                  backgroundColor={colors.tertiaryColor}
                  labelColor='white'
                  style={styles.button}
                  onTouchTap={() => this.goToEdit()}
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
              <RaisedButton
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
          open={dialogFlag}
          contentStyle={styles.dialog}
          onRequestClose={() => this.setState({dialogFlag: false})}
        >
          Are you sure you want to delete ?
        </Dialog>
      </div>
    )
  }

  render() {
    const { editFlag, props } = this.state

    return (
      <div>
        {editFlag ? <DetailEdit props={props} /> : <this.DetailInfo />}
      </div>
    )
  }
}
