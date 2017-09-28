import React, { Component } from 'react'
import firebase from 'firebase'
import moment from 'moment'

import {
  DatePicker,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  Card,
  CardText,
  Snackbar,
} from 'material-ui'

import Detail from './Detail'

const styles = {
  root: {
    padding: '65px 1vw 65px',
    width: '98vw',
  },
  text: {
    textAlign: 'center',
  },
  card: {
    padding: '1vh 1vw',
  },
  snackbar: {
    height: '60px',
  },
}

export default class Home extends Component {
  state = {
    auth: firebase.auth().currentUser,
    useArray: [],
    detailFlag: false,
    inputFlag: null,
  }

  componentWillMount = () => {
    const { auth } = this.state
    const state = {
      state: location.hash.slice(2),
    }
    firebase.database().ref('users/' + auth.uid).update(state)
  }

  componentDidMount = () => {
    const { auth } = this.state
    this.useRef = firebase.database().ref('use/' + auth.uid)
    this.stateRef = firebase.database().ref('state/' + auth.uid)
    this.useRef.on('value', use => {
      if (use.val() !== null) {
        this.setState({
          use: use,
          inputFlag: true,
        })
        let [date, message] = [new Date(moment()), '']
        this.stateRef.once('value', state => {
          if (state.val() !== null) {
            if (state.val().date !== undefined) {
              date = new Date(state.val().date)
              this.setState({
                date: date,
              })
            }
            if (state.val().message !== undefined) {
              message = state.val().message
              this.setState({
                message: message,
              })
            }
            this.stateRef.remove()
          }
          this.setState({
            date: date,
            message: message,
          })
          this.changeAll(date, use)
        })
      } else {
        this.setState({
          inputFlag: false,
        })
      }
    })
  }

  componentWillUnmount = () => {
    this.useRef.off('value')
  }

  /**
   * 更新があった時の処理
   */
  changeAll = (date, use) => {
    const _date = moment(date).format('YYYY-MM-DD')
    this.getUse(_date, use)
    this.getTotalMoneyByDate(_date, use)
    this.getTotalMoneyByMonth(_date, use)
  }

  /**
   * 使ったお金一覧の取得
   */
  getUse = (date, use) => {
    let [useVal, useArray] = [use.val(), []]
    Object.keys(useVal).forEach(snapshot => {
      if (date === useVal[snapshot].date) {
        let obj = useVal[snapshot]
        obj.id = snapshot
        useArray.push(obj)
      }
    })
    this.setState({
      useArray: useArray,
    })
  }

  /**
   * 一日の使ったお金の合計の取得
   */
  getTotalMoneyByDate = (date, use) => {
    let totalMoneyByDate = 0
    use.forEach(snapshot => {
      if (date === snapshot.val().date) {
        totalMoneyByDate += parseInt(snapshot.val().money)
      }
    })
    this.setState({
      totalMoneyByDate: totalMoneyByDate,
    })
  }

  /**
   * 一月の使ったお金の合計の取得
   */
  getTotalMoneyByMonth = (date, use) => {
    let totalMoneyByMonth = 0
    use.forEach(snapshot => {
      if (moment(date).format('M') === moment(snapshot.val().date).format('M')) {
        totalMoneyByMonth += parseInt(snapshot.val().money)
      }
    })
    this.setState({
      totalMoneyByMonth: totalMoneyByMonth,
    })
  }

  /**
   * 日付を変更したときの処理
   */
  changeDate = date => {
    const { use } = this.state
    this.changeAll(date, use)
    this.setState({
      date: date,
    })
  }

  /**
   * セルのタッチによる処理
   */
  goToDetail = id => {
    const props = {
      changeDetailFlag: this.changeDetailFlag,
      id: id,
    }
    this.setState({
      props: props,
    })
    this.changeDetailFlag()
  }

  /**
   * ホームと詳細画面を行き来する処理
   */
  changeDetailFlag = () => {
    const { detailFlag } = this.state
    this.setState({
      detailFlag: !detailFlag,
    })
  }

  render() {
    const {
      useArray,
      date,
      totalMoneyByMonth,
      totalMoneyByDate,
      detailFlag,
      props,
      inputFlag,
      message,
    } = this.state

    const [todayMonth, setMonth] = [
      moment().format('YYYYMM'),
      moment(date).format('YYYYMM')
    ]

    const [todayDate, setDate] = [
      moment().format('YYYYMMDD'),
      moment(date).format('YYYYMMDD')
    ]

    return (
      <div style={styles.root}>
        <Card>
          {inputFlag !== null ?
            inputFlag ? <div>
              {!detailFlag ? <div>
                <CardText>
                  <DatePicker
                    hintText='import date'
                    floatingLabelText='import date'
                    autoOk={true}
                    fullWidth={true}
                    value={date}
                    onChange={(a, date) => this.changeDate(date)}
                  />
                  <div>
                    {todayMonth === setMonth ? '今月' : moment(date).format('M月')}の合計金額: {totalMoneyByMonth}円 / 月
                  </div>
                  <div>
                    {todayDate === setDate ? '本日' : moment(date).format('D日')}の合計金額: {totalMoneyByDate}円 / 日
                  </div>
                </CardText>
                {totalMoneyByDate !== 0 ? <div style={styles.card}>
                  <Card>
                    <Table>
                      <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                      >
                        <TableRow>
                          <TableHeaderColumn><span style={styles.text}>target</span></TableHeaderColumn>
                          <TableHeaderColumn><span style={styles.text}>money</span></TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody
                        showRowHover={true}
                        displayRowCheckbox={false}
                      >
                        {useArray.map((row, index) => {
                          return (
                            <TableRow
                              key={index}
                              onTouchTap={() => this.goToDetail(row.id)}
                            >
                              <TableRowColumn><span style={styles.text}>{row.target}</span></TableRowColumn>
                              <TableRowColumn><span style={styles.text}>{row.money + ' 円'}</span></TableRowColumn>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </Card></div> : <CardText>
                  {todayDate === setDate ? '本日' : moment(date).format('D日')}はまだお金を使っていません
                </CardText>}
              </div> : <Detail props={props} />}
            </div> : <CardText>家計簿を付けましょう</CardText>
            : null}
        </Card>
        {message !== undefined ?
          <Snackbar
            open={message !== ''}
            message={message}
            autoHideDuration={3000}
            bodyStyle={styles.snackbar}
            onRequestClose={() => this.setState({ message: '' })}
          /> : null}
      </div>
    )
  }
}
