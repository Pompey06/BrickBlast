// ===== Loader & Section Toggle Logic =====

// 1. Определяем тип навигации
let navType = "navigate";
const [navEntry] = performance.getEntriesByType("navigation");
if (navEntry) {
   navType = navEntry.type; // "navigate" | "reload" | "back_forward"
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
   } else {
      sec1.classList.add("hidden");
      sec2.classList.remove("hidden");
   }

   handleParallax();
   window.addEventListener("scroll", handleParallax);
}

// 6. Сразу скрываем или показываем loader до любой отрисовки
if (!shouldShow) {
   // без лоудера — сразу скрыть и показать нужную секцию
   loader.classList.add("hidden");
   sec1.classList.add("hidden");
   sec2.classList.remove("hidden");
   document.documentElement.classList.add("loaded");
   document.body.classList.add("loaded");
   handleParallax();
   window.addEventListener("scroll", handleParallax);
} else {
   // с лоудером — блокируем скролл сразу
   sessionStorage.setItem("loaderShown", "true");
   document.documentElement.classList.add("loading");
   document.body.classList.add("loading");
   sec1.classList.remove("hidden");
   sec2.classList.add("hidden");

   // по load показываем секцию и скрываем loader через delay
   window.addEventListener("load", () => {
      const delay = window.innerWidth <= 1080 ? 4000 : 5000;
      setTimeout(finish, delay);
   });
}
