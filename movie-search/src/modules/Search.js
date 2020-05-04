export default class Search {
  constructor() {
    this.searchInputElement = document.getElementById('searchInput');
  }

  init() {
    this.searchInputElement.focus();
  }
}
