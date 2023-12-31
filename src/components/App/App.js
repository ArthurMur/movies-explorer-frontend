import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import './App.css';

import { INFO_TOOLTIP, SHORT_MOVIE_DURATION, DATA_USER_UPDATE, BASE_URL } from '../../utils/constants';

import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Movies from '../Movies/Movies';
import SavedMovies from '../SavedMovies/SavedMovies';
import Profile from '../Profile/Profile';
import NotFound from '../NotFound/NotFound';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
// Импорт модулей для работы с API
import { mainApi } from '../../utils/MainApi';
import { moviesApi } from '../../utils/MoviesApi';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') || false); // Залогинился пользователь или нет
  const [isMoviesLoading, setIsMoviesLoading] = useState(false); // Состояние, определяющее, идет ли загрузка данных о фильмах
  const [isSavedMoviesLoading, setIsSavedMoviesLoading] = useState(false); // Состояние, определяющее, идет ли загрузка данных о сохраненных фильмах
  const [isRegisterLoading, setIsRegisterLoading] = useState(false); // Состояние, определяющее, идет ли загрузка при регистрации
  const [isLoginLoading, setIsLoginLoading] = useState(false); // Состояние, определяющее, идет ли загрузка при входе пользователя
  const [currentUser, setCurrentUser] = useState({}); // Состояние, содержащее информацию о текущем пользователе
  const [isSuccess, setIsSuccess] = useState(true); // Состояние, определяющее, успешно ли выполнена операция (например, регистрация, вход)
  const [serverError, setServerError] = useState(''); // Состояние, содержащее сообщение об ошибке с сервера
  const [initialMovies, setInitialMovies] = useState([]); // Состояние, содержащее список фильмов
  const [savedInitialMovies, setSavedInitialMovies] = useState([]); // Состояние, содержащее список сохраненных фильмов
  const [savedFilteredInitialMovies, setSavedFilteredInitialMovies] = useState([]); // Состояние, содержащее отфильтрованный список сохраненных фильмов
  const [isSearched, setIsSearched] = useState(false); // Состояние, определяющее, выполнялся ли поиск фильмов
  const [isTooltipOpen, setIsTooltipOpen] = useState(false); // Состояние, определяющее, открыто ли всплывающее окно (тултип)
  const [tooltipMessage, setTooltipMessage] = useState(''); // Состояние, содержащее сообщение во всплывающем окне (тултипе)
  const [isTooltipSuccess, setIsTooltipSuccess] = useState(true); // Состояние, определяющее, успешно ли выполнена операция во всплывающем окне (тултипе)

  const { pathname } = useLocation(); // Текущий путь
  const navigate = useNavigate(); // Хук для перенаправления

  // Открытие всплывающей подсказки
  const openTooltip = useCallback(() => {
    setIsTooltipOpen(true);
  }, []);

  // Закрытие всплывающей подсказки
  const closeTooltip = () => {
    setIsTooltipOpen(false);
  };

  // Обработчик ошибок, который открывает всплывающую подсказку с ошибкой
  const handleError = useCallback(
    (err) => {
      setIsTooltipSuccess(false);
      setTooltipMessage(err ? err : INFO_TOOLTIP);
      openTooltip();
    },
    [openTooltip],
  );

    // Проверка токена при загрузке страницы и получение информации о пользователе
    useEffect(() => {
      mainApi.getToken();
      const jwt = localStorage.getItem('jwt');
    if(jwt) {
      mainApi.getAllNeededData()
        .then(([userInfo, savedByUserMovies]) => {
          setIsLoggedIn(true);
          setCurrentUser(userInfo);
          setSavedInitialMovies(savedByUserMovies);
        })
        .catch((err) => {
          console.log(err);
          handleError(err);
        })
    }
    }, [isLoggedIn, handleError]);

  // Фильтруем фильмы
  const filterMovies = (movies, search, isChecked) => {
    
    // Если нет поискового запроса, вернем исходный список фильмов
    if (!search) {
      return isChecked ? movies.filter(movie => movie.duration <= SHORT_MOVIE_DURATION) : movies;
    }

    // Преобразуем поисковый запрос и названия фильмов в нижний регистр для сравнения
    const lowerCaseSearch = search.toLowerCase();
  
    // Фильтруем фильмы по названию (названиеRU или названиеEN), содержащему поисковой запрос
    const foundMovies = movies.filter(movie =>
      movie.nameRU.toLowerCase().includes(lowerCaseSearch) ||
      movie.nameEN.toLowerCase().includes(lowerCaseSearch)
    );
  
    // Если не нужно фильтровать по длительности, возвращаем найденные фильмы
    if (!isChecked) {
      return foundMovies;
    }
  
    // Фильтруем найденные фильмы по длительности (короткометражные)
    const shortMovies = foundMovies.filter(movie => movie.duration <= SHORT_MOVIE_DURATION);
  
    return shortMovies;
  };
  
  // Обработчик фильтрации данных фильмов
  const handleFilterMoviesData = useCallback(async (search, isChecked) => {
    // Получение данных из локального хранилища
    const savedInLs = localStorage.getItem('movies');
    const savedData = savedInLs ? JSON.parse(savedInLs) : null;
  
    // Если данных нет, показать лоадер
    if (!savedData) {
      setIsMoviesLoading(true);
    }
  
    try {
      let newInitialMovies;
  
      if (isChecked) {
        // Если флаг isChecked установлен, фильтруем фильмы
        newInitialMovies = savedData || [];
        newInitialMovies = filterMovies(newInitialMovies, search, isChecked);
        setIsSearched(true); // Устанавливаем флаг поиска
      } else {
        // Если флаг isChecked не установлен, получаем данные с сервера и фильтруем их
        const moviesData = savedData || await moviesApi.getMovies();
        localStorage.setItem('movies', JSON.stringify(moviesData));
  
        newInitialMovies = filterMovies(moviesData, search, isChecked);
        localStorage.setItem('found-movies', JSON.stringify(newInitialMovies));
        setIsSearched(true); // Устанавливаем флаг поиска
      }

      // Фильтруем фильмы, если есть поисковой запрос
      if (!isChecked && search) {
        newInitialMovies = filterMovies(newInitialMovies, search, isChecked);
      }
  
      // Обновляем стейт с отфильтрованным списком фильмов
      setInitialMovies(newInitialMovies);
    } catch (err) {
      console.log(err);
      setIsSuccess(false);
    } finally {
      // Скрываем лоадер
      setIsMoviesLoading(false);
    }
  }, [setIsMoviesLoading, setInitialMovies]);

  // Получение данных о фильмах
  const getMovies = useCallback(async () => {
    // Получаем данные из хранилища
    const savedSearch = localStorage.getItem('search');
    const savedCheckbox = localStorage.getItem('filter-checkbox');
    // Запускаем фильтрацию, если есть сохраненные данные
    if (savedSearch || savedCheckbox) {
      handleFilterMoviesData(savedSearch ?? '', savedCheckbox === 'true' || false);
    }
  }, [handleFilterMoviesData]);

  // Вызов функции получения данных о фильмах при изменении стейта isLoggedIn
  useEffect(() => {
    isLoggedIn && getMovies();
  }, [getMovies, isLoggedIn]);
  
  // Обработчик фильтрации сохраненных фильмов
  const handleFilterSavedMovies = useCallback(
    (search, isChecked) => {
      // Показываем loader при фильтрации
      setIsSavedMoviesLoading(true);
      try {
        // Фильтруем сохраненные фильмы
        const newInitialMovies = filterMovies(savedInitialMovies, search, isChecked);
        // Сохраняем отфильтрованный список в стейте
        setSavedFilteredInitialMovies(newInitialMovies);
      } catch (err) {
        console.log(err); 
        handleError(err);
      } finally {
        setIsSavedMoviesLoading(false);
      }
    },
    [handleError, savedInitialMovies],
  );

  // Получение сохраненных фильмов
  const getSavedMovies = useCallback(async () => {
    try {
      // Запрос к API за сохраненными фильмами
      const moviesData = await mainApi.getSavedMovies();
      // Сохраняем в локальном хранилище
      localStorage.setItem('saved-movies', JSON.stringify(moviesData));
      setSavedInitialMovies(moviesData);
      setSavedFilteredInitialMovies(moviesData);
    } catch (err) {
      console.log(err); 
      handleError(err); 
    }
  }, [handleError]);

  // Вызов функции получения сохраненных фильмов при изменении стейта isLoggedIn
  useEffect(() => {
    isLoggedIn && getSavedMovies();
  }, [getSavedMovies, isLoggedIn]);
  
// Обработчик входа в систему
const handleLogin = async ({ email, password }) => {
  setIsLoginLoading(true); // Устанавливаем флаг загрузки во время входа

  mainApi.loginUser({ email, password })
  .then((res) => {
    localStorage.setItem('jwt', res.token);
    setIsLoggedIn(true); // Устанавливаем флаг "пользователь вошел в систему"
    setCurrentUser({
      email: res.email,
      name: res.name
    });
    const registerTrue = localStorage.getItem('registerTrue');
    console.log('registerTrue: ', registerTrue);
    localStorage.setItem('loginTrue', 'true'); // Сохраняем информацию о входе в локальное хранилище
    navigate('/movies');
  })
  .catch((err) => {
    console.log(err); // Логируем ошибку, если вход не удался
    handleError(err); // Обрабатываем ошибку входа
    setIsLoggedIn(false); // Устанавливаем флаг "пользователь не вошел в систему"
  })
  .finally(() => {
    setIsLoginLoading(false); // Скрываем лоадер после завершения операции входа
  })
};

  // Обработчик регистрации
  const handleRegister = async ({ name, email, password }) => {
    setIsRegisterLoading(true); // Устанавливаем флаг загрузки во время регистрации

    mainApi.registerUser({ name, email, password })
    .then(() => {
      handleLogin({email, password});
      localStorage.setItem('registerTrue: ', 'true'); // Сохраняем информацию о регистрации в локальное хранилище
    })
    .catch((err) => {
      console.log(err);
      handleError(err);
      setIsLoggedIn(false); // Устанавливаем флаг "пользователь не вошел в систему"
    })
    .finally(() => {
      setIsRegisterLoading(false); // Скрываем лоадер после завершения операции
    })
  };

  // Обработчик обновления профиля пользователя
  const handleProfileUpdate = async ({ name, email }) => {
    try {
      const user = await mainApi.editUserInfo({ name, email }); // Обновляем информацию о пользователе
      setCurrentUser(user); // Обновляем данные текущего пользователя
      setServerError(DATA_USER_UPDATE); // Устанавливаем сообщение об успешном обновлении данных
      setIsSuccess(true); // Устанавливаем флаг "успешное обновление"
    } catch (err) {
      setServerError(err); // Устанавливаем сообщение об ошибке
      setIsSuccess(false); // Устанавливаем флаг "неуспешное обновление"
      console.log(err); 
      handleError(err);
    }
  };

  // Обработчик добавления фильма
  const handleAddMovie = async (movieData) => {
    try {
      // Формируем URL изображения и миниатюры для фильма
      const imageUrl = `${BASE_URL}${movieData.image.url}`;
      const thumbnailUrl = `${BASE_URL}${movieData.image.formats.thumbnail.url}`;

      // Отправляем запрос на сервер для создания фильма
      const addedMovie = await mainApi.createMovie({
        ...movieData,
        movieId: movieData.id,
        image: imageUrl,
        thumbnail: thumbnailUrl,
      });

      // Обновляем список сохраненных фильмов в состоянии приложения
      const updatedSavedInitialMovies = [...savedInitialMovies, addedMovie];
      setSavedInitialMovies(updatedSavedInitialMovies);

      // Сохраняем обновленный список в локальное хранилище
      localStorage.setItem('saved-movies', JSON.stringify(updatedSavedInitialMovies));
    } catch (err) {
      console.log(err);
      handleError(err);
    }
  };

  // Эффект для фильтрации сохраненных фильмов по продолжительности при изменении соответствующего стейта.
  useEffect(() => {
    if (localStorage.getItem('checked-save') === 'true') {
      const filteredMovies = savedInitialMovies.filter(
        (movie) => movie.duration <= SHORT_MOVIE_DURATION,
      );
      setSavedFilteredInitialMovies(filteredMovies);
    } else {
      setSavedFilteredInitialMovies(savedInitialMovies);
    }
  }, [savedInitialMovies]);

  // Обработчик удаления фильма
  const handleDeleteClick = async (movieId) => {
    try {
      // Удаляем фильм с указанным movieId на сервере
      await mainApi.deleteCard(movieId);

      // Обновляем список сохраненных фильмов, исключая удаленный фильм
      const updatedSavedInitialMovies = savedInitialMovies.filter((movie) => movie._id !== movieId);

      // Обновляем состояние и сохраняем обновленный список в локальное хранилище
      setSavedInitialMovies(updatedSavedInitialMovies);
      localStorage.setItem('saved-movies', JSON.stringify(updatedSavedInitialMovies));
    } catch (err) {
      console.log(err);
      handleError(err);
    }
  };

  // Обработчик фильтрации коротких фильмов
  const handleFilterShortMovies = (checked) => {
    // Если чекбокс "Показать только короткометражки" отмечен
    if (checked) {
      // Фильтрация фильмов: оставляем только те, чья длительность меньше или равна SHORT_MOVIE_DURATION
      const filteredMovies = initialMovies.filter((movie) => movie.duration <= SHORT_MOVIE_DURATION);
      // Устанавливаем отфильтрованные фильмы в состояние initialMovies
      setInitialMovies(filteredMovies);
    } else {
      // Если чекбокс не отмечен, восстанавливаем исходный список фильмов
      const foundMoviesInLs = JSON.parse(localStorage.getItem('movies'));
      if (foundMoviesInLs) {
        const searchQuery = localStorage.getItem('search');
        const filteredMovies = filterMovies(foundMoviesInLs, searchQuery, false);
        setInitialMovies(filteredMovies);
      } else {
        setInitialMovies([]);
      }
    }
  };

// Обработчик фильтрации коротких сохраненных фильмов
const handleFilterShortSavedMovies = (checked) => {
  // Сохраняем состояние чекбокса "Показать только короткометражки" в локальное хранилище
  localStorage.setItem('checked-save', checked);

  // Получаем сохраненные фильмы из локального хранилища
  const foundMoviesInLs = JSON.parse(localStorage.getItem('saved-movies'));

  // Если чекбокс "Показать только короткометражки" отмечен
  if (checked) {
    // Фильтрация сохраненных фильмов: оставляем только те, чья длительность меньше или равна SHORT_MOVIE_DURATION
    const filteredMovies = foundMoviesInLs.filter((movie) => movie.duration <= SHORT_MOVIE_DURATION);
    // Устанавливаем отфильтрованные сохраненные фильмы в состояние savedFilteredInitialMovies
    setSavedFilteredInitialMovies(filteredMovies);
  } else {
    // Если чекбокс не отмечен, восстанавливаем изначальные сохраненные фильмы
    setSavedInitialMovies(foundMoviesInLs ? foundMoviesInLs : []);
  }
};

  // Обработчик выхода из системы
  const handleLogout = async () => {
      localStorage.clear();
      setIsLoggedIn(false);
      setCurrentUser({});
      setInitialMovies([]);
      setIsSearched(false);
      navigate('/', { replace: true });
  };

  // Сброс сообщения об ошибке на сервере
  const resetServerError = () => {
    setServerError('');
  };

  // Сброс состояния успеха
  const resetSuccessState = () => {
    setIsSuccess(true);
  };
  

  // Компоненты для роутинга
  const mainComponent = <Main />;

  const moviesComponent = (
    <ProtectedRoute
      component={Movies}
      isSearched={isSearched}
      isLoading={isMoviesLoading}
      isSuccess={isSuccess}
      loggedIn={isLoggedIn}
      initialMovies={initialMovies}
      onAddMovie={handleAddMovie}
      onDelete={handleDeleteClick}
      onError={handleError}
      onFilterMovies={handleFilterMoviesData}
      onFilterShortMovies={handleFilterShortMovies}
      savedInitialMovies={savedInitialMovies}
    />
  );

  const savedMoviesComponent = (
    <ProtectedRoute
      component={SavedMovies}
      isSuccess={isSuccess}
      isLoading={isSavedMoviesLoading}
      loggedIn={isLoggedIn}
      onDelete={handleDeleteClick}
      onFilterMovies={handleFilterSavedMovies}
      onFilterShortMovies={handleFilterShortSavedMovies}
      savedInitialMovies={savedFilteredInitialMovies}
    />
  );

  const profileComponent = (
    <ProtectedRoute
      component={Profile}
      isSuccess={isSuccess}
      loggedIn={isLoggedIn}
      onLogout={handleLogout}
      resetServerError={resetServerError}
      resetSuccessState={resetSuccessState}
      serverError={serverError}
      onSave={handleProfileUpdate}
    />
  );

  const registerComponent = (
    <Register isLoggedIn={isLoggedIn} onSubmit={handleRegister} isLoading={isRegisterLoading} />
  );

  const loginComponent = (
    <Login isLoggedIn={isLoggedIn} onSubmit={handleLogin} isLoading={isLoginLoading} />
  );
  const notFoundComponent = <NotFound />;

  // Функция для определения, какой компонент отображать на основе текущего пути
  const displayComponent = (routes) => routes.includes(pathname);

  return (
    <CurrentUserContext.Provider value={currentUser}>
    <div className="app">
      {displayComponent(['/', '/movies', '/saved-movies', '/profile']) && (
        <Header isLoggedIn={isLoggedIn} />
      )}
      <Routes>
        <Route path="/" element={mainComponent}></Route>
        <Route path="/movies" element={moviesComponent} />
        <Route path="/saved-movies" element={savedMoviesComponent} />
        <Route path="/profile" element={profileComponent} />
        <Route path="/signup" element={registerComponent} />
        <Route path="/signin" element={loginComponent} />
        <Route path="*" element={notFoundComponent} />
      </Routes>
      {displayComponent(['/', '/movies', '/saved-movies']) && <Footer />}
      <InfoTooltip
          isOpen={isTooltipOpen}
          onClose={closeTooltip}
          isSuccess={isTooltipSuccess}
          message={tooltipMessage}
        />
    </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
