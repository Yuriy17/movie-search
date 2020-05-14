
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
    this.maxSlideIndex = 1;
    this.greatestPage = 1;
  }

  setGreatestPage(greatestPage) {
    this.greatestPage = greatestPage;
  }

  getGreatestPage() {
    return this.greatestPage;
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
      this.mySwiper.appendSlide(Slider.createSlideElement(result));
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

  async init(search) {
    this.mySwiper = new Swiper('.swiper-container', {
      centerInsufficientSlides: true,
      slidesPerColumn: 2,
      slidesPerColumnFill: 'column',
      slidesPerGroup: 1,
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
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        992: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
      },
    });

    const startResult = await search('action', this.getGreatestPage());
    startResult.Search.forEach((result) => {
      this.mySwiper.appendSlide(Slider.createSlideElement(result));
    });

    this.mySwiper.on('reachEnd', () => {
      this.greatestPage += 1;

      document.getElementById('loading-icon').classList.remove('hide-loading');

      const promises = [];
      search('action', this.greatestPage)
        .then((data) => {
          data.Search.forEach((result) => {
            promises.push(new Promise(() => {
              this.mySwiper.appendSlide(Slider.createSlideElement(result));
            }));
          });
        });

      Promise.allSettled(promises)
        .then(() => document.getElementById('loading-icon').classList.add('hide-loading'));
    });
  }
}
