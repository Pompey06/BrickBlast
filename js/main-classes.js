class MainClass {
  constructor() { }

  queryAll(selectorOrElements, base = document) {
    if (typeof selectorOrElements === 'string') {
      // Use it as a selector to find elements and convert NodeList to Array
      return Array.from(base.querySelectorAll(selectorOrElements));
    } else if (selectorOrElements instanceof NodeList) {
      // Convert NodeList to Array
      return Array.from(selectorOrElements);
    } else if (selectorOrElements instanceof Element) {
      // If it's a single DOM Element, return it inside an array
      return [selectorOrElements];
    } else if (Array.isArray(selectorOrElements)) {
      // If it's already an array, return it directly
      return selectorOrElements;
    } else {
      // If none of the above, throw an error
      throw new TypeError("The queryAll method expects a CSS selector string, a single DOM element, an array, or a NodeList of DOM elements.");
    }
  }

  queryOne(selectorOrElement, base = document) {
    if (typeof selectorOrElement === 'string') {
      return base.querySelector(selectorOrElement);
    } else if (selectorOrElement) {
      return selectorOrElement;
    } else {
      throw new TypeError("The query method expects a CSS selector string or an array/NodeList of DOM elements.");
    }
  }

  forEach(selectorOrElements, callback) {
    const elements = this.queryAll(selectorOrElements);
    elements.forEach((element, index) => {
      callback(element, index);
    });
  }

  // EVENTS
  addEvents(selectorOrElements, event, handler) {
    this.forEach(selectorOrElements, (element) => {
      element.addEventListener(event, handler)
    });
  }

  removeEvents(selectorOrElements, event, handler) {
    this.forEach(selectorOrElements, (element) => {
      element.removeEventListener(event, handler);
    });
  }

  // CLASSES
  addClass(selectorOrElements, className) {
    this.forEach(selectorOrElements, (element) => {
      element.classList.add(className);
    });
  }

  removeClass(selectorOrElements, className) {
    this.forEach(selectorOrElements, (element) => {
      element.classList.remove(className);
    });
  }

  toggleClass(selectorOrElements, className) {
    this.forEach(selectorOrElements, (element) => {
      element.classList.toggle(className);
    });
  }
}

const app = new MainClass();