/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import 'bootstrap';
import Swiper from 'swiper';
import './assets/stylesheets/index.scss';
// import App from './modules/App';


document.addEventListener('DOMContentLoaded', () => {
  const mySwiper = new Swiper('.swiper-container', { // Optional parameters
    loop: true,

    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

  });
/*   const app = new App();
  app.init(); */
});
