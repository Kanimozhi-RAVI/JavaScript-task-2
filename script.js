const starsCanvas = document.getElementById('starsCanvas');
const snowCanvas = document.getElementById('snowCanvas');
const starsCtx = starsCanvas.getContext('2d');
const snowCtx = snowCanvas.getContext('2d');

function resizeAll() {
  [starsCanvas, snowCanvas].forEach(c => {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  });
}
resizeAll();
window.addEventListener('resize', resizeAll);

const stars = [];
const shootingStars = [];
const starCount = 150;

for (let i = 0; i < starCount; i++) {
  stars.push({
    x: Math.random() * starsCanvas.width,
    y: Math.random() * starsCanvas.height,
    radius: Math.random() * 1.5 + 0.5,
    alpha: Math.random(),
    delta: Math.random() * 0.02
  });
}

function spawnShootingStar() {
  shootingStars.push({
    x: Math.random() * starsCanvas.width,
    y: Math.random() * starsCanvas.height / 2,
    vx: -8 - Math.random() * 4,
    vy: 4 + Math.random() * 2,
    life: 100
  });
}

function drawStars() {
  starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

  for (let star of stars) {
    star.alpha += star.delta;
    if (star.alpha <= 0 || star.alpha >= 1) star.delta *= -1;

    starsCtx.beginPath();
    starsCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    starsCtx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    starsCtx.fill();
  }

  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    starsCtx.beginPath();
    starsCtx.strokeStyle = 'white';
    starsCtx.lineWidth = 2;
    starsCtx.moveTo(s.x, s.y);
    starsCtx.lineTo(s.x + s.vx * 4, s.y + s.vy * 4);
    starsCtx.stroke();

    s.x += s.vx;
    s.y += s.vy;
    s.life--;

    if (s.life <= 0 || s.x < 0 || s.y > starsCanvas.height) {
      shootingStars.splice(i, 1);
    }
  }

  if (Math.random() < 0.02) spawnShootingStar();

  requestAnimationFrame(drawStars);
}
drawStars();

const flakes = [];
const flakeCount = 400;
let mX = -100, mY = -100;

function snow() {
  snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

  for (let i = 0; i < flakeCount; i++) {
    const flake = flakes[i];
    const dist = Math.sqrt((flake.x - mX) ** 2 + (flake.y - mY) ** 2);
    if (dist < 150) {
      let force = 150 / (dist * dist),
          xcomp = (mX - flake.x) / dist,
          ycomp = (mY - flake.y) / dist,
          deltaV = force / 2;
      flake.velX -= deltaV * xcomp;
      flake.velY -= deltaV * ycomp;
    } else {
      flake.velX *= 0.98;
      if (flake.velY <= flake.speed) flake.velY = flake.speed;
      flake.velX += Math.cos(flake.step += 0.05) * flake.stepSize;
    }

    snowCtx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
    flake.y += flake.velY;
    flake.x += flake.velX;

    if (flake.y >= snowCanvas.height || flake.x >= snowCanvas.width || flake.x <= 0) {
      reset(flake);
    }

    snowCtx.beginPath();
    snowCtx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
    snowCtx.fill();
  }
  requestAnimationFrame(snow);
}

function reset(flake) {
  flake.x = Math.random() * snowCanvas.width;
  flake.y = 0;
  flake.size = Math.random() * 3 + 2;
  flake.speed = Math.random() * 1 + 0.5;
  flake.velY = flake.speed;
  flake.velX = 0;
  flake.opacity = Math.random() * 0.5 + 0.3;
}

function initSnow() {
  for (let i = 0; i < flakeCount; i++) {
    flakes.push({
      speed: Math.random() * 1 + 0.5,
      velY: 0,
      velX: 0,
      x: Math.random() * snowCanvas.width,
      y: Math.random() * snowCanvas.height,
      size: Math.random() * 3 + 2,
      stepSize: Math.random() / 30,
      step: 0,
      opacity: Math.random() * 0.5 + 0.3
    });
  }
  snow();
}

snowCanvas.addEventListener("mousemove", function(e) {
  mX = e.clientX;
  mY = e.clientY;
});

initSnow();


const display = document.getElementById('display');

function appendToDisplay(val) {
  display.value += val;
}

function clearDisplay() {
  display.value = '';
}

function backspace() {
  display.value = display.value.slice(0, -1);
}

function calculate() {
  try {
    display.value = eval(display.value);
  } catch {
    display.value = 'Error';
  }
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    calculate();
  }
})

display.addEventListener('input', function(e) {
  const allowed = '0123456789+-*/.';
  const lastChar = display.value.slice(-1);

  if (!allowed.includes(lastChar)) {
    display.value = display.value.slice(0, -1);
  }
});
