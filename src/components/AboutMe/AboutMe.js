import './AboutMe.css';

import React from 'react';
import profilePhoto from '../../images/profilePhoto.jpg';

function AboutMe() {
  return (
    <section
      className="about-me section-container tablet-container-large"
      aria-label="Информация о студенте"
      id="about-me"
    >
      <h2 className="about-me__title">Студент</h2>
      <div className="about-me__container">
        <h3 className="about-me__subtitle">Артур</h3>
        <p className="about-me__job">Фронтенд-разработчик, 22&nbsp;года</p>
        <p className="about-me__info">
        В&nbsp;2022 году переехал из&nbsp;Ярославля в&nbsp;Москву, работал по&nbsp;образованию, 
        а&nbsp;именно инженером-проектировщиком автоматизированных систем в&nbsp;области медицины. 
        Я&nbsp;прекрасно понимал, что не&nbsp;буду надолго задерживаться в&nbsp;этой профессии, 
        поскольку всегда мечтал стать веб-разработчиком. Как-то давно касался PHP (Laravel) и&nbsp;Python (Django, Flask), 
        не&nbsp;понравилось. В&nbsp;конечном счёте остановился на&nbsp;JS (React). 
        Мне нравится данное направление и&nbsp;считаю его интересным. Мои успехи можете увидеть на&nbsp;этом сайте.
        </p>
        <ul className="about-me__list">
          <li className="about-me__list-item">
            <a
              className="about-me__link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/ArthurMur"
            >
              Github
            </a>
          </li>
        </ul>
        <img
          className="about-me__img"
          src={profilePhoto}
          alt="Изображение автора"
          draggable="false"
        />
      </div>
    </section>
  );
}

export default AboutMe;
