import { Swiper, Navigation, Pagination } from 'swiper/js/swiper.esm';
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

    /*     const startResult = await search('action', this.getGreatestPage());
    startResult.Search.forEach((result) => {
      this.mySwiper.appendSlide(Slider.createSlideElement(result));
    }); */


    document.getElementById('loading-icon').classList.remove('hide-loading');
    this.renderSearchResult(search('action', this.greatestPage));

    this.mySwiper.on('reachEnd', () => {
      this.greatestPage += 1;

      document.getElementById('loading-icon').classList.remove('hide-loading');
      this.renderSearchResult(search('action', this.greatestPage));
      /* const promises = [];
       search('action', this.greatestPage).then((data) => {
        data.Search.forEach((result) => {
          promises.push(
            new Promise(() => {
              this.mySwiper.appendSlide(Slider.createSlideElement(result));
              return Slider.loadImage(result.Poster)
                .then((img) => {
                  const posterBlock = this.mySwiper.slides[
                    this.mySwiper.slides.length - 1
                  ].querySelector('.swiper-slide__poster-block');
                  console.log(posterBlock);

                  posterBlock.firstElementChild.remove();
                  posterBlock.append(img);
                })
                .catch((error) => console.error(error));
            }),
          );
        });
      });

      Promise.allSettled(promises).then(() => document.getElementById('loading-icon').classList.add('hide-loading')); */
    });
  }

  renderSearchResult(resultPromise) {
    const postersInfo = [];
    resultPromise
      .then((data) => {
        data.Search.forEach((result) => {
          const slideElement = Slider.createSlideElement(result);
          this.mySwiper.appendSlide(slideElement);
          postersInfo.push({ poster: result.Poster, element: slideElement });
        });
      })
      .then(() => {
        const posterPromises = [];
        postersInfo.forEach((object) => {
          // await setTimeout(()=>{},10000);
          posterPromises.push(Slider.loadImage(object.poster).then((img) => new Promise(() => {
            const posterBlock = object.element.querySelector('.swiper-slide__poster-block');
            if (posterBlock.firstElementChild) {
              posterBlock.firstElementChild.remove();
            }
            posterBlock.append(img);
          })));
        });
        Promise.all(posterPromises).then(() => {
          console.log('sdfsdfsdf');

          document.getElementById('loading-icon').classList.add('hide-loading');
        });
      });
  }

  static createSlideElement(slide) {
    const slideElement = document.createElement('div');
    slideElement.classList.add('swiper-slide');

    slideElement.innerHTML = `
    <div class="swiper-slide__title">${slide.Title}</div>
    <div class="swiper-slide__poster-block">
      <div class="spinner-border" role="status">
        <span  class="sr-only">Loading...</span>
      </div>
    </div>
    <div class="swiper-slide__year">${slide.Year}</div>
    <div class="swiper-slide__rating">
      <i class="swiper-slide__rating-star fa fa-star"></i>
      <span class="swiper-slide__rating-rank">${slide.imdbRating}</span>
    </div>
    `;

    return slideElement;
  }

  static loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', function () {
        this.onerror = null;
        this.src = './assets/img/poster-not-available.jpg';
        reject(new Error(`Failed to load image's URL: ${url}`));
      });
      img.src = url;
    });
  }
}
