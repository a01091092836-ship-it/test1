// Zdog로 만든 춤추는 캐릭터
// Zdog는 index.html에서 CDN으로 불러와요.

const TAU = Zdog.TAU;
const canvas = document.querySelector(".illo");

const SKIN = "#ffd9b3";
const SHIRT = "#ff8fa3";
const PANTS = "#3b4a6b";
const INK = "#1d2b44";
const BASE_Y = 10; // 캐릭터를 화면 가운데에 맞추는 값

const illo = new Zdog.Illustration({
  element: canvas,
  resize: true,
  zoom: 2,
  dragRotate: true,
  onResize(width, height) {
    // 화면 크기에 맞춰 캐릭터 크기를 조절해요.
    this.zoom = Math.max(1, Math.min(width / 280, height / 330));
  },
});

// 바닥 그림자
const shadow = new Zdog.Ellipse({
  addTo: illo,
  diameter: 90,
  translate: { y: BASE_Y + 62 },
  rotate: { x: TAU / 4 },
  stroke: false,
  fill: true,
  color: "#a9c6e6",
});

// 캐릭터 전체
const hero = new Zdog.Anchor({
  addTo: illo,
  translate: { y: BASE_Y },
});

// 몸통
new Zdog.Shape({
  addTo: hero,
  path: [{ y: -14 }, { y: 14 }],
  stroke: 44,
  color: SHIRT,
});

// 머리
const head = new Zdog.Anchor({
  addTo: hero,
  translate: { y: -52 },
});

new Zdog.Shape({
  addTo: head,
  stroke: 50,
  color: SKIN,
});

// 눈
[-9, 9].forEach((x) => {
  new Zdog.Shape({
    addTo: head,
    translate: { x, y: -2, z: 22 },
    stroke: 6,
    color: INK,
  });
});

// 웃는 입
new Zdog.Shape({
  addTo: head,
  path: [
    { x: -8, y: 7, z: 23 },
    { arc: [{ x: 0, y: 14, z: 24 }, { x: 8, y: 7, z: 23 }] },
  ],
  closed: false,
  fill: false,
  stroke: 3,
  color: INK,
});

// 머리카락(윗부분)
new Zdog.Hemisphere({
  addTo: head,
  diameter: 52,
  translate: { y: -7 },
  rotate: { x: TAU / 4 },
  color: INK,
  backface: INK,
  stroke: false,
});

// 팔: 어깨 위치에서 아래로 뻗은 막대 + 손
function makeArm(x) {
  const arm = new Zdog.Anchor({
    addTo: hero,
    translate: { x, y: -24 },
  });
  new Zdog.Shape({
    addTo: arm,
    path: [{ y: 0 }, { y: 28 }],
    stroke: 12,
    color: SHIRT,
  });
  new Zdog.Shape({
    addTo: arm,
    translate: { y: 33 },
    stroke: 15,
    color: SKIN,
  });
  return arm;
}

// 다리: 엉덩이 위치에서 아래로 뻗은 막대 + 발
function makeLeg(x) {
  const leg = new Zdog.Anchor({
    addTo: hero,
    translate: { x, y: 16 },
  });
  new Zdog.Shape({
    addTo: leg,
    path: [{ y: 0 }, { y: 32 }],
    stroke: 14,
    color: PANTS,
  });
  new Zdog.Shape({
    addTo: leg,
    translate: { y: 36, z: 4 },
    stroke: 16,
    color: INK,
  });
  return leg;
}

const leftArm = makeArm(-28);
const rightArm = makeArm(28);
const leftLeg = makeLeg(-12);
const rightLeg = makeLeg(12);

let t = 0;

function pose() {
  const beat = t * 2;
  const s = Math.sin(beat);

  // 위아래로 통통 튀기
  const bounce = Math.abs(s);
  hero.translate.y = BASE_Y - bounce * 10;
  shadow.diameter = 90 - bounce * 18;

  // 몸을 좌우로 살짝 돌리기
  hero.rotate.y = Math.sin(t) * 0.5;
  hero.rotate.z = s * 0.05;
  head.rotate.z = Math.sin(beat + 0.8) * 0.15;

  // 양팔을 번갈아 들어 올리기 (왼팔은 +, 오른팔은 - 방향이 바깥쪽)
  leftArm.rotate.z = 1.4 + s * 1.0;
  rightArm.rotate.z = -(1.4 - s * 1.0);

  // 다리를 번갈아 차기
  leftLeg.rotate.z = 0.12 + Math.max(0, s) * 0.5;
  rightLeg.rotate.z = -(0.12 + Math.max(0, -s) * 0.5);
}

function animate() {
  t += 0.05;
  pose();
  illo.updateRenderGraph();
  requestAnimationFrame(animate);
}

// 움직임을 줄이고 싶은 사용자 설정을 존중해요.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  t = 0.6;
  pose();
  illo.updateRenderGraph();
  window.addEventListener("resize", () => illo.updateRenderGraph());
} else {
  animate();
}
