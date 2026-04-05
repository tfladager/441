// ============================================================
//  HW-13  ·  Commissioner on the Run
//  Classes: Player, Obstacle, Collectible
//  1920s broadside aesthetic meets modern county government
// ============================================================

const canvas = document.getElementById("gameCanvas");
const ctx    = canvas.getContext("2d");

let score        = 0;
let obstacles    = [];
let collectibles = [];
let gameWon      = false;
let tooltip      = null;   // { label, timer }
let particles    = [];     // sparkle on collect

// ── Keys ─────────────────────────────────────────────────────
const keys = {};
window.addEventListener("keydown", e => {
  keys[e.key] = true;
  e.preventDefault();
});
window.addEventListener("keyup",   e => { keys[e.key] = false; });

// ── Audio — sad trombone wah-wah ─────────────────────────────
let audioCtx = null;
let wahCooldown = 0; // prevent rapid re-triggering

function playWahWah() {
  if (wahCooldown > 0) return;
  wahCooldown = 80; // frames before it can fire again

  // Lazy-init AudioContext on first user interaction
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const now = audioCtx.currentTime;
  const notes = [
    { freq: 466, start: 0,    dur: 0.18 },  // Bb4
    { freq: 415, start: 0.16, dur: 0.18 },  // Ab4
    { freq: 370, start: 0.32, dur: 0.18 },  // F#4
    { freq: 311, start: 0.48, dur: 0.38 },  // Eb4 — the long sad one
  ];

  notes.forEach(({ freq, start, dur }) => {
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sawtooth"; // brassy trombone-ish
    osc.frequency.setValueAtTime(freq, now + start);
    // Slight pitch droop on each note for the wah feel
    osc.frequency.linearRampToValueAtTime(freq * 0.93, now + start + dur);

    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.18, now + start + 0.02);
    gain.gain.linearRampToValueAtTime(0.14, now + start + dur - 0.04);
    gain.gain.linearRampToValueAtTime(0, now + start + dur);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now + start);
    osc.stop(now + start + dur + 0.05);
  });
}

// ── Utility ───────────────────────────────────────────────────
function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx &&
         ay < by + bh && ay + ah > by;
}
function circleRectOverlap(cx, cy, cr, rx, ry, rw, rh) {
  const nearX = Math.max(rx, Math.min(cx, rx + rw));
  const nearY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - nearX, dy = cy - nearY;
  return (dx * dx + dy * dy) < (cr * cr);
}

// ── Particle ─────────────────────────────────────────────────
class Particle {
  constructor(x, y, color) {
    this.x  = x; this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4 - 2;
    this.alpha = 1;
    this.color = color;
    this.size  = Math.random() * 5 + 3;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vy += 0.15;
    this.alpha -= 0.035;
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle   = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ============================================================
//  CLASS: Obstacle
// ============================================================
class Obstacle {
  constructor(data) {
    this.id     = data.id;
    this.x      = data.x;
    this.y      = data.y;
    this.width  = data.width;
    this.height = data.height;
    this.type   = data.type;
    this.label  = data.label;
    this.emoji  = data.emoji;
    this.pulse  = Math.random() * Math.PI * 2;
    this.flash  = 0; // frames to flash red on hit
  }

  update() {
    this.pulse += 0.04;
    if (this.flash > 0) this.flash--;
  }

  draw(ctx) {
    const glow = Math.sin(this.pulse) * 0.15 + 0.85;

    // Aged parchment card with dark border
    ctx.save();

    // Drop shadow
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(this.x + 5, this.y + 5, this.width, this.height);

    // Card background — sepia tinted by type
    const bgColors = {
      phone:       "#d6cdb0",
      meeting:     "#cec9ac",
      constituent: "#d4c8a8",
      mandate:     "#cbc5a6",
      agenda:      "#d2caa8"
    };
    ctx.fillStyle = bgColors[this.type] || "#d0c8a8";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Aged ink stain overlay
    ctx.fillStyle = "rgba(80,65,40,0.08)";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Red flash on collision hit
    if (this.flash > 0) {
      ctx.fillStyle = `rgba(200,40,20,${(this.flash / 18) * 0.45})`;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Art deco border — double rule in faded ink
    ctx.strokeStyle = "#6b6050";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "rgba(107,96,80,0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);

    // Corner ornaments — dusty ink
    const corners = [[this.x+2,this.y+2],[this.x+this.width-10,this.y+2],
                     [this.x+2,this.y+this.height-10],[this.x+this.width-10,this.y+this.height-10]];
    ctx.fillStyle = "#6b6050";
    corners.forEach(([cx,cy]) => {
      ctx.fillRect(cx, cy, 8, 2);
      ctx.fillRect(cx, cy, 2, 8);
    });

    // Emoji (pulsing scale)
    const scale = 0.9 + Math.sin(this.pulse) * 0.1;
    ctx.font = `${Math.floor(28 * scale)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.emoji, this.x + this.width / 2, this.y + this.height / 2 - 6);

    // Type label in tiny slab serif style
    ctx.font = "bold 7px 'Georgia', serif";
    ctx.fillStyle = "#6b6050";
    ctx.fillText("OBSTACLE", this.x + this.width / 2, this.y + this.height - 8);

    ctx.restore();
  }
}

// ============================================================
//  CLASS: Collectible
// ============================================================
class Collectible {
  constructor(data) {
    this.id      = data.id;
    this.x       = data.x;
    this.y       = data.y;
    this.radius  = data.radius;
    this.type    = data.type;
    this.label   = data.label;
    this.emoji   = data.emoji;
    this.points  = data.points;
    this.active  = true;
    this.bob     = Math.random() * Math.PI * 2;
  }

  update() {
    this.bob += 0.05;
  }

  draw(ctx) {
    if (!this.active) return;
    const offsetY = Math.sin(this.bob) * 4;

    ctx.save();

    // Glow ring
    const gradient = ctx.createRadialGradient(
      this.x, this.y + offsetY, this.radius * 0.3,
      this.x, this.y + offsetY, this.radius * 1.8
    );
    const glowColors = {
      knowledge:    ["rgba(107,96,80,0.45)",  "rgba(107,96,80,0)"],
      relationship: ["rgba(130,120,95,0.45)", "rgba(130,120,95,0)"],
      grant:        ["rgba(160,140,90,0.55)",  "rgba(160,140,90,0)"],
      equipment:    ["rgba(110,115,105,0.45)","rgba(110,115,105,0)"],
      win:          ["rgba(150,130,80,0.6)",   "rgba(150,130,80,0)"]
    };
    const [c1, c2] = glowColors[this.type] || ["rgba(107,96,80,0.4)", "rgba(107,96,80,0)"];
    gradient.addColorStop(0, c1);
    gradient.addColorStop(1, c2);
    ctx.beginPath();
    ctx.arc(this.x, this.y + offsetY, this.radius * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Circle background — yellowed newsprint
    ctx.beginPath();
    ctx.arc(this.x, this.y + offsetY, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#e8e0c8";
    ctx.fill();
    ctx.strokeStyle = "#6b6050";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Inner ring
    ctx.beginPath();
    ctx.arc(this.x, this.y + offsetY, this.radius - 4, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(107,96,80,0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Emoji
    ctx.font = `${this.radius}px serif`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.emoji, this.x, this.y + offsetY);

    // Points badge
    ctx.font      = "bold 8px Georgia, serif";
    ctx.fillStyle = "#5a5040";
    ctx.fillText(`+${this.points}`, this.x, this.y + offsetY + this.radius + 10);

    ctx.restore();
  }
}

// ============================================================
//  CLASS: Player
// ============================================================
class Player {
  constructor() {
    this.x      = 50;
    this.y      = 450;
    this.width  = 36;
    this.height = 44;
    this.speed  = 3;
    this.frame  = 0;
    this.frameTimer = 0;
    this.facing = 1; // 1 = right, -1 = left
    this.moving = false;
  }

  update(obstacles) {
    let dx = 0, dy = 0;
    if (keys["ArrowLeft"]  || keys["a"]) { dx -= this.speed; this.facing = -1; }
    if (keys["ArrowRight"] || keys["d"]) { dx += this.speed; this.facing =  1; }
    if (keys["ArrowUp"]    || keys["w"]) dy -= this.speed;
    if (keys["ArrowDown"]  || keys["s"]) dy += this.speed;

    this.moving = (dx !== 0 || dy !== 0);

    // Animate legs
    if (this.moving) {
      this.frameTimer++;
      if (this.frameTimer > 8) { this.frame = (this.frame + 1) % 4; this.frameTimer = 0; }
    } else {
      this.frame = 0;
    }

    // Move X then check
    let nx = this.x + dx;
    nx = Math.max(0, Math.min(canvas.width - this.width, nx));
    let blockedX = false;
    for (const obs of obstacles) {
      if (rectsOverlap(nx, this.y, this.width, this.height,
                       obs.x, obs.y, obs.width, obs.height)) {
        blockedX = true;
        obs.flash = 18;
        playWahWah();
        break;
      }
    }
    if (!blockedX) this.x = nx;

    // Move Y then check
    let ny = this.y + dy;
    ny = Math.max(0, Math.min(canvas.height - this.height, ny));
    let blockedY = false;
    for (const obs of obstacles) {
      if (rectsOverlap(this.x, ny, this.width, this.height,
                       obs.x, obs.y, obs.width, obs.height)) {
        blockedY = true;
        obs.flash = 18;
        playWahWah();
        break;
      }
    }
    if (!blockedY) this.y = ny;
  }

  draw(ctx) {
    ctx.save();
    const cx = this.x + this.width / 2;
    const cy = this.y;

    // Flip for direction
    ctx.translate(cx, cy);
    ctx.scale(this.facing, 1);
    ctx.translate(-this.width / 2, 0);

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(this.width/2, this.height + 3, 14, 5, 0, 0, Math.PI*2);
    ctx.fill();

    // Legs (walking animation)
    const legSwing = this.moving ? Math.sin(this.frame / 4 * Math.PI * 2) * 6 : 0;
    ctx.fillStyle = "#3a3530";
    // left leg
    ctx.fillRect(this.width/2 - 10, this.height - 14 - legSwing, 8, 16 + legSwing);
    // right leg
    ctx.fillRect(this.width/2 + 2,  this.height - 14 + legSwing, 8, 16 - legSwing);

    // Shoes
    ctx.fillStyle = "#252220";
    ctx.fillRect(this.width/2 - 12, this.height, 10, 5);
    ctx.fillRect(this.width/2 + 1,  this.height, 10, 5);

    // Coat / body — dusty charcoal with gray-ink lapels
    ctx.fillStyle = "#2e2b28";
    ctx.fillRect(this.width/2 - 12, this.height - 26, 24, 14);
    // Lapels — faded gray
    ctx.fillStyle = "#7a7060";
    ctx.beginPath();
    ctx.moveTo(this.width/2 - 2, this.height - 26);
    ctx.lineTo(this.width/2 - 8, this.height - 18);
    ctx.lineTo(this.width/2,     this.height - 20);
    ctx.closePath();
    ctx.fill();
    // Buttons — muted brass
    ctx.fillStyle = "#908060";
    [0, 5, 10].forEach(by => {
      ctx.beginPath();
      ctx.arc(this.width/2, this.height - 24 + by, 1.5, 0, Math.PI*2);
      ctx.fill();
    });

    // Arms
    const armSwing = this.moving ? legSwing * 0.5 : 0;
    ctx.fillStyle = "#2e2b28";
    ctx.fillRect(this.width/2 - 18, this.height - 24 + armSwing, 7, 13);
    ctx.fillRect(this.width/2 + 11, this.height - 24 - armSwing, 7, 13);
    // Hands — faded skin
    ctx.fillStyle = "#c4a882";
    ctx.beginPath(); ctx.arc(this.width/2-14, this.height-11+armSwing, 4,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(this.width/2+15, this.height-11-armSwing, 4,0,Math.PI*2); ctx.fill();

    // Head
    ctx.fillStyle = "#c4a882";
    ctx.beginPath();
    ctx.ellipse(this.width/2, this.height - 34, 11, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Face — grayed ink
    ctx.fillStyle = "#5a5048";
    // eyes
    ctx.beginPath(); ctx.arc(this.width/2-4, this.height-36, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(this.width/2+4, this.height-36, 2, 0, Math.PI*2); ctx.fill();
    // mustache (it's the 1920s after all)
    ctx.fillStyle = "#4a4038";
    ctx.beginPath();
    ctx.ellipse(this.width/2, this.height-30, 5, 2, 0, 0, Math.PI);
    ctx.fill();

    // Hat — dusty charcoal
    ctx.fillStyle = "#252220";
    // brim
    ctx.fillRect(this.width/2 - 14, this.height - 46, 28, 4);
    // crown
    ctx.fillRect(this.width/2 - 10, this.height - 58, 20, 14);
    // hat band — faded stripe
    ctx.fillStyle = "#7a7060";
    ctx.fillRect(this.width/2 - 10, this.height - 47, 20, 3);

    // Briefcase — worn leather, dusty tan
    ctx.fillStyle = "#8a7858";
    ctx.fillRect(this.width/2 + 13, this.height - 20, 12, 9);
    ctx.strokeStyle = "#5a5040";
    ctx.lineWidth = 1;
    ctx.strokeRect(this.width/2 + 13, this.height - 20, 12, 9);
    ctx.beginPath();
    ctx.arc(this.width/2 + 19, this.height - 21, 3, Math.PI, 0);
    ctx.stroke();

    ctx.restore();
  }
}

// ============================================================
//  BACKGROUND — aged parchment canvas
// ============================================================
function drawBackground() {
  // Base — yellowed, sun-bleached newsprint
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0,   "#f0e8cc");
  grad.addColorStop(0.4, "#ede0b8");
  grad.addColorStop(0.7, "#e8d8a8");
  grad.addColorStop(1,   "#dece98");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Horizontal print lines — like old newsprint columns faintly showing through
  ctx.strokeStyle = "rgba(100,88,60,0.06)";
  ctx.lineWidth = 1;
  for (let y = 24; y < canvas.height; y += 18) {
    ctx.beginPath();
    ctx.moveTo(20, y); ctx.lineTo(canvas.width - 20, y);
    ctx.stroke();
  }

  // Grain / foxing spots — aged paper
  ctx.fillStyle = "rgba(90,70,30,0.05)";
  for (let i = 0; i < canvas.width; i += 4) {
    for (let j = 0; j < canvas.height; j += 4) {
      if ((i * 7 + j * 13) % 17 < 3) ctx.fillRect(i, j, 2, 2);
    }
  }

  // A few larger foxing blotches
  const spots = [[60,80,18],[520,360,14],[140,420,12],[480,60,10],[300,240,8]];
  spots.forEach(([sx,sy,sr]) => {
    const sg = ctx.createRadialGradient(sx,sy,0,sx,sy,sr);
    sg.addColorStop(0, "rgba(120,90,40,0.08)");
    sg.addColorStop(1, "rgba(120,90,40,0)");
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.arc(sx,sy,sr,0,Math.PI*2); ctx.fill();
  });

  // Edge vignette — dusty brown fade
  const vig = ctx.createRadialGradient(
    canvas.width/2, canvas.height/2, canvas.height * 0.3,
    canvas.width/2, canvas.height/2, canvas.height * 0.95
  );
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(60,45,20,0.35)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Art deco border — grayed ink
  ctx.strokeStyle = "#4a4438";
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);
  ctx.strokeStyle = "#7a7060";
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
  ctx.strokeStyle = "rgba(100,90,70,0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

  // Corner diamonds
  drawCornerOrnament(20, 20);
  drawCornerOrnament(canvas.width - 20, 20);
  drawCornerOrnament(20, canvas.height - 20);
  drawCornerOrnament(canvas.width - 20, canvas.height - 20);
}

function drawCornerOrnament(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#7a7060";
  ctx.beginPath();
  ctx.moveTo(0, -8); ctx.lineTo(8, 0); ctx.lineTo(0, 8); ctx.lineTo(-8, 0);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

// ============================================================
//  HUD — newspaper headline style
// ============================================================
function drawHUD() {
  // Banner at top — yellowed paper strip with dark ink
  ctx.save();
  ctx.fillStyle = "rgba(232,220,190,0.92)";
  ctx.fillRect(20, 20, canvas.width - 40, 36);
  ctx.strokeStyle = "#4a4438";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(20, 20, canvas.width - 40, 36);
  // thin inner rule
  ctx.strokeStyle = "rgba(100,90,70,0.4)";
  ctx.lineWidth = 0.5;
  ctx.strokeRect(23, 23, canvas.width - 46, 30);

  // Masthead text — dark grayed ink
  ctx.font      = "bold 11px 'Georgia', serif";
  ctx.fillStyle = "#2e2820";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("THE DANIELS COUNTY GAZETTE", 34, 38);

  // Score — headline style
  ctx.textAlign = "right";
  ctx.font = "bold 13px 'Georgia', serif";
  // Score — headline style, dark ink
  ctx.textAlign = "right";
  ctx.font = "bold 13px 'Georgia', serif";
  ctx.fillStyle = "#3a3428";
  ctx.fillText(`Commissioner Secures ${score} Win${score !== 1 ? "s" : ""} for the County`, canvas.width - 34, 38);
  ctx.restore();
}

// ── Tooltip ───────────────────────────────────────────────────
function drawTooltip() {
  if (!tooltip || tooltip.timer <= 0) return;
  tooltip.timer -= 1;
  const alpha = Math.min(1, tooltip.timer / 30);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = "italic bold 13px 'Georgia', serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#3a3428";
  ctx.fillText(`✦ ${tooltip.label} ✦`, canvas.width / 2, canvas.height - 38);
  ctx.restore();
}

// ── Win Screen ────────────────────────────────────────────────
function drawWinScreen() {
  ctx.save();
  // Panel — aged paper, not dark overlay
  ctx.fillStyle = "rgba(232,220,185,0.96)";
  ctx.fillRect(80, 160, canvas.width - 160, 180);
  ctx.strokeStyle = "#4a4438";
  ctx.lineWidth = 3;
  ctx.strokeRect(80, 160, canvas.width - 160, 180);
  ctx.strokeStyle = "rgba(100,90,70,0.4)";
  ctx.lineWidth = 1;
  ctx.strokeRect(87, 167, canvas.width - 174, 166);

  ctx.textAlign = "center";
  ctx.fillStyle = "#2e2820";
  ctx.font = "bold 22px 'Georgia', serif";
  ctx.fillText("COMMISSIONER TRIUMPHANT!", canvas.width / 2, 210);
  ctx.font = "14px 'Georgia', serif";
  ctx.fillStyle = "#4a4438";
  ctx.fillText(`A Remarkable ${score} Victories Secured for the People`, canvas.width / 2, 242);
  ctx.font = "italic 11px 'Georgia', serif";
  ctx.fillStyle = "#6a6050";
  ctx.fillText("— Against All Odds & Endless Bureaucracy —", canvas.width / 2, 268);
  ctx.font = "bold 11px 'Georgia', serif";
  ctx.fillStyle = "#3a3428";
  ctx.fillText("Press R to Begin a New Term", canvas.width / 2, 308);
  ctx.restore();
}

// ============================================================
//  LOAD JSON  →  create arrays of class instances
// ============================================================
async function loadJSON(path) {
  const res  = await fetch(path);
  return res.json();
}

// ============================================================
//  MAIN GAME
// ============================================================
let player;

async function init() {
  const obsData  = await loadJSON("obstacles.json");
  const colData  = await loadJSON("collectibles.json");

  obstacles    = obsData.map(d => new Obstacle(d));
  collectibles = colData.map(d => new Collectible(d));
  player       = new Player();
  score        = 0;
  gameWon      = false;
  particles    = [];

  // Restart key
  window.addEventListener("keydown", e => {
    if (e.key === "r" || e.key === "R") init();
  });

  requestAnimationFrame(loop);
}

function loop() {
  if (!gameWon) {
    // Update
    if (wahCooldown > 0) wahCooldown--;
    obstacles.forEach(o => o.update());
    collectibles.forEach(c => c.update());
    player.update(obstacles);

    // Collision: player + collectibles
    for (const col of collectibles) {
      if (!col.active) continue;
      if (circleRectOverlap(col.x, col.y, col.radius,
                            player.x, player.y, player.width, player.height)) {
        col.active = false;
        score += col.points;
        tooltip = { label: col.label, timer: 90 };
        // Spawn particles
        for (let i = 0; i < 18; i++) {
          particles.push(new Particle(col.x, col.y, "#7a7060"));
          particles.push(new Particle(col.x, col.y, "#b0a080"));
        }
        // Update DOM score
        document.getElementById("scoreDisplay").textContent =
          `Commissioner Secures ${score} Win${score !== 1 ? "s" : ""} for the County`;
      }
    }

    // Check win — all collected
    if (collectibles.every(c => !c.active)) gameWon = true;

    // Update particles
    particles = particles.filter(p => p.alpha > 0);
    particles.forEach(p => p.update());
  }

  // Draw
  drawBackground();
  obstacles.forEach(o => o.draw(ctx));
  collectibles.forEach(c => c.draw(ctx));
  particles.forEach(p => p.draw(ctx));
  player.draw(ctx);
  drawHUD();
  drawTooltip();
  if (gameWon) drawWinScreen();

  requestAnimationFrame(loop);
}

init();
