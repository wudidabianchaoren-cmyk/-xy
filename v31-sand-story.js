(() => {
  "use strict";

  const SCENES = [
    {
      src: "./assets/sand-story/craft-raised.webp",
      poseA: "./assets/sand-story/craft-strike.webp",
      video: "./assets/sand-story/craft-motion.mp4",
      videoDuration: 2.041667,
      seed: 1709
    },
    { src: "./assets/sand-story/camera-operator.webp", seed: 2903 },
    {
      src: "./assets/sand-story/applause-airplane.webp",
      poseA: "./assets/sand-story/applause-open.webp",
      video: "./assets/sand-story/applause-motion.mp4",
      videoDuration: 2.041667,
      seed: 4153
    },
    {
      src: "./assets/sand-story/violin-duet.webp",
      poseA: "./assets/sand-story/violin-return.webp",
      video: "./assets/sand-story/violin-motion.mp4",
      videoDuration: 2.041667,
      seed: 6211
    },
    {
      src: "./assets/sand-story/boxing-ring.webp",
      poseA: "./assets/sand-story/boxing-left-jab.webp",
      poseB: "./assets/sand-story/boxing-right-jab.webp",
      video: "./assets/sand-story/boxing-motion.mp4",
      videoDuration: 4.041667,
      seed: 7489
    },
    { src: "./assets/sand-story/european-castle-simple-v2.webp", seed: 8627 },
    { src: "./assets/sand-story/envelope-volume-v32-72.png", seed: 9733 }
  ];
  const SAMPLE_WIDTH = 384;
  const SAMPLE_HEIGHT = 216;

  function particleBudget() {
    let count = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4 ? 72000 : 82000;
    try {
      const probe = document.createElement("canvas");
      const context = probe.getContext("webgl2") || probe.getContext("webgl");
      const extension = context && context.getExtension("WEBGL_debug_renderer_info");
      const rendererName = extension ? context.getParameter(extension.UNMASKED_RENDERER_WEBGL) : "";
      if (/swiftshader|llvmpipe|software/i.test(rendererName)) count = 68000;
      const loseContext = context && context.getExtension("WEBGL_lose_context");
      if (loseContext) loseContext.loseContext();
    } catch (_) {
      count = Math.min(count, 72000);
    }
    return count;
  }

  const PARTICLE_COUNT = particleBudget();

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const smooth = (value) => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };

  function randomGenerator(seed) {
    let state = seed >>> 0;
    return () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  function createSamplingGuide(images) {
    const validImages = images.filter(Boolean);
    if (validImages.length === 1) return validImages[0];
    const first = validImages[0];
    const width = first.naturalWidth || first.width;
    const height = first.naturalHeight || first.height;
    const guide = document.createElement("canvas");
    guide.width = width;
    guide.height = height;
    const context = guide.getContext("2d");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = "multiply";
    validImages.forEach(image => context.drawImage(image, 0, 0, width, height));
    context.globalCompositeOperation = "source-over";
    return guide;
  }

  async function loadVideo(sceneItem) {
    if (!sceneItem.video) return Promise.resolve(null);
    const frames = Math.round(sceneItem.videoDuration * 24);
    return { image: await loadImage(sceneItem.video.replace('.mp4', '-atlas.webp')),
      duration: sceneItem.videoDuration, frames, rows: Math.ceil(frames / 8),
      texture: null, requestedTime: 0, frame: 0 };
  }

  // Monotonic scroll time: anticipation, a slower contact window, then recovery.
  function actionTiming(sceneIndex, value) {
    const knots = sceneIndex === 0
      ? [[0,0],[.30,.24],[.43,.47],[.63,.54],[.77,.74],[1,1]]
      : sceneIndex === 4
        ? [[0,0],[.20,.23],[.32,.28],[.48,.48],[.66,.72],[.80,.78],[1,1]]
        : sceneIndex === 2
          ? [[0,0],[.34,.42],[.62,.56],[1,1]]
          : [[0,0],[1,1]];
    const i = knots.findIndex((point, index) => index && value <= point[0]);
    if (i < 1) return value;
    const a = knots[i - 1], b = knots[i];
    return a[1] + (b[1] - a[1]) * clamp((value - a[0]) / (b[0] - a[0]));
  }

  function ellipseWeight(x, y, centerX, centerY, radiusX, radiusY) {
    const dx = (x - centerX) / radiusX;
    const dy = (y - centerY) / radiusY;
    return smooth(1 - Math.sqrt(dx * dx + dy * dy));
  }

  function envelopeSilhouetteWeight(x, y) {
    const vertical = smooth((y - .53) / .07) * smooth((.92 - y) / .07);
    const depth = clamp((y - .53) / .39);
    const left = .38 - depth * .18;
    const right = .72 + depth * .2;
    const horizontal = smooth((x - left) / .045) * smooth((right - x) / .045);
    return vertical * horizontal;
  }

  function sceneFocus(sceneIndex, x, y) {
    if (sceneIndex === 0) {
      const figure = ellipseWeight(x, y, .38, .52, .29, .46) * .72;
      const workingHands = ellipseWeight(x, y, .54, .46, .2, .2);
      const bench = ellipseWeight(x, y, .67, .74, .36, .2) * .26;
      return .06 + Math.max(figure, workingHands, bench) * .94;
    }
    if (sceneIndex === 1) {
      const operator = ellipseWeight(x, y, .3, .55, .24, .45);
      const face = ellipseWeight(x, y, .36, .3, .12, .17) * .94;
      const hands = ellipseWeight(x, y, .48, .5, .2, .22) * .95;
      const cameraRig = ellipseWeight(x, y, .59, .31, .36, .23) * .67;
      const lens = ellipseWeight(x, y, .73, .31, .17, .14) * .78;
      return .005 + Math.max(operator, face, hands, cameraRig, lens) * .995;
    }
    if (sceneIndex === 2) {
      const plane = ellipseWeight(x, y, .51, .25, .49, .2) * .7;
      const figure = ellipseWeight(x, y, .61, .69, .13, .3) * .84;
      return .045 + Math.max(plane, figure) * .955;
    }
    if (sceneIndex === 3) {
      const leftPlayer = ellipseWeight(x, y, .27, .56, .22, .42) * .82;
      const rightPlayer = ellipseWeight(x, y, .57, .55, .2, .4) * .82;
      const leftHands = ellipseWeight(x, y, .34, .45, .14, .18);
      const rightHands = ellipseWeight(x, y, .65, .45, .14, .18);
      const stand = ellipseWeight(x, y, .78, .69, .22, .26) * .18;
      return .05 + Math.max(leftPlayer, rightPlayer, leftHands, rightHands, stand) * .95;
    }
    if (sceneIndex === 4) {
      const leftFighter = ellipseWeight(x, y, .31, .56, .19, .42) * .76;
      const rightFighter = ellipseWeight(x, y, .69, .56, .19, .42) * .76;
      const gloves = Math.max(ellipseWeight(x, y, .39, .2, .1, .13), ellipseWeight(x, y, .61, .23, .1, .13));
      const ropeRows = [.445, .565, .69, .805];
      const ropes = ropeRows.reduce((weight, row) => Math.max(weight, smooth(1 - Math.abs(y - row) / .018)), 0) * .34;
      const floor = smooth(1 - Math.abs(y - .9) / .08) * .18;
      return .045 + Math.max(leftFighter, rightFighter, gloves, ropes, floor) * .955;
    }
    if (sceneIndex === 5) {
      const architecture = ellipseWeight(x, y, .5, .48, .46, .42) * .78;
      const towerBand = ellipseWeight(x, y, .5, .34, .42, .3) * .82;
      const centerSpire = ellipseWeight(x, y, .5, .16, .105, .25);
      const leftSpire = ellipseWeight(x, y, .285, .28, .09, .23) * .92;
      const rightSpire = ellipseWeight(x, y, .715, .28, .09, .23) * .92;
      const terrain = ellipseWeight(x, y, .5, .76, .48, .17) * .24;
      return .055 + Math.max(architecture, towerBand, centerSpire, leftSpire, rightSpire, terrain) * .945;
    }
    const silhouette = envelopeSilhouetteWeight(x, y);
    const flap = ellipseWeight(x, y, .57, .64, .3, .13) * .9;
    const fold = ellipseWeight(x, y, .57, .69, .23, .085);
    const lowerEdge = ellipseWeight(x, y, .57, .82, .38, .075);
    return silhouette * (.4 + Math.max(flap, fold, lowerEdge) * .6);
  }

  function isEnvelopeColumnArtifact(sceneIndex, x, y) {
    if (sceneIndex !== 6) return false;
    const verticalArtifact = x > .27 && x < .305 && y < .69;
    const sideSplash = y > .53 && (x < .235 || x > .91);
    return verticalArtifact || sideSplash;
  }

  function isEnvelopeStaticSky(sceneIndex, y) {
    return sceneIndex === 6 && y < .54;
  }

  async function sampleScene(image, seed, sceneIndex, fixedUv = null) {
    const source = document.createElement("canvas");
    source.width = SAMPLE_WIDTH;
    source.height = SAMPLE_HEIGHT;
    const context = source.getContext("2d", { willReadFrequently: true });
    const imageWidth = image.naturalWidth || image.width;
    const imageHeight = image.naturalHeight || image.height;
    const sourceRatio = imageWidth / imageHeight;
    const targetRatio = SAMPLE_WIDTH / SAMPLE_HEIGHT;
    let sx = 0;
    let sy = 0;
    let sw = imageWidth;
    let sh = imageHeight;
    if (sourceRatio > targetRatio) {
      sw = imageHeight * targetRatio;
      sx = (imageWidth - sw) * .5;
    } else {
      sh = imageWidth / targetRatio;
      sy = (imageHeight - sh) * .5;
    }
    context.drawImage(image, sx, sy, sw, sh, 0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT);
    const pixels = context.getImageData(0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT).data;
    const darkness = new Float32Array(SAMPLE_WIDTH * SAMPLE_HEIGHT);

    for (let index = 0; index < darkness.length; index += 1) {
      const offset = index * 4;
      const luminance = (pixels[offset] * .2126 + pixels[offset + 1] * .7152 + pixels[offset + 2] * .0722) / 255;
      const value = clamp((1 - luminance - .018) / .94);
      darkness[index] = value;
    }

    function densityAt(uvX, uvY) {
      if (isEnvelopeStaticSky(sceneIndex, uvY) || isEnvelopeColumnArtifact(sceneIndex, uvX, uvY)) return 0;
      if (sceneIndex === 6 && envelopeSilhouetteWeight(uvX, uvY) < .015) return 0;
      const pixelX = Math.min(SAMPLE_WIDTH - 1, Math.floor(uvX * SAMPLE_WIDTH));
      const pixelY = Math.min(SAMPLE_HEIGHT - 1, Math.floor(uvY * SAMPLE_HEIGHT));
      const value = darkness[pixelY * SAMPLE_WIDTH + pixelX];
      const left = darkness[pixelY * SAMPLE_WIDTH + Math.max(0, pixelX - 1)];
      const right = darkness[pixelY * SAMPLE_WIDTH + Math.min(SAMPLE_WIDTH - 1, pixelX + 1)];
      const up = darkness[Math.max(0, pixelY - 1) * SAMPLE_WIDTH + pixelX];
      const down = darkness[Math.min(SAMPLE_HEIGHT - 1, pixelY + 1) * SAMPLE_WIDTH + pixelX];
      const edge = clamp((Math.abs(right - left) + Math.abs(down - up)) * 2.6);
      const focus = sceneFocus(sceneIndex, uvX, uvY);
      const exponent = sceneIndex === 5 ? .68 : sceneIndex === 6 ? .72 : 1.02;
      const baseDensity = Math.pow(value, exponent) * focus;
      if (sceneIndex === 6) {
        return clamp(Math.max(Math.pow(value, 1.38) * focus * .7, edge * focus * .82));
      }
      if (sceneIndex === 1) return clamp(Math.max(Math.pow(value, 1.62) * focus * .54, edge * focus * .96));
      if (sceneIndex === 5) return clamp(Math.max(baseDensity * 1.12, edge * focus * .92));
      return clamp(baseDensity);
    }

    // Every scene and every action keyframe uses the same stratified UV field.
    // Motion is therefore expressed by changing particle visibility, never by
    // pulling unrelated body pixels through one another.
    const random = randomGenerator(90731 + sceneIndex * 7919);
    const uniformCount = Math.floor(PARTICLE_COUNT * .18);
    const columns = Math.ceil(Math.sqrt(uniformCount * (16 / 9)));
    const rows = Math.ceil(uniformCount / columns);
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const uv = new Float32Array(PARTICLE_COUNT * 2);
    const opacity = new Float32Array(PARTICLE_COUNT);
    const densityValues = new Float32Array(PARTICLE_COUNT);
    const focusValues = new Float32Array(PARTICLE_COUNT);
    for (let particle = 0; particle < PARTICLE_COUNT; particle += 1) {
      if (particle && particle % 2048 === 0) await new Promise(resolve => setTimeout(resolve, 0));
      let uvX;
      let uvY;
      if (fixedUv) {
        uvX = fixedUv[particle * 2];
        uvY = 1 - fixedUv[particle * 2 + 1];
      } else if (particle < uniformCount) {
        const column = particle % columns;
        const row = Math.floor(particle / columns);
        uvX = clamp((column + .12 + random() * .76) / columns);
        uvY = clamp((row + .12 + random() * .76) / rows);
      } else {
        uvX = random();
        uvY = random();
        for (let attempt = 0; attempt < 14; attempt += 1) {
          const candidateX = random();
          const candidateY = random();
          const candidateDensity = densityAt(candidateX, candidateY);
          const acceptance = clamp(.012 + Math.pow(candidateDensity, .72) * 1.16);
          if (random() < acceptance) {
            uvX = candidateX;
            uvY = candidateY;
            break;
          }
        }
      }
      const focus = sceneFocus(sceneIndex, uvX, uvY);
      const density = densityAt(uvX, uvY);
      const cutoff = sceneIndex === 6 ? .03 : .004;
      const offset = particle * 3;
      positions[offset] = (uvX - .5) * 3.48;
      positions[offset + 1] = (.5 - uvY) * 1.96;
      positions[offset + 2] = (random() - .5) * .095 + (density - .35) * .13;
      uv[particle * 2] = uvX;
      uv[particle * 2 + 1] = 1 - uvY;
      densityValues[particle] = density;
      focusValues[particle] = focus;
      opacity[particle] = density < cutoff ? 0 : clamp(.5 + Math.pow(density, .68) * .5);
      // Remove only the thin protruding corner above the lens hood. Keep the
      // seeded positions and all other camera particles exactly as sampled.
      if(sceneIndex===1&&uvX>.69&&uvX<.730&&uvY>.205&&uvY<.246-(uvX-.69)*.08){opacity[particle]=0;densityValues[particle]=0;}
    }
    let detail = null;
    if (sceneIndex === 6) {
      const detailRandom = randomGenerator(807733);
      const detailPositions = new Float32Array(PARTICLE_COUNT * 3);
      const detailUv = new Float32Array(PARTICLE_COUNT * 2);
      const detailOpacity = new Float32Array(PARTICLE_COUNT);
      const detailDensity = new Float32Array(PARTICLE_COUNT);
      const detailFocus = new Float32Array(PARTICLE_COUNT);
      for (let particle = 0; particle < PARTICLE_COUNT; particle += 1) {
      if (particle && particle % 2048 === 0) await new Promise(resolve => setTimeout(resolve, 0));
        let sampleX = .5;
        let sampleY = .68;
        let sampleValue = 0;
        let sampleEdge = 0;
        let sampleFocus = 0;
        for (let attempt = 0; attempt < 24; attempt += 1) {
          const candidateX = detailRandom();
          const candidateY = detailRandom();
          const candidatePixelX = Math.min(SAMPLE_WIDTH - 1, Math.floor(candidateX * SAMPLE_WIDTH));
          const candidatePixelY = Math.min(SAMPLE_HEIGHT - 1, Math.floor(candidateY * SAMPLE_HEIGHT));
          const candidateIndex = candidatePixelY * SAMPLE_WIDTH + candidatePixelX;
          const candidateValue = darkness[candidateIndex];
          const candidateLeft = darkness[candidatePixelY * SAMPLE_WIDTH + Math.max(0, candidatePixelX - 1)];
          const candidateRight = darkness[candidatePixelY * SAMPLE_WIDTH + Math.min(SAMPLE_WIDTH - 1, candidatePixelX + 1)];
          const candidateUp = darkness[Math.max(0, candidatePixelY - 1) * SAMPLE_WIDTH + candidatePixelX];
          const candidateDown = darkness[Math.min(SAMPLE_HEIGHT - 1, candidatePixelY + 1) * SAMPLE_WIDTH + candidatePixelX];
          const candidateEdge = clamp((Math.abs(candidateRight - candidateLeft) + Math.abs(candidateDown - candidateUp)) * 2.8);
          const candidateFocus = sceneFocus(sceneIndex, candidateX, candidateY);
          if (isEnvelopeStaticSky(sceneIndex, candidateY) || isEnvelopeColumnArtifact(sceneIndex, candidateX, candidateY) || envelopeSilhouetteWeight(candidateX, candidateY) < .02) continue;
          const importance = clamp(
            candidateEdge * candidateFocus * 1.14 +
            Math.pow(candidateValue, 1.25) * candidateFocus * .07
          );
          sampleX = candidateX;
          sampleY = candidateY;
          sampleValue = candidateValue;
          sampleEdge = candidateEdge;
          sampleFocus = candidateFocus;
          if (detailRandom() < importance) break;
        }
        const detailValue = clamp(Math.max(
          Math.pow(sampleValue, 1.3) * sampleFocus * .12,
          sampleEdge * sampleFocus * 1.12
        ));
        const offset = particle * 3;
        detailPositions[offset] = (sampleX - .5) * 3.48;
        detailPositions[offset + 1] = (.5 - sampleY) * 1.96;
        detailPositions[offset + 2] = (detailRandom() - .5) * .07 + (detailValue - .3) * .2;
        detailUv[particle * 2] = sampleX;
        detailUv[particle * 2 + 1] = 1 - sampleY;
        detailDensity[particle] = detailValue;
        detailFocus[particle] = sampleFocus;
        detailOpacity[particle] = clamp(.08 + Math.pow(detailValue, .5) * .78);
      }
      detail = { positions: detailPositions, uv: detailUv, opacity: detailOpacity, density: detailDensity, focus: detailFocus };
    }
    return { positions, uv, opacity, density: densityValues, focus: focusValues, detail };
  }

  async function sampleCameraOperator(image) {
    const source = document.createElement("canvas");
    source.width = SAMPLE_WIDTH;
    source.height = SAMPLE_HEIGHT;
    const context = source.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT);
    const pixels = context.getImageData(0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT).data;
    const ink = new Float32Array(SAMPLE_WIDTH * SAMPLE_HEIGHT);
    for (let index = 0; index < ink.length; index += 1) {
      const offset = index * 4;
      ink[index] = clamp(1 - (pixels[offset] * .2126 + pixels[offset + 1] * .7152 + pixels[offset + 2] * .0722) / 255);
    }

    const bodyLightAt = (x, y) => Math.min(1,
      Math.exp(-Math.pow((x - .27) / .17, 2) - Math.pow((y - .36) / .23, 2)) * .7 +
      Math.exp(-Math.pow((x - .245) / .19, 2) - Math.pow((y - .66) / .23, 2)) * .48);
    const personWeightAt = (x, y) => Math.max(
      1 - smooth((x - .34) / .16),
      smooth((y - .39) / .17) * (1 - smooth((x - .52) / .19)));
    const fields = Array.from({ length: 4 }, () => new Float64Array(ink.length));
    const totals = new Float64Array(4);
    for (let y = 1; y < SAMPLE_HEIGHT - 1; y += 1) {
      for (let x = 1; x < SAMPLE_WIDTH - 1; x += 1) {
        const index = y * SAMPLE_WIDTH + x;
        const value = ink[index];
        if (value < .13) continue;
        const nx = x / SAMPLE_WIDTH;
        const ny = y / SAMPLE_HEIGHT;
        const personWeight = personWeightAt(nx, ny);
        const edge = clamp((Math.abs(ink[index - 1] - ink[index + 1]) +
          Math.abs(ink[index - SAMPLE_WIDTH] - ink[index + SAMPLE_WIDTH])) * 1.45);
        const bodyLight = bodyLightAt(nx, ny) * personWeight;
        const surfaceWeight = Math.pow(value, 1.12) * (1 - bodyLight * .22);
        const contourWeight = edge * (.25 + value * .75) * (1 - bodyLight * .23);
        fields[0][index] = surfaceWeight * personWeight;
        fields[1][index] = contourWeight * personWeight;
        fields[2][index] = surfaceWeight * (1 - personWeight);
        fields[3][index] = contourWeight * (1 - personWeight);
      }
    }
    fields.forEach((field, fieldIndex) => {
      let total = 0;
      for (let index = 0; index < field.length; index += 1) {
        total += field[index];
        field[index] = total;
      }
      totals[fieldIndex] = total;
    });

    const random = randomGenerator(290319);
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const uv = new Float32Array(PARTICLE_COUNT * 2);
    const opacity = new Float32Array(PARTICLE_COUNT);
    const density = new Float32Array(PARTICLE_COUNT);
    const focus = new Float32Array(PARTICLE_COUNT);
    const groups = [.56, .11, .27, .06];
    let trimmedFin=0;
    for (let particle = 0; particle < PARTICLE_COUNT; particle += 1) {
      if (particle && particle % 2048 === 0) await new Promise(resolve => setTimeout(resolve, 0));
      const choice = random();
      let fieldIndex = 0;
      let boundary = groups[0];
      while (choice > boundary && fieldIndex < 3) boundary += groups[++fieldIndex];
      const field = fields[fieldIndex];
      const target = random() * totals[fieldIndex];
      let low = 0;
      let high = field.length - 1;
      while (low < high) {
        const middle = (low + high) >>> 1;
        if (field[middle] < target) low = middle + 1;
        else high = middle;
      }
      const value = ink[low];
      const isContour = fieldIndex % 2 === 1;
      const edge = clamp((Math.abs(ink[Math.max(0, low - 1)] - ink[Math.min(ink.length - 1, low + 1)]) +
        Math.abs(ink[Math.max(0, low - SAMPLE_WIDTH)] - ink[Math.min(ink.length - 1, low + SAMPLE_WIDTH)])) * 1.45);
      const x = ((low % SAMPLE_WIDTH) + .14 + random() * .72) / SAMPLE_WIDTH;
      const y = (Math.floor(low / SAMPLE_WIDTH) + .14 + random() * .72) / SAMPLE_HEIGHT;
      const bodyLight = bodyLightAt(x, y) * personWeightAt(x, y);
      const offset = particle * 3;
      positions[offset] = (x - .5) * 3.48;
      positions[offset + 1] = (.5 - y) * 1.96;
      positions[offset + 2] = .085 + personWeightAt(x, y) * .035 + (random() - .5) * .035;
      uv[particle * 2] = x;
      uv[particle * 2 + 1] = 1 - y;
      density[particle] = .40 + value * .40 - bodyLight * .12;
      focus[particle] = .69 + value * .23 - bodyLight * .08;
      opacity[particle] = isContour
        ? (.46 + edge * .32) * (1 - bodyLight * .17)
        : (.51 + value * .28) * (1 - bodyLight * .16);
      // This dedicated camera target replaces sampleScene below. Trim its actual
      // matte-box fin here, after sampling, keeping every other seeded point.
      if(x>.610&&x<.730&&y>.185&&y<.269-(x-.610)*.42){opacity[particle]=0;density[particle]=0;trimmedFin++;}
    }
    window.cameraTrimV133={target:'sampleCameraOperator',removed:trimmedFin,preservesOtherSeededSamples:true};
    return { positions, uv, opacity, density, focus, detail: null };
  }

  function createProceduralEnvelopeTarget() {
    const random = randomGenerator(9733007);
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const uv = new Float32Array(PARTICLE_COUNT * 2);
    const opacity = new Float32Array(PARTICLE_COUNT);
    const density = new Float32Array(PARTICLE_COUNT);
    const focus = new Float32Array(PARTICLE_COUNT);
    const detailPositions = new Float32Array(PARTICLE_COUNT * 3);
    const detailUv = new Float32Array(PARTICLE_COUNT * 2);
    const detailOpacity = new Float32Array(PARTICLE_COUNT);
    const detailDensity = new Float32Array(PARTICLE_COUNT);
    const detailFocus = new Float32Array(PARTICLE_COUNT);
    const A = [.31, .535, -.13];
    const B = [.75, .55, -.16];
    const C = [.89, .805, .13];
    const D = [.18, .815, .09];
    const F = [.555, .705, .2];
    const D2 = [.19, .84, .15];
    const C2 = [.88, .83, .19];
    const faces = [
      { points: [A, B, F], weight: .17, shade: .36 },
      { points: [A, F, D], weight: .15, shade: .24 },
      { points: [B, C, F], weight: .15, shade: .48 },
      { points: [D, F, C], weight: .47, shade: .73 },
      { points: [D, C, D2], weight: .03, shade: .89 },
      { points: [C, C2, D2], weight: .03, shade: .92 }
    ];
    const seams = [[A, F], [B, F], [D, F], [C, F], [A, D], [B, C], [D, C]];

    function facePoint(face) {
      const u = Math.sqrt(random());
      const v = random();
      const a = 1 - u;
      const b = u * (1 - v);
      const c = u * v;
      const [p, q, r] = face.points;
      return {
        x: p[0] * a + q[0] * b + r[0] * c,
        y: p[1] * a + q[1] * b + r[1] * c,
        z: p[2] * a + q[2] * b + r[2] * c
      };
    }

    function seamPoint(segment) {
      const t = random();
      const [p, q] = segment;
      return {
        x: p[0] + (q[0] - p[0]) * t + (random() - .5) * .0017,
        y: p[1] + (q[1] - p[1]) * t + (random() - .5) * .0017,
        z: p[2] + (q[2] - p[2]) * t + .014
      };
    }

    function writePoint(targetPositions, targetUv, index, point, pointDensity, pointFocus) {
      const offset = index * 3;
      targetPositions[offset] = (point.x - .5) * 3.48;
      targetPositions[offset + 1] = (.5 - point.y) * 1.96;
      targetPositions[offset + 2] = point.z + (random() - .5) * .018;
      targetUv[index * 2] = point.x;
      targetUv[index * 2 + 1] = 1 - point.y;
      return { density: pointDensity, focus: pointFocus };
    }

    for (let particle = 0; particle < PARTICLE_COUNT; particle += 1) {
      const isContour = random() < .055;
      let point;
      let pointDensity;
      let pointFocus;
      if (isContour) {
        point = seamPoint(seams[Math.floor(random() * seams.length)]);
        pointDensity = .62 + random() * .22;
        pointFocus = .82;
      } else {
        let faceChoice = random();
        let face = faces[faces.length - 1];
        for (const candidate of faces) {
          faceChoice -= candidate.weight;
          if (faceChoice <= 0) { face = candidate; break; }
        }
        point = facePoint(face);
        const paperGrain = (random() - .5) * .13;
        const lowerShade = smooth((point.y - .63) / .2) * .08;
        pointDensity = clamp(face.shade + lowerShade + paperGrain);
        pointFocus = clamp(.55 + point.z * .45 + face.shade * .27);
      }
      const values = writePoint(positions, uv, particle, point, pointDensity, pointFocus);
      density[particle] = values.density;
      focus[particle] = values.focus;
      opacity[particle] = isContour ? .75 : .47 + values.density * .45;

      const detailPoint = seamPoint(seams[particle % seams.length]);
      const detailValues = writePoint(detailPositions, detailUv, particle, detailPoint, .77, .8);
      detailDensity[particle] = detailValues.density;
      detailFocus[particle] = detailValues.focus;
      detailOpacity[particle] = .56;
    }

    return {
      positions,
      uv,
      opacity,
      density,
      focus,
      detail: {
        positions: detailPositions,
        uv: detailUv,
        opacity: detailOpacity,
        density: detailDensity,
        focus: detailFocus
      }
    };
  }

  function sampleEnvelopeVolume() {
    const random=randomGenerator(973373),N=PARTICLE_COUNT;
    const positions=new Float32Array(N*3),uv=new Float32Array(N*2),opacity=new Float32Array(N),density=new Float32Array(N),focus=new Float32Array(N);
    // A paper packet: planar surfaces, bowed contents, inset triangular flap and substantial side walls.
    // Project the entire solid into an oblique view so thickness remains visible without mouse movement.
    const project=(x,y,z)=>{const perspective=1-y*.12;return [(x*.98+y*.20)*perspective,y*.48+z*.94-.25,-y*.82+z*.50];};
    const width=1.92,height=1.08,depth=.125;
    for(let i=0;i<N;i++){
      let x=(random()-.5)*width,y=(random()-.5)*height,z=depth*.5,shade=.22,alpha=.31;
      const kind=random(),u=x/width+.5,v=y/height+.5;
      if(kind<.80){
        const tip=-.10,flapY=tip+Math.abs(x)*(.64/.96),isFlap=y>flapY;
        z+=.027*Math.sin(Math.PI*u)*Math.sin(Math.PI*v)+(isFlap?.010:0);
        shade=isFlap?.25:.45;shade+=.17*(1-v);
        const d=Math.abs(y-flapY),crease=Math.exp(-d*d/.0018);
        // Broad density gradients describe the fold, never a forced row of contour points.
        shade+=crease*.13;alpha=.34+shade*.60;
      }else if(kind<.89){
        // The lower and right walls form a continuous, visibly shaded packet edge.
        if(random()<.66){y=-height*.5+(random()-.5)*.075;z=(random()-.5)*depth;shade=.55;alpha=.56;}
        else {x=width*.5+(random()-.5)*.07;z=(random()-.5)*depth;shade=.49;alpha=.51;}
      }else if(kind<.93){
        x=-width*.5+(random()-.5)*.075;z=(random()-.5)*depth;shade=.37;alpha=.40;
      }else if(kind<.96){
        y=height*.5+(random()-.5)*.075;z=(random()-.5)*depth;shade=.33;alpha=.35;
      }else{
        // Sparse contents and a soft contact field establish volume without black edge rails.
        z=-depth*.5;shade=.24;alpha=.20;
      }
      const edge=Math.min(width*.5-Math.abs(x),height*.5-Math.abs(y));
      const feather=.58+.42*smooth(Math.max(0,edge)/.055);opacity[i]=alpha*feather;
      const p=project(x,y,z);positions.set(p,i*3);uv.set([.5+p[0]/3.48,.5+p[1]/1.96],i*2);
      density[i]=shade;focus[i]=.5+shade*.2;
    }
    return {positions,uv,opacity,density,focus,detail:{positions:positions.slice(),uv:uv.slice(),opacity:new Float32Array(N),density:density.slice(),focus:focus.slice()}};
  }

  function sampleRainSurface(){
    const N=PARTICLE_COUNT,random=randomGenerator(9733),positions=new Float32Array(N*3),uv=new Float32Array(N*2),opacity=new Float32Array(N),density=new Float32Array(N),focus=new Float32Array(N);
    for(let i=0;i<N;i++){const x=(random()-.5)*2.7,y=-.52+random()*.70;positions.set([x,y,.25-(y+.52)*1.2],i*3);uv.set([.5+x/3.48,.5+y/1.96],i*2);const edge=Math.exp(-Math.pow(x/1.15,6)-Math.pow((y+.2)/.30,6));opacity[i]=edge*.018;density[i]=.18;focus[i]=.4;}
    return{positions,uv,opacity,density,focus,detail:{positions:positions.slice(),uv:uv.slice(),opacity:new Float32Array(N),density:density.slice(),focus:focus.slice()}};
  }
  function createField() {
    const random = randomGenerator(19490717);
    const uniformCount = Math.floor(PARTICLE_COUNT * .18);
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const opacity = new Float32Array(PARTICLE_COUNT);
    const size = new Float32Array(PARTICLE_COUNT);
    const seed = new Float32Array(PARTICLE_COUNT);
    for (let particle = 0; particle < PARTICLE_COUNT; particle += 1) {
      const offset = particle * 3;
      positions[offset] = (random() * 2 - 1) * 1.08;
      positions[offset + 1] = (random() * 2 - 1) * 1.045;
      positions[offset + 2] = (random() - .5) * .52;
      opacity[particle] = .18 + Math.pow(random(), .72) * .78;
      const pointSize = .78 + random() * .26;
      size[particle] = particle < uniformCount ? pointSize : -pointSize;
      seed[particle] = random();
    }
    return { positions, opacity, size, seed };
  }

  function prepareCharacters(copy) {
    const heading = copy.querySelector("h2");
    if (!heading) return [];
    const characters = [];
    [...heading.childNodes].forEach((node) => {
      if (node.nodeName === "BR" || node.nodeType !== Node.TEXT_NODE) return;
      const fragment = document.createDocumentFragment();
      [...node.textContent].forEach((character) => {
        if (/\s/.test(character)) {
          fragment.appendChild(document.createTextNode(character));
          return;
        }
        const span = document.createElement("span");
        span.className = "sand-word-char";
        span.textContent = character;
        fragment.appendChild(span);
        characters.push(span);
      });
      node.replaceWith(fragment);
    });
    return characters;
  }

  const vertexShader = `
    precision highp float;
    attribute vec3 aShape;
    attribute vec3 aPoseA;
    attribute vec3 aPoseB;
    attribute vec3 aField;
    attribute float aSize;
    attribute float aOpacity;
    attribute float aPoseAOpacity;
    attribute float aPoseBOpacity;
    attribute float aFieldOpacity;
    attribute float aSeed;
    attribute float aDensity;
    attribute float aFocus;
    attribute vec2 aUv;
    uniform float uAssemble;
    uniform float uDisperse;
    uniform float uAction;
    uniform float uScene;
    uniform float uAspect;
    uniform float uPixelRatio;
    uniform float uOpacity;
    uniform float uTime;
    uniform vec2 uPointer;
    uniform float uPointerEnergy;
    uniform float uLayer;
    uniform float uDetail;
    uniform sampler2D uVideoTexture;
    uniform float uUseVideo;
    uniform vec2 uVideoGrid;
    uniform float uVideoFrame;
    uniform float uImpulse;
    uniform float uImpulseAge;
    uniform vec2 uContactUv;
    varying float vOpacity;
    varying float vSeed;
    varying float vDensity;

    float ease(float value) {
      value = clamp(value, 0.0, 1.0);
      return value * value * (3.0 - 2.0 * value);
    }

    float hash11(float value) {
      return fract(sin(value * 127.1) * 43758.5453123);
    }

    vec3 motionFrame(vec2 uv, float frame) {
      vec2 cell = vec2(mod(frame, uVideoGrid.x), uVideoGrid.y - 1.0 - floor(frame / uVideoGrid.x));
      vec2 inset = vec2(.5 / 480.0, .5 / 270.0);
      return texture2D(uVideoTexture, (cell + clamp(uv, inset, 1.0 - inset)) / uVideoGrid).rgb;
    }

    vec3 motionColor(vec2 uv) {
      return mix(motionFrame(uv, floor(uVideoFrame)), motionFrame(uv, ceil(uVideoFrame)), fract(uVideoFrame));
    }

    void main() {
      vec3 shape = aShape;
      float shapeOpacity = aOpacity;
      float shapeDensity = aDensity;
      float action = ease(uAction);
      float actionMask = 0.0;

      if (uScene < 0.5) {
        float strike = ease(sin(action * 3.14159265));
        shape = mix(aShape, aPoseA, strike);
        shapeOpacity = mix(aOpacity, aPoseAOpacity, strike);
      } else if (uScene < 1.5) {
        shape = aShape;
      } else if (uScene < 2.5) {
        shape = aShape;
        float planeMask = smoothstep(.61, .73, aUv.y);
        float planeTravel = ease(action);
        shape.x += planeMask * planeTravel * .2;
        shape.y += planeMask * sin(planeTravel * 3.14159265) * .014;
      } else if (uScene < 3.5) {
        float bowStroke = ease(.5 - .5 * cos(action * 6.2831853));
        shape = mix(aShape, aPoseA, bowStroke);
        shapeOpacity = mix(aOpacity, aPoseAOpacity, bowStroke);
      } else if (uScene < 4.5) {
        float leftPunch = smoothstep(.04, .23, action) * (1.0 - smoothstep(.31, .47, action));
        float rightPunch = smoothstep(.52, .7, action) * (1.0 - smoothstep(.8, .97, action));
        shape = mix(aShape, aPoseA, ease(leftPunch));
        shape = mix(shape, aPoseB, ease(rightPunch));
        shapeOpacity = mix(aOpacity, aPoseAOpacity, ease(leftPunch));
        shapeOpacity = mix(shapeOpacity, aPoseBOpacity, ease(rightPunch));
      } else if (uScene < 5.5) {
        if (uLayer < .5) {
          float rise = ease(smoothstep(.04, .68, action));
          shape.y = mix(-.65 + shape.y * .035, shape.y, rise);
          shape.x = mix(shape.x * .72, shape.x, rise);
        }
      } else {
        if (uLayer > .5) {
          float streamSeed = hash11(aSeed * 17.13 + 5.0);
          float selected = 1.0 - step(.35, hash11(aSeed * 47.17 + 3.0));
          float streamX = hash11(aSeed * 113.73 + 11.0);
          float speed = .43 + hash11(aSeed * 83.91 + 23.0) * .5;
          float bead = hash11(aSeed * 347.93 + 41.0);
          float fall = fract(hash11(aSeed * 197.17 + 29.0) + action * speed + uTime * .24 + (bead - .5) * .018);
          float beadVisible = 1.0 - step(.25, hash11(aSeed * 613.17 + 79.0));
          float streamSlope = (hash11(aSeed * 229.7 + 31.0) - .5) * .1;
          float hitY = -.40 + streamSeed * .49;
          float hitX = (streamX - .5) * 1.86 + (streamSeed - .5) * .20;
          vec2 dropPoint = vec2(
            hitX + (fall - .5) * streamSlope + (bead - .5) * .016,
            hitY + 1.48 * (1.0 - fall / .86) + (bead - .5) * .032
          );
          float impact = smoothstep(.86, .99, fall);
          float splashSide = (bead - .5) * 2.0;
          float splashLift = sin(impact * 3.14159265) * (.035 + streamSeed * .075);
          vec2 splashPoint = vec2(
            hitX + splashSide * impact * (.025 + streamSeed * .055),
            hitY + splashLift - impact * impact * .010
          );
          shape.xy = mix(dropPoint, splashPoint, impact);
          shape.z = .43 - streamSeed * .84 + .06;
          float rainPulse = .4 + .6 * hash11(aSeed * 29.0 + streamSeed);
          float dropLife = smoothstep(.01, .08, fall) * (1.0 - smoothstep(.985, 1.0, fall));
          float splashVisibility = mix(1.0, .7, impact);
          actionMask = selected * beadVisible * rainPulse * .86 * dropLife * splashVisibility;
        }
      }


      if (uUseVideo > .5 && uLayer < .5) {
        vec3 videoColor = motionColor(aUv);
        float videoInk = 1.0 - dot(videoColor, vec3(.2126, .7152, .0722));
        vec2 texel = vec2(1.0 / 960.0, 1.0 / 540.0);
        float inkLeft = 1.0 - dot(motionColor(aUv - vec2(texel.x, 0.0)), vec3(.2126, .7152, .0722));
        float inkRight = 1.0 - dot(motionColor(aUv + vec2(texel.x, 0.0)), vec3(.2126, .7152, .0722));
        float inkUp = 1.0 - dot(motionColor(aUv + vec2(0.0, texel.y)), vec3(.2126, .7152, .0722));
        float inkDown = 1.0 - dot(motionColor(aUv - vec2(0.0, texel.y)), vec3(.2126, .7152, .0722));
        float supportInk = max(max(inkLeft, inkRight), max(inkUp, inkDown));
        float videoLow = uScene < .5 ? .38 : .16;
        float videoHigh = uScene < .5 ? .82 : .72;
        float videoDensity = smoothstep(videoLow, videoHigh, max(videoInk, supportInk * .84));
        videoDensity = clamp(videoDensity * (.42 + pow(aFocus, .65) * .76), 0.0, 1.0);
        shape = aShape;
        shapeDensity = videoDensity;
        shapeOpacity = videoDensity < .002 ? 0.0 : clamp(.12 + pow(videoDensity, .42) * 1.2, 0.0, 1.0);
        if (uScene > 1.5 && uScene < 2.5) {
          float movingAircraft = smoothstep(.61, .73, aUv.y);
          shape.x += movingAircraft * ease(action) * .3;
          shape.y += movingAircraft * sin(ease(action) * 3.14159265) * .018;
        }
      }
      if (uUseVideo < .5 && uLayer < .5) {
        float contourProbability = clamp(.018 + pow(shapeDensity, .7) * .56, 0.0, 1.0);
        float subjectProbability = clamp(.72 + pow(shapeDensity, .76) * .28, 0.0, 1.0);
        float importanceSample = max(1.0 - step(0.0, aSize), uDetail);
        float densityProbability = mix(contourProbability, subjectProbability, importanceSample);
        if (uScene > .5 && uScene < 1.5) densityProbability = 1.0;
        if (uScene > 5.5) densityProbability = 1.0;
        shapeOpacity *= step(hash11(aSeed * 391.7 + 17.0), densityProbability);
      }
      float depthWeight = clamp(pow(max(shapeDensity, 0.0), .6) * .56 + pow(aFocus, 1.55) * .44, 0.0, 1.0);
      if (!(uScene > 5.5 && uLayer < .5)) {
        shape.z += (depthWeight - .38) * .42 + (hash11(aSeed * 83.17) - .5) * mix(.07, .025, depthWeight);
      }
      if (uScene > .5 && uScene < 1.5 && uLayer < .5) {
        vec2 lensUv = vec2((aUv.x - .7) / .18, (aUv.y - .69) / .15);
        float lensDepth = 1.0 - smoothstep(.28, 1.0, length(lensUv));
        shape.z += lensDepth * .16;
      }

      if (uLayer < .5) {
        vec2 contactDelta = aUv - uContactUv;
        float contactDistance = length(contactDelta * vec2(1.0, 1.5));
        float receiver = exp(-contactDistance * contactDistance * 48.0);
        float recoil = sin(uImpulseAge * 36.0 - contactDistance * 24.0) * uImpulse * receiver;
        float amplitude = uScene > 5.5 ? .012 : .011;
        shape.y += recoil * amplitude;
        shape.z += recoil * amplitude * 1.6;
        if (uScene > 3.5 && uScene < 4.5) shape.x += recoil * .014;
        if (uScene > 5.5) {
          float rings=0.;
          for(int hit=0;hit<5;hit++){
            float id=float(hit),pulse=fract(uTime*.51+id*.193);
            vec2 center=vec2((hash11(id*13.1+8.)-.5)*1.8,-.40+hash11(id*37.7+2.)*.49);
            float radial=length((shape.xy-center)*vec2(1.,2.15));
            float ring=exp(-pow((radial-pulse*.44)/.014,2.))*(1.-pulse)*(1.-pulse);
            rings+=ring;shape.y+=sin(radial*80.-pulse*30.)*ring*.003;
          }
          float surfaceFade=exp(-pow(shape.x/1.15,6.)-pow((shape.y+.20)/.30,6.));
          shapeOpacity=surfaceFade*(.002+min(rings,1.)*.65);

        }
        if (uScene > .5 && uScene < 1.5) shape.z += sin(action * 3.14159265) * .018 * aFocus;
        if (uScene > 2.5 && uScene < 3.5) shape.z += sin(action * 6.2831853) * .009 * aFocus;
      }

      vec3 field = aField;
      field.x *= uAspect;
      float assembled = ease(uAssemble);
      float dispersed = ease(uDisperse);
      vec3 point = mix(field, shape, assembled);
      point = mix(point, field, dispersed);

      if (uPointerEnergy > .002) {
        vec2 pointerWorld = vec2(uPointer.x * uAspect, uPointer.y);
        float pointerDistance = distance(point.xy, pointerWorld);
        float jelly = exp(-pointerDistance * 2.1) * sin(pointerDistance * 13.0 - uTime * 7.0 + aSeed * 2.0);
        jelly *= uPointerEnergy;
        vec2 direction = normalize(point.xy - pointerWorld + vec2(.0001));
        point.xy += direction * jelly * .023;
        point.z += jelly * .12;
      }
      point.x += uPointer.x * (.009 + point.z * .024);
      point.y += uPointer.y * (.006 + point.z * .018);

      float sceneOpacity = mix(aFieldOpacity, shapeOpacity, assembled);
      sceneOpacity = mix(sceneOpacity, aFieldOpacity, dispersed) * uOpacity;
      if (uLayer > .5) {
        sceneOpacity = mix(aFieldOpacity, 1.0, assembled);
        sceneOpacity = mix(sceneOpacity, aFieldOpacity, dispersed) * uOpacity;
      }
      float layerOpacity = uLayer > .5 ? actionMask : 1.0;
      float importanceSample = max(1.0 - step(0.0, aSize), uDetail);
      float depthOpacity = uLayer > .5 ? .72 : mix(.44, 1.0, smoothstep(.08, .86, depthWeight));
      if (uScene > .5 && uScene < 1.5 && uLayer < .5) {
        depthOpacity = mix(.2, 1.0, smoothstep(.075, .82, depthWeight));
      }
      if (uScene > 5.5 && uLayer < .5) {
        depthOpacity = .94;
      }
      depthOpacity = mix(depthOpacity, .84 + smoothstep(.12, .82, depthWeight) * .16, importanceSample);
      float copySafe = 1.0 - smoothstep(uScene > 5.5 ? .88 : .54, uScene > 5.5 ? 1.36 : 1.25, point.x);
      sceneOpacity *= mix(1.0, .06 + copySafe * .94, assembled);
      vOpacity = sceneOpacity * layerOpacity * depthOpacity * (.95 + aSeed * .05);
      if (uDetail > .5) vOpacity *= .74;
      vSeed = aSeed;
      float renderDensity = mix(.18 + aFieldOpacity * .18, shapeDensity, assembled);
      renderDensity = mix(renderDensity, .18 + aFieldOpacity * .18, dispersed);
      if (uLayer > .5) renderDensity = .3 + aSeed * .22;
      float renderDepth = uLayer > .5 ? renderDensity : clamp(pow(max(renderDensity, 0.0), .6) * .56 + pow(aFocus, 1.55) * .44, 0.0, 1.0);
      vDensity = renderDepth;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(point, 1.0);
      float layerScale = uLayer > .5 ? 1.08 : .94;
      float densityScale = uLayer > .5 ? 1.2 : .76 + pow(renderDepth, 1.18) * .48;
      if (uDetail > .5) densityScale *= .92;
      float grainVariation = mix(.92, 1.08, hash11(aSeed * 271.31 + 9.0));
      float minimumPointSize = uLayer > .5 ? 3.0 : 1.72;
      if (uScene > .5 && uScene < 1.5 && uLayer < .5) {
        minimumPointSize = mix(1.08, 1.72, smoothstep(.08, .88, renderDepth));
      }
      if (uScene > 5.5 && uLayer < .5) {
        minimumPointSize = mix(1.0, 1.4, smoothstep(.1, .86, renderDepth));
      }
      gl_PointSize = max(minimumPointSize * uPixelRatio, abs(aSize) * layerScale * densityScale * grainVariation * uPixelRatio * (1.0 + point.z * .34 + uPointerEnergy * .08));
    }
  `;

  const fragmentShader = `
    precision highp float;
    uniform float uLayer;
    uniform float uDetail;
    uniform float uScene;
    varying float vOpacity;
    varying float vSeed;
    varying float vDensity;
    void main() {
      vec2 point = gl_PointCoord - .5;
      float dropShape = mix(.72, 1.08, vSeed);
      vec2 grainPoint = uLayer > .5 ? vec2(point.x * (1.9 + vSeed * .7), point.y * dropShape) : point;
      float radius = dot(grainPoint, grainPoint);
      float edge = 1.0 - smoothstep(.105, .25, radius);
      if (edge < .02) discard;
      float tone = .004 + vSeed * .008;
      if (uScene > .5 && uScene < 1.5 && uLayer < .5) {
        tone = mix(.38, .006, smoothstep(.055, .89, vDensity));
      }
      if (uScene > 5.5 && uLayer < .5) {
        tone = mix(.36, .04, smoothstep(.035, .74, vDensity));
      }
      if (uLayer > .5) {
        float dropRim = smoothstep(.08, .22, radius);
        tone = mix(.28, .075, dropRim);
      }
      if (uDetail > .5) tone = max(tone, uScene > 5.5 ? .018 : .035);
      gl_FragColor = vec4(vec3(tone), vOpacity * edge);
    }
  `;

  function initSandNarrative() {
    const section = document.getElementById("sandNarrative");
    const canvas = document.getElementById("sandNarrativeCanvas");
    if (!section || !canvas || !window.THREE) return;

    const copies = [...section.querySelectorAll("[data-sand-copy]")];
    const characterSets = copies.map(prepareCharacters);
    const indexLabel = document.getElementById("sandNarrativeIndex");
    const progressBar = document.getElementById("sandNarrativeProgress");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();
    const pointerVelocity = new THREE.Vector2();
    const tilt = new THREE.Vector2();
    const tiltVelocity = new THREE.Vector2();
    let targets = [];
    let renderer;
    let camera;
    let scene;
    let geometry;
    let material;
    let actionMaterial;
    let particles;
    let actionParticles;
    let detailGeometry;
    let detailMaterial;
    let detailParticles;
    let videoRecords = [];
    let fallbackVideoTexture;
    let currentScene = -1;
    let targetProgress = 0;
    let displayProgress = 0;
    let pointerEnergy = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let lastPointerTime = performance.now();
    let visible = false, contextLost = false;let contextRestores=0;
    let frame = 0;
    let lastFrameTime = performance.now();
    let lastAction = 0;
    let contactScene = -1;
    let impactAt = -10000;
    let impactCount = 0;
    let motionState = {};
    const entryDebug = { triggers: 0, boundsTop: 0, targetTop: 0, startY: 0 };

    function stateFromProgress(progress) {
      const page = Math.min(SCENES.length - .0001, clamp(progress) * SCENES.length);
      const sceneIndex = Math.floor(page);
      return { scene: sceneIndex, local: page - sceneIndex };
    }

    function updateScene(sceneIndex) {
      if (sceneIndex === currentScene || !geometry) return;
      currentScene = sceneIndex;
      const target = targets[sceneIndex];
      geometry.getAttribute("aShape").array.set(target.base.positions);
      geometry.getAttribute("aShape").needsUpdate = true;
      geometry.getAttribute("aPoseA").array.set(target.poseA.positions);
      geometry.getAttribute("aPoseA").needsUpdate = true;
      geometry.getAttribute("aPoseB").array.set(target.poseB.positions);
      geometry.getAttribute("aPoseB").needsUpdate = true;
      geometry.getAttribute("aOpacity").array.set(target.base.opacity);
      geometry.getAttribute("aOpacity").needsUpdate = true;
      geometry.getAttribute("aPoseAOpacity").array.set(target.poseA.opacity);
      geometry.getAttribute("aPoseAOpacity").needsUpdate = true;
      geometry.getAttribute("aPoseBOpacity").array.set(target.poseB.opacity);
      geometry.getAttribute("aPoseBOpacity").needsUpdate = true;
      geometry.getAttribute("aUv").array.set(target.base.uv);
      geometry.getAttribute("aUv").needsUpdate = true;
      geometry.getAttribute("aDensity").array.set(target.base.density);
      geometry.getAttribute("aDensity").needsUpdate = true;
      geometry.getAttribute("aFocus").array.set(target.base.focus);
      geometry.getAttribute("aFocus").needsUpdate = true;
      const videoRecord = videoRecords[sceneIndex];
      material.uniforms.uVideoTexture.value = videoRecord ? videoRecord.texture : fallbackVideoTexture;
      material.uniforms.uUseVideo.value = videoRecord ? 1 : 0;
      material.uniforms.uVideoGrid.value.set(8, videoRecord ? videoRecord.rows : 1);
    }

    function updateCopy(state) {
      copies.forEach((copy, index) => {
        const isCurrent = index === state.scene;
        const exit = smooth((state.local - .86) / .1);
        const opacity = isCurrent ? 1 - exit : 0;
        copy.style.opacity = opacity.toFixed(3);
        copy.style.visibility = opacity > .01 ? "visible" : "hidden";
        copy.style.transform = `translateY(${(exit * -18).toFixed(2)}px)`;
        copy.style.filter = `blur(${(exit * 7).toFixed(2)}px)`;
        copy.classList.toggle("is-active", isCurrent && opacity > .5);
        copy.setAttribute("aria-hidden", String(!isCurrent || opacity <= .5));
        if (!isCurrent) return;

        const reveal = smooth((state.local - .13) / .43);
        const characters = characterSets[index];
        const total = Math.max(1, characters.length - 1);
        characters.forEach((character, characterIndex) => {
          const start = characterIndex / total * .76;
          const ink = smooth((reveal - start) / .24);
          character.style.color = `rgba(23,28,25,${(.12 + ink * .88).toFixed(3)})`;
        });
        const paragraph = copy.querySelector("p");
        if (paragraph) {
          const paragraphReveal = smooth((reveal - .58) / .34) * (1 - exit);
          paragraph.style.opacity = paragraphReveal.toFixed(3);
          paragraph.style.transform = `translateY(${((1 - paragraphReveal) * 9).toFixed(2)}px)`;
        }
      });
      if (indexLabel) indexLabel.textContent = String(state.scene + 1).padStart(2, "0");
      if (progressBar) progressBar.style.transform = `scaleX(${displayProgress.toFixed(4)})`;
    }

    function renderScene(time) {
      if (!renderer || !visible || contextLost) return;
      const state = stateFromProgress(displayProgress);
      updateScene(state.scene);
      updateCopy(state);
      const assemble = reducedMotion ? 1 : smooth((state.local - .015) / .145);
      const disperse = reducedMotion ? 0 : smooth((state.local - .87) / .115);
      const rawAction = reducedMotion ? .52 : smooth((state.local - .17) / .66);
      const action = actionTiming(state.scene, rawAction);
      const videoRecord = videoRecords[state.scene];
      if (videoRecord) {
        videoRecord.frame = action * (videoRecord.frames - 1);
        videoRecord.requestedTime = videoRecord.frame / 24;
        material.uniforms.uVideoFrame.value = videoRecord.frame;
      }
      const contacts = [[.51], [], [.50], [.25,.75], [.26,.73], [.84], [.24,.48,.72]][state.scene];
      if (contactScene !== state.scene) {
        contactScene = state.scene;
        lastAction = action;
        impactAt = -10000;
      }
      if (!reducedMotion && Math.abs(action-lastAction) < .22 && contacts.some(c =>
        (lastAction < c && action >= c) || (lastAction > c && action <= c))) {
        impactAt = time;
        impactCount++;
      }
      lastAction = action;
      const age = Math.max(0, (time-impactAt)/1000);
      const impulse = reducedMotion ? 0 : Math.exp(-age*9) * assemble * (1-disperse);
      const contactUv = [[.58,.28],[.7,.69],[.50,.53],[.48,.55],[.51,.63],[.48,.24],[.57,.28]][state.scene];
      motionState = { scene:state.scene, rawAction, action, frame:videoRecord?.frame ?? null,
        impulse, age, impacts:impactCount, atlas:!!videoRecord };
      const finalFade = state.scene === SCENES.length - 1 ? smooth((state.local - .94) / .06) : 0;
      [material, actionMaterial, detailMaterial].filter(Boolean).forEach((layerMaterial) => {
        layerMaterial.uniforms.uAssemble.value = assemble;
        layerMaterial.uniforms.uDisperse.value = disperse;
        layerMaterial.uniforms.uAction.value = action;
        layerMaterial.uniforms.uScene.value = state.scene;
        layerMaterial.uniforms.uOpacity.value = 1 - finalFade;
        layerMaterial.uniforms.uTime.value = time * .001;
        layerMaterial.uniforms.uImpulse.value = impulse;
        layerMaterial.uniforms.uImpulseAge.value = Math.min(age, 2);
        layerMaterial.uniforms.uContactUv.value.set(...contactUv);
        layerMaterial.uniforms.uPointer.value.copy(pointerCurrent);
        layerMaterial.uniforms.uPointerEnergy.value = pointerEnergy;
      });
      particles.rotation.x = tilt.y * .032;
      particles.rotation.y = tilt.x * .05;
      particles.rotation.z = -tilt.x * tilt.y * .009;
      const isEnvelope = state.scene === 6;
      particles.position.x = isEnvelope ? -.36 : -.27;
      particles.position.y = isEnvelope ? .065 : 0;
      const sceneScaleX = isEnvelope ? .94 : 1.13;
      const sceneScaleY = isEnvelope ? 1.16 : 1.13;
      particles.scale.set(sceneScaleX, sceneScaleY, 1);
      actionParticles.visible = state.scene === 6;
      actionParticles.rotation.copy(particles.rotation);
      actionParticles.scale.set(isEnvelope ? 1.05 : sceneScaleX, isEnvelope ? 1.27 : sceneScaleY, 1);
      actionParticles.position.set(isEnvelope ? -.36 : particles.position.x, isEnvelope ? .065 : particles.position.y, 0);
      detailParticles.visible = false;
      detailParticles.rotation.copy(particles.rotation);
      detailParticles.scale.copy(particles.scale);
      detailParticles.position.copy(particles.position);
      renderer.render(scene, camera);
    }

    function resize() {
      if (!renderer || !camera) return;
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      const aspect = width / height;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.22);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
      material.uniforms.uAspect.value = aspect;
      material.uniforms.uPixelRatio.value = pixelRatio;
      actionMaterial.uniforms.uAspect.value = aspect;
      actionMaterial.uniforms.uPixelRatio.value = pixelRatio;
      if (detailMaterial) {
        detailMaterial.uniforms.uAspect.value = aspect;
        detailMaterial.uniforms.uPixelRatio.value = pixelRatio;
      }
      renderScene(performance.now());
    }

    function readProgress() {
      const bounds = section.getBoundingClientRect();
      visible = bounds.bottom > 0 && bounds.top < innerHeight && !document.hidden;
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      const entryHold = Math.min(window.innerHeight * .92, range * .08);
      const activeRange = Math.max(1, range - entryHold);
      const desktopEntry = window.innerWidth > 900;
      const entryBlend = desktopEntry ? smooth((window.innerHeight - bounds.top) / window.innerHeight) : 1;
      const paper = section.querySelector('.sand-narrative-sticky');
      paper.style.opacity = entryBlend.toFixed(4);
      paper.style.transform = '';
      paper.style.pointerEvents = desktopEntry && bounds.top > 0 ? 'none' : '';
      document.body.classList.toggle('is-sand-reading', visible && entryBlend > .72 && bounds.bottom > 0);
      targetProgress = clamp((-bounds.top - entryHold) / activeRange);
      if (reducedMotion) displayProgress = targetProgress;
      requestFrame();
    }


    function animate(time) {
      frame = 0;
      if (!visible || !renderer || contextLost) return;
      const delta = Math.min(2.2, Math.max(.25, (time - lastFrameTime) / 16.667));
      lastFrameTime = time;
      const progressDifference = targetProgress - displayProgress;
      displayProgress += progressDifference * (reducedMotion ? 1 : 1 - Math.pow(.79, delta));
      pointerVelocity.x += (pointerTarget.x - pointerCurrent.x) * .075 * delta;
      pointerVelocity.y += (pointerTarget.y - pointerCurrent.y) * .075 * delta;
      pointerVelocity.multiplyScalar(Math.pow(.79, delta));
      pointerCurrent.addScaledVector(pointerVelocity, delta);
      tiltVelocity.x += (pointerTarget.x - tilt.x) * .045 * delta;
      tiltVelocity.y += (pointerTarget.y - tilt.y) * .045 * delta;
      tiltVelocity.multiplyScalar(Math.pow(.82, delta));
      tilt.addScaledVector(tiltVelocity, delta);
      pointerEnergy *= Math.pow(.9, delta);
      renderScene(time);
      const unsettled = Math.abs(targetProgress - displayProgress) > .00004 ||
        pointerVelocity.lengthSq() > .000002 || tiltVelocity.lengthSq() > .000002 || pointerEnergy > .003;
      if (unsettled || (!reducedMotion && time-impactAt < 700)) frame = requestAnimationFrame(animate);
    }

    function requestFrame() {
      if (!frame && visible && renderer) frame = requestAnimationFrame(animate);
    }

    function handlePointer(event) {
      if (!visible) return;
      const bounds = canvas.getBoundingClientRect();
      if (event.clientY < bounds.top || event.clientY > bounds.bottom) return;
      const now = performance.now();
      const elapsed = Math.max(16, now - lastPointerTime);
      const movement = Math.hypot(event.clientX - lastPointerX, event.clientY - lastPointerY) / elapsed;
      pointerTarget.set(
        clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1),
        clamp(-((event.clientY - bounds.top) / bounds.height * 2 - 1), -1, 1)
      );
      pointerEnergy = clamp(pointerEnergy + movement * .18, 0, 1);
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      lastPointerTime = now;
      requestFrame();
    }

    async function initializeRenderer(field) {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
      renderer.setClearColor(0xf1f0ec, 0);
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -3, 3);
      camera.position.z = 1;
      scene = new THREE.Scene();
      geometry = new THREE.BufferGeometry();
      const firstTarget = targets[0];
      const fallbackPixel = new Uint8Array([255, 255, 255, 255]);
      fallbackVideoTexture = new THREE.DataTexture(fallbackPixel, 1, 1, THREE.RGBAFormat);
      fallbackVideoTexture.needsUpdate = true;
      videoRecords.forEach((record) => {
        if (!record) return;
        record.texture = new THREE.Texture(record.image);
        record.texture.minFilter = THREE.LinearFilter;
        record.texture.magFilter = THREE.LinearFilter;
        record.texture.generateMipmaps = false;
        if ("colorSpace" in record.texture && THREE.SRGBColorSpace) record.texture.colorSpace = THREE.SRGBColorSpace;
        record.texture.needsUpdate = true;
      });
      geometry.setAttribute("position", new THREE.BufferAttribute(firstTarget.base.positions.slice(), 3));
      geometry.setAttribute("aShape", new THREE.BufferAttribute(firstTarget.base.positions.slice(), 3).setUsage(THREE.DynamicDrawUsage));
      geometry.setAttribute("aPoseA", new THREE.BufferAttribute(firstTarget.poseA.positions.slice(), 3).setUsage(THREE.DynamicDrawUsage));
      geometry.setAttribute("aPoseB", new THREE.BufferAttribute(firstTarget.poseB.positions.slice(), 3).setUsage(THREE.DynamicDrawUsage));
      geometry.setAttribute("aField", new THREE.BufferAttribute(field.positions, 3));
      geometry.setAttribute("aUv", new THREE.BufferAttribute(firstTarget.base.uv.slice(), 2).setUsage(THREE.DynamicDrawUsage));
      geometry.setAttribute("aDensity", new THREE.BufferAttribute(firstTarget.base.density.slice(), 1).setUsage(THREE.DynamicDrawUsage));
      geometry.setAttribute("aFocus", new THREE.BufferAttribute(firstTarget.base.focus.slice(), 1).setUsage(THREE.DynamicDrawUsage));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(field.size, 1));
      geometry.setAttribute("aOpacity", new THREE.BufferAttribute(firstTarget.base.opacity.slice(), 1).setUsage(THREE.DynamicDrawUsage));
      geometry.setAttribute("aPoseAOpacity", new THREE.BufferAttribute(firstTarget.poseA.opacity.slice(), 1).setUsage(THREE.DynamicDrawUsage));
      geometry.setAttribute("aPoseBOpacity", new THREE.BufferAttribute(firstTarget.poseB.opacity.slice(), 1).setUsage(THREE.DynamicDrawUsage));
      geometry.setAttribute("aFieldOpacity", new THREE.BufferAttribute(field.opacity, 1));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(field.seed, 1));
      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.NormalBlending,
        uniforms: {
          uAssemble: { value: 0 },
          uDisperse: { value: 0 },
          uAction: { value: 0 },
          uScene: { value: 0 },
          uAspect: { value: 1 },
          uPixelRatio: { value: 1 },
          uOpacity: { value: 1 },
          uTime: { value: 0 },
          uVideoGrid: { value: new THREE.Vector2(8, videoRecords[0]?.rows || 1) },
          uVideoFrame: { value: 0 },
          uImpulse: { value: 0 },
          uImpulseAge: { value: 0 },
          uContactUv: { value: new THREE.Vector2(.58,.28) },
          uPointer: { value: new THREE.Vector2() },
          uPointerEnergy: { value: 0 },
          uLayer: { value: 0 },
          uDetail: { value: 0 },
          uVideoTexture: { value: videoRecords[0] ? videoRecords[0].texture : fallbackVideoTexture },
          uUseVideo: { value: videoRecords[0] ? 1 : 0 }
        }
      });
      actionMaterial = material.clone();
      actionMaterial.uniforms = THREE.UniformsUtils.clone(material.uniforms);
      actionMaterial.uniforms.uLayer.value = 1;
      actionMaterial.uniforms.uUseVideo.value = 0;
      actionMaterial.uniforms.uVideoTexture.value = fallbackVideoTexture;
      particles = new THREE.Points(geometry, material);
      actionParticles = new THREE.Points(geometry, actionMaterial);
      const envelopeDetail = targets[6].base.detail;
      detailGeometry = geometry.clone();
      detailGeometry.setAttribute("position", new THREE.BufferAttribute(envelopeDetail.positions.slice(), 3));
      detailGeometry.setAttribute("aShape", new THREE.BufferAttribute(envelopeDetail.positions.slice(), 3));
      detailGeometry.setAttribute("aPoseA", new THREE.BufferAttribute(envelopeDetail.positions.slice(), 3));
      detailGeometry.setAttribute("aPoseB", new THREE.BufferAttribute(envelopeDetail.positions.slice(), 3));
      detailGeometry.setAttribute("aUv", new THREE.BufferAttribute(envelopeDetail.uv, 2));
      detailGeometry.setAttribute("aDensity", new THREE.BufferAttribute(envelopeDetail.density, 1));
      detailGeometry.setAttribute("aFocus", new THREE.BufferAttribute(envelopeDetail.focus, 1));
      detailGeometry.setAttribute("aOpacity", new THREE.BufferAttribute(envelopeDetail.opacity, 1));
      detailGeometry.setAttribute("aPoseAOpacity", new THREE.BufferAttribute(envelopeDetail.opacity, 1));
      detailGeometry.setAttribute("aPoseBOpacity", new THREE.BufferAttribute(envelopeDetail.opacity, 1));
      detailGeometry.setDrawRange(0, Math.floor(PARTICLE_COUNT * .012));
      detailMaterial = material.clone();
      detailMaterial.uniforms = THREE.UniformsUtils.clone(material.uniforms);
      detailMaterial.uniforms.uUseVideo.value = 0;
      detailMaterial.uniforms.uVideoTexture.value = fallbackVideoTexture;
      detailMaterial.uniforms.uDetail.value = 1;
      detailParticles = new THREE.Points(detailGeometry, detailMaterial);
      particles.frustumCulled = false;
      actionParticles.frustumCulled = false;
      detailParticles.frustumCulled = false;
      detailParticles.visible = false;
      actionParticles.renderOrder = 1;
      detailParticles.renderOrder = 2;
      scene.add(particles, actionParticles, detailParticles);
      window.__sandStoryDebug = {
        gpuPrepared: false,
        particleCount: PARTICLE_COUNT,
        sceneCount: SCENES.length,
        getProgress: () => displayProgress,
        getScene: () => currentScene,
        getPointerEnergy: () => pointerEnergy,
        getMotionState: () => ({...motionState}),
        actionTiming,
        getInkPixels: () => {
          renderScene(performance.now());
          const gl = renderer.getContext();
          const data = new Uint8Array(canvas.width * canvas.height * 4);
          gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, data);
          let ink = 0;
          for (let i = 0; i < data.length; i += 64) if (data[i+3] > 10 && data[i] < 180) ink++;
          return ink;
        },
        getEntryState: () => ({ ...entryDebug, entryPrimed: false, entryLock: false }),
        getRendererState:()=>({visible,contextLost,contextRestores,contextAvailable:!renderer.getContext().isContextLost(),renderedScene:currentScene,targetProgress,displayProgress}),
        exerciseContextRestore:()=>{const ext=renderer.getContext().getExtension("WEBGL_lose_context");ext?.loseContext();setTimeout(()=>ext?.restoreContext(),150);},
        getVideoState: () => videoRecords.map((record) => record ? ({
          currentTime: record.requestedTime,
          duration: record.duration,
          readyState: 4,
          seeking: false,
          atlas: true,
          frame: record.frame,
          requestedTime: record.requestedTime
        }) : null)
      };
      currentScene = 0;
      resize();
      // Complete the first shader compilation, atlas uploads and vertex-buffer draw during the opening.
      // The original poses and visible renderer size are unchanged.
      const warmTarget = new THREE.WebGLRenderTarget(16, 16);
      await renderer.compileAsync(scene, camera);
      for (const record of videoRecords) {
        if (record?.texture) renderer.initTexture(record.texture);
        await new Promise(resolve => requestAnimationFrame(resolve));
      }
      renderer.setRenderTarget(warmTarget);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      warmTarget.dispose();
      // The visible canvas has a separate default framebuffer: allocate and draw it now too,
      // instead of paying that first full-size draw when the scroll enters the chapter.
      renderer.render(scene, camera);
      window.__sandStoryDebug.gpuPrepared = true;
      readProgress();
    }

    Promise.all([Promise.all(SCENES.map(async (sceneItem, index) => {
      const [baseImage, poseAImage, poseBImage] = await Promise.all([
        loadImage(sceneItem.src),
        sceneItem.poseA ? loadImage(sceneItem.poseA) : null,
        sceneItem.poseB ? loadImage(sceneItem.poseB) : null
      ]);
      const guide = await sampleScene(createSamplingGuide([baseImage, poseAImage, poseBImage]), sceneItem.seed, index);
      const base = poseAImage || poseBImage ? await sampleScene(baseImage, sceneItem.seed, index, guide.uv) : guide;
      return {
        base,
        poseA: poseAImage ? await sampleScene(poseAImage, sceneItem.seed, index, guide.uv) : base,
        poseB: poseBImage ? await sampleScene(poseBImage, sceneItem.seed, index, guide.uv) : base
      };
    })), Promise.all(SCENES.map(loadVideo))]).then(async ([loadedTargets, loadedVideos]) => {
      const cameraTarget = await sampleCameraOperator(await loadImage(SCENES[1].src));
      loadedTargets[1] = { base: cameraTarget, poseA: cameraTarget, poseB: cameraTarget };
      const envelopeTarget = sampleRainSurface();
      loadedTargets[6] = { base: envelopeTarget, poseA: envelopeTarget, poseB: envelopeTarget };
      targets = loadedTargets;
      videoRecords = loadedVideos;
      await initializeRenderer(createField());
    }).catch(() => {
      section.classList.add("is-sand-fallback");
    });

    new IntersectionObserver(([entry]) => {
      const bounds=section.getBoundingClientRect();visible = bounds.bottom>0&&bounds.top<innerHeight&&!document.hidden;
      document.body.classList.toggle("is-sand-reading", visible);
      if (visible) {
        lastFrameTime = performance.now();
        readProgress();
      } else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { rootMargin: "0px", threshold: 0 }).observe(section);
    window.addEventListener("scroll", readProgress, { passive: true });
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();contextLost=true;cancelAnimationFrame(frame);frame=0;});
    canvas.addEventListener('webglcontextrestored',()=>{contextLost=false;contextRestores++;currentScene=-1;lastFrameTime=performance.now();resize();readProgress();});
    const resumeChapter=()=>{lastFrameTime=performance.now();readProgress();requestFrame();};
    window.addEventListener('portfolio:surface-return',resumeChapter);
    window.addEventListener('pageshow',resumeChapter);
    document.addEventListener('visibilitychange',resumeChapter);
    window.__v31SandEntryGate = () => true;
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", handlePointer, { passive: true });
    document.documentElement.addEventListener("mouseleave", () => {
      pointerTarget.set(0, 0);
      pointerEnergy = Math.max(pointerEnergy, .22);
      requestFrame();
    });
  }

  function init() {
    if (document.body.classList.contains("experience-entered") || document.body.dataset.openingStarted === "true" || document.body.dataset.openingComplete === "true") initSandNarrative();
    else window.addEventListener("v31:opening-complete", initSandNarrative, { once: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
