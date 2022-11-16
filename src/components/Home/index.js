import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsPatchExclamationFill} from 'react-icons/bs'

import Header from '../Header'
import Trending from '../Trending'
import TopRated from '../TopRated'
import Originals from '../Originals'
import Footer from '../Footer'

import './index.css'

const homePosterApi = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failed: 'FAILED',
}

export default class Home extends Component {
  state = {homePosterApiStatus: homePosterApi.initial, homePosterDetails: {}}

  componentDidMount() {
    window.scrollTo(0, 0)
    this.processingHomePosterApi()
  }

  processingHomePosterApi = async () => {
    this.setState({
      homePosterApiStatus: homePosterApi.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis.ccbp.in/movies-app/originals'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    console.log(response)
    if (response.ok) {
      const successData = await response.json()
      const randomDetails =
        successData.results[
          Math.floor(Math.random() * successData.results.length)
        ]
      const formattedData = {
        backdropPath: randomDetails.backdrop_path,
        id: randomDetails.id,
        overview: randomDetails.overview,
        posterPath: randomDetails.poster_path,
        title: randomDetails.title,
      }
      this.setState({
        homePosterApiStatus: homePosterApi.success,
        homePosterDetails: formattedData,
      })
    } else {
      this.setState({
        homePosterApiStatus: homePosterApi.failed,
        homePosterDetails: {},
      })
    }
  }

  renderLoader = () => (
    <div className="home-poster-loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderHomePosterFailed = () => (
    <div className="home-poster-failed-view">
      <BsPatchExclamationFill size={30} color="#D81F26" />
      <p className="home-poster-error-msg">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        onClick={this.processingHomePosterApi}
        className="home-poster-try-again-button"
      >
        Try Again
      </button>
    </div>
  )

  renderHomePosterSuccess = () => {
    const {homePosterDetails} = this.state
    return (
      <div
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #fffff333 38%, #181818 99%, #181818 101%, #181818 108.61%), url(${homePosterDetails.posterPath})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
        className="home-bg-image"
        alt={homePosterDetails.title}
      >
        <Header />
        <div className="banner-content">
          <h1 className="banner-title">{homePosterDetails.title}</h1>
          <p className="banner-description">{homePosterDetails.overview}</p>
          <button type="button" className="banner-button">
            Play
          </button>
        </div>
      </div>
    )
  }

  showHomePosterCurrentStatus = () => {
    const {homePosterApiStatus} = this.state

    switch (homePosterApiStatus) {
      case homePosterApi.success:
        return this.renderHomePosterSuccess()
      case homePosterApi.inProgress:
        return this.renderLoader()
      case homePosterApi.failed:
        return this.renderHomePosterFailed()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-container">
        {this.showHomePosterCurrentStatus()}
        <div className="video-containers">
          <h1 className="trending-home-title">Trending Now</h1>
          <Trending />
          <h1 className="originals-home-title">Top Rated</h1>
          <TopRated />
          <h1 className="originals-home-title">Originals</h1>
          <Originals />
        </div>
        <Footer />
      </div>
    )
  }
}
