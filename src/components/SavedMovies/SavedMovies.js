import { useEffect } from 'react';
import MoviesCardList from '../MoviesCardList/MoviesCardList';
import SearchForm from '../SearchForm/SearchForm';
import Preloader from '../Preloader/Preloader';
import './SavedMovies.css';

function SavedMovies(
  {isSuccess,
  isLoading,
  onDelete,
  onFilterMovies,
  savedInitialMovies,
  onFilterShortMovies,
}) {
  useEffect(() => {
    document.title = 'Сохраненные фильмы';
  }, []);

  // Чтение сохраненных фильмов из localStorage
  const savedMoviesInLs = JSON.parse(localStorage.getItem('saved-movies'));
  return (
    <main className="saved-movies">
      {/* Форма поиска для фильтрации сохраненных фильмов */}
      <SearchForm onFilterMovies={onFilterMovies} onFilterShortMovies={onFilterShortMovies} />
      
      {/* Отображение прелоадера при загрузке */}
      {isLoading && <Preloader />}
      
      {/* Отображение списка сохраненных фильмов, если они есть и загрузка завершена */}
      {!isLoading && savedMoviesInLs.length > 0 && (
        <MoviesCardList 
        isSuccess={isSuccess} 
        initialMovies={savedInitialMovies}
        button="delete" 
        onDeleteClick={onDelete}
        />
      )}
      
    </main>
  );
}

export default SavedMovies;
