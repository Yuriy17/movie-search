import Search from './Search';
import Slider from './Slider';

export default class App {
  constructor() {
    this.slider = new Slider();
    this.search = new Search(Slider.createSlideElement);
  }

  init() {
    this.slider.init();
    this.search.init(this.slider.mySwiper);
  }
}
