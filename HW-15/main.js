import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ─── SCENE SETUP ────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0010);
scene.fog = new THREE.FogExp2(0x0a0010, 0.04);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 2, 18);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// ─── LIGHTING ────────────────────────────────────────────────────────────────
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xff66ff, 3, 40);
pointLight1.position.set(5, 8, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x66ffee, 3, 40);
pointLight2.position.set(-6, -4, 3);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xffcc44, 2, 30);
pointLight3.position.set(0, -6, -5);
scene.add(pointLight3);

// ─── BLOB CLASS ──────────────────────────────────────────────────────────────
const blobColors = [
  0xff4da6, // hot pink
  0x44eeff, // cyan
  0xffaa22, // amber
  0xaa55ff, // violet
  0x55ff88, // mint
  0xff6644, // coral
];

class Blob {
  constructor(index) {
    this.radius = 0.6 + Math.random() * 0.9;
    this.alive = true;
    this.absorbing = false;

    // Slightly irregular shape using different sphere detail levels
    const geo = new THREE.SphereGeometry(this.radius, 32, 32);
    // Squish/stretch for blob feel
    const sx = 0.85 + Math.random() * 0.3;
    const sy = 0.85 + Math.random() * 0.3;
    const sz = 0.85 + Math.random() * 0.3;

    const mat = new THREE.MeshStandardMaterial({
      color: blobColors[index % blobColors.length],
      roughness: 0.15,
      metalness: 0.05,
      transparent: true,
      opacity: 0.88,
    });

    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.scale.set(sx, sy, sz);

    // Random starting position
    this.mesh.position.set(
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 6
    );

    // Random drift velocity
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.012,
      (Math.random() - 0.5) * 0.012,
      (Math.random() - 0.5) * 0.006
    );

    // Rotation speeds
    this.rotSpeed = new THREE.Vector3(
      (Math.random() - 0.5) * 0.008,
      (Math.random() - 0.5) * 0.012,
      (Math.random() - 0.5) * 0.006
    );

    scene.add(this.mesh);
  }

  update() {
    if (!this.alive) return;

    // Drift
    this.mesh.position.add(this.velocity);

    // Rotate
    this.mesh.rotation.x += this.rotSpeed.x;
    this.mesh.rotation.y += this.rotSpeed.y;
    this.mesh.rotation.z += this.rotSpeed.z;

    // Gentle boundary bounce
    const bounds = { x: 9, y: 5.5, z: 4 };
    if (Math.abs(this.mesh.position.x) > bounds.x) this.velocity.x *= -1;
    if (Math.abs(this.mesh.position.y) > bounds.y) this.velocity.y *= -1;
    if (Math.abs(this.mesh.position.z) > bounds.z) this.velocity.z *= -1;

    // Slow pulse (breathe)
    const t = Date.now() * 0.001;
    const pulse = 1 + Math.sin(t * 0.8 + this.radius) * 0.04;
    this.mesh.scale.setScalar(pulse * this.radius * 0.85);
  }
}

// ─── CREATE BLOBS ────────────────────────────────────────────────────────────
let blobs = [];
const NUM_BLOBS = 6;
for (let i = 0; i < NUM_BLOBS; i++) {
  blobs.push(new Blob(i));
}

// ─── PLOP SOUND ──────────────────────────────────────────────────────────────
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playPlop() {
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.18);

  gainNode.gain.setValueAtTime(0.45, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.25);
}

// ─── PLOP MESSAGE ────────────────────────────────────────────────────────────
const plopMsg = document.getElementById('plop-msg');
let plopTimeout = null;

function showPlop() {
  plopMsg.classList.remove('playing');
  void plopMsg.offsetWidth; // force reflow so animation restarts
  plopMsg.classList.add('playing');
}

// ─── ABSORPTION LOGIC ────────────────────────────────────────────────────────
function checkAbsorptions() {
  for (let i = 0; i < blobs.length; i++) {
    if (!blobs[i].alive || blobs[i].absorbing) continue;
    for (let j = i + 1; j < blobs.length; j++) {
      if (!blobs[j].alive || blobs[j].absorbing) continue;

      const dist = blobs[i].mesh.position.distanceTo(blobs[j].mesh.position);
      const combinedRadius = blobs[i].radius + blobs[j].radius;

      if (dist < combinedRadius * 0.9) {
        // i absorbs j
        absorbBlob(blobs[i], blobs[j]);
      }
    }
  }
}

function absorbBlob(absorber, victim) {
  victim.absorbing = true;
  absorber.absorbing = true;

  playPlop();
  showPlop();

  // Grow absorber, shrink victim over time
  let progress = 0;
  const startRadius = absorber.radius;
  const newRadius = Math.min(startRadius + victim.radius * 0.3, 1.8);

  const interval = setInterval(() => {
    progress += 0.04;

    // Victim shrinks and fades
    const victimScale = Math.max(0, 1 - progress);
    victim.mesh.scale.setScalar(victimScale * victim.radius);
    victim.mesh.material.opacity = Math.max(0, 0.88 - progress * 0.88);

    // Absorber grows slightly
    const growScale = startRadius + (newRadius - startRadius) * Math.min(progress, 1);
    absorber.mesh.scale.setScalar(growScale * 0.85);
    absorber.radius = growScale;

    if (progress >= 1) {
      clearInterval(interval);
      scene.remove(victim.mesh);
      victim.alive = false;
      absorber.absorbing = false;

      // Spawn a new blob after a delay so scene stays populated
      setTimeout(() => {
        if (blobs.filter(b => b.alive).length < 4) {
          const idx = Math.floor(Math.random() * 6);
          const newBlob = new Blob(idx);
          blobs.push(newBlob);
        }
      }, 3000);
    }
  }, 30);
}

// ─── LOAD GLB MODEL ──────────────────────────────────────────────────────────
// We load the GLTFLoader from Three.js addons
// Since we're using the module build, we import it inline here
let flowerModel = null;

// Dynamically import GLTFLoader from Three.js addons path
async function loadModel() {
  try {
    const loader = new GLTFLoader();
    loader.load(
      './blob.glb',
      (gltf) => {
        flowerModel = gltf.scene;
        flowerModel.scale.setScalar(1.2);
        flowerModel.position.set(0, 0, 6);
        scene.add(flowerModel);
        console.log('Model loaded!');
      },
      undefined,
      (err) => {
        console.warn('Model load failed, using fallback shape:', err);
        // Fallback: a torus knot as the "model"
        const geo = new THREE.TorusKnotGeometry(1.2, 0.38, 128, 16);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.1,
          metalness: 0.6,
          emissive: 0x331122,
        });
        flowerModel = new THREE.Mesh(geo, mat);
        flowerModel.position.set(0, 0, 6);
        scene.add(flowerModel);
      }
    );
  } catch (e) {
    console.warn('GLTFLoader not found, using torus knot fallback');
    const geo = new THREE.TorusKnotGeometry(1.2, 0.38, 128, 16);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.6,
      emissive: 0x331122,
    });
    flowerModel = new THREE.Mesh(geo, mat);
    flowerModel.position.set(0, 0, 6);
    scene.add(flowerModel);
  }
}

loadModel();

// ─── STARS BACKGROUND ────────────────────────────────────────────────────────
const starGeo = new THREE.BufferGeometry();
const starCount = 800;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  starPositions[i] = (Math.random() - 0.5) * 120;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.6 });
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// ─── SLOW CAMERA ORBIT ───────────────────────────────────────────────────────
let cameraAngle = 0;

// ─── RESIZE HANDLER ──────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── ANIMATION LOOP ──────────────────────────────────────────────────────────
let frameCount = 0;

function animate() {
  requestAnimationFrame(animate);
  frameCount++;

  // Update blobs
  blobs.forEach(b => b.update());

  // Check for absorptions every 20 frames
  if (frameCount % 20 === 0) {
    checkAbsorptions();
  }

  // Rotate flower/model
  if (flowerModel) {
    flowerModel.rotation.y += 0.004;
    flowerModel.rotation.x += 0.001;
  }

  // Slow camera orbit
  cameraAngle += 0.0008;
  camera.position.x = Math.sin(cameraAngle) * 18;
  camera.position.z = Math.cos(cameraAngle) * 18;
  camera.position.y = 2 + Math.sin(cameraAngle * 0.4) * 3;
  camera.lookAt(0, 0, 0);

  // Slowly shift point light colors
  const t = Date.now() * 0.0005;
  pointLight1.color.setHSL((t * 0.1) % 1, 0.9, 0.6);
  pointLight2.color.setHSL((t * 0.1 + 0.33) % 1, 0.9, 0.6);

  renderer.render(scene, camera);
}

animate();
