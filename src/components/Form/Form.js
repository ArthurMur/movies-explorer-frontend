import './Form.css';

function Form({ name, onSubmit, place, autorize, btnText, isProfileEdit = true, children }) {

  return (
    <form name={name} onSubmit={onSubmit} className={`form form_place_${place}`}>
      {children}
      <div
        className={`form__container ${
          place !== 'profile' ? `form__container_path_${autorize}` : ''
        }`}
      >
        {isProfileEdit && (
          <button
            className={`form__btn ${place === 'profile' ? 'form__btn_form_profile' : ''}`}
            type="submit"
          >
            {btnText}
          </button>
        )}
      </div>
    </form>
  );
}

export default Form;