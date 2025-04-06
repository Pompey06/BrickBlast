window.addEventListener("scroll", function () {
   const scrollOffset = window.pageYOffset;

   // Обработка cube-wrapper (оставляем как есть)
   document.querySelectorAll(".cube-wrapper").forEach((wrapper) => {
      let factor = wrapper.getAttribute("data-parallax-factor");
      factor = factor ? parseFloat(factor) : 0.2;
      const parallaxOffset = scrollOffset * factor;

      const img = wrapper.querySelector("img");
      if (img) {
         img.style.transform = `translateY(${parallaxOffset}px)`;
      }
   });

   // Обработка .crystal
   document.querySelectorAll(".crystal").forEach((crystal) => {
      let factor = crystal.getAttribute("data-parallax-factor");
      factor = factor ? parseFloat(factor) : 0.2;
      const partners = document.querySelector(".partners");
      const partnersOffset = partners.offsetTop * 0.5;
      let parallaxOffset = (scrollOffset - partnersOffset) * factor;
      parallaxOffset = parallaxOffset > 0 ? parallaxOffset : 0;

      if (scrollOffset - partners.offsetTop < -300) crystal.style.transform = `translateY(${parallaxOffset}px)`;
   });

   document
      .querySelectorAll(
         ".coin1, .coin2, .blue, .green, .purple, .yellow, .blue_circle, .green_circle, .purple_circle, .yellow_circle"
      )
      .forEach((el) => {
         let factor = el.getAttribute("data-parallax-factor");
         factor = factor ? parseFloat(factor) : 0.2;

         const parallaxOffset = scrollOffset * factor;

         // Смещаем вверх на 300px изначально
         el.style.transform = `translateY(${parallaxOffset - 300}px)`;
      });
});

const Engine = Matter.Engine,
   Render = Matter.Render,
   Runner = Matter.Runner,
   World = Matter.World,
   Bodies = Matter.Bodies,
   Body = Matter.Body,
   Mouse = Matter.Mouse,
   MouseConstraint = Matter.MouseConstraint;

// Создаем движок и мир
const engine = Engine.create();
const world = engine.world;

function getCanvasHeight() {
   const width = window.innerWidth;
   if (width > 2400) {
      return 850;
   } else if (width > 1600) {
      return 700;
   } else if (width > 1100) {
      return 600;
   } else if (width > 700) {
      return 600;
   } else {
      return 500;
   }
}

// Рендерер на всю ширину экрана
const render = Render.create({
   element: document.getElementById("partners-physics"),
   engine: engine,
   options: {
      width: window.innerWidth,
      height: getCanvasHeight(),
      // Попробуйте временно wireframes: true, чтобы увидеть реальный размер тел
      wireframes: false,
      background: "transparent",
   },
});

document.querySelector("#partners-physics").addEventListener("wheel", function (e) {
   e.stopPropagation();
   // Можно добавить обработку события для прокрутки тут, если нужно
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

/**
 * Создание дуги из сегментов (как в вашем коде)
 */
function createArcBody(centerX, centerY, radius, segmentCount, curveStrength = 0.8) {
   const segments = [];
   const segmentAngle = Math.PI / segmentCount;
   const thickness = 3;

   for (let i = 0; i < segmentCount; i++) {
      const angle1 = i * segmentAngle;
      const angle2 = (i + 1) * segmentAngle;

      const x1 = centerX + radius * Math.cos(angle1) + 2;
      const y1 = centerY + radius * Math.sin(angle1) * curveStrength + 2;
      const x2 = centerX + radius * Math.cos(angle2) + 2;
      const y2 = centerY + radius * Math.sin(angle2) * curveStrength + 2;

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      const segment = Bodies.rectangle(midX, midY, length, thickness, {
         isStatic: true,
         angle: angle,
         render: {
            //fillStyle: "#3498db",
            //strokeStyle: "#2980b9",
            //lineWidth: 2,
            visible: false,
         },
      });

      segments.push(segment);
   }

   return Body.create({
      parts: segments,
      isStatic: true,
   });
}

// Инициализация дуги
// Функция линейной интерполяции
// Функция линейной интерполяции
function lerp(a, b, t) {
   return a + (b - a) * t;
}

// Функция для получения параметров дуги по текущей ширине экрана
function getArcParams(width) {
   // Контрольные точки для диапазонов ширины (от большего к меньшему)
   const controlPoints = [
      { width: 2600, centerY: 30, divisor: 2.02, curveStrength: 0.42 },
      { width: 2560, centerY: 55, divisor: 2.06, curveStrength: 0.43 },
      { width: 2500, centerY: 90, divisor: 2.06, curveStrength: 0.42 },
      { width: 2400, centerY: -25, divisor: 2.03, curveStrength: 0.42 },
      { width: 2300, centerY: 15, divisor: 2.02, curveStrength: 0.42 },
      { width: 2200, centerY: 55, divisor: 2.02, curveStrength: 0.43 },
      { width: 2100, centerY: 95, divisor: 2.02, curveStrength: 0.43 },
      { width: 2000, centerY: 135, divisor: 2.02, curveStrength: 0.43 },
      { width: 1900, centerY: 175, divisor: 2.01, curveStrength: 0.43 },
      { width: 1800, centerY: 215, divisor: 2.01, curveStrength: 0.43 },
      { width: 1700, centerY: 255, divisor: 2.01, curveStrength: 0.43 },
      { width: 1650, centerY: 286, divisor: 2.01, curveStrength: 0.43 },
      { width: 1600, centerY: 200, divisor: 1.98, curveStrength: 0.43 },
      { width: 1500, centerY: 236, divisor: 1.96, curveStrength: 0.44 },
      { width: 1400, centerY: 80, divisor: 1.96, curveStrength: 0.44 },
      { width: 1300, centerY: 120, divisor: 1.96, curveStrength: 0.44 },
      { width: 1200, centerY: 160, divisor: 1.96, curveStrength: 0.44 },
      { width: 1100, centerY: 113, divisor: 1.96, curveStrength: 0.44 },
      { width: 1000, centerY: 150, divisor: 1.94, curveStrength: 0.45 },
      { width: 900, centerY: 197, divisor: 1.94, curveStrength: 0.45 },
      { width: 800, centerY: 235, divisor: 1.94, curveStrength: 0.45 },
      { width: 700, centerY: 185, divisor: 1.94, curveStrength: 0.45 },
      { width: 600, centerY: 230, divisor: 1.94, curveStrength: 0.45 },
      { width: 500, centerY: 280, divisor: 1.94, curveStrength: 0.45 },
      { width: 400, centerY: 325, divisor: 1.94, curveStrength: 0.45 },
      { width: 0, centerY: 620, divisor: 1.94, curveStrength: 0.45 },
   ];

   // Ищем две соседние контрольные точки, между которыми лежит текущая ширина
   for (let i = 0; i < controlPoints.length - 1; i++) {
      const cpHigh = controlPoints[i];
      const cpLow = controlPoints[i + 1];
      if (width <= cpHigh.width && width >= cpLow.width) {
         // Вычисляем t: 0 при нижней границе, 1 при верхней
         const t = (width - cpLow.width) / (cpHigh.width - cpLow.width);
         const centerY = lerp(cpLow.centerY, cpHigh.centerY, t);
         const divisor = lerp(cpLow.divisor, cpHigh.divisor, t);
         const curveStrength = lerp(cpLow.curveStrength, cpHigh.curveStrength, t);
         return {
            centerX: width / 2,
            centerY: centerY,
            radius: width / divisor,
            segmentCount: 100,
            curveStrength: curveStrength,
         };
      }
   }
   // Если ширина больше максимальной контрольной точки:
   if (width >= controlPoints[0].width) {
      const cp = controlPoints[0];
      return {
         centerX: width / 2,
         centerY: cp.centerY,
         radius: width / cp.divisor,
         segmentCount: 100,
         curveStrength: cp.curveStrength,
      };
   }
   // Если ширина меньше минимальной:
   const cp = controlPoints[controlPoints.length - 1];
   return {
      centerX: width / 2,
      centerY: cp.centerY,
      radius: width / cp.divisor,
      segmentCount: 100,
      curveStrength: cp.curveStrength,
   };
}

// Изначальное создание дуги при загрузке страницы
let currentWidth = window.innerWidth;
const arcParams = getArcParams(currentWidth);
let arc = createArcBody(
   arcParams.centerX,
   arcParams.centerY,
   arcParams.radius,
   arcParams.segmentCount,
   arcParams.curveStrength
);
World.add(world, arc);

// Обновляем канвас и дугу при изменении размера окна
window.addEventListener("resize", () => {
   const newWidth = window.innerWidth;
   // Обновляем размеры канваса Matter.js
   render.options.width = newWidth;
   render.canvas.width = newWidth;
   // Получаем новые параметры дуги
   const newArcParams = getArcParams(newWidth);
   // Удаляем старую дугу
   World.remove(world, arc);
   // Создаем новую дугу с обновленными параметрами
   arc = createArcBody(
      newArcParams.centerX,
      newArcParams.centerY,
      newArcParams.radius,
      newArcParams.segmentCount,
      newArcParams.curveStrength
   );
   World.add(world, arc);
});

// При ресайзе пересоздаем дугу
window.addEventListener("resize", () => {
   const newWidth = window.innerWidth;
   render.options.width = newWidth;
   render.canvas.width = newWidth;

   // Удаляем старую дугу
   World.remove(world, arc);

   // Выбираем параметры в зависимости от новой ширины экрана
   let newArc;
   if (newWidth < 2600) {
      newArc = createArcBody(window.innerWidth / 2, -1000, window.innerWidth / 2.05, 100, 0.42);
   } else if (newWidth < 1920) {
      newArc = createArcBody(window.innerWidth / 2, 80, window.innerWidth / 2.05, 100, 0.42);
   } else {
      newArc = createArcBody(newWidth / 2, 80, newWidth / 2, 120, 0.4);
   }

   arc = newArc;
   World.add(world, arc);

   // Обновляем позицию правой стены
   Body.setPosition(rightWall, {
      x: newWidth + wallThickness / 2,
      y: worldHeight / 2,
   });
});

// Границы по бокам
const wallThickness = 100; // достаточно толстые, чтобы точно не пролетели
const worldHeight = 600;

const leftWall = Bodies.rectangle(-wallThickness / 2, worldHeight / 2, wallThickness, worldHeight, {
   isStatic: true,
   render: { visible: false },
});

const rightWall = Bodies.rectangle(window.innerWidth + wallThickness / 2, worldHeight / 2, wallThickness, worldHeight, {
   isStatic: true,
   render: { visible: false },
});

World.add(world, [leftWall, rightWall]);

/**
 * Создание логотипа с реалистичными физическими параметрами
 */
function createLogoAuto(texture, xOffset, yOffset, bodyWidth) {
   return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
         // Вычисляем соотношение сторон оригинальной картинки
         const imageRatio = img.width / img.height;
         // Определяем высоту физического тела на основе заданной ширины и соотношения
         const bodyHeight = bodyWidth / imageRatio;
         // Вычисляем коэффициент масштабирования для картинки:
         const scale = bodyWidth / img.width;

         // Создаем физическое тело с заданными размерами
         const body = Bodies.rectangle(window.innerWidth / 2 + xOffset, yOffset, bodyWidth, bodyHeight, {
            restitution: 1,
            friction: 0.1,
            frictionStatic: 0.3,
            frictionAir: 0.01,
            density: 0.002,
            collisionFilter: { group: 0 },
            chamfer: { radius: 26.598 },
            render: {
               sprite: {
                  texture: texture,
                  // Устанавливаем масштаб спрайта так, чтобы картинка отображалась в том же размере, что и тело:
                  xScale: scale,
                  yScale: scale,
               },
            },
         });

         const randomAngle = Math.random() * Math.PI * 2;
         const randomVelocityX = (Math.random() - 0.5) * 2;
         const randomAngularVelocity = (Math.random() - 0.5) * 0.05;

         Body.setAngle(body, randomAngle);
         Body.setVelocity(body, { x: randomVelocityX, y: 0 });
         Body.setAngularVelocity(body, randomAngularVelocity);

         resolve(body);
      };
      img.src = texture;
   });
}

document.addEventListener("DOMContentLoaded", () => {
   // Функция, возвращающая размеры логотипов в зависимости от ширины экрана
   function getLogoSizes() {
      const width = window.innerWidth;
      if (width > 1600) {
         return { logo1: 293, logo2: 448, logo3: 363, logo4: 248, logo5: 430 };
      } else if (width > 1100) {
         return { logo1: 230, logo2: 360, logo3: 300, logo4: 180, logo5: 360 };
      } else if (width > 768) {
         return { logo1: 180, logo2: 280, logo3: 260, logo4: 134, logo5: 300 };
      } else if (width > 400) {
         return { logo1: 143, logo2: 219, logo3: 177, logo4: 121, logo5: 210 };
      } else {
         return { logo1: 120, logo2: 180, logo3: 150, logo4: 100, logo5: 180 };
      }
   }

   const logosSection = document.querySelector("#logos-section");
   let logosLoaded = false;

   if (logosSection) {
      const observer = new IntersectionObserver(
         (entries, observer) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting && !logosLoaded) {
                  logosLoaded = true;
                  // Получаем размеры логотипов в зависимости от текущей ширины экрана
                  const sizes = getLogoSizes();
                  // Создаем логотипы с использованием адаптивных размеров
                  Promise.all([
                     createLogoAuto("./image/partners/logos/logo-1.png", -250, -300, sizes.logo1),
                     createLogoAuto("./image/partners/logos/logo-2.png", -100, -400, sizes.logo2),
                     createLogoAuto("./image/partners/logos/logo-3.png", 50, -350, sizes.logo3),
                     createLogoAuto("./image/partners/logos/logo-4.png", 150, -420, sizes.logo4),
                     createLogoAuto("./image/partners/logos/logo-5.png", 250, -320, sizes.logo5),
                  ]).then((logos) => {
                     logos.forEach((logo) => World.add(world, logo));
                  });
                  // Прекращаем наблюдение за секцией
                  observer.unobserve(entry.target);
               }
            });
         },
         {
            root: null, // viewport браузера
            threshold: 0.4, // когда 40% секции видно, запускаем анимацию
         }
      );
      observer.observe(logosSection);
   }
});

/**
 * Управление мышью (перетаскивание логотипов)
 */
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
   mouse: mouse,
   constraint: {
      stiffness: 0.2,
      render: { visible: false },
   },
});
World.add(world, mouseConstraint);
render.mouse = mouse;
