import { search } from '../utils/utils';

export default class Search {
  constructor() {
    this.searchForm = document.getElementById('searchForm');
    this.searchInputElement = this.searchForm.querySelector(
      '.search-form__input',
    );
  }


  init(appendSlides, resetSlider) {
    this.searchInputElement.focus();
    this.searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      resetSlider();
      const inputElement = e.target[0];
      const searchResult = await search(inputElement.value);
      appendSlides(searchResult);
    });
  }
}
