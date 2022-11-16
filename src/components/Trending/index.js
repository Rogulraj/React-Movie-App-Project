import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Slider from 'react-slick'
import {BsPatchExclamationFill} from 'react-icons/bs'

import './index.css'

const trendingApi = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failed: 'FAILED',
}

export default class Trending extends Component {
  state = {trendingApiStatus: trendingApi.initial, trendingList: []}

  componentDidMount() {
    this.processingTrendingApi()
  }

  processingTrendingApi = async () => {
    this.setState({
      trendingApiStatus: trendingApi.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/trending-movies'
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
        overview: each.overview,
        posterPath: each.poster_path,
        title: each.title,
      }))
      this.setState({
        trendingApiStatus: trendingApi.success,
        trendingList: formattedData,
      })
    } else {
      this.setState({
        trendingApiStatus: trendingApi.failed,
        trendingList: [],
      })
    }
  }

  renderLoader = () => (
    <div className="trending-loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderTrendingVideo = () => {
    const {trendingList} = this.state

    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 3000,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1800,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1120,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 920,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 475,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    }

    return (
      <Slider {...settings}>
        {trendingList.map(each => {
          const {id, posterPath, title} = each

          return (
            <div className="slick-item" key={id}>
              <Link to={`/movies/${id}`}>
                <img className="logo-image" src={posterPath} alt={title} />
              </Link>
            </div>
          )
        })}
      </Slider>
    )
  }

  renderTrendingFailed = () => (
    <div className="trending-failed-view">
      <img
        src=<BsPatchExclamationFill size={25} color="#D81F26" />
        alt="failure view"
      />

      <p className="trending-error-msg">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        onClick={this.processingTrendingApi}
        className="trending-try-again-button"
      >
        Try Again
      </button>
    </div>
  )

  showTrendingCurrentStatus = () => {
    const {trendingApiStatus} = this.state

    switch (trendingApiStatus) {
      case trendingApi.inProgress:
        return this.renderLoader()
      case trendingApi.success:
        return this.renderTrendingVideo()
      case trendingApi.failed:
        return this.renderTrendingFailed()
      default:
        return null
    }
  }

  render() {
    return <div>{this.showTrendingCurrentStatus()}</div>
  }
}
