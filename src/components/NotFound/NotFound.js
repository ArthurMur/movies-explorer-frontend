import { Link } from 'react-router-dom';
import './NotFound.css';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  function handleClick() {
    navigate(-1);
  }

  return (
    <main className="not-found mobile-container-large">
      <h1 className="not-found__title">404</h1>
      <p className="not-found__text">Страница не найдена</p>
      <Link className="not-found__link" onClick={handleClick}>
        Назад
      </Link>
    </main>
  );
}

export default NotFound;