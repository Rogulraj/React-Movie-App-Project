import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const popularApi = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failed: 'FAILED',
}

export default class Popular extends Component {
  state = {popularApiStatus: popularApi.initial, popularVideoList: []}

  componentDidMount() {
    this.processingPopularApi()
  }

  processingPopularApi = async () => {
    this.setState({
      popularApiStatus: popularApi.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis.ccbp.in/movies-app/popular-movies'
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
        popularApiStatus: popularApi.success,
        popularVideoList: formattedData,
      })
    } else {
      this.setState({
        popularApiStatus: popularApi.failed,
        popularVideoList: [],
      })
    }
  }

  renderLoader = () => (
    <div className="popular-loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderPopularVideoFailedView = () => (
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
        onClick={this.processingPopularApi}
        className="failure-view-try-again-button"
      >
        Try Again
      </button>
    </div>
  )

  renderPopularVideo = () => {
    const {popularVideoList} = this.state
    return (
      <>
        <ul className="popular-video-list">
          {popularVideoList.map(each => {
            const {posterPath, title, id} = each
            return (
              <li key={id} className="popular-video-list-item">
                <Link to={`/movies/${id}`}>
                  <img
                    src={posterPath}
                    alt={title}
                    className="popular-video-image"
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      </>
    )
  }

  showPopularVideoCurrentStatus = () => {
    const {popularApiStatus} = this.state

    switch (popularApiStatus) {
      case popularApi.inProgress:
        return this.renderLoader()
      case popularApi.success:
        return this.renderPopularVideo()
      case popularApi.failed:
        return this.renderPopularVideoFailedView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="popular-container">
        <Header />
        {this.showPopularVideoCurrentStatus()}
        <Footer />
      </div>
    )
  }
}
