function init_header() {
  const isMobile = {
    Android: () => navigator.userAgent.match(/Android/i),
    BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
    iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
    Opera: () => navigator.userAgent.match(/Opera Mini/i),
    Windows: () => navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i),
    any: function () {
      return (
        this.Android() ||
        this.BlackBerry() ||
        this.iOS() ||
        this.Opera() ||
        this.Windows()
      );
    },
  };

  if (isMobile.any()) {
    app.addClass(document.body, "_touch");
  } else {
    app.addClass(document.body, "_pc");
  }

  const iconMenu = app.queryOne(".menu__icon");
  const menuBody = app.queryOne(".menu__body");
  const header = app.queryOne(".header");

  if (iconMenu) {
    app.addEvents(iconMenu, "click", function (e) {
      app.toggleClass(iconMenu, "_active");
      app.toggleClass(menuBody, "_active");
      app.toggleClass(header, "_active");
      app.toggleClass(document.body, "_lock");
    });
  }

  const closeBurgerEls = app.queryAll('[data-close-burger]');
  app.addEvents(closeBurgerEls, 'click', () => {
    app.removeClass(iconMenu, "_active");
    app.removeClass(menuBody, "_active");
    app.removeClass(header, "_active");
    app.removeClass(document.body, "_lock");
  });

  // window.addEventListener("scroll", function () {
  //   let header = app.queryOne("header");
  //   if (window.pageYOffset > 50) {
  //     app.addClass(header, "_fixed");
  //   } else {
  //     app.removeClass(header, "_fixed");
  //   }
  // });
}

document.addEventListener('DOMContentLoaded', init_header);