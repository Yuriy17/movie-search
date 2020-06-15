import { Swiper, Navigation, Pagination } from 'swiper/js/swiper.esm';
import { search, loadImage, createSlideElement } from '../utils/utils';
// Install modules
Swiper.use([Navigation, Pagination]);

export default class Slider {
  constructor(currentFilm) {
    this.sliderElement = document.getElementById('slider');
    this.totalResults = 0;
    this.greatestPage = 1;
    this.isReachEnd = false;
    this.currentFilm = currentFilm;
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

  resetSlider() {
    this.greatestPage = 1;
    this.totalResults = 0;
    this.isReachEnd = false;
    this.mySwiper.removeAllSlides();
  }


  async init() {
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
        },
        768: {
          slidesPerView: 3,
        },
        992: {
          slidesPerView: 4,
        },
      },
    });
    this.renderSearchResult(search(this.currentFilm, this.greatestPage));
    this.mySwiper.on('slideChange', () => {
      if (this.isReachEnd && (this.mySwiper.activeIndex !== 0)) {
        this.greatestPage += 1;
        this.renderSearchResult(search(this.currentFilm, this.greatestPage));
        this.isReachEnd = false;
      }
    });
    this.mySwiper.on('reachEnd', () => {
      this.isReachEnd = true;
    });
  }

  renderSearchResult(resultPromise) {
    const postersInfo = [];
    document.getElementById('loading-icon').classList.remove('hide');
    const notFoundElement = document.getElementById('not-found');
    if (notFoundElement) {
      notFoundElement.remove();
    }
    resultPromise.then((data) => {
      if (data) {
        data.Search.forEach((result) => {
          const slideElement = createSlideElement(result);
          this.mySwiper.appendSlide(slideElement);
          postersInfo.push({ poster: result.Poster, element: slideElement });
        });
      } else {
        document.querySelector('.main').insertAdjacentHTML('afterbegin', `<div id="not-found" class="not-found">
        <h3>We're Sorry!</h3>
        <p>
          We can't seem to find any films that match your search for <span>${document.getElementById('search-input').value}</span>
        </p>
      </div>`);
      }
    }).then(() => {
      if (postersInfo.length) {
        const posterPromises = [];
        postersInfo.forEach((object) => {
          posterPromises.push(loadImage(object.poster, object.element));
        });
        Promise.allSettled(posterPromises).then(() => {
          document.getElementById('loading-icon').classList.add('hide');
        });
      } else {
        document.getElementById('loading-icon').classList.add('hide');
      }
    });
  }
}
