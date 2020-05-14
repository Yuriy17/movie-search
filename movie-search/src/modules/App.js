import Search from './Search';
import Slider from './Slider';

export default class App {
  constructor() {
    this.slider = new Slider();
    this.search = new Search();
  }

  init() {
    this.slider.init(Search.search);
    this.search.init(
      this.slider.appendSlides.bind(this.slider),
      this.slider.getGreatestPage.bind(this.slider),
    );
  }
}
