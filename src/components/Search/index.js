import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

import {HiOutlineSearch} from 'react-icons/hi'

import Header from '../Header'

import './index.css'

const searchApi = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failed: 'FAILED',
}

export default class Search extends Component {
  state = {
    searchApiStatus: searchApi.initial,
    searchList: [],
    userSearchInput: '',
  }

  gettingSearchInput = searchInput => {
    this.setState(
      {
        userSearchInput: searchInput,
      },
      this.processingSearchApi,
    )
  }

  processingSearchApi = async () => {
    this.setState({
      searchApiStatus: searchApi.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const {userSearchInput} = this.state

    const url = `https://apis.ccbp.in/movies-app/movies-search?search=${userSearchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const successData = await response.json()

      const formattedData = successData.results.map(each => ({
        backdropPath: each.backdrop_path,
        id: each.id,
        posterPath: each.poster_path,
        title: each.title,
      }))

      this.setState({
        searchApiStatus: searchApi.success,
        searchList: formattedData,
      })
    } else {
      this.setState({
        searchApiStatus: searchApi.failed,
        searchList: [],
      })
    }
  }

  renderLoader = () => (
    <div className="search-loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderSearchVideoFailedView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/dy0mnmvem/image/upload/v1668150698/Movie-app-react-js/Background-Completelg-something_went_wrong_rrgcyg.png"
        alt="failure view"
        className="failure-view-image"
      />
      <p className="failure-view-description">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        onClick={this.processingSearchApi}
        className="failure-view-try-again-button"
      >
        Try Again
      </button>
    </div>
  )

  renderSearchVideo = () => {
    const {searchList} = this.state
    if (searchList.length === 0) {
      const {userSearchInput} = this.state
      return (
        <div className="no-movie-search-image-card">
          <img
            src="https://res.cloudinary.com/dy0mnmvem/image/upload/v1668227271/Movie-app-react-js/Group_7394noItem_pqdnno.png"
            alt="no movies"
            className="no-movie-search-image"
          />
          <p className="no-movie-search-text">
            {`Your search for ${userSearchInput} did not find any matches.`}
          </p>
        </div>
      )
    }
    return (
      <div>
        <ul className="search-video-list">
          {searchList.map(each => {
            const {posterPath, title, id} = each
            return (
              <li key={id} className="search-video-list-item">
                <Link to={`/movies/${id}`}>
                  <img
                    src={posterPath}
                    alt={title}
                    className="search-video-image"
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  showSearchVideoCurrentStatus = () => {
    const {searchApiStatus} = this.state

    switch (searchApiStatus) {
      case searchApi.inProgress:
        return this.renderLoader()
      case searchApi.success:
        return this.renderSearchVideo()
      case searchApi.failed:
        return this.renderSearchVideoFailedView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="search-container">
        <Header gettingSearchInput={this.gettingSearchInput} />
        {this.showSearchVideoCurrentStatus()}
      </div>
    )
  }
}
