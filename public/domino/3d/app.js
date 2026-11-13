"use strict";

const form = document.querySelector("#setup-form");
const countInput = document.querySelector("#domino-count");
const decrement = document.querySelector("#decrement");
const increment = document.querySelector("#increment");
const reset = document.querySelector("#reset");
const drawButton = document.querySelector("#draw-path");
const shuffleButton = document.querySelector("#shuffle-path");
const canvas = document.querySelector("#stage-canvas");
const status = document.querySelector("#status");
const placedReadout = document.querySelector("#placed-count");
const fallenReadout = document.querySelector("#fallen-count");

const scene = window.createDominoScene(canvas);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const minimum = Number(countInput.min);
const maximum = Number(countInput.max);
const fallDuration = 340;
const minimumTileSize = 0.006;
const tileWidthRatio = 0.69;

const routeAnchors = [
  [[.13, .81], [.30, .77], [.54, .83], [.76, .79], [.86, .65], [.78, .51],
    [.56, .46], [.35, .51], [.19, .46], [.14, .32], [.26, .20], [.51, .18], [.78, .23]],
  [[.21, .80], [.13, .62], [.18, .41], [.34, .23], [.52, .17], [.69, .26],
    [.77, .42], [.73, .62], [.59, .73], [.45, .69], [.38, .57], [.47, .47], [.60, .47]],
  [[.14, .80], [.31, .69], [.45, .75], [.65, .82], [.81, .73], [.86, .56],
    [.72, .42], [.55, .53], [.37, .51], [.22, .39], [.25, .23], [.44, .18], [.68, .25], [.84, .18]],
];

let routeIndex = 0;
let path = makeRoute(routeIndex);
let dominoes = [];
let placedCount = 0;
let fallenCount = 0;
let firstFallen = 0;
let activeIndex = 0;
let showSelection = false;
let drawing = false;
let drawPointer = null;
let playPointer = null;
let draft = [];
let animation = null;

function makeRoute(index) {
  const anchors = routeAnchors[index];
  const points = [];
  for (let i = 0; i < anchors.length - 1; i += 1) {
    const before = anchors[Math.max(0, i - 1)];
    const start = anchors[i];
    const end = anchors[i + 1];
    const after = anchors[Math.min(anchors.length - 1, i + 2)];
    for (let step = 0; step < 12; step += 1) {
      const t = step / 12;
      const [x, z] = start.map((value, axis) => {
        const p0 = before[axis];
        const p2 = end[axis];
        const p3 = after[axis];
        return value + .5 * t * (
          p2 - p0 + t * (2 * p0 - 5 * value + 4 * p2 - p3 + t * (3 * value - p0 - 3 * p2 + p3))
        );
      });
      points.push({ x, z });
    }
  }
  const [x, z] = anchors.at(-1);
  points.push({ x, z });
  return points;
}

function distance(a, b) {
  return Math.hypot(b.x - a.x, b.z - a.z);
}

function measurePath(points) {
  const lengths = [0];
  for (let i = 1; i < points.length; i += 1) {
    lengths.push(lengths.at(-1) + distance(points[i - 1], points[i]));
  }
  return lengths;
}

function distributeDominoes(points, count) {
  const lengths = measurePath(points);
  const length = lengths.at(-1);
  const spacing = count > 1 ? length / (count - 1) : length;
  if (length < .08 || (count > 1 && spacing * tileWidthRatio < minimumTileSize)) {
    return null;
  }

  const size = Math.min(.085, spacing * tileWidthRatio);
  const positions = [];
  let segment = 1;
  for (let i = 0; i < count; i += 1) {
    const offset = count === 1 ? length / 2 : Math.min(i * spacing, length);
    while (lengths[segment] < offset) segment += 1;

    const start = points[segment - 1];
    const end = points[segment];
    const weight = (offset - lengths[segment - 1]) / (lengths[segment] - lengths[segment - 1]);
    positions.push({
      x: start.x + weight * (end.x - start.x),
      z: start.z + weight * (end.z - start.z),
      angle: Math.atan2(end.z - start.z, end.x - start.x),
      progress: 0,
      size,
    });
  }

  for (let i = 0; i < count - 1; i += 1) {
    const from = positions[i];
    const to = positions[i + 1];
    if (distance(from, to) > 0.001) {
      from.angle = Math.atan2(to.z - from.z, to.x - from.x);
    }
  }
  return positions;
}

function render() {
  scene.draw({
    path: drawPointer === null ? path : draft,
    dominoes: drawPointer === null ? dominoes : [],
    drawing,
    activeIndex: showSelection && !drawing ? activeIndex : -1,
  });
}

function resize() {
  scene.resize();
  render();
}

function updateCountControls() {
  decrement.disabled = countInput.valueAsNumber <= minimum;
  increment.disabled = countInput.valueAsNumber >= maximum;
}

function changeInputCount(step) {
  const entered = countInput.valueAsNumber;
  const value = Number.isFinite(entered) ? Math.round(entered) : placedCount;
  countInput.value = String(Math.max(minimum, Math.min(maximum, value + step)));
  updateCountControls();
}

function currentCount() {
  if (!countInput.reportValidity()) return null;
  return countInput.valueAsNumber;
}

function restingMessage() {
  if (fallenCount === placedCount) return "全部倒下了！点「复位」再玩一次。";
  if (fallenCount > 0) return `已有 ${fallenCount} 块倒下。还可以点选站立的骨牌。`;
  return "点任意一块骨牌，它和后面的骨牌会沿着路线依次倒下。";
}

function placeDominoes(points, count) {
  const arranged = distributeDominoes(points, count);
  if (!arranged) {
    status.textContent = `路线太短，摆不下 ${count} 块骨牌。请画长一点，或减少数量。`;
    return false;
  }

  if (animation !== null) window.cancelAnimationFrame(animation);
  animation = null;
  path = points;
  dominoes = arranged;
  placedCount = count;
  fallenCount = 0;
  firstFallen = count;
  activeIndex = 0;
  placedReadout.textContent = String(placedCount);
  fallenReadout.textContent = String(fallenCount);
  status.textContent = restingMessage();
  updateCountControls();
  render();
  return true;
}

function timeToContact(from, to) {
  const gap = Math.max(0, distance(from, to) - (from.size + to.size) * .14);
  const reach = Math.min(1, gap / (from.size * 2.3));
  const angleFraction = Math.asin(reach) / (Math.PI / 2);
  // The renderer uses smoothstep for rotation. Invert it to find the contact time.
  const timeFraction = .5 - Math.sin(Math.asin(1 - 2 * angleFraction) / 3);
  return fallDuration * Math.max(.32, Math.min(.8, timeFraction));
}

function startCascade(start) {
  if (drawing || animation !== null || start < 0 || start >= firstFallen) return;

  const end = firstFallen;
  firstFallen = start;
  status.textContent = `第 ${start + 1} 块骨牌开始倒下。`;
  const offsets = [0];
  for (let i = start; i < end - 1; i += 1) {
    offsets.push(offsets.at(-1) + timeToContact(dominoes[i], dominoes[i + 1]));
  }
  let startedAt;

  function advance(now) {
    startedAt ??= now;
    const elapsed = now - startedAt;
    let settled = 0;

    for (let i = start; i < end; i += 1) {
      const time = reducedMotion.matches
        ? 1
        : Math.max(0, Math.min(1, (elapsed - offsets[i - start]) / fallDuration));
      dominoes[i].progress = time;
      if (time === 1) settled += 1;
    }

    fallenCount = placedCount - end + settled;
    if (fallenReadout.textContent !== String(fallenCount)) {
      fallenReadout.textContent = String(fallenCount);
    }
    render();

    if (settled === end - start) {
      animation = null;
      status.textContent = drawing ? "在平面上拖动，画出一条新的路线。" : restingMessage();
    } else {
      animation = window.requestAnimationFrame(advance);
    }
  }

  if (reducedMotion.matches) {
    advance(0);
  } else {
    animation = window.requestAnimationFrame(advance);
  }
}

function discardDraft() {
  const pointer = drawPointer;
  drawPointer = null;
  draft = [];
  if (pointer !== null && canvas.hasPointerCapture(pointer)) {
    canvas.releasePointerCapture(pointer);
  }
}

function setDrawing(enabled) {
  if (!enabled) discardDraft();
  drawing = enabled;
  playPointer = null;
  canvas.classList.toggle("is-drawing", enabled);
  drawButton.setAttribute("aria-pressed", String(enabled));
  status.textContent = enabled ? "在平面上拖动，画出一条新的路线。" : restingMessage();
  render();
}

function addDraftPoint(event) {
  const point = scene.groundAt(event.clientX, event.clientY);
  if (point && distance(draft.at(-1), point) >= .008) draft.push(point);
}

function smoothDraft(points) {
  return points.map((point, i) => {
    if (i === 0 || i === points.length - 1) return point;
    const before = points[i - 1];
    const after = points[i + 1];
    return { x: (before.x + 2 * point.x + after.x) / 4, z: (before.z + 2 * point.z + after.z) / 4 };
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const count = currentCount();
  if (count === null) return;
  setDrawing(false);
  placeDominoes(path, count);
});

countInput.addEventListener("input", updateCountControls);
decrement.addEventListener("click", () => changeInputCount(-1));
increment.addEventListener("click", () => changeInputCount(1));
reset.addEventListener("click", () => {
  countInput.value = String(placedCount);
  setDrawing(false);
  placeDominoes(path, placedCount);
});

drawButton.addEventListener("click", () => setDrawing(!drawing));
shuffleButton.addEventListener("click", () => {
  const count = currentCount();
  if (count === null) return;
  setDrawing(false);
  routeIndex = (routeIndex + 1) % routeAnchors.length;
  placeDominoes(makeRoute(routeIndex), count);
});

canvas.addEventListener("pointerdown", (event) => {
  if (!event.isPrimary || event.button !== 0) return;
  if (showSelection) {
    showSelection = false;
    render();
  }

  if (!drawing) {
    playPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    return;
  }

  const point = scene.groundAt(event.clientX, event.clientY);
  if (!point) {
    status.textContent = "从平面内开始拖动，画出骨牌路线。";
    return;
  }
  drawPointer = event.pointerId;
  draft = [point];
  canvas.setPointerCapture(event.pointerId);
  render();
});

canvas.addEventListener("pointermove", (event) => {
  if (drawPointer !== event.pointerId) return;
  addDraftPoint(event);
  render();
});

canvas.addEventListener("pointerup", (event) => {
  if (drawPointer === event.pointerId) {
    addDraftPoint(event);
    const points = smoothDraft(draft);
    discardDraft();
    const count = currentCount();
    if (count === null) {
      render();
    } else if (placeDominoes(points, count)) {
      setDrawing(false);
    } else {
      render();
    }
    return;
  }

  if (playPointer?.id === event.pointerId) {
    const movement = Math.hypot(event.clientX - playPointer.x, event.clientY - playPointer.y);
    playPointer = null;
    if (movement <= 10) startCascade(scene.dominoAt(event.clientX, event.clientY));
  }
});

function cancelPointer(event) {
  if (drawPointer === event.pointerId) {
    discardDraft();
    status.textContent = "在平面上拖动，画出一条新的路线。";
    render();
  }
  if (playPointer?.id === event.pointerId) playPointer = null;
}

canvas.addEventListener("pointercancel", cancelPointer);
canvas.addEventListener("lostpointercapture", cancelPointer);
canvas.addEventListener("focus", () => {
  showSelection = canvas.matches(":focus-visible");
  render();
});
canvas.addEventListener("blur", () => {
  showSelection = false;
  render();
});

canvas.addEventListener("keydown", (event) => {
  if (drawing) {
    if (event.key === "Escape") {
      event.preventDefault();
      setDrawing(false);
    }
    return;
  }

  switch (event.key) {
    case "ArrowLeft":
    case "ArrowUp":
      activeIndex = Math.max(0, activeIndex - 1);
      break;
    case "ArrowRight":
    case "ArrowDown":
      activeIndex = Math.min(placedCount - 1, activeIndex + 1);
      break;
    case "Home":
      activeIndex = 0;
      break;
    case "End":
      activeIndex = placedCount - 1;
      break;
    case "Enter":
    case " ":
      event.preventDefault();
      startCascade(activeIndex);
      return;
    default:
      return;
  }
  event.preventDefault();
  showSelection = true;
  render();
  if (animation === null && fallenCount < placedCount) {
    const state = activeIndex < firstFallen ? "站立" : "已倒下";
    status.textContent = `已选中第 ${activeIndex + 1} 块骨牌，${state}。`;
  }
});

placeDominoes(path, countInput.valueAsNumber);
const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(canvas);
resize();
