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

    if (scrollOffset - partners.offsetTop < -300)
      crystal.style.transform = `translateY(${parallaxOffset}px)`;
  });

  // Обработка дополнительных элементов с параллаксом
  // Обработка дополнительных элементов с параллаксом + стартовое смещение вверх на 300px
  document
    .querySelectorAll(
      ".coin1, .coin2, .blue, .green, .purple, .yellow, .blue_circle, .green_circle, .purple_circle, .yellow_circle",
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

// Рендерер на всю ширину экрана
const render = Render.create({
  element: document.getElementById("partners-physics"),
  engine: engine,
  options: {
    width: window.innerWidth,
    height: 600,
    // Попробуйте временно wireframes: true, чтобы увидеть реальный размер тел
    wireframes: false,
    background: "transparent",
  },
});

document
  .querySelector("#partners-physics")
  .addEventListener("wheel", function (e) {
    e.stopPropagation();
    // Можно добавить обработку события для прокрутки тут, если нужно
  });

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

/**
 * Создание дуги из сегментов (как в вашем коде)
 */
function createArcBody(
  centerX,
  centerY,
  radius,
  segmentCount,
  curveStrength = 1,
) {
  const segments = [];
  const segmentAngle = Math.PI / segmentCount;
  const thickness = 3;

  for (let i = 0; i < segmentCount; i++) {
    const angle1 = i * segmentAngle;
    const angle2 = (i + 1) * segmentAngle;

    const x1 = centerX + radius * Math.cos(angle1);
    const y1 = centerY + radius * Math.sin(angle1) * curveStrength;
    const x2 = centerX + radius * Math.cos(angle2);
    const y2 = centerY + radius * Math.sin(angle2) * curveStrength;

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
        fillStyle: "#3498db",
        strokeStyle: "#2980b9",
        lineWidth: 2,
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
let arc = createArcBody(
  window.innerWidth / 2,
  300,
  window.innerWidth / 2,
  100,
  0.2,
);
World.add(world, arc);



// При ресайзе пересоздаем дугу
window.addEventListener("resize", () => {
  const newWidth = window.innerWidth;
  render.options.width = newWidth;
  render.canvas.width = newWidth;

  World.remove(world, arc);
  arc = createArcBody(newWidth / 2, 300, newWidth / 2, 100, 0.2);
  World.add(world, arc);

  Body.setPosition(rightWall, {
    x: newWidth + wallThickness / 2,
    y: worldHeight / 2,
  });
});

// Границы по бокам
const wallThickness = 100; // достаточно толстые, чтобы точно не пролетели
const worldHeight = 600;

const leftWall = Bodies.rectangle(
  -wallThickness / 2,
  worldHeight / 2,
  wallThickness,
  worldHeight,
  {
    isStatic: true,
    render: { visible: false },
  },
);

const rightWall = Bodies.rectangle(
  window.innerWidth + wallThickness / 2,
  worldHeight / 2,
  wallThickness,
  worldHeight,
  {
    isStatic: true,
    render: { visible: false },
  },
);

World.add(world, [leftWall, rightWall]);

/**
 * Создание логотипа с реалистичными физическими параметрами
 */
function createLogoAuto(texture, xOffset, yOffset, bodyWidth) {
  const fixedHeight = 180;
  const borderRadius = 26.598;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const imageRatio = img.width / img.height;
      const bodyHeight = bodyWidth / imageRatio; // высота тела подгоняется по ширине и соотношению

      const scale = bodyWidth / img.width; // одинаковый масштаб по X и Y

      const body = Bodies.rectangle(
        window.innerWidth / 2 + xOffset,
        yOffset,
        bodyWidth,
        bodyHeight,
        {
          restitution: 1,
          friction: 0.1,
          frictionStatic: 0.3,
          frictionAir: 0.01,
          density: 0.002,
          collisionFilter: { group: 0 },
          chamfer: { radius: borderRadius },
          render: {
            sprite: {
              texture: texture,
              //xScale: scale,
              //yScale: scale,
            },
          },
        },
      );

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

// Логотипы (увеличим разброс начальных координат)
Promise.all([
  //  createLogoAuto("./image/logo1.png", -250, -300, 293),
  //  createLogoAuto("./image/logo2.png", -100, -400, 448),
  //  createLogoAuto("./image/logo3.png", 50, -350, 363),
  //  createLogoAuto("./image/logo4.png", 150, -420, 248),
  //  createLogoAuto("./image/logo5.png", 250, -320, 430),
  createLogoAuto("./image/partners/logos/logo-1.png", -250, -300, 293),
  createLogoAuto("./image/partners/logos/logo-2.png", -100, -400, 448),
  createLogoAuto("./image/partners/logos/logo-3.png", 50, -350, 363),
  createLogoAuto("./image/partners/logos/logo-4.png", 150, -420, 248),
  createLogoAuto("./image/partners/logos/logo-5.png", 250, -320, 430),
]).then((logos) => {
  logos.forEach((logo) => World.add(world, logo));
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
