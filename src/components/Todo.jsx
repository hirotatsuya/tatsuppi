import React, { Component } from 'react'
import firebase from 'firebase'
import moment from 'moment'

import {
  TextField,
  FlatButton,
  RaisedButton,
  Dialog,
  Card,
  CardHeader,
  CardText,
  CardActions,
} from 'material-ui'

const styles = {
  root: {
    padding: '65px 1vw 1vh',
    width: '98vw',
  },
  error: {
    color: 'red',
  },
  card: {
    padding: '1vh 1vw',
    width: '96vw',
    center: {
      textAlign: 'center',
    },
  },
  button: {
    width: '40vw',
  },
  dialog: {
    width: '100vw',
  },
}

export default class Todo extends Component {
  state = {
    title: '',
    text: '',
    addFlag: false,
    editFlag: false,
    deleteFlag: false,
    sortFlag: true,
  }

  componentWillMount = () => {
    this.setState({
      authUid: firebase.auth().currentUser.uid,
    })
  }

  componentDidMount = () => {
    const { authUid } = this.state
    this.todosRef = firebase.database().ref('todos/' + authUid)
    this.todosRef.on('value', snapshots => {
      this.getTodos(snapshots.val())
    })
  }

  componentWillUnmount = () => {
    this.todosRef.off('value')
  }

  /**
   * Todoリストの取得
   */
  getTodos = todos => {
    let todosArray = []
    if (todos) {
      Object.keys(todos).forEach(snapshot => {
        let todo = todos[snapshot]
        todo.id = snapshot
        todosArray.push(todo)
      })
      const { sortFlag } = this.state
      todosArray = this.sortDateTime(todosArray, sortFlag)
    }
    this.setState({
      todosArray: todosArray,
    })
  }

  /**
   * 時間のソート処理
   */
  sortDateTime = (array, flag) => {
    let sortArray = []
    sortArray = array.sort((before, after) => {
      if (before.datetime < after.datetime) {
        return (flag ? 1 : -1)
      } else if (before.datetime > after.datetime) {
        return (flag ? -1 : 1)
      } else {
        return 0
      }
    })
    return sortArray
  }

  /**
   * Todoの追加
   */
  addTodo = () => {
    const { title, text } = this.state
    const dateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const todoObj = {
      title: title,
      datetime: dateTime,
      text: text,
      enter_datetime: firebase.database.ServerValue.TIMESTAMP,
    }
    this.todosRef.push(todoObj).then(() => {
      this.clearTodoForm()
    }, err => {
      console.log(err)
    })
    this.setState({
      addFlag: false,
    })
  }

  /**
   * Todoの編集
   */
  editTodo = () => {
    const { title, text, authUid, editId } = this.state
    const dateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const editObj = {
      title: title,
      datetime: dateTime,
      text: text,
    }
    firebase.database().ref('todos/' + authUid + '/' + editId).update(editObj).then(() => {
      this.clearTodoForm()
    }, err => {
      console.log(err)
    })
    this.setState({
      editFlag: false,
    })
  }

  /**
   * Todoの削除
   */
  deleteTodo = () => {
    const { authUid, deleteId } = this.state
    firebase.database().ref('todos/' + authUid + '/' + deleteId).remove().then(() => {
      // Todo
    }, err => {
      console.log(err)
    })
    this.setState({
      deleteFlag: false,
    })
  }

  /**
   * TodoFormのリセット
   */
  clearTodoForm = () => {
    this.setState({
      title: '',
      text: '',
    })
  }

  /**
   * 改行の置き換え
   */
  replaceStr = str => {
    const replacedStr = str.replace('\n', '\n')
    return replacedStr
  }

  /**
   * Todoの入力フォーム
   */
  TodoForm = () => {
    const { title, text, addFlag, editFlag } = this.state

    return (
      <div>
        <Card>
          <CardHeader
            title={addFlag ? <div>ADD TODO</div> : editFlag ? <div>EDIT TODO</div> : null}
          />
          <CardText>
            <TextField
              hintText='title'
              floatingLabelText='title'
              fullWidth={true}
              value={title}
              onChange={e => {
                const value = e.target.value
                this.setState({
                  title: value,
                })
              }}
            />
            <br />
            <TextField
              hintText='text'
              floatingLabelText='text'
              multiLine={true}
              fullWidth={true}
              value={text}
              onChange={e => {
                const value = e.target.value
                this.setState({
                  text: value,
                })
              }}
            />
          </CardText>
          <CardActions>
            <div style={styles.card.center}>
              {addFlag ? <div>
                <FlatButton
                  label='RETURN'
                  secondary={true}
                  style={styles.button}
                  onTouchTap={() => this.setState({ addFlag: false, })}
                />
                <span> </span>
                <FlatButton
                  label='OK'
                  primary={true}
                  style={styles.button}
                  onTouchTap={() => this.addTodo()}
                />
              </div> : editFlag ? <div>
                <FlatButton
                  label='RETURN'
                  secondary={true}
                  style={styles.button}
                  onTouchTap={() => this.setState({ editFlag: false, })}
                />
                <span> </span>
                <FlatButton
                  label='OK'
                  primary={true}
                  style={styles.button}
                  onTouchTap={() => this.editTodo()}
                />
              </div> : null}
            </div>
          </CardActions>
        </Card>
      </div>
    )
  }

  /**
   * ソートのボタン
   */
  SortButton = () => {
    const { todosArray, sortFlag } = this.state
    return (
      <FlatButton
        label={sortFlag ? 'ASCENDING' : 'DESCENDING'}
        primary={sortFlag}
        secondary={!sortFlag}
        style={styles.button}
        onTouchTap={() => {
          this.setState({
            todosArray: this.sortDateTime(todosArray, !sortFlag),
            sortFlag: !sortFlag,
          })
        }}
      />
    )
  }

  render() {
    const {
      todosArray,
      addFlag,
      editFlag,
      deleteFlag,
    } = this.state

    const deleteActions = [
      <FlatButton
        label='CANCEL'
        secondary={true}
        onTouchTap={() => this.setState({ deleteFlag: false, })}
      />,
      <FlatButton
        label='OK'
        primary={true}
        onTouchTap={() => this.deleteTodo()}
      />
    ]

    return (
      <div style={styles.root}>
        <Card>
          {!addFlag && !editFlag ? <div>
            <CardActions>
                <div style={styles.card.center}>
                <this.SortButton />
                <span> </span>
                <RaisedButton
                  label='ADD TODO'
                  style={styles.button}
                  onTouchTap={() => {
                    this.clearTodoForm(),
                    this.setState({ addFlag: true, })
                  }}
                />
              </div>
            </CardActions>
            {todosArray !== undefined && todosArray.length !== 0 ? todosArray.map((row, index) => {
              return (
                <div key={index} style={styles.card}>
                  <Card>
                    <CardHeader
                      title={row.title}
                      subtitle={row.datetime}
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText expandable={true}>
                      {this.replaceStr(row.text)}
                    </CardText>
                    <CardActions expandable={true}>
                      <div style={styles.card.center}>
                        <FlatButton
                          label='DELETE'
                          secondary={true}
                          style={styles.button}
                          onTouchTap={() => {
                            this.setState({
                              deleteFlag: true,
                              deleteId: row.id,
                            })
                          }}
                        />
                        <FlatButton
                          label='EDIT'
                          primary={true}
                          style={styles.button}
                          onTouchTap={() => {
                            this.setState({
                              editFlag: true,
                              editId: row.id,
                              title: row.title,
                              text: row.text,
                            })
                          }}
                        />
                      </div>
                    </CardActions>
                  </Card>
                </div>
              )
            }) : <CardText>There is no Todo</CardText>}
          </div> : <div><this.TodoForm /></div>}
        </Card>
        <Dialog
          title='DELETE'
          actions={deleteActions}
          modal={true}
          open={deleteFlag}
          contentStyle={styles.dialog}
          onRequestClose={() => this.setState({deleteFlag: false,})}
        >
          Can I delete it ?
        </Dialog>
      </div>
    )
  }
}
