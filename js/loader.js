// ===== Loader & Section Toggle Logic =====

// 1. Определяем тип навигации
let navType = "navigate";
const [navEntry] = performance.getEntriesByType("navigation");
if (navEntry) {
   navType = navEntry.type;
} else if (performance.navigation) {
   const t = performance.navigation.type;
   if (t === performance.navigation.TYPE_RELOAD) navType = "reload";
   else if (t === performance.navigation.TYPE_BACK_FORWARD) navType = "back_forward";
}

// 2. Флаг — показывали ли лоадер в этой сессии
const shown = sessionStorage.getItem("loaderShown") === "true";

// 3. Решаем, показывать ли лоадер сейчас (при reload или первом заходе)
const shouldShow = navType === "reload" || !shown;

// 4. Ссылки на элементы
const loader = document.getElementById("page-loader");
const sec1 = document.getElementById("info-loader");
const sec2 = document.getElementById("info-noloader");

// 5. Функция завершения работы лоадера и показа секций
function finish() {
   loader.classList.add("hidden");
   document.documentElement.classList.remove("loading");
   document.documentElement.classList.add("loaded");
   document.body.classList.remove("loading");
   document.body.classList.add("loaded");

   if (shouldShow) {
      sec1.classList.remove("hidden");
      sec2.classList.add("hidden");

      // Сброс и рестарт анимаций — без переписывания delay
      const animItems = sec1.querySelectorAll("[data-anim-on-scroll]");
      animItems.forEach((el) => el.classList.remove("_animate"));

      requestAnimationFrame(() => {
         requestAnimationFrame(() => {
            animItems.forEach((el) => el.classList.add("_animate"));
         });
      });
   } else {
      sec1.classList.add("hidden");
      sec2.classList.remove("hidden");
   }

   handleParallax();
   window.addEventListener("scroll", handleParallax);
}

// 6. Сразу скрываем или показываем loader до любой отрисовки
if (!shouldShow) {
   loader.classList.add("hidden");
   sec1.classList.add("hidden");
   sec2.classList.remove("hidden");
   initSwiper();
   document.documentElement.classList.add("loaded");
   document.body.classList.add("loaded");
   handleParallax();
   window.addEventListener("scroll", handleParallax);
} else {
   sessionStorage.setItem("loaderShown", "true");
   document.documentElement.classList.add("loading");
   document.body.classList.add("loading");
   sec1.classList.remove("hidden");
   sec2.classList.add("hidden");

   window.addEventListener("load", () => {
      const gif = document.querySelector(".loader__gif--pc") || document.querySelector(".loader__gif--mobile");

      if (gif && gif.tagName === "IMG") {
         let finished = false;

         // Показываем сразу, как только начинаем загружать
         gif.style.opacity = "1";

         // Запускаем finish через 5.5 секунд — независимо от загрузки гифки
         setTimeout(() => {
            if (!finished) {
               finished = true;
               finish();
            }
         }, 5500);

         // Fallback: если гифка вообще не грузится, все равно заканчиваем максимум через 10 сек
         setTimeout(() => {
            if (!finished) {
               finished = true;
               finish();
            }
         }, 10000);
      } else {
         setTimeout(finish, 5500);
      }
   });
}
