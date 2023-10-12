import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';

import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Movies from '../Movies/Movies';
import SavedMovies from '../SavedMovies/SavedMovies';
import filmArray from '../../utils/filmArray';
import Profile from '../Profile/Profile';
import NotFound from '../NotFound/NotFound';

function App() {
  const [user, setUser] = useState({ name: 'Виталий', email: 'pochta@yandex.ru' }); // Данные пользователя
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Залогинился пользователь или нет
  const [isBurgerOpen, setIsBurgerOpen] = useState(false); // Открыто ли бургер-меню
  const { pathname } = useLocation(); // Текущий путь
  const displayComponent = (routes) => routes.includes(pathname); // Функция для определения, нужно ли отображать компоненты в зависимости от маршрута
  const navigate = useNavigate(); // Хук для перенаправления

  const handleLoadMore = () => {
    // функция для загрузки большего количества фильмов
    console.log('Прогрузить еще');
  };

  const handleRegister = (newUser) => {
    // функция для регистрации нового пользователя
    console.log(newUser);
  };

  const handleLogin = (credentials) => {
    // функция для входа в систему
    setIsLoggedIn(true);
    navigate('/', { replace: true });
  };

  const handleSave = (newData) => {
    // функция для сохранения новых данных пользователя
    setUser(newData); // обновляем информацию о пользователе
    console.log(newData);
  };

  const handleLogout = () => {
    // функция для выхода из системы
    setIsLoggedIn(false);
  };

  const handleOpenBurger = () => {
    // функция для открытия бургер-меню
    setIsBurgerOpen(true);
  };

  const handleCloseBurger = () => {
    // функция для закрытия бургер-меню
    setIsBurgerOpen(false);
  };

  return (
    <div className="app">
      {displayComponent(['/', '/movies', '/saved-movies', '/profile']) && (
        <Header
          isLoggedIn={isLoggedIn}
          isBurgerOpen={isBurgerOpen}
          onOpenBurger={handleOpenBurger}
          onCloseBurger={handleCloseBurger}
        />
      )}
      <Routes>
      <Route path="/" element={<Main />}></Route>
        <Route
          path="/movies"
          element={
            <Movies
              initialMovies={filmArray}
              onLoadMore={handleLoadMore}
            />
          }
        ></Route>
        <Route path="/saved-movies" element={<SavedMovies />}></Route>
        <Route path="/signup" element={<Register onSubmit={handleRegister} />}></Route>
        <Route path="/signin" element={<Login onSubmit={handleLogin} />}></Route>
        <Route
          path="/profile"
          element={<Profile user={user} onSave={handleSave} onLogout={handleLogout} />}
        ></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      {displayComponent(['/', '/movies', '/saved-movies']) && <Footer />}
    </div>
  );
}

export default App;
