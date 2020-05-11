
import {
  Swiper, Navigation, Pagination,
} from 'swiper/js/swiper.esm';
// Install modules
Swiper.use([Navigation, Pagination]);

export default class Slider {
  constructor(swiper) {
    this.swiper = swiper;
    this.sliderElement = document.getElementById('slider');
    this.totalResults = 0;
    this.currentPage = 1;
  }

  setCurrentPage(currentPage) {
    this.currentPage = currentPage;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  setTotalResults(totalResults) {
    this.totalResults = totalResults;
  }

  getTotalResults() {
    return this.totalResults;
  }

  appendSlides(searchResult) {
    this.setTotalResults(searchResult.totalResults);
    searchResult.Search.forEach((result) => {
      this.mySwiper.appendSlide(this.createSlideElement(result));
    });
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
      centerInsufficientSlides: true,
      slidesPerColumn: 2,
      spaceBetween: 30,
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
        992: {
          slidesPerView: 4,
          spaceBetween: 40,
          slidesPerGroup: 4,
        },
      },
    });
    // eslint-disable-next-line prefer-arrow-callback
    this.mySwiper.on('slideChange', () => {
      console.log(this.mySwiper.realIndex);
    });
  }
}
