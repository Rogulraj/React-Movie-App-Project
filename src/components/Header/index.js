import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'

import {HiOutlineSearch} from 'react-icons/hi'
import {CgPlayList} from 'react-icons/cg'
import {IoIosCloseCircle} from 'react-icons/io'

import AppContext from '../../context/AppContext'

import './index.css'

class Header extends Component {
  state = {searchInput: ''}

  onChangeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  searchButtonTriggered = () => {
    const {searchInput} = this.state
    const {gettingSearchInput} = this.props
    gettingSearchInput(searchInput)
  }

  render() {
    return (
      <AppContext.Consumer>
        {value => {
          const {
            mobileMenu,
            onChangeMobileMenuHide,
            onChangeMobileMenuShow,
          } = value

          const showMenuBars = () => (
            <div className="show-menu-container">
              <ul className="show-menu-card">
                <li className="menu-list-item">
                  <Link to="/" className="nav-link-el nav-menu-list-button">
                    Home
                  </Link>
                </li>
                <li className="menu-list-item">
                  <Link
                    to="/popular"
                    className="nav-link-el nav-menu-list-button"
                  >
                    Popular
                  </Link>
                </li>
                <li className="menu-list-item">
                  <Link
                    to="/account"
                    className="nav-link-el nav-menu-list-button "
                  >
                    Account
                  </Link>
                </li>
              </ul>
              <button onClick={onChangeMobileMenuHide} type="button">
                <IoIosCloseCircle size={25} color="#FFFFFF" />
              </button>
            </div>
          )

          const {searchInput} = this.state
          const {match} = this.props
          const {path} = match

          return (
            <nav className="nav-bg">
              <div className="nav-container">
                <div className="nav-logo-text-card">
                  <Link to="/">
                    <img
                      src="https://res.cloudinary.com/dy0mnmvem/image/upload/v1667983981/Movie-app-react-js/Group_7399sm-movie-log_uytht7.png"
                      alt="website logo"
                      className="nav-website-logo"
                    />
                  </Link>
                  <ul className="nav-home-population-card">
                    <li className="menu-list-item">
                      <Link to="/" className="nav-link-el nav-menu-list-button">
                        Home
                      </Link>
                    </li>
                    <li className="menu-list-item">
                      <Link
                        to="/popular"
                        className="nav-link-el nav-menu-list-button"
                      >
                        Popular
                      </Link>
                    </li>
                  </ul>
                </div>
                <ul className="nav-icon-card">
                  {path !== '/search' && (
                    <li className="nav-search-icon">
                      <Link to="/search" className="nav-link-el">
                        <HiOutlineSearch size={25} color="#FFFFFF" />
                      </Link>
                    </li>
                  )}
                  {path === '/search' && (
                    <li>
                      <div className="search-input-card">
                        <input
                          type="search"
                          placeholder="Search"
                          className="search-input-field"
                          onChange={this.onChangeSearchInput}
                          value={searchInput}
                        />
                        <button
                          testid="searchButton"
                          type="button"
                          onClick={this.searchButtonTriggered}
                          className="search-input-button"
                        >
                          <HiOutlineSearch size={17} color="#FFFFFF" />
                        </button>
                      </div>
                    </li>
                  )}
                  <li className="nav-menu-icon">
                    <CgPlayList
                      onClick={onChangeMobileMenuShow}
                      size={30}
                      color="#FFFFFF"
                    />
                  </li>
                  <li>
                    <Link to="/account">
                      <img
                        src="https://res.cloudinary.com/dy0mnmvem/image/upload/v1668017402/Movie-app-react-js/Avatarboy-avatar_ps7djs.png"
                        alt="profile"
                        className="nav-profile-image"
                      />
                    </Link>
                  </li>
                </ul>
              </div>
              {mobileMenu && showMenuBars()}
            </nav>
          )
        }}
      </AppContext.Consumer>
    )
  }
}
export default withRouter(Header)
