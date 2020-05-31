import { createElement } from '../utils/utils';
import database from '../utils/buttons';

class Keyboard {
  constructor(language = 'ENGLISH') {
    this.elements = {
      keysContainer: null,
      keys: database.buttons,
      keysNodes: [],
      keyPressed: null,
    };

    this.properties = {
      language,
      capsLock: false,
      altKey: false,
      shiftKey: false,
    };
  }

  init() {
    this.elements.keysContainer = document
      .getElementById('virtual-keyboard')
      .querySelector('.card-body');
    this.elements.keysContainer.append(this.render());
  }

  // eslint-disable-next-line class-methods-use-this
  toggleShow() {
    document.getElementById('virtual-keyboard').classList.toggle('hide');
  }

  render() {
    const keyboardFragment = document.createDocumentFragment();
    this.elements.keysContainer = createElement('div', 'keyboard');
    this.elements.keysContainer.append(...this._createKeys());
    keyboardFragment.append(this.elements.keysContainer);
    return keyboardFragment;
  }

  _createKeys() {
    const nodeRows = [];
    const { language } = this.properties;

    nodeRows.push(createElement('div', 'keyboard__row'));

    this.elements.keys.forEach((element) => {
      const button = createElement('button', 'keyboard__key');
      this.elements.keysNodes.push(button);
      const currentRow = nodeRows[nodeRows.length - 1];

      switch (element.type) {
        case 'CONTROL':
          button.innerHTML = element.title === 'Language'
            ? '<i class="fa fa-globe"></i>'
            : element.title;

          currentRow.append(button);
          if (element.code === 'ShiftRight') {
            button.classList.add('keyboard__key-medium');
            nodeRows.push(createElement('div', 'keyboard__row'));
          } else if (
            element.code === 'ShiftLeft'
            || element.code === 'CapsLock'
          ) {
            button.classList.add('keyboard__key-medium');
          } else {
            button.classList.add('keyboard__key-small');
          }
          break;

        case 'NAVIGATION':
          if (
            element.code === 'Backspace'
            || element.code === 'Enter'
            || element.code === 'Delete'
          ) {
            currentRow.append(button);
            button.classList.add(
              element.code === 'Delete'
                ? 'keyboard__key-small'
                : 'keyboard__key-large',
            );
            button.innerHTML = element.title;
            nodeRows.push(createElement('div', 'keyboard__row'));
          } else {
            button.classList.add('keyboard__key-small');
            let arrowClass;
            if (element.code === 'ArrowLeft') {
              arrowClass = 'fa-caret-left';
              currentRow.append(button);
            } else if (element.code === 'ArrowRight') {
              arrowClass = 'fa-caret-right';
              currentRow.append(button);
            } else if (element.code === 'ArrowUp') {
              arrowClass = 'fa-caret-up';
              const keyBlock = createElement('div', 'keyboard__key-block');
              keyBlock.append(button);
              currentRow.append(keyBlock);
            } else if (element.code === 'ArrowDown') {
              arrowClass = 'fa-caret-down';
              currentRow.lastChild.append(button);
            }
            const icon = createElement('i', 'fa', arrowClass);
            button.append(icon);
          }

          break;

        case 'CHAR':
          currentRow.append(button);
          if (element.code === 'Space') {
            button.classList.add('keyboard__key-space');
          } else {
            button.classList.add('keyboard__key-small');
          }
          if (element.code === 'Tab') {
            button.innerHTML = element.title;
          } else {
            button.innerHTML = element[language].default;
          }
          break;

        default:
          break;
      }
    });
    return nodeRows;
  }

  // eslint-disable-next-line consistent-return
  keyDown(event) {
    const { altKey, shiftKey } = this.properties;

    this.elements.keys.forEach((element, index) => {
      if (element.code === event.code) {
        this.elements.keysNodes[index].classList.toggle(
          'keyboard__key-pressed',
        );

        if (element.type === 'CHAR') {
          const char = this.elements.keysNodes[index].innerHTML;
          switch (char) {
            case '&amp;':
              this.elements.keyPressed = '&';
              break;
            case '&lt;':
              this.elements.keyPressed = '<';
              break;
            case '&gt;':
              this.elements.keyPressed = '>';
              break;
            default:
              this.elements.keyPressed = char;
              break;
          }
        }
      }
    });

    if (
      event.code === 'Backspace'
      || event.code === 'Enter'
      || event.code === 'Delete'
      || event.code === 'CapsLock'
      || event.code === 'Tab'
      || event.code === 'ControlLeft'
      || event.code === 'ControlRight'
      || event.code.substring(0, 5) === 'Arrow'
    ) {
      return event.code;
    }

    const isCurrentShift = !!(
      event.code === 'ShiftLeft' || event.code === 'ShiftRight'
    );
    const isCurrentAlt = !!(
      event.code === 'AltLeft' || event.code === 'AltRight'
    );
    if (altKey && !shiftKey && isCurrentShift && event.key === 'GroupNext') {
      this.properties.shiftKey = true;
      this.changeLanguage();
    } else if (
      shiftKey
      && !altKey
      && isCurrentAlt
      && event.key === 'GroupNext'
    ) {
      this.properties.altKey = true;
      this.changeLanguage();
    } else if (isCurrentAlt && !altKey) {
      this.properties.altKey = true;
    } else if (isCurrentShift && !shiftKey) {
      this.properties.shiftKey = true;
    }
  }

  keyUp(event) {
    const { altKey, shiftKey } = this.properties;
    const { keysNodes, keys } = this.elements;
    let { keyPressed } = this.elements;

    if (keyPressed) {
      keyPressed = '';
    }

    keys.forEach((element, index) => {
      if (element.code === event.code) {
        const currentNode = keysNodes[index];
        if (event.code === 'CapsLock') {
          this.capsToggle();
        } else {
          currentNode.classList.remove('keyboard__key-pressed');
        }
      }
    });

    if ((event.code === 'AltLeft' || event.code === 'AltRight') && altKey) {
      this.properties.altKey = false;
    } else if (
      (event.code === 'ShiftLeft' || event.code === 'ShiftRight')
      && shiftKey
    ) {
      this.properties.shiftKey = false;
    }
  }

  capsToggle() {
    const { language } = this.properties;
    const { keys } = this.elements;
    this.properties.capsLock = !this.properties.capsLock;
    keys.forEach((element, index) => {
      if (element[language] && element.code !== 'Tab') {
        const keysNode = this.elements.keysNodes[index];
        keysNode.innerHTML = this.properties.capsLock
          ? element[language].shift
          : element[language].default;
      }
    });
    return this.properties.capsLock;
  }

  changeLanguage() {
    this.properties.language = this.properties.language === 'ENGLISH' ? 'RUSSIAN' : 'ENGLISH';

    const { language, capsLock } = this.properties;
    const { keys, keysNodes } = this.elements;

    keys.forEach((element, index) => {
      if (element[language] && element.code !== 'Tab') {
        keysNodes[index].innerHTML = capsLock
          ? element[language].shift
          : element[language].default;
      }
    });
  }
}

export default Keyboard;
