/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * @param {HTMLElement} el
 */
function getBoundingRect(el) {
  const { x, y, width: w, height: h } = el.getBoundingClientRect();
  return {
    x,
    y,
    centerx: x + w / 2,
    centery: y + h / 2,
    w,
    h,
  };
}

/**
 * @param {HTMLElement} el
 */
function getCorners(el) {
  const { x, y, w, h } = getBoundingRect(el);
  return [
    { x, y },
    { x: x + w, y },
    { x, y: y + h },
    { x: x + w, y: y + h },
  ]
}

/**
 * @param {HTMLElement} el1
 * @param {HTMLElement} el2
 */
function isColide(el1, el2) {
  const [el11, el12, el13, el14] = getCorners(el1);
  const { x: x0, y: y0 } = el11;
  const { x: x1, y: y1 } = el14; 
  const el2corners = getCorners(el2);
  for (const el2corner of el2corners) {
    const { x, y } = el2corner;
    if (x >= x0 && x <= x1 && y >= y0 && y <= y1) {
      return true;
    }
  }
  return false;
}

function getScreenSize() {
  return {
    w: window.innerWidth,
    h: window.innerHeight
  }
}

/**
 * @param {HTMLElement} el
 * @param {{x:number,y:number}} coor
 */
function setCoordinate(el, coor) {
  let { x, y } = coor;
  const { w: screenW, h: screenH } = getScreenSize();
  if (x < 0) x = 0;
  else if (x > screenW) x = screenW;
  if (y < 0) y = 0;
  else if (y > screenH) y = screenH;
  el.style.setProperty('--centerx', `${x}px`);
  el.style.setProperty('--centery', `${y}px`);
}

/** @type {HTMLElement[]} */
const players = [];

const speed = 2;

/**
 * @param {HTMLElement} gameMap
 * @param {string} _playerName
 */
function createPlayer(gameMap, _playerName) {
  const player = document.createElement('div');
  player.classList.add('player');
  player.innerText = _playerName;
  gameMap.appendChild(player);
  players.push(player);
  const screenSize = getScreenSize();
  setCoordinate(player, {x: Math.random() * screenSize.w, y: Math.random() * screenSize.h});
  /** @type {HTMLElement|null} */
  let enemy = null;
  setInterval(() => {
    const playerName = player.innerText;
    const enemyName = playerName === '石'
      ? '刀'
      : playerName === '刀'
        ? '布'
        : '石';
    if (enemy === null || enemy.innerText !== enemyName) {
      enemy = getClosestPlayer(player, enemyName);
    }
    if (enemy === null) return;
    const { centerx: x1, centery: y1 } = getBoundingRect(player);
    const { centerx: x2, centery: y2 } = getBoundingRect(enemy);
    for (const p of players) {
      if (p.innerText === enemyName && isColide(player, p)) {
        enemy.innerText = player.innerText;
      }
    }
    const dx = x2 - x1;
    const dy = y2 - y1;
    const rx = dx / (Math.abs(dx) + Math.abs(dy));
    const ry = dy / (Math.abs(dx) + Math.abs(dy));
    setCoordinate(player, { x: x1 + speed * rx, y: y1 + speed * ry });
  }, 1);
}

/**
 * @param {HTMLElement} el
 * @param {string} name
 */
function getClosestPlayer(el, name) {
  /** @type {HTMLElement|null} */
  let closestPlayer = null, closestDistance = Infinity;
  const { centerx: x1, centery: y1 } = getBoundingRect(el);
  for (const player of players) {
    if (player.innerText === name) {
      const { centerx: x2, centery: y2 } = getBoundingRect(player);
      const d = calculateDistance(x1, y1, x2, y2);
      if (d < closestDistance) {
        closestDistance = d;
        closestPlayer = player;
      }
    }
  }
  return closestPlayer;
}

window.addEventListener('load', () => {
  const gameMap = document.getElementById('rps-map');
  for (let i = 0; i < 50; i++) {
    createPlayer(gameMap, '石', '刀');
    createPlayer(gameMap, '刀', '布');
    createPlayer(gameMap, '布', '石');
  }
})