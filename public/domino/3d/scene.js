"use strict";

window.createDominoScene = function createDominoScene(canvas) {
  const ctx = canvas.getContext("2d");
  const depth = 2.55;
  const palettes = [
    { face: [236, 106, 76], ink: "#532831" },
    { face: [250, 230, 189], ink: "#514137" },
    { face: [241, 190, 91], ink: "#51352d" },
    { face: [155, 177, 165], ink: "#30413d" },
  ];
  const pipPatterns = [[], [4], [0, 8], [0, 4, 8], [0, 2, 6, 8], [0, 2, 4, 6, 8], [0, 2, 3, 5, 6, 8]];
  const faces = [[1, 4], [2, 5], [3, 6], [2, 2], [5, 1], [0, 3], [4, 6], [3, 3], [6, 1], [4, 2], [3, 5], [6, 6], [2, 1], [1, 5]];
  const corners = [[0, 0], [1, 0], [1, 1], [0, 1]];
  const light = { x: -0.46, y: 0.8, z: 0.37 };

  let width = 0;
  let height = 0;
  let scale = 0;
  let centerX = 0;
  let centerY = 0;
  let boardWidth = 1.2;
  let boardLength = 1;
  let yawCos = 1;
  let yawSin = 0;
  let pitchCos = 1;
  let pitchSin = 0;
  let camera = { x: 0, y: 0, z: 0 };
  let boardLayer;
  let hitAreas = [];

  function project(x, y, z) {
    const wx = (x - 0.5) * boardWidth;
    const wz = (z - 0.5) * boardLength;
    const across = wx * yawCos - wz * yawSin;
    const away = wx * yawSin + wz * yawCos;
    const distance = depth - away * pitchCos - y * pitchSin;
    return {
      x: centerX + scale * across / distance,
      y: centerY + scale * (away * pitchSin - y * pitchCos) / distance,
      distance,
    };
  }

  function trace(points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let index = 1; index < points.length; index += 1) {
      ctx.lineTo(points[index].x, points[index].y);
    }
  }

  function fillPolygon(points, fill, edge) {
    trace(points);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (edge) {
      ctx.strokeStyle = edge;
      ctx.stroke();
    }
  }

  function paintBoard() {
    const backdrop = ctx.createRadialGradient(width * 0.54, height * 0.48, 5, width * 0.5, height * 0.55, width * 0.7);
    backdrop.addColorStop(0, "#363346");
    backdrop.addColorStop(1, "#201e31");
    ctx.fillStyle = backdrop;
    ctx.fillRect(0, 0, width, height);

    const surface = corners.map(([x, z]) => project(x, 0, z));
    const underside = corners.map(([x, z]) => project(x, -0.038, z));
    const shadow = surface.map((point) => ({ x: point.x + 3, y: point.y + 13 }));
    ctx.save();
    ctx.shadowBlur = 28;
    ctx.shadowColor = "#100d1bdd";
    fillPolygon(shadow, "#181625");
    ctx.restore();

    fillPolygon([surface[1], surface[2], underside[2], underside[1]], "#282638");
    fillPolygon([surface[3], surface[2], underside[2], underside[3]], "#2c293b", "#69607175");

    const top = Math.min(...surface.map((point) => point.y));
    const bottom = Math.max(...surface.map((point) => point.y));
    const material = ctx.createLinearGradient(0, top, 0, bottom);
    material.addColorStop(0, "#4f4a60");
    material.addColorStop(0.62, "#423d53");
    material.addColorStop(1, "#38354b");
    fillPolygon(surface, material, "#766c80");

    ctx.lineWidth = 0.75;
    for (let index = 1; index < 16; index += 1) {
      const t = index / 16;
      ctx.strokeStyle = index % 4 === 0 ? "#b6a5c035" : "#b6a5c01f";
      trace([project(t, 0, 0), project(t, 0, 1)]);
      ctx.stroke();
      trace([project(0, 0, t), project(1, 0, t)]);
      ctx.stroke();
    }

    ctx.lineWidth = 1;
    trace([surface[3], surface[2]]);
    ctx.strokeStyle = "#b7a6b670";
    ctx.stroke();

    const ticks = [[0.025, 0.025], [0.975, 0.025], [0.025, 0.975], [0.975, 0.975]];
    for (const [x, z] of ticks) {
      const inwardX = x < 0.5 ? 0.022 : -0.022;
      const inwardZ = z < 0.5 ? 0.031 : -0.031;
      trace([project(x, 0, z + inwardZ), project(x, 0, z), project(x + inwardX, 0, z)]);
      ctx.strokeStyle = "#dbc5a88a";
      ctx.stroke();
    }
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(bounds.width * ratio);
    const pixelHeight = Math.round(bounds.height * ratio);
    if (bounds.width === width && bounds.height === height && canvas.width === pixelWidth && canvas.height === pixelHeight) return;

    width = bounds.width;
    height = bounds.height;
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineJoin = "round";

    const narrow = width < 520;
    boardWidth = narrow ? 1.03 : 1.27;
    boardLength = narrow ? 1.20 : 1;
    const yaw = narrow ? 0.20 : 0.16;
    const pitch = narrow ? 0.93 : 0.68;
    yawCos = Math.cos(yaw);
    yawSin = Math.sin(yaw);
    pitchCos = Math.cos(pitch);
    pitchSin = Math.sin(pitch);
    camera = {
      x: 0.5 + yawSin * depth * pitchCos / boardWidth,
      y: depth * pitchSin,
      z: 0.5 + yawCos * depth * pitchCos / boardLength,
    };

    centerX = 0;
    centerY = 0;
    scale = 1;
    const footprint = corners.flatMap(([x, z]) => [project(x, 0, z), project(x, -0.042, z)]);
    const left = Math.min(...footprint.map((point) => point.x));
    const right = Math.max(...footprint.map((point) => point.x));
    const top = Math.min(...footprint.map((point) => point.y));
    const bottom = Math.max(...footprint.map((point) => point.y));
    const horizontalMargin = narrow ? 15 : Math.max(35, width * 0.055);
    const topMargin = narrow ? 70 : 81;
    const bottomMargin = narrow ? 28 : 31;
    scale = Math.min((width - horizontalMargin * 2) / (right - left), (height - topMargin - bottomMargin) / (bottom - top));
    centerX = width / 2 - scale * (left + right) / 2;
    centerY = (height + topMargin - bottomMargin) / 2 - scale * (top + bottom) / 2;
    paintBoard();
    boardLayer = document.createElement("canvas");
    boardLayer.width = pixelWidth;
    boardLayer.height = pixelHeight;
    boardLayer.getContext("2d").drawImage(canvas, 0, 0);
  }

  function paintPath(path, drawing) {
    if (!path.length) return;

    const points = path.map(({ x, z }) => project(x, 0.002, z));
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (points.length > 1) {
      trace(points);
      if (drawing) {
        ctx.strokeStyle = "#f6c47833";
        ctx.lineWidth = 8;
        ctx.stroke();
      }
      ctx.strokeStyle = drawing ? "#ffe2a6" : "#ebbc805c";
      ctx.lineWidth = drawing ? 2.1 : 1.3;
      if (!drawing) ctx.setLineDash([4, 6]);
      ctx.stroke();
    }

    for (const point of [points[0], points.at(-1)]) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, drawing ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = drawing ? "#ffe5af" : "#eeb674a0";
      ctx.fill();
    }
    ctx.restore();
  }

  function tint(color, amount) {
    return "rgb(" + color.map((channel) => Math.min(255, Math.round(channel * amount))).join(",") + ")";
  }

  function makePiece(domino, index) {
    const { x, z, angle, progress } = domino;
    const size = domino.size || 0.042;
    const tall = size * 2.3;
    const thick = size * 0.28;
    const dx = Math.cos(angle);
    const dz = Math.sin(angle);
    const across = { x: -dz, y: 0, z: dx };
    const p = Math.max(0, Math.min(1, progress || 0));
    const swing = Math.PI / 2 * (p * p * (3 - 2 * p));
    const up = { x: dx * Math.sin(swing), y: Math.cos(swing), z: dz * Math.sin(swing) };
    const front = { x: dx * Math.cos(swing), y: -Math.sin(swing), z: dz * Math.cos(swing) };

    function point(u, v, w) {
      return {
        x: x + dx * thick / 2 + across.x * u * size + up.x * v * tall + front.x * w * thick,
        y: up.y * v * tall + front.y * w * thick + 0.001,
        z: z + dz * thick / 2 + across.z * u * size + up.z * v * tall + front.z * w * thick,
      };
    }

    const dimensions = [
      [-0.5, 0, 0], [0.5, 0, 0], [0.5, 1, 0], [-0.5, 1, 0],
      [-0.5, 0, -1], [0.5, 0, -1], [0.5, 1, -1], [-0.5, 1, -1],
    ];
    const vertices = dimensions.map((coords) => point(...coords));
    const points = vertices.map(({ x, y, z }) => project(x, y, z));
    const center = point(0, 0.5, -0.5);
    const projected = project(center.x, center.y, center.z);
    return { index, vertices, points, point, projected, across, up, front };
  }

  function paintShadow(piece) {
    const base = piece.point(0, 0, -0.5);
    const top = piece.point(0, 1, -0.5);
    const lower = project(base.x + 0.008, 0, base.z + 0.005);
    const upper = project(top.x + top.y * 0.32 + 0.008, 0, top.z - top.y * 0.17 + 0.005);
    const edge = piece.points[0];
    const lineWidth = Math.max(2, Math.hypot(edge.x - piece.points[1].x, edge.y - piece.points[1].y) * 0.72);

    ctx.lineCap = "round";
    ctx.lineWidth = lineWidth + 3;
    ctx.strokeStyle = "#1513222e";
    trace([lower, upper]);
    ctx.stroke();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "#17142445";
    ctx.stroke();
  }

  function dot(point, u, v, surface, fill) {
    const place = (a, b) => {
      const { x, y, z } = point(a, b, surface);
      return project(x, y, z);
    };
    const center = place(u, v);
    const right = place(u + 0.061, v);
    const high = place(u, v + 0.0265);
    ctx.save();
    ctx.transform(right.x - center.x, right.y - center.y, high.x - center.x, high.y - center.y, center.x, center.y);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.restore();
  }

  function paintPips(piece, surface, ink) {
    const values = faces[piece.index % faces.length];
    const surfaceOffset = surface === 0 ? 0.004 : -1.004;
    const lineStart = piece.point(-0.39, 0.5, surfaceOffset);
    const lineEnd = piece.point(0.39, 0.5, surfaceOffset);
    const start = project(lineStart.x, lineStart.y, lineStart.z);
    const end = project(lineEnd.x, lineEnd.y, lineEnd.z);
    ctx.lineWidth = 0.65;
    ctx.strokeStyle = ink + "7f";
    trace([start, end]);
    ctx.stroke();
    values.forEach((value, half) => {
      for (const pip of pipPatterns[value]) {
        dot(piece.point, (pip % 3 - 1) * 0.23, 0.75 - half * 0.5 + (1 - Math.floor(pip / 3)) * 0.12, surfaceOffset, ink);
      }
    });
  }

  function paintPiece(piece, activeIndex) {
    const { across, up, front, points, vertices, index } = piece;
    const shapes = [
      { ids: [0, 1, 2, 3], axis: front, direction: 1, pipSide: 0 },
      { ids: [4, 5, 6, 7], axis: front, direction: -1, pipSide: -1 },
      { ids: [3, 2, 6, 7], axis: up, direction: 1 },
      { ids: [0, 1, 5, 4], axis: up, direction: -1 },
      { ids: [1, 2, 6, 5], axis: across, direction: 1 },
      { ids: [0, 3, 7, 4], axis: across, direction: -1 },
    ];
    const palette = palettes[index % palettes.length];
    const polygons = [];

    for (const shape of shapes) {
      const { ids, axis, direction, pipSide } = shape;
      const corner = vertices[ids[0]];
      const normal = { x: axis.x * direction, y: axis.y * direction, z: axis.z * direction };
      const facing = (camera.x - corner.x) * normal.x + (camera.y - corner.y) * normal.y + (camera.z - corner.z) * normal.z;
      if (facing <= 0) continue;

      const polygon = ids.map((id) => points[id]);
      const cosine = normal.x * light.x + normal.y * light.y + normal.z * light.z;
      const broad = pipSide !== undefined;
      const brightness = (broad ? 0.95 : 0.85) + cosine * 0.24;
      let color = tint(palette.face, brightness);
      if (broad) {
        const gradient = ctx.createLinearGradient(polygon[2].x, polygon[2].y, polygon[0].x, polygon[0].y);
        gradient.addColorStop(0, tint(palette.face, brightness * 1.12));
        gradient.addColorStop(1, tint(palette.face, brightness * 0.91));
        color = gradient;
      }
      ctx.lineWidth = index === activeIndex ? 1.5 : 0.8;
      fillPolygon(polygon, color, index === activeIndex ? "#fff4d7" : "#3823388c");
      polygons.push(polygon);
      if (broad) paintPips(piece, pipSide, palette.ink);
    }

    const left = Math.min(...points.map((point) => point.x));
    const right = Math.max(...points.map((point) => point.x));
    const top = Math.min(...points.map((point) => point.y));
    const bottom = Math.max(...points.map((point) => point.y));
    hitAreas.push({ index, polygons, left, right, top, bottom });
  }

  function draw({ path, dominoes, drawing, activeIndex = -1 }) {
    resize();
    if (!boardLayer) return;
    ctx.drawImage(boardLayer, 0, 0, width, height);
    paintPath(path, drawing);
    const pieces = dominoes.map(makePiece).sort((a, b) => b.projected.distance - a.projected.distance);
    hitAreas = [];
    for (const piece of pieces) paintShadow(piece);
    for (const piece of pieces) paintPiece(piece, activeIndex);
  }

  function groundAt(clientX, clientY) {
    if (!scale) return null;
    const rect = canvas.getBoundingClientRect();
    const u = (clientX - rect.left - centerX) / scale;
    const v = (clientY - rect.top - centerY) / scale;
    const away = v * depth / (pitchSin + v * pitchCos);
    const across = u * (depth - away * pitchCos);
    const x = 0.5 + (across * yawCos + away * yawSin) / boardWidth;
    const z = 0.5 + (-across * yawSin + away * yawCos) / boardLength;
    if (x < 0 || x > 1 || z < 0 || z > 1) return null;
    return { x, z };
  }

  function insidePolygon(x, y, polygon) {
    let inside = false;
    let previous = polygon.at(-1);
    for (const point of polygon) {
      if ((previous.y > y) !== (point.y > y)
          && x < (point.x - previous.x) * (y - previous.y) / (point.y - previous.y) + previous.x) {
        inside = !inside;
      }
      previous = point;
    }
    return inside;
  }

  function dominoAt(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    let closest = -1;
    let nearest = 9;
    for (let i = hitAreas.length - 1; i >= 0; i -= 1) {
      const { index, polygons, left, right, top, bottom } = hitAreas[i];
      if (polygons.some((polygon) => insidePolygon(x, y, polygon))) return index;
      const dx = Math.max(left - x, 0, x - right);
      const dy = Math.max(top - y, 0, y - bottom);
      const distance = Math.hypot(dx, dy);
      if (distance < nearest) {
        nearest = distance;
        closest = index;
      }
    }
    return closest;
  }

  return { draw, groundAt, dominoAt, resize };
};
