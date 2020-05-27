import Search from './Search';
import Slider from './Slider';

export default class App {
  constructor() {
    this.slider = new Slider('Sherlock');
    this.search = new Search();
  }

  init() {
    this.slider.init();
    this.search.init(
      this.slider.renderSearchResult.bind(this.slider),
      this.slider.resetSlider.bind(this.slider),
    );
  }
}
