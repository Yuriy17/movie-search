import { apiKey } from '../utils/constants';

export default class Search {
  constructor(createSlideElement) {
    this.createSlideElement = createSlideElement;
    this.searchForm = document.getElementById('searchForm');
    this.searchInputElement = this.searchForm.querySelector(
      '.search-form__input',
    );
  }


  init(swiper) {
    this.searchInputElement.focus();
    this.searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      // const formData = new FormData(this);
      const searchResult = await Search.search('action');
      searchResult.Search.forEach((result) => {
        swiper.appendSlide(this.createSlideElement(result));
      });
      // const promises = searchResult.Search.map((result) => new Promise((resolve, reject) => this.createSlideElement(result)));
      // console.log(imagesResult);
    });
  }

  static async search(title) {
    const results = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${title}&page=2`)
      .then((response) => response.json())
      .catch((error) => console.error(error));
    console.log(results);
    return results;
  }
}
/* const obj = {
  Title: 'Run',
  Year: '1991',
  Rated: 'R',
  Released: '01 Feb 1991',
  Runtime: '91 min',
  Genre: 'Action, Drama, Thriller',
  Director: 'Geoff Burrowes',
  Writer: 'Dennis Shryack, Michael Blodgett',
  Actors: 'Patrick Dempsey, Kelly Preston, Ken Pogue, A.C. Peterson',
  Plot:
    'When a law student accidentally kills the son of a mob boss in a fight, he finds himself relentlessly pursued by the mob and the police.',
  Language: 'English',
  Country: 'USA, Canada',
  Awards: 'N/A',
  Poster:
    'https://m.media-amazon.com/images/M/MV5BMWI2ZDg1YjQtZDIzNi00NGMwLWJiOTUtZWNiZDAwMzE3NTUxXkEyXkFqcGdeQXVyNjExODE1MDc@._V1_SX300.jpg',
  Ratings: [
    { Source: 'Internet Movie Database', Value: '6.3/10' },
    { Source: 'Rotten Tomatoes', Value: '0%' },
  ],
  Metascore: 'N/A',
  imdbRating: '6.3',
  imdbVotes: '2,424',
  imdbID: 'tt0102818',
  Type: 'movie',
  DVD: 'N/A',
  BoxOffice: 'N/A',
  Production: 'N/A',
  Website: 'N/A',
  Response: 'True',
};
 */
