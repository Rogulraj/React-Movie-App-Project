import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {format} from 'date-fns'
import {Link} from 'react-router-dom'

import {BsPatchExclamationFill} from 'react-icons/bs'

import Header from '../Header'

import Footer from '../Footer'

import AppContext from '../../context/AppContext'

import './index.css'

const movieDetailsApi = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failed: 'FAILED',
}

export default class MovieDetails extends Component {
  state = {movieDetailsApiStatus: movieDetailsApi.initial, movieDetailsList: {}}

  componentDidMount() {
    this.processingMovieDetailsApi()
  }

  processingMovieDetailsApi = async () => {
    this.setState({
      movieDetailsApiStatus: movieDetailsApi.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const successData = await response.json()
      const year = format(
        new Date(successData.movie_details.release_date),
        'yyyy',
      )

      const fullDate = format(
        new Date(successData.movie_details.release_date),
        "dd'th' MMMM yyyy",
      )

      const duration = successData.movie_details.runtime
      const hours = Math.floor(duration / 60)
      const minutes = Math.round((duration / 60 - hours) * 60)

      const formattedData = {
        adult: successData.movie_details.adult,
        backdropPath: successData.movie_details.backdrop_path,
        budget: successData.movie_details.budget,
        genres: successData.movie_details.genres,
        id: successData.movie_details.id,
        overview: successData.movie_details.overview,
        posterPath: successData.movie_details.poster_path,
        releaseDate: fullDate,
        yearOfRelease: year,
        runtime: `${hours}h ${minutes}m`,
        title: successData.movie_details.title,
        voteAverage: successData.movie_details.vote_average,
        voteCount: successData.movie_details.vote_count,
        spokenLanguages: successData.movie_details.spoken_languages.map(
          each => ({
            englishName: each.english_name,
            id: each.id,
          }),
        ),
        similarMovies: successData.movie_details.similar_movies.map(each => ({
          backdropPath: each.backdrop_path,
          posterPath: each.poster_path,
          id: each.id,
          title: each.title,
        })),
      }
      this.setState({
        movieDetailsApiStatus: movieDetailsApi.success,
        movieDetailsList: formattedData,
      })
    } else {
      this.setState({
        movieDetailsApiStatus: movieDetailsApi.failed,
        movieDetailsList: {},
      })
    }
  }

  renderMovieDetailsFailedView = () => (
    <div className="movie-details-failure-view-container">
      <img
        src="https://res.cloudinary.com/dy0mnmvem/image/upload/v1668150698/Movie-app-react-js/Background-Completelg-something_went_wrong_rrgcyg.png"
        alt="failure view"
        className="failure-view-image"
      />
      <p className="movie-details-failure-view-description">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        onClick={this.processingMovieDetailsApi}
        className="movie-details-failure-view-try-again-button"
      >
        Try Again
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="movie-details-loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  showMovieDetailsStatus = () => {
    const {movieDetailsApiStatus} = this.state

    switch (movieDetailsApiStatus) {
      case movieDetailsApi.inProgress:
        return this.renderLoader()
      case movieDetailsApi.failed:
        return this.renderMovieDetailsFailedView()
      default:
        return null
    }
  }

  renderMovieDetailsAndSimilarMovies = () => {
    const {movieDetailsList} = this.state

    return (
      <div>
        <div className="movie-details-card">
          <div className="movie-details-list-card">
            <h1 className="genres-title">Genres</h1>
            <ul className="genres-list">
              {movieDetailsList.genres.map(each => (
                <li key={each.id}>
                  <p className="genres-list-item">{each.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="movie-details-list-card">
            <h1 className="genres-title">Audio Available</h1>
            <ul className="genres-list">
              {movieDetailsList.spokenLanguages.map(each => (
                <li key={each.id}>
                  <p className="genres-list-item">{each.englishName}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="movie-details-list-card">
            <h1 className="genres-title">Rating Count</h1>
            <p className="genres-list-item">{movieDetailsList.voteCount}</p>
            <h1 className="genres-title">Rating Average</h1>
            <p className="genres-list-item">{movieDetailsList.voteAverage}</p>
          </div>
          <div className="movie-details-list-card">
            <h1 className="genres-title">Budget</h1>
            <p className="genres-list-item">{movieDetailsList.budget}</p>
            <h1 className="genres-title">Release Date</h1>
            <p className="genres-list-item">{movieDetailsList.releaseDate}</p>
          </div>
        </div>
        <div className="similar-movie-container">
          <h1 className="similar-movie-title">More like this</h1>
          <ul className="similar-movie-card">
            {movieDetailsList.similarMovies.map(each => (
              <li key={each.id}>
                <Link to={`/movies/${each.id}`}>
                  <img
                    src={each.posterPath}
                    alt={each.title}
                    className="similar-movie-image"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    return (
      <AppContext.Consumer>
        {value => {
          const {username} = value
          const {movieDetailsList} = this.state

          return (
            <div className="movie-details-container">
              <div
                style={
                  movieDetailsList.id !== undefined
                    ? {
                        backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #fffff333 38%, #181818 99%, #181818 101%, #181818 108.61%), url(${movieDetailsList.backdropPath})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                      }
                    : {
                        display: 'none',
                      }
                }
                className="movie-details-banner-image"
              >
                <Header />
                <div className="movie-details-banner-card">
                  <h1 className="movie-details-movie-title">
                    {movieDetailsList.title}
                  </h1>
                  <ul className="movie-duration-year-card">
                    <li className="movie-duration-year-list-item">
                      <p className="movie-details-runtime-year">
                        {movieDetailsList.runtime}
                      </p>
                    </li>
                    <li className="movie-duration-year-list-item">
                      <p className="movie-details-adult">
                        {movieDetailsList.adult === true ? 'A' : 'U/A'}
                      </p>
                    </li>
                    <li className="movie-duration-year-list-item">
                      <p className="movie-details-runtime-year">
                        {movieDetailsList.yearOfRelease}
                      </p>
                    </li>
                  </ul>
                  <p className="movie-details-over-view">
                    {movieDetailsList.overview}
                  </p>
                  <button type="button" className="movie-details-button">
                    Play
                  </button>
                </div>
              </div>
              {movieDetailsList.id === undefined ? (
                <Header />
              ) : (
                this.renderMovieDetailsAndSimilarMovies()
              )}
              {this.showMovieDetailsStatus()}
              <Footer />
            </div>
          )
        }}
      </AppContext.Consumer>
    )
  }
}
