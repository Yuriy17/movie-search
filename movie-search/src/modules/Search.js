import { search } from '../utils/utils';

export default class Search {
  constructor(inputValue = '') {
    this.searchForm = document.getElementById('searchForm');
    this.searchInputElement = this.searchForm.querySelector(
      '.search-form__input',
    );
    this.value = inputValue;
    this.selectionStart = inputValue.length;
    this.searchInputElement.value = this.value;
  }


  init(renderSearchResult, resetSlider) {
    this.searchInputElement.focus();
    this.searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      resetSlider();
      const inputElement = e.target[0];
      renderSearchResult(search(inputElement.value));
    });
  }

  delete() {
    this.searchInputElement.value = this.value.substring(0, this.selectionStart)
    + this.value.substring(this.selectionStart + 1, this.value.length);
  }

  backspace() {
    if (this.selectionStart >= 1) {
      this.searchInputElement.value = this.value.substring(0, this.selectionStart - 1)
    + this.value.substring(this.selectionStart, this.value.length);
      this.selectionStart -= 1;
    }
  }

  addChar(symbol) {
    console.log(this.selectionStart);
    console.log(this.value);


    this.searchInputElement.value = this.value.substring(0, this.selectionStart)
    + symbol
    + this.value.substring(this.selectionStart, this.value.length);
    this.selectionStart += 1;
  }
}
