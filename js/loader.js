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

      // Устанавливаем delay — строго по тому, что указано в data-delay
      const delayElements = sec1.querySelectorAll("[data-delay]");
      delayElements.forEach((el) => {
         const delay = el.getAttribute("data-delay");
         el.style.transitionDelay = `${delay}s`;
         el.style.animationDelay = `${delay}s`;
      });

      // Сначала убираем _animate, чтобы анимации не стартовали до отрисовки
      const animItems = sec1.querySelectorAll("[data-anim-on-scroll]");
      animItems.forEach((el) => {
         el.classList.remove("_animate");
      });

      // Ждём два animation frame, чтобы анимации не мигали
      requestAnimationFrame(() => {
         requestAnimationFrame(() => {
            animItems.forEach((el) => {
               el.classList.add("_animate");
            });
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

         // Прячем до загрузки
         gif.style.opacity = "0";

         const clone = new Image();
         clone.src = gif.src;

         clone.onload = () => {
            gif.style.opacity = "1";

            setTimeout(() => {
               if (!finished) {
                  finished = true;
                  finish();
               }
            }, 5500); // длительность анимации GIF
         };

         // Fallback если не загрузилось — максимум 10 сек
         setTimeout(() => {
            if (!finished) {
               finished = true;
               gif.style.opacity = "1";
               finish();
            }
         }, 10000);
      } else {
         setTimeout(finish, 5500);
      }
   });
}
