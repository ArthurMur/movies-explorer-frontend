import { NavLink } from 'react-router-dom';
import Overlay from '../Overlay/Overlay';
import './BurgerMenu.css';
import AccountBtn from '../AccountBtn/AccountBtn';
import BurgerMenuClose from '../BurgerMenuClose/BurgerMenuClose';

function BurgerMenu({ isOpen, onClose }) {
  return (
    <Overlay isOpen={isOpen}>
      <BurgerMenuClose onClose={onClose} />
      <aside className={`burger-menu ${isOpen ? 'burger-menu_opened' : ''}`}>
        <ul className="burger-menu__list">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `burger-menu__link ${isActive ? 'burger-menu__link_active' : ''}`
              }
              onClick={onClose}
            >
              Главная
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/movies"
              className={({ isActive }) =>
                `burger-menu__link ${isActive ? 'burger-menu__link_active' : ''}`
              }
              onClick={onClose}
            >
              Фильмы
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/saved-movies"
              className={({ isActive }) =>
                `burger-menu__link ${isActive ? 'burger-menu__link_active' : ''}`
              }
              onClick={onClose}
            >
              Сохранённые фильмы
            </NavLink>
          </li>
        </ul>
        <AccountBtn onClick={onClose}/>
      </aside>
    </Overlay>
  );
}

export default BurgerMenu;