import API_KEY from '../../environment';

const corsAnywhere = 'https://cors-anywhere.herokuapp.com/';

function getImdbRating(searchResult) {
  return searchResult.Response === 'True'
    ? Promise.allSettled(searchResult.Search.map((result) => fetch(
      `${corsAnywhere}http://www.omdbapi.com/?apikey=${API_KEY}&i=${result.imdbID}`,
    ).then((res) => res.json())))
      .then((res) => {
        const responseWithRating = Object.assign(searchResult);
        res.forEach((element, index) => {
          if (element.value.imdbID === responseWithRating.Search[index].imdbID) {
            responseWithRating.Search[index].imdbRating = element.value.imdbRating;
          }
        });
        return responseWithRating;
      }) : false;
}

export async function search(title, greatestPage = 1) {
  return fetch(
    `${corsAnywhere}http://www.omdbapi.com/?apikey=${API_KEY}&s=${title}&page=${greatestPage}`,
  )
    .then((response) => response.json())
    .then((response) => getImdbRating(response))
    .catch((error) => console.error(error));
}

export function shuffle(arr) {
  let j;
  let temp;
  const newArr = [...arr];
  try {
    for (let i = newArr.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = newArr[j];
      newArr[j] = newArr[i];
      newArr[i] = temp;
    }
  } catch (e) {
    console.log(`Can't shuffle array \n ${e}`);
  }

  return newArr;
}

export function loadImage(url, slideElement) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => {
      const posterBlock = slideElement.querySelector(
        '.swiper-slide__poster-block',
      );
      if (posterBlock.firstElementChild) {
        posterBlock.firstElementChild.remove();
      }
      posterBlock.append(img);
      resolve(img);
    });
    img.addEventListener('error', function () {
      this.onerror = null;
      this.src = './assets/img/poster-not-available.jpg';
      reject(new Error(`Failed to load image's URL: ${url}`));
    });
    img.src = url;
  });
}

export function createSlideElement(slide) {
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

export function createElement(tag, ...classes) {
  const element = document.createElement(tag);
  element.classList.add(...classes);
  return element;
}
