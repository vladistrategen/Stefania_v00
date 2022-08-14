import React from "react";



export default class AppointmentTooltipTest extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        movieData: getMovieById(props.data.appointmentData.movieId),
      };
    }
  
    render() {
      const { movieData } = this.state;
      return (
        <div className="movie-tooltip">
          
          <div className="movie-info">
            <div className="movie-title">
              {movieData.text} ({movieData.year})
            </div>
            <div>
              Director: {movieData.director}
            </div>
            <div>
              Duration: {movieData.duration} minutes
            </div>
          </div>
        </div>
      );
    }
  }