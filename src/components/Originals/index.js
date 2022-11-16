import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Slider from 'react-slick'

import {BsPatchExclamationFill} from 'react-icons/bs'

import './index.css'

const originalsApi = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failed: 'FAILED',
}

export default class Originals extends Component {
  state = {originalsApiStatus: originalsApi.initial, originalsList: []}

  componentDidMount() {
    this.processingOriginalsApi()
  }

  processingOriginalsApi = async () => {
    this.setState({
      originalsApiStatus: originalsApi.inProgress,
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
        originalsApiStatus: originalsApi.success,
        originalsList: formattedData,
      })
    } else {
      this.setState({
        originalsApiStatus: originalsApi.failed,
        originalsList: [],
      })
    }
  }

  renderLoader = () => (
    <div className="originals-loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderOriginalsVideo = () => {
    const {originalsList} = this.state

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
        {originalsList.map(each => {
          const {id, posterPath, title} = each

          return (
            <div className="slick-item" key={id}>
              <Link to={`/movies/${id}`}>
                <img src={posterPath} alt={title} className="logo-image" />
              </Link>
            </div>
          )
        })}
      </Slider>
    )
  }

  renderTrendingFailed = () => (
    <div className="originals-failed-view">
      <img
        src=<BsPatchExclamationFill size={25} color="#D81F26" />
        alt="failure view"
      />

      <p className="originals-error-msg">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        onClick={this.processingOriginalsApi}
        className="originals-try-again-button"
      >
        Try Again
      </button>
    </div>
  )

  showOriginalsCurrentStatus = () => {
    const {originalsApiStatus} = this.state

    switch (originalsApiStatus) {
      case originalsApi.inProgress:
        return this.renderLoader()
      case originalsApi.success:
        return this.renderOriginalsVideo()
      case originalsApi.failed:
        return this.renderTrendingFailed()
      default:
        return null
    }
  }

  render() {
    return <div>{this.showOriginalsCurrentStatus()}</div>
  }
}
