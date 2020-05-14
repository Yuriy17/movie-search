
import 'bootstrap';
import './assets/stylesheets/index.scss';
import App from './modules/App';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
