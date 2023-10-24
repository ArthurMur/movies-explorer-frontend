import './Header.css';

import Logo from '../Logo/Logo';
import Navigation from '../Navigation/Navigation';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import BurgerMenuOpen from '../BurgerMenuOpen/BurgerMenuOpen';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

function Header({ isLoggedIn }) { 
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  // функция для открытия бургер-меню
  const handleOpenBurger = () => {
    setIsBurgerOpen(true);
  };

  // функция для закрытия бургер-меню
  const handleCloseBurger = () => {
    setIsBurgerOpen(false);
  };

  // Получение текущего пути (pathname)
  const { pathname } = useLocation();

  // Если путь совпадает с одним из этих путей, то добавляется специальный класс 'header_path_movies'
  const headerClass = `header ${
    pathname === '/movies' || pathname === '/saved-movies' || pathname === '/profile'
      ? 'header_path_movies'
      : ''
  }`;

  return (
    <header className={headerClass}>
      <div className="header__container section-container">
        <Logo />
        <Navigation isLoggedIn={isLoggedIn} />
        <BurgerMenuOpen onOpenBurger={handleOpenBurger} isLoggedIn={isLoggedIn} />
        <BurgerMenu isOpen={isBurgerOpen} onClose={handleCloseBurger} />
      </div>
    </header>
  );
}

export default Header;