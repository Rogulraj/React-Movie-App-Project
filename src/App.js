import {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Login from './components/Login'

import Home from './components/Home'
import Popular from './components/Popular'
import Search from './components/Search'
import Account from './components/Account'
import MovieDetails from './components/MovieDetails'
import NotFound from './components/NotFound'

import './App.css'
import ProtectedRoute from './components/ProtectedRoute'

import AppContext from './context/AppContext'

export default class App extends Component {
  state = {username: '', password: '', mobileMenu: false}

  onChangeMobileMenuShow = () => {
    this.setState({
      mobileMenu: true,
    })
  }

  onChangeMobileMenuHide = () => {
    this.setState({
      mobileMenu: false,
    })
  }

  onChangeUsername = event => {
    this.setState({
      username: event.target.value,
    })
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  render() {
    const {username, password, mobileMenu} = this.state
    console.log(username, password)
    return (
      <AppContext.Provider
        value={{
          username,
          password,
          mobileMenu,
          onChangeMobileMenuShow: this.onChangeMobileMenuShow,
          onChangeMobileMenuHide: this.onChangeMobileMenuHide,
          onChangeUsername: this.onChangeUsername,
          onChangePassword: this.onChangePassword,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/popular" component={Popular} />
          <ProtectedRoute exact path="/search" component={Search} />
          <ProtectedRoute exact path="/account" component={Account} />
          <ProtectedRoute exact path="/movies/:id" component={MovieDetails} />
          <Route exact path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </AppContext.Provider>
    )
  }
}
