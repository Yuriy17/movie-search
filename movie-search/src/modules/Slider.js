import Swiper from 'swiper';

export default class Slider {
  constructor() {
    this.sliderElement = document.getElementById('slider');
  }

  static createSlideElement(slide) {
    return `<div class="swiper-slide">
            <div class="swiper-slide__title">${slide.Title}</div>
            <div class="swiper-slide__poster-block">
              <img onerror="this.onerror=null; this.src='./assets/img/poster-not-available.jpg';" src="${slide.Poster}" alt="${slide.Title} poster">
            </div>
            <div class="swiper-slide__year">${slide.Year}</div>
            <div class="swiper-slide__rating">
              <i class="swiper-slide__rating-star fa fa-star"></i>
              <span class="swiper-slide__rating-rank">${slide.imdbRating}</span>
            </div>
          </div>`;
  }

  init() {
    this.mySwiper = new Swiper('.swiper-container', { // Optional parameters
      // slidesPerView: 3,
      slidesPerColumn: 2,
      spaceBetween: 30,
      // centerInsufficientSlides: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 10,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        // when window width is >= 320px
        /*         320: {
          slidesPerView: 2,
          spaceBetween: 20,
          slidesPerGroup: 2,
        }, */
        // when window width is >= 480px
        480: {
          slidesPerView: 2,
          spaceBetween: 20,
          slidesPerGroup: 2,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
          slidesPerGroup: 3,
        },
        // when window width is >= 640px
        992: {
          slidesPerView: 4,
          spaceBetween: 40,
          slidesPerGroup: 4,
        },
      },
    });
  }
}
