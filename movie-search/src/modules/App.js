import Search from './Search';
import Slider from './Slider';
import Keyboard from './Keyboard';

export default class App {
  constructor() {
    this.virtualKeyboard = null;
  }

  init(language) {
    if (window.localStorage.getItem('keyboardLocalData')) {
      this.localData = JSON.parse(
        window.localStorage.getItem('keyboardLocalData'),
      );
    } else {
      this.localData = {
        language,
        inputValue: '',
      };
    }

    this.slider = new Slider('Sherlock');
    this.search = new Search(this.localData.inputValue);

    document.getElementById('button-keyboard').addEventListener('click', () => {
      if (!this.virtualKeyboard) {
        this.virtualKeyboard = new Keyboard(this.localData.language);
        this.virtualKeyboard.init();
        this.activateVirtualKeyboard();
      }
      this.search.searchInputElement.focus();
      this.virtualKeyboard.toggleShow();
    });

    this.slider.init();
    this.search.init(
      this.slider.renderSearchResult.bind(this.slider),
      this.slider.resetSlider.bind(this.slider),
    );
  }

  activateVirtualKeyboard() {
    document.addEventListener('keydown', (event) => {
      event.preventDefault();
      switch (this.virtualKeyboard.keyDown(event)) {
        case 'Backspace':
          this.search.backspace();
          break;

        case 'Delete':
          this.search.delete();
          break;
        case 'Tab':
          this.search.addChar('\t');
          break;
        case 'Enter':
          this.search.addChar('\n');
          break;
        case 'ArrowRight':
          this.search.addChar('→');
          break;
        case 'ArrowLeft':
          this.search.addChar('←');
          break;

        case 'ArrowUp':
          this.search.addChar('↑');
          break;
        case 'ArrowDown':
          this.search.addChar('↓');
          break;
        case 'ControlLeft':
        case 'ControlRight':
        case 'CapsLock':
          // this.search.selectionStart += 1;
          break;

        default:
          if (this.virtualKeyboard.elements.keyPressed) {
            this.search.addChar(this.virtualKeyboard.elements.keyPressed);
            this.virtualKeyboard.elements.keyPressed = '';
          }
          break;
      }
      this.search.value = this.search.searchInputElement.value;
      this.search.searchInputElement.selectionEnd = this.search.selectionStart;
    });

    document.addEventListener('keyup', (event) => {
      this.virtualKeyboard.keyUp(event);
    });

    let removePressedClass = true;

    this.virtualKeyboard.elements.keysContainer.addEventListener(
      'mousedown',
      (event) => {
        const ancestorKey = event.target.closest('.keyboard__key');
        if (event.target.classList.contains('keyboard__key') || ancestorKey) {
          if (ancestorKey) {
            ancestorKey.classList.add('keyboard__key-pressed');
            this.pressedButton = ancestorKey;
          } else {
            event.target.classList.add('keyboard__key-pressed');
            this.pressedButton = event.target;
          }
          const keyText = event.target.textContent;

          switch (keyText) {
            case 'Backspace':
              this.search.backspace();
              break;
            case 'Del':
              this.search.delete();
              break;
            case 'Caps lock':
              removePressedClass = !this.virtualKeyboard.capsToggle();
              break;
            case 'Enter':
              this.search.addChar('\n');
              break;
            case 'Tab':
              this.search.addChar('\t');
              break;
            case 'arrow_right':
              this.search.addChar('→');
              break;
            case 'arrow_left':
              this.search.addChar('←');
              break;
            case 'arrow_drop_up':
              this.search.addChar('↑');
              break;
            case 'arrow_drop_down':
              this.search.addChar('↓');
              break;

            case 'Alt':
            case 'Ctrl':
            case 'Shift':
              break;

            default:
              if (event.target.classList.contains('fa-globe')) {
                this.virtualKeyboard.changeLanguage();
              } else {
                this.search.addChar(keyText);
              }
              break;
          }
        }
      },
    );

    this.virtualKeyboard.elements.keysContainer.addEventListener(
      'mouseup',
      () => {
        if (
          !(this.pressedButton.textContent === 'Caps lock')
          || removePressedClass
        ) {
          this.pressedButton.classList.remove('keyboard__key-pressed');
        }
      },
    );

    this.search.searchInputElement.addEventListener('mouseup', () => {
      this.search.selectionStart = this.search.searchInputElement.selectionStart;
      this.search.value = this.search.searchInputElement.value;
    });

    this.search.searchInputElement.addEventListener('blur', () => {
      this.search.searchInputElement.focus();
      this.search.searchInputElement.selectionEnd = this.search.selectionStart;
      this.search.value = this.search.searchInputElement.value;
    });

    document
      .getElementById('close-virtual-keyboard')
      .addEventListener('click', this.virtualKeyboard.toggleShow);

    window.addEventListener('beforeunload', () => {
      this.localData.inputValue = this.search.searchInputElement.value;
      this.localData.language = this.virtualKeyboard.properties.language;
      window.localStorage.setItem(
        'keyboardLocalData',
        JSON.stringify(this.localData),
      );
    });
  }
}
