const swiperInstance = new Swiper(".console__swiper", {
   navigation: {
      nextEl: ".swiper__next",
      prevEl: ".swiper__prev",
   },
   on: {
      init: function () {
         updateNavigationArrows(this);
      },
      slideChange: function () {
         updateNavigationArrows(this);
      },
   },
});

function updateNavigationArrows(swiper) {
   const prevEl = document.querySelector(".swiper__prev");
   const nextEl = document.querySelector(".swiper__next");

   if (swiper.activeIndex === 0) {
      // Первый слайд: скрываем левую стрелку, показываем правую
      prevEl.style.display = "none";
      nextEl.style.display = "block";
   } else if (swiper.isEnd) {
      // Последний слайд: скрываем обе стрелки
      prevEl.style.display = "none";
      nextEl.style.display = "none";
   } else {
      // Для остальных слайдов показываем обе стрелки
      prevEl.style.display = "block";
      nextEl.style.display = "block";
   }
}

const consoleWrap = document.querySelector("[data-console]");
const consoleFirst = document.querySelector(".console__first");
const consoleLast = document.querySelector(".console__last");

// btns
function initBtns() {
   const btns = document.querySelectorAll("[data-btn]");
   btns.forEach((btn) => {
      const onHandlePress = btn.getAttribute("data-btn");
      onPressWithRelease(
         btn,
         () => {
            btn.classList.add("_active");
            if (typeof window[onHandlePress] === "function") {
               window[onHandlePress]();
            }
         },
         () => {
            btn.classList.remove("_active");
         }
      );
   });
}

function initDradBtns() {
   const dpad = document.querySelector("[data-dpad]");
   const dpadNext = document.querySelector("[data-dpad-next]");
   const dpadPrev = document.querySelector("[data-dpad-prev]");

   const swiperNext = document.querySelector(".swiper__next");
   const swiperPrev = document.querySelector(".swiper__prev");

   onPressWithRelease(
      dpadNext,
      () => {
         if (!isStartConsole()) {
            dpad.classList.add("_next");
            swiperInstance.slideNext();
            showSwiperScreen();
         }
      },
      () => {
         dpad.classList.remove("_next");
      }
   );

   onPressWithRelease(
      dpadPrev,
      () => {
         if (!isStartConsole()) {
            dpad.classList.add("_prev");
            swiperInstance.slidePrev();
            showSwiperScreen();
         }
      },
      () => {
         dpad.classList.remove("_prev");
      }
   );
}

function initConsole() {
   showStartScreen();
}

function onPressWithRelease(el, onPressCallback, onReleaseCallback) {
   el.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      onPressCallback();
   });

   el.addEventListener("pointerup", () => {
      onReleaseCallback();
   });

   el.addEventListener("pointercancel", () => {
      onReleaseCallback();
   });
}

function showStartScreen() {
   consoleWrap.classList.add("_start");
   consoleWrap.classList.remove("_show_swiper");
   consoleWrap.classList.remove("_trailer");
}

function showTrailerScreen() {
   consoleWrap.classList.add("_trailer");
   consoleWrap.classList.remove("_show_swiper");
   consoleWrap.classList.remove("_start");
}

function showSwiperScreen() {
   consoleWrap.classList.add("_show_swiper");
   consoleWrap.classList.remove("_start");
   consoleWrap.classList.remove("_trailer");
}

function isStartConsole() {
   return !!consoleWrap.classList.contains("_start");
}

function onStartConsole() {
   console.log("start");
   showSwiperScreen();
}

function onTrailerConsole() {
   console.log("trailer");
   showTrailerScreen();
}

function onPressA() {
   if (swiperInstance.isEnd) {
      window.location.href = "game.html";
   }
}

function onPressB() {
   if (swiperInstance.isEnd) {
      swiperInstance.slideTo(0);
   }
}

initDradBtns();
initBtns();
initConsole();
//showSwiperScreen();

document.querySelectorAll("[data-console-last]").forEach((block) => {
   const video = block.querySelector(".content__video");
   const playWrapper = block.querySelector(".video__play-wrapper");

   // Старт по кастомной кнопке
   playWrapper.addEventListener("click", () => {
      video.setAttribute("controls", "true");
      video.play();
      playWrapper.classList.add("hidden");
   });

   // При паузе — вернуть кнопку
   video.addEventListener("pause", () => {
      playWrapper.classList.remove("hidden");
   });

   // При продолжении — снова убрать кнопку
   video.addEventListener("play", () => {
      playWrapper.classList.add("hidden");
   });
});

const consoleEl = document.querySelector(".console");
let maxScroll = 0;
const threshold = 600;

window.addEventListener("scroll", function () {
   const currentScroll = window.pageYOffset;
   if (currentScroll > maxScroll) {
      maxScroll = currentScroll;
   }
   if (maxScroll >= threshold) {
      consoleEl.style.setProperty("--console-translateY", "0px");
      consoleEl.style.opacity = 1;
   } else {
      const translateY = maxScroll - threshold; // от -600 до 0
      consoleEl.style.setProperty("--console-translateY", `${translateY}px`);
      consoleEl.style.opacity = maxScroll / threshold;
   }
});

let backgroundRevealed = false;

function revealBackgroundElements() {
   // Задаём порядок появления
   const order = [
      ".blue_crystal",
      ".pink_crystal",
      ".star1",
      ".star3",
      ".yellow_cube",
      ".star4",
      ".green_cube",
      ".green_crystal",
      ".star2",
   ];

   order.forEach((selector, index) => {
      setTimeout(() => {
         const el = document.querySelector(selector);
         if (el) {
            el.style.opacity = 1;
         }
      }, index * 200); // задержка 300ms между каждым элементом
   });

   // После того как все элементы появились, добавляем анимацию к звёздам
   setTimeout(() => {
      document.querySelectorAll(".star1, .star2, .star3, .star4").forEach((star) => {
         star.classList.add("anim");
      });
   }, order.length * 200); // дополнительная задержка после последнего элемента
}

window.addEventListener("scroll", function () {
   // Если пользователь прокрутил страницу вниз хотя бы на threshold пикселей и анимация ещё не запускалась:
   if (window.pageYOffset >= threshold && !backgroundRevealed) {
      backgroundRevealed = true;
      revealBackgroundElements();
   }
});
