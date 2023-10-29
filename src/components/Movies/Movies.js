import { useCallback, useEffect, useMemo, useState } from 'react';

import MoviesCardList from '../MoviesCardList/MoviesCardList';
import SearchForm from '../SearchForm/SearchForm';
import './Movies.css';
import Preloader from '../Preloader/Preloader';

import {
  DESKTOP_WIDTH,
  NUMBER_CARDS_ADD_FOR_DESKTOP,
  NUMBER_CARDS_ADD_FOR_MOBILE_GADGETS,
  NUMBER_CARDS_FOR_DESKTOP,
  NUMBER_CARDS_FOR_MOBILE,
  NUMBER_CARDS_FOR_TABLET,
  TABLET_WIDTH,
} from '../../utils/constants';

function Movies({   
  isLoading,
  isSearched,
  isSuccess,
  initialMovies,
  onAddMovie,
  onDelete,
  onError,
  onFilterMovies,
  onFilterShortMovies,
  savedInitialMovies, }) {

  const moviesLength = initialMovies.length; // Общее количество фильмов
  const [showMoviesLength, setShowMoviesLength] = useState(0); // Состояние для отображения определенного количества фильмов
  const [addMoviesCount, setAddMoviesCount] = useState(0); // Состояние для отображения дополнительных фильмов при нажатии кнопки "Еще"
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Состояние для текущей ширины экрана

  useEffect(() => {
    document.title = 'Фильмы';
  }, []);

  // Получение базового количества фильмов в зависимости от ширины экрана
  const getBaseCount = useCallback(() => {
    if (screenWidth > DESKTOP_WIDTH) {
      return NUMBER_CARDS_FOR_DESKTOP;
    }
    if (screenWidth > TABLET_WIDTH) {
      return NUMBER_CARDS_FOR_TABLET;
    }
    return NUMBER_CARDS_FOR_MOBILE;
  }, [screenWidth]);

  // Получение количества дополнительных фильмов в зависимости от ширины экрана
  const getAddCount = useCallback(
    (width = screenWidth) => {
      if (width > DESKTOP_WIDTH) {
        return NUMBER_CARDS_ADD_FOR_DESKTOP;
      }
      return NUMBER_CARDS_ADD_FOR_MOBILE_GADGETS;
    },
    [screenWidth],
  );

  // Устанавливаем количество фильмов для отображения в зависимости от isSearched и ширины экрана
  useEffect(() => {
    const baseCount = getBaseCount();
    const searchCount = baseCount > NUMBER_CARDS_FOR_MOBILE ? NUMBER_CARDS_FOR_MOBILE : baseCount;

    if (isSearched) {
      setShowMoviesLength(searchCount);
      setAddMoviesCount(getAddCount());
    } else {
      setShowMoviesLength(searchCount);
      setAddMoviesCount(getAddCount());
    }
  }, [isSearched, getBaseCount, getAddCount]);


  
  // Фильтрация списка фильмов для отображения на основе showMoviesLength
  const cards = useMemo(
    () => initialMovies.filter((movie, index) => index < showMoviesLength),
    [initialMovies, showMoviesLength],
  );

  // Обработчик события клика на кнопку "Показать больше"
  const handleMoreClick = useCallback(() => {
    setShowMoviesLength((prev) => {
      const next = prev + addMoviesCount; // Вычисляем новое значение для переменной showMoviesLength
      return next > moviesLength ? moviesLength : next; // Проверяем, не превышает ли новое значение общее количество фильмов
    });
  }, [addMoviesCount, moviesLength]);

  // Обработчик изменения размера окна
  useEffect(() => {
    let initialScreenWidth = window.innerWidth; // Инициализируем переменную для хранения начальной ширины экрана

    // Функция обработки изменения размера окна
    const handleResize = () => {
      const newScreenWidth = window.innerWidth;// Получаем текущую ширину экрана после изменения

      // Проверяем, изменилась ли ширина экрана
      if (initialScreenWidth === newScreenWidth) { 
        return; // Если ширина осталась прежней, выходим из функции
      }

      initialScreenWidth = newScreenWidth; // Обновляем начальную ширину экрана
      setScreenWidth(newScreenWidth); // Обновляем состояние с новой шириной экрана
      setAddMoviesCount(getAddCount(newScreenWidth)); // Вычисляем и обновляем количество фильмов, которое нужно добавить
      setShowMoviesLength(getBaseCount()); // Устанавливаем базовое количество фильмов для отображения
    };

    // Вызываем функции при первоначальном рендере и каждый раз, когда функции getAddCount и getBaseCount изменяются
    setAddMoviesCount(getAddCount());
    setShowMoviesLength(getBaseCount());
    
    window.addEventListener('resize', handleResize);// Добавляем обработчик изменения размера окна

    return () => {// Возвращаем функцию для удаления обработчика при размонтировании
      window.removeEventListener('resize', handleResize);
    };
  }, [getAddCount, getBaseCount]);


  return (
    <main className="movies">
      <SearchForm 
        onFilterMovies={onFilterMovies}
        onFilterShortMovies={onFilterShortMovies}
        isLoading={isLoading}
        onError={onError}
      />
      {isLoading && <Preloader />}
      {!isLoading && isSearched && (
        <MoviesCardList
          onAddClick={onAddMovie}
          onDeleteClick={onDelete}
          initialMovies={cards}
          savedInitialMovies={savedInitialMovies}
          isSuccess={isSuccess}
        />
      )}
      {moviesLength > showMoviesLength ? (
        <button className="movies__button" type="button" onClick={handleMoreClick}>
          Ещё
        </button>
      ) : null}
    </main>
  );
}

export default Movies;
