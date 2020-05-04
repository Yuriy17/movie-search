import Swiper from 'swiper';

export default class Slider {
  constructor() {
    this.init();
  }

  init() {
    this.mySwiper = new Swiper('.swiper-container', { // Optional parameters
      loop: true,
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
}
