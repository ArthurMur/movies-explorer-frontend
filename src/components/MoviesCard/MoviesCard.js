import './MoviesCard.css';

import { Link } from 'react-router-dom';

function MoviesCard({ imageUrl, name, duration, button, trailerLink, onButtonClick }) {
  return (
    <li className="movies-card">
      <img className="movies-card__img" src={imageUrl} alt={name} />
      <button
        className={`movies-card__btn movies-card__btn_${button}`}
        type="button"
        onClick={onButtonClick}
      >
        {button === 'save' ? 'Сохранить' : ''}
      </button>
      <Link className="movies-card__link" to={trailerLink} target="_blank" />
      <div className="movies-card__container">
        <h3 className="movies-card__text">{name}</h3>
        <span className="movies-card__time">{duration}</span>
      </div>
    </li> 
  );
}

export default MoviesCard;
