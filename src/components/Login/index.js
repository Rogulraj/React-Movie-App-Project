import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import AppContext from '../../context/AppContext'

import './index.css'

export default class Login extends Component {
  state = {errorMessage: ''}

  render() {
    return (
      <AppContext.Consumer>
        {value => {
          const {username, password, onChangePassword, onChangeUsername} = value

          const onSubmitTriggered = async event => {
            event.preventDefault()

            const userDetails = {username, password}
            const url = 'https://apis.ccbp.in/login'
            const options = {
              method: 'POST',
              body: JSON.stringify(userDetails),
            }

            const response = await fetch(url, options)
            if (response.ok) {
              const fetchData = await response.json()
              this.setState({
                errorMessage: '',
              })
              const jwtToken = fetchData.jwt_token
              const {history} = this.props
              Cookies.set('jwt_token', jwtToken, {expires: 1})
              history.replace('/')
            } else {
              const fetchData = await response.json()
              const errorMsg = fetchData.error_msg
              this.setState({
                errorMessage: errorMsg,
              })
            }
          }

          const jwtToken = Cookies.get('jwt_token')

          if (jwtToken !== undefined) {
            return <Redirect to="/" />
          }
          const {errorMessage} = this.state

          return (
            <div className="login-container">
              <img
                src="https://res.cloudinary.com/dy0mnmvem/image/upload/v1667983981/Movie-app-react-js/Group_7399sm-movie-log_uytht7.png"
                alt="login website logo"
                className="login-logo-image"
              />
              <div className="login-card">
                <form className="login-form-card" onSubmit={onSubmitTriggered}>
                  <h1 className="login-heading">Login</h1>
                  <div className="user-name-card">
                    <label htmlFor="user-name-id" className="login-form-label">
                      USERNAME
                    </label>
                    <br />
                    <input
                      type="text"
                      id="user-name-id"
                      className="username-input-field"
                      onChange={onChangeUsername}
                      value={username}
                    />
                  </div>
                  <div className="password-card">
                    <label htmlFor="password-id" className="login-form-label">
                      PASSWORD
                    </label>
                    <br />
                    <input
                      type="password"
                      id="password-id"
                      className="password-input-field"
                      onChange={onChangePassword}
                      value={password}
                    />
                  </div>
                  <p className="login-error-msg">
                    {errorMessage === '' ? '' : errorMessage}
                  </p>
                  <button type="submit" className="login-button">
                    Login
                  </button>
                </form>
              </div>
            </div>
          )
        }}
      </AppContext.Consumer>
    )
  }
}
