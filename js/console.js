new Swiper(".console__swiper", {
   navigation: {
      nextEl: ".swiper__next",
      prevEl: ".swiper__prev",
   },
});

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
         dpad.classList.add("_next");
         swiperNext.click();
         showSwiperScreen();
      },
      () => {
         dpad.classList.remove("_next");
      }
   );

   onPressWithRelease(
      dpadPrev,
      () => {
         dpad.classList.add("_prev");
         swiperPrev.click();
         showSwiperScreen();
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
   // press
   el.addEventListener("touchstart", () => {
      onPressCallback();
   });

   el.addEventListener("mousedown", () => {
      onPressCallback();
   });

   // release
   el.addEventListener("touchend", () => {
      onReleaseCallback();
   });

   el.addEventListener("mouseup", () => {
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

function onStartConsole() {
   console.log("start");
   showSwiperScreen();
}

function onTrailerConsole() {
   console.log("trailer");
   showTrailerScreen();
}

function onPressA() {
   console.log("press a");
}

function onPressB() {
   console.log("press b");
}

initDradBtns();
initBtns();
initConsole();
