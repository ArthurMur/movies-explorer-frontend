import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';
import './SearchForm.css';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';

function SearchForm({ onFilterMovies, onFilterShortMovies, isLoading, onError }) {

  // Получение текущего пути
  const { pathname } = useLocation();
  const isMovies = pathname === '/movies';

  // Управление состоянием формы
  const [isFormReset, setFormReset] = useState(false);
  const { values, handleChange, resetForm } = useForm({ search: '' });

  // Управление состоянием чекбокса
  const [isChecked, setIsChecked] = useState(
    isMovies ? localStorage.getItem('filter-checkbox') === 'true' : false,
  );

  // Обработчик отправки формы
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();// Предотвращаем стандартное действие отправки формы (перезагрузка страницы)

      // Проверяем, является ли текущая страница страницей фильмов (isMovies) и, если да, сохраняем значение поискового запроса в локальное хранилище
      if (isMovies) {
        localStorage.setItem('search', values.search);
      }

      // Проверяем, выполнять ли фильтрацию фильмов: если текущая страница НЕ фильмы или поле поиска НЕ пустое
      if (!isMovies || values.search) {
        onFilterMovies(values.search, isChecked); // Вызываем функцию onFilterMovies с введенным поисковым запросом и состоянием чекбокса (isChecked)
      } else {
        onError(); // Если не выполняем фильтрацию (например, пустой поисковый запрос), вызываем функцию onError
      }
    },
    [isChecked, isMovies, onFilterMovies, values.search, onError]
  );

  // Обработчик изменения чекбокса 
  const handleShortMoviesChange = useCallback(
    (event) => {
      const checked = event.target.checked; // Получаем состояние чекбокса (отмечен или не отмечен)
      setIsChecked(checked); // Обновляем состояние чекбокса

      // Если текущая страница - страница фильмов, сохраняем состояние чекбокса в локальное хранилище
      if (isMovies) {
        localStorage.setItem('filter-checkbox', checked);
      }

      onFilterShortMovies(checked); // Вызываем функцию onFilterShortMovies с переданным состоянием чекбокса
    },
    [isMovies, onFilterShortMovies]
  );

  // Эффект для установки начального состояния формы на основе данных из localStorage
  useEffect(() => {
    // Проверяем, не было ли уже сброса формы
    if (!isFormReset) {
      // Получаем сохраненное значение поискового запроса из localStorage, в зависимости от текущей страницы (фильмы или сохраненные фильмы)
      const userSearch = isMovies
        ? localStorage.getItem('search')
        : localStorage.getItem('saved-search');

      // Вызываем функцию resetForm, чтобы установить начальное состояние формы на основе сохраненных данных
      resetForm({ search: userSearch || '' }, {}, false);

      setFormReset(true); // Устанавливаем флаг сброса формы в true, чтобы не выполнять этот эффект снова
    }
  }, [isFormReset, resetForm, isMovies]);

  return (
    <section className="search-form section-container" aria-label="Форма для поиска фильмов">
      <form className="search-form__form" onSubmit={handleSubmit} noValidate>
        <input
          className="search-form__input"
          placeholder="Фильм"
          required
          minLength={1}
          type="text"
          name="search"
          id="search"
          autoComplete="off"
          value={values.search || ''}
          onChange={handleChange}
        />
        <button className="search-form__btn" type="submit" disabled={isLoading}></button>
        <FilterCheckbox isChecked={isChecked} onChange={handleShortMoviesChange} />
      </form>
    </section>
  );
}

export default SearchForm;