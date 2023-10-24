import { useCallback, useState } from 'react';
import { EMAIL_VALIDATION, NAME_VALIDATION } from '../utils/constants';

import isEmail from 'validator/es/lib/isEmail';

// Хук управления формой и валидации формы
export function useForm(initialValues = {}) {
  // Инициализация состояний
  const [values, setValues] = useState(initialValues); // Значения полей формы
  const [errors, setErrors] = useState({}); // Сообщения об ошибках для полей формы
  const [isFormValid, setIsFormValid] = useState(false); // Флаг валидности всей формы

  // Функция для обработки изменений полей формы
  const handleChange = useCallback((event) => {
    const target = event.target; // Получаем элемент, вызвавший событие
    const { name, value } = target; // Извлекаем имя и значение поля

    // Функция для установки сообщения об ошибке
    const setCustomValidity = (message) => {
      target.setCustomValidity(message);
    };

    // Проверка на валидацию полей
    if (name === 'name' && target.validity.patternMismatch) {
      setCustomValidity(NAME_VALIDATION); // Устанавливаем сообщение об ошибке для имени
    } else if (name === 'email' && !isEmail(value)) {
      setCustomValidity(EMAIL_VALIDATION); // Устанавливаем сообщение об ошибке для email
    } else {
      setCustomValidity(''); // Сбрасываем сообщение об ошибке
    }

    // Функция для обновления состояний
    const updateState = (stateSetter, key, newValue) => {
      stateSetter((prev) => ({ ...prev, [key]: newValue }));
    };

    // Обновление состояний
    updateState(setValues, name, value); // Обновляем значения полей
    updateState(setErrors, name, target.validationMessage); // Обновляем сообщения об ошибках
    setIsFormValid(target.closest('form').checkValidity()); // Обновляем флаг валидности всей формы
  }, []);

  // Функция для сброса формы к начальным значениям
  const resetForm = useCallback(
    (newValues = initialValues, newErrors = {}, newIsValid = false) => {
      setValues(newValues); // Устанавливаем начальные значения полей
      setErrors(newErrors); // Очищаем сообщения об ошибках
      setIsFormValid(newIsValid); // Устанавливаем флаг валидности формы
    },
    [initialValues],
  );

  // Возвращаем объект с данными и функциями для работы с формой
  return { values, handleChange, errors, isFormValid, resetForm };
}
