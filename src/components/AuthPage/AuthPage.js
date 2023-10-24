import { Link } from 'react-router-dom';
import Form from '../Form/Form';
import Logo from '../Logo/Logo';
import './AuthPage.css';

function AuthPage({
  title,
  btnText,
  questionText,
  url,
  linkText,
  name,
  onSubmit,
  autorize,
  place,
  isFormValid,
  children,
}) {

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(event); // Вызываем переданный обработчик handleSubmit
  };
  
  return (
    <section
      className="auth-page mobile-container-small"
      aria-label="Страница авторизации"
    >
      <Logo />
      <h1 className="auth-page__title">{title}</h1>
      <Form
        btnText={btnText}
        type={name}
        name={name}
        handleSubmit={handleSubmit}
        autorize={autorize}
        place={place}
        isFormValid={isFormValid}
      >
        {children}
      </Form>
      <div className="auth-page__container">
        <p className="auth-page__ask">{questionText}</p>
        <Link to={url} className="auth-page__link">
          {linkText}
        </Link>
      </div>
    </section>
  );
}

export default AuthPage;
