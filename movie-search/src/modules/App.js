import Search from './Search';
import Slider from './Slider';

export default class App {
  constructor() {
    this.search = new Search();
    this.slider = new Slider();
  }

  init() {
    this.search.init();
  }
}
