import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Slider from 'react-slick'
import {BsPatchExclamationFill} from 'react-icons/bs'

import './index.css'

const topRatedApi = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failed: 'FAILED',
}

export default class TopRated extends Component {
  state = {topRatedApiStatus: topRatedApi.initial, topRatedList: []}

  componentDidMount() {
    this.processingTopRatedApi()
  }

  processingTopRatedApi = async () => {
    this.setState({
      topRatedApiStatus: topRatedApi.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis.ccbp.in/movies-app/top-rated-movies'
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
        topRatedApiStatus: topRatedApi.success,
        topRatedList: formattedData,
      })
    } else {
      this.setState({
        topRatedApiStatus: topRatedApi.failed,
        topRatedList: [],
      })
    }
  }

  renderLoader = () => (
    <div className="top-rated-loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderTopRatedVideo = () => {
    const {topRatedList} = this.state

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
        {topRatedList.map(each => {
          const {id, posterPath, title} = each

          return (
            <div className="slick-item" key={id}>
              <Link to={`/movies/${id}`}>
                <img
                  className="top-rated-logo-image"
                  src={posterPath}
                  alt={title}
                />
              </Link>
            </div>
          )
        })}
      </Slider>
    )
  }

  renderTopRatedFailed = () => (
    <div className="top-rated-failed-view">
      <BsPatchExclamationFill size={25} color="#D81F26" />
      <p className="top-rated-error-msg">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        onClick={this.processingTopRatedApi}
        className="top-rated-try-again-button"
      >
        Try Again
      </button>
    </div>
  )

  showTopRatedCurrentStatus = () => {
    const {topRatedApiStatus} = this.state

    switch (topRatedApiStatus) {
      case topRatedApi.inProgress:
        return this.renderLoader()
      case topRatedApi.success:
        return this.renderTopRatedVideo()
      case topRatedApi.failed:
        return this.renderTopRatedFailed()
      default:
        return null
    }
  }

  render() {
    return <div>{this.showTopRatedCurrentStatus()}</div>
  }
}
