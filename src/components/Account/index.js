import {Component} from 'react'
import Cookies from 'js-cookie'

import Header from '../Header'
import Footer from '../Footer'
import AppContext from '../../context/AppContext'
import './index.css'

export default class Account extends Component {
  logoutTriggered = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    localStorage.removeItem('userDetails')
    history.replace('/login')
  }

  render() {
    return (
      <AppContext.Consumer>
        {value => {
          const {username, password} = value

          return (
            <div className="account-container">
              <Header />
              <div className="account-card">
                <h1 className="account-heading">Account</h1>
                <hr />
                <div className="member-ship-card">
                  <p className="member-ship-heading">Member ship</p>
                  <div>
                    <p className="member-ship-user-name">{username}</p>
                    <p className="member-ship-password">
                      Password: {'*'.repeat(password.length)}
                    </p>
                  </div>
                </div>
                <hr />
                <div className="plan-card">
                  <p className="plan-heading">Plan Details</p>
                  <div className="plan-details-card">
                    <p className="plan-type">Premium</p>
                    <p className="plan-type-details">Ultra HD</p>
                  </div>
                </div>
                <hr />
                <div className="log-out-card">
                  <button
                    type="button"
                    onClick={this.logoutTriggered}
                    className="log-out-button"
                  >
                    Logout
                  </button>
                </div>
              </div>
              <Footer />
            </div>
          )
        }}
      </AppContext.Consumer>
    )
  }
}
