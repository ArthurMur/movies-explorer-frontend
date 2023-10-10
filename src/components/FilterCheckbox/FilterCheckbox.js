import './FilterCheckbox.css';

function FilterCheckbox() {
  return (
    <span className="filter-checkbox">
      <input
        id="filter-checkbox__input"
        className="filter-checkbox__input"
        type="checkbox"
        defaultChecked
      />
      <label
        htmlFor="filter-checkbox__input"
        className="filter-checkbox__text filter-checkbox__text_active"
      ></label>
      <label htmlFor="filter-checkbox__input" className="filter-checkbox__text">
        Короткометражки
      </label>
    </span>
  );
}

export default FilterCheckbox;