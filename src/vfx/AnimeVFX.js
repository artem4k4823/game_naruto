// Anime VFX: Cel-Shading, Inverted Hull Outlines, Particles, and Speed Lines
import * as THREE from 'three';

// Create 5-tone studio anime gradient ramp texture for MeshToonMaterial
export function createToonRampTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  
  // 5-band studio anime cel gradient with crisp, soft transitions
  // Band 1: Deep shadow (0 to 0.22)
  // Band 2: Ambient shadow (0.22 to 0.48)
  // Band 3: Midtone (0.48 to 0.72)
  // Band 4: Main illuminated body (0.72 to 0.91)
  // Band 5: Specular highlight (0.91 to 1.0)
  const grad = ctx.createLinearGradient(0, 0, 128, 0);
  grad.addColorStop(0.00, '#3f4b5e');
  grad.addColorStop(0.20, '#3f4b5e');
  grad.addColorStop(0.24, '#5f738e');
  grad.addColorStop(0.46, '#5f738e');
  grad.addColorStop(0.50, '#94a7c0');
  grad.addColorStop(0.70, '#94a7c0');
  grad.addColorStop(0.74, '#dce5f0');
  grad.addColorStop(0.90, '#dce5f0');
  grad.addColorStop(0.93, '#ffffff');
  grad.addColorStop(1.00, '#ffffff');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

const sharedToonRamp = createToonRampTexture();

export function createToonMaterial(color, options = {}) {
  return new THREE.MeshToonMaterial({
    color: new THREE.Color(color),
    gradientMap: sharedToonRamp,
    roughness: options.roughness !== undefined ? options.roughness : 0.75,
    ...options
  });
}

// Stylized Anime Water Canvas Texture & Animated Material
export function createAnimeWaterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Base aquatic gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 128, 128);
  bgGrad.addColorStop(0, '#0277bd');
  bgGrad.addColorStop(0.5, '#0288d1');
  bgGrad.addColorStop(1, '#039be5');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 128, 128);

  // Stylized anime caustic ripple rings
  ctx.strokeStyle = 'rgba(224, 247, 250, 0.45)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  const drawRipple = (cx, cy, rx, ry, rot) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  drawRipple(32, 32, 22, 14, 0.3);
  drawRipple(96, 40, 20, 12, -0.4);
  drawRipple(48, 96, 26, 16, 0.2);
  drawRipple(108, 104, 18, 10, -0.2);

  // Fine sparkle glints
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  [ [20, 25], [85, 35], [52, 85], [105, 95], [64, 45] ].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export const sharedWaterTexture = createAnimeWaterTexture();

export function createAnimeWaterMaterial(options = {}) {
  return new THREE.MeshToonMaterial({
    color: 0x29b6f6,
    map: sharedWaterTexture,
    gradientMap: sharedToonRamp,
    transparent: true,
    opacity: 0.85,
    ...options
  });
}

// Inverted Hull Toon Outline
export function createOutlineMesh(sourceMesh, thickness = 0.04, color = 0x111111) {
  const outlineMat = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.BackSide
  });

  const outlineMesh = new THREE.Mesh(sourceMesh.geometry, outlineMat);
  outlineMesh.scale.set(1 + thickness, 1 + thickness, 1 + thickness);
  return outlineMesh;
}

// Particle Class
class Particle {
  constructor(mesh, velocity, life, maxLife, updateFn) {
    this.mesh = mesh;
    this.velocity = velocity;
    this.life = life;
    this.maxLife = maxLife;
    this.updateFn = updateFn;
  }
}

// Comprehensive Anime Particle & Visual Effects Engine
export class AnimeVFX {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.sakuraPetals = [];
    this.fxCanvas = document.getElementById('fx-canvas');
    this.fxCtx = this.fxCanvas ? this.fxCanvas.getContext('2d') : null;
    this.speedLinesIntensity = 0;
    this.screenShakeTime = 0;
    this.screenShakeIntensity = 0;

    this.resizeFxCanvas();
    window.addEventListener('resize', () => this.resizeFxCanvas());

    this.initSakuraPetals();
  }

  initSakuraPetals(count = 130) {
    const petalGeo = new THREE.PlaneGeometry(0.22, 0.32);
    const petalMat1 = new THREE.MeshToonMaterial({
      color: 0xf8bbd0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88
    });
    const petalMat2 = new THREE.MeshToonMaterial({
      color: 0xf48fb1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88
    });

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(petalGeo, (i % 2 === 0) ? petalMat1 : petalMat2);
      mesh.position.set(
        (Math.random() - 0.5) * 140,
        Math.random() * 20 + 0.5,
        (Math.random() - 0.5) * 140 + 20
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      this.scene.add(mesh);

      this.sakuraPetals.push({
        mesh: mesh,
        fallSpeed: 1.1 + Math.random() * 0.9,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 1.5 + Math.random() * 1.4,
        rotSpeedX: (Math.random() - 0.5) * 2.2,
        rotSpeedY: (Math.random() - 0.5) * 3.0,
        driftX: 0.6 + Math.random() * 0.8,
        driftZ: (Math.random() - 0.5) * 0.6
      });
    }
  }

  updateSakuraPetals(dt, targetPos) {
    const center = targetPos || new THREE.Vector3(0, 0, 30);
    const radius = 65;

    for (let i = 0; i < this.sakuraPetals.length; i++) {
      const p = this.sakuraPetals[i];
      p.swayPhase += p.swaySpeed * dt;
      p.mesh.position.y -= p.fallSpeed * dt;
      p.mesh.position.x += (Math.sin(p.swayPhase) * 0.9 + p.driftX) * dt;
      p.mesh.position.z += (Math.cos(p.swayPhase * 0.8) * 0.5 + p.driftZ) * dt;

      p.mesh.rotation.x += p.rotSpeedX * dt;
      p.mesh.rotation.y += p.rotSpeedY * dt;

      // Recycle petals that touch ground or drift too far from the action
      const distFromCenter = p.mesh.position.distanceTo(center);
      if (p.mesh.position.y <= 0.08 || distFromCenter > radius) {
        p.mesh.position.set(
          center.x + (Math.random() - 0.5) * (radius * 1.5) - 15,
          14 + Math.random() * 10,
          center.z + (Math.random() - 0.5) * (radius * 1.5)
        );
        p.mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      }
    }
  }

  // Waterfall Mist Particle Fountain
  spawnWaterfallMist(pos, count = 3) {
    const mistMat = new THREE.MeshBasicMaterial({
      color: 0xe0f7fa,
      transparent: true,
      opacity: 0.45
    });
    const geo = new THREE.DodecahedronGeometry(0.5, 1);

    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(geo, mistMat);
      m.position.copy(pos).add(new THREE.Vector3(
        (Math.random() - 0.5) * 8.0,
        Math.random() * 1.5 + 0.2,
        (Math.random() - 0.5) * 4.0
      ));
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        Math.random() * 3.0 + 1.5,
        (Math.random() - 0.5) * 1.5
      );
      this.scene.add(m);
      this.particles.push(new Particle(m, vel, 0.9, 0.9, (p, dt) => {
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.mesh.scale.addScalar(dt * 0.8);
        p.mesh.material.opacity = (p.life / p.maxLife) * 0.45;
      }));
    }
  }

  // Forest Fireflies / Chakra Motes
  spawnForestFireflies(pos, count = 4) {
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xc6ff00,
      transparent: true,
      opacity: 0.75
    });
    const geo = new THREE.SphereGeometry(0.12, 6, 6);

    for (let i = 0; i < count; i++) {
      const f = new THREE.Mesh(geo, glowMat);
      f.position.copy(pos).add(new THREE.Vector3(
        (Math.random() - 0.5) * 12.0,
        Math.random() * 3.5 + 0.5,
        (Math.random() - 0.5) * 12.0
      ));
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 1.2
      );
      this.scene.add(f);
      this.particles.push(new Particle(f, vel, 2.2, 2.2, (p, dt) => {
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.velocity.x += (Math.random() - 0.5) * 1.5 * dt;
        p.velocity.z += (Math.random() - 0.5) * 1.5 * dt;
        p.mesh.material.opacity = 0.4 + Math.sin(p.life * 6) * 0.35;
      }));
    }
  }

  resizeFxCanvas() {
    if (!this.fxCanvas) return;
    this.fxCanvas.width = window.innerWidth;
    this.fxCanvas.height = window.innerHeight;
  }

  // Anime Cartoon Smoke Puff (POOF! on Kage Bunshin or Enemy Defeat)
  spawnSmokePoof(pos, count = 22, scale = 1.0) {
    const geo = new THREE.DodecahedronGeometry(0.5 * scale, 1);
    const mat = new THREE.MeshToonMaterial({
      color: 0xf3f4f6,
      gradientMap: sharedToonRamp,
      transparent: true,
      opacity: 0.95
    });

    for (let i = 0; i < count; i++) {
      const puff = new THREE.Mesh(geo, mat.clone());
      puff.position.copy(pos).add(new THREE.Vector3(
        (Math.random() - 0.5) * 1.2 * scale,
        (Math.random() * 1.0 + 0.2) * scale,
        (Math.random() - 0.5) * 1.2 * scale
      ));

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 5.0 * scale,
        (Math.random() * 3.5 + 2.0) * scale,
        (Math.random() - 0.5) * 5.0 * scale
      );

      const life = 0.5 + Math.random() * 0.4;
      const initialScale = 0.6 + Math.random() * 0.8;
      puff.scale.setScalar(initialScale);

      this.scene.add(puff);

      this.particles.push(new Particle(puff, vel, life, life, (p, dt) => {
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.velocity.multiplyScalar(0.92); // air drag
        p.mesh.rotation.x += 1.5 * dt;
        p.mesh.rotation.y += 2.0 * dt;

        const progress = p.life / p.maxLife;
        // Expand puff then shrink & fade
        const curScale = initialScale * (1.0 + (1.0 - progress) * 1.2);
        p.mesh.scale.setScalar(curScale);
        p.mesh.material.opacity = Math.min(1.0, progress * 1.8);
      }));
    }
  }

  // Anime Comic Hit Spark (BAM! starburst on hit)
  spawnHitSparks(pos, isHeavy = false) {
    const count = isHeavy ? 18 : 10;
    const colors = isHeavy ? [0xff1744, 0xffea00, 0xff9100] : [0xffea00, 0xffffff, 0x00e5ff];

    for (let i = 0; i < count; i++) {
      const size = (0.15 + Math.random() * 0.25) * (isHeavy ? 1.5 : 1.0);
      const geo = new THREE.ConeGeometry(size * 0.6, size * 2.2, 4);
      geo.rotateX(Math.PI / 2);

      const color = colors[Math.floor(Math.random() * colors.length)];
      const mat = new THREE.MeshBasicMaterial({ color: color });
      const spark = new THREE.Mesh(geo, mat);

      spark.position.copy(pos);
      const dir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();

      spark.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);

      const speed = (6 + Math.random() * 10) * (isHeavy ? 1.4 : 1.0);
      const vel = dir.clone().multiplyScalar(speed);
      const life = 0.18 + Math.random() * 0.12;

      this.scene.add(spark);

      this.particles.push(new Particle(spark, vel, life, life, (p, dt) => {
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.velocity.multiplyScalar(0.88);
        const progress = p.life / p.maxLife;
        p.mesh.scale.set(progress, progress, progress * 1.5);
      }));
    }

    // Comic impact ring
    const ringGeo = new THREE.RingGeometry(0.2, 0.4, 16);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isHeavy ? 0xff1744 : 0xffea00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    ring.lookAt(pos.clone().add(new THREE.Vector3(0, 1, 0)));
    this.scene.add(ring);

    this.particles.push(new Particle(ring, new THREE.Vector3(), 0.22, 0.22, (p, dt) => {
      const prog = 1.0 - (p.life / p.maxLife);
      const s = 1.0 + prog * 4.0;
      p.mesh.scale.set(s, s, s);
      p.mesh.material.opacity = (p.life / p.maxLife) * 0.9;
    }));
  }

  // Rasengan Expanding Blast Ring & Spiral shockwave
  spawnRasenganExplosion(pos) {
    this.triggerScreenShake(0.4, 0.35);

    // Expanding blue chakra sphere
    const sphereGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.9
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.copy(pos);
    this.scene.add(sphere);

    this.particles.push(new Particle(sphere, new THREE.Vector3(), 0.4, 0.4, (p, dt) => {
      const prog = 1.0 - (p.life / p.maxLife);
      const s = 1.0 + prog * 6.5;
      p.mesh.scale.setScalar(s);
      p.mesh.rotation.y += 12 * dt;
      p.mesh.material.opacity = (p.life / p.maxLife) * 0.9;
    }));

    // Spiral chakra shards
    for (let i = 0; i < 30; i++) {
      const geo = new THREE.TetrahedronGeometry(0.35);
      const mat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x00f0ff : 0xffffff
      });
      const shard = new THREE.Mesh(geo, mat);
      shard.position.copy(pos);

      const angle = (i / 30) * Math.PI * 2;
      const speed = 8 + Math.random() * 6;
      const vel = new THREE.Vector3(
        Math.cos(angle) * speed,
        Math.random() * 5 + 2,
        Math.sin(angle) * speed
      );

      this.scene.add(shard);
      this.particles.push(new Particle(shard, vel, 0.5, 0.5, (p, dt) => {
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.velocity.y -= 9.8 * dt; // gravity
        p.mesh.rotation.x += 8 * dt;
        p.mesh.rotation.z += 8 * dt;
        p.mesh.scale.setScalar(p.life / p.maxLife);
      }));
    }
  }

  // Celebratory Level Up Divine Chakra Pillar & Sparkles
  spawnLevelUpBurst(pos) {
    this.triggerScreenShake(0.35, 0.25);

    // 1. Ascending Golden Light Pillar
    const pillarGeo = new THREE.CylinderGeometry(1.4, 1.8, 14, 16);
    const pillarMat = new THREE.MeshBasicMaterial({
      color: 0xffea00,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.copy(pos).setY(pos.y + 7);
    this.scene.add(pillar);

    this.particles.push(new Particle(pillar, new THREE.Vector3(), 0.7, 0.7, (p, dt) => {
      p.mesh.scale.x += 1.2 * dt;
      p.mesh.scale.z += 1.2 * dt;
      p.mesh.rotation.y += 6 * dt;
      p.mesh.material.opacity = (p.life / p.maxLife) * 0.75;
    }));

    // 2. Expanding Gold Shockwave Ring
    const ringGeo = new THREE.TorusGeometry(1.8, 0.15, 8, 28);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.9 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.copy(pos).setY(pos.y + 0.3);
    this.scene.add(ring);

    this.particles.push(new Particle(ring, new THREE.Vector3(), 0.5, 0.5, (p, dt) => {
      const s = 1.0 + (1.0 - p.life / p.maxLife) * 5.0;
      p.mesh.scale.set(s, s, s);
      p.mesh.material.opacity = (p.life / p.maxLife) * 0.9;
    }));

    // 3. Spiraling celebratory stars & golden embers
    for (let i = 0; i < 28; i++) {
      const starGeo = new THREE.TetrahedronGeometry(0.28);
      const starMat = new THREE.MeshBasicMaterial({
        color: (i % 2 === 0) ? 0xffd700 : 0xffffff
      });
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.copy(pos).add(new THREE.Vector3(
        (Math.random() - 0.5) * 2.2,
        Math.random() * 1.5,
        (Math.random() - 0.5) * 2.2
      ));

      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 3.5;
      const vel = new THREE.Vector3(
        Math.cos(angle) * speed,
        Math.random() * 6.5 + 4.5,
        Math.sin(angle) * speed
      );

      this.scene.add(star);
      this.particles.push(new Particle(star, vel, 0.85, 0.85, (p, dt) => {
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.velocity.y -= 4 * dt;
        p.mesh.rotation.x += 10 * dt;
        p.mesh.rotation.y += 8 * dt;
        p.mesh.scale.setScalar(p.life / p.maxLife);
      }));
    }
  }

  // Giant Wind Style: Rasenshuriken Vortex Detonation
  spawnRasenshurikenVortex(pos) {
    this.triggerScreenShake(0.65, 0.45);

    // 1. Massive swirling wind vortex core sphere
    const coreGeo = new THREE.SphereGeometry(3.6, 20, 20);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xe0f7fa,
      transparent: true,
      opacity: 0.85,
      wireframe: true
    });
    const vortexCore = new THREE.Mesh(coreGeo, coreMat);
    vortexCore.position.copy(pos);
    this.scene.add(vortexCore);

    this.particles.push(new Particle(vortexCore, new THREE.Vector3(), 0.75, 0.75, (p, dt) => {
      const prog = 1.0 - (p.life / p.maxLife);
      const scale = 1.0 + prog * 4.2;
      p.mesh.scale.setScalar(scale);
      p.mesh.rotation.y += 24 * dt;
      p.mesh.rotation.x += 16 * dt;
      p.mesh.material.opacity = (p.life / p.maxLife) * 0.85;
    }));

    // 2. Dual Horizontal & Vertical Cutting Wind Rings
    [0, Math.PI / 2].forEach(tilt => {
      const ringGeo = new THREE.TorusGeometry(3.8, 0.22, 8, 36);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x80deea,
        transparent: true,
        opacity: 0.95
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.rotation.x = tilt;
      this.scene.add(ring);

      this.particles.push(new Particle(ring, new THREE.Vector3(), 0.65, 0.65, (p, dt) => {
        const prog = 1.0 - (p.life / p.maxLife);
        const s = 1.0 + prog * 5.0;
        p.mesh.scale.setScalar(s);
        p.mesh.rotation.z += 28 * dt;
        p.mesh.material.opacity = (p.life / p.maxLife) * 0.95;
      }));
    });

    // 3. Hundreds of razor sharp cutting wind shards flying outward
    for (let i = 0; i < 48; i++) {
      const shardGeo = new THREE.BoxGeometry(0.7, 0.04, 0.22);
      const shardMat = new THREE.MeshBasicMaterial({
        color: (i % 3 === 0) ? 0xffffff : ((i % 3 === 1) ? 0x80deea : 0x00e5ff),
        transparent: true,
        opacity: 0.9
      });
      const shard = new THREE.Mesh(shardGeo, shardMat);
      shard.position.copy(pos);

      const angle = (i / 48) * Math.PI * 2;
      const elev = (Math.random() - 0.5) * 1.4;
      const speed = 14 + Math.random() * 12;
      const vel = new THREE.Vector3(
        Math.cos(angle) * speed,
        elev * speed,
        Math.sin(angle) * speed
      );

      this.scene.add(shard);
      this.particles.push(new Particle(shard, vel, 0.6, 0.6, (p, dt) => {
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.mesh.rotation.y += 25 * dt;
        p.mesh.rotation.z += 18 * dt;
        p.mesh.scale.setScalar(p.life / p.maxLife);
      }));
    }
  }

  // Tailed Beast Bomb (Bijuu Dama) Colossal Detonation
  spawnBijuuDamaExplosion(pos) {
    this.triggerScreenShake(0.85, 0.65);

    // 1. Dark Purple / Black Core Annihilation Sphere
    const coreGeo = new THREE.SphereGeometry(2.5, 20, 20);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x120024,
      transparent: true,
      opacity: 0.95
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.copy(pos);
    this.scene.add(core);

    this.particles.push(new Particle(core, new THREE.Vector3(), 0.75, 0.75, (p, dt) => {
      const prog = 1.0 - (p.life / p.maxLife);
      const s = 1.0 + prog * 9.0;
      p.mesh.scale.setScalar(s);
      p.mesh.material.opacity = (p.life / p.maxLife) * 0.95;
    }));

    // 2. Crimson Kyuubi Chakra Wireframe Corona
    const coronaGeo = new THREE.SphereGeometry(2.8, 16, 16);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xff1744,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    corona.position.copy(pos);
    this.scene.add(corona);

    this.particles.push(new Particle(corona, new THREE.Vector3(), 0.8, 0.8, (p, dt) => {
      const prog = 1.0 - (p.life / p.maxLife);
      const s = 1.0 + prog * 10.5;
      p.mesh.scale.setScalar(s);
      p.mesh.rotation.y += 15 * dt;
      p.mesh.rotation.x += 10 * dt;
      p.mesh.material.opacity = (p.life / p.maxLife) * 0.9;
    }));

    // 3. Expanding Horizontal Shockwave Rings
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.RingGeometry(0.8, 2.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: (r === 0) ? 0xff3d00 : 0xaa00ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.copy(pos).setY(pos.y + 0.2 + r * 0.4);
      this.scene.add(ring);

      this.particles.push(new Particle(ring, new THREE.Vector3(), 0.7 + r * 0.15, 0.7 + r * 0.15, (p, dt) => {
        const prog = 1.0 - (p.life / p.maxLife);
        const s = 1.0 + prog * 16.0;
        p.mesh.scale.set(s, s, s);
        p.mesh.material.opacity = (p.life / p.maxLife) * 0.95;
      }));
    }

    // 4. Dense Radial Chakra Shards
    for (let i = 0; i < 50; i++) {
      const shardGeo = new THREE.BoxGeometry(0.8, 0.15, 0.15);
      const shardMat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.4 ? 0xff1744 : 0x7c4dff,
        transparent: true,
        opacity: 0.9
      });
      const shard = new THREE.Mesh(shardGeo, shardMat);
      shard.position.copy(pos);

      const angle = (i / 50) * Math.PI * 2;
      const elev = (Math.random() - 0.2) * 1.5;
      const speed = 18 + Math.random() * 16;
      const vel = new THREE.Vector3(
        Math.cos(angle) * speed,
        elev * speed,
        Math.sin(angle) * speed
      );

      this.scene.add(shard);
      this.particles.push(new Particle(shard, vel, 0.65, 0.65, (p, dt) => {
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.velocity.y -= 12 * dt;
        p.mesh.rotation.y += 18 * dt;
        p.mesh.rotation.z += 12 * dt;
        p.mesh.scale.setScalar(p.life / p.maxLife);
      }));
    }

    // 5. Giant perimeter smoke dust wall
    this.spawnSmokePoof(pos, 35, 3.2);
  }

  // Kyuubi Conical Roar Wave (Sonic Chakra Shockwave)
  spawnKuramaRoarWave(pos, forward) {
    this.triggerScreenShake(0.65, 0.5);

    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        const ringGeo = new THREE.RingGeometry(1.2, 2.8 + i * 1.2, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xff3d00,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        const ringPos = pos.clone().add(forward.clone().multiplyScalar(2.5 + i * 3.5)).setY(pos.y + 4.8);
        ring.position.copy(ringPos);
        ring.lookAt(ringPos.clone().add(forward));
        this.scene.add(ring);

        this.particles.push(new Particle(ring, forward.clone().multiplyScalar(26), 0.48, 0.48, (p, dt) => {
          p.mesh.position.addScaledVector(p.velocity, dt);
          const prog = 1.0 - (p.life / p.maxLife);
          const s = 1.0 + prog * 4.5;
          p.mesh.scale.set(s, s, s);
          p.mesh.material.opacity = (p.life / p.maxLife) * 0.85;
        }));
      }, i * 70);
    }
  }

  // 9-Tails 360-degree Whirlwind Shockwave
  spawnKuramaTailSweepShockwave(pos) {
    this.triggerScreenShake(0.55, 0.45);

    const discGeo = new THREE.RingGeometry(3.0, 14.0, 36);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0xff1744,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.copy(pos).setY(pos.y + 1.2);
    this.scene.add(disc);

    this.particles.push(new Particle(disc, new THREE.Vector3(), 0.65, 0.65, (p, dt) => {
      const prog = 1.0 - (p.life / p.maxLife);
      const s = 1.0 + prog * 3.5;
      p.mesh.scale.set(s, s, s);
      p.mesh.rotation.z += 16 * dt;
      p.mesh.material.opacity = (p.life / p.maxLife) * 0.85;
    }));

    this.spawnSmokePoof(pos, 35, 3.5);
  }

  // Heavy Paw Footstep Shockwave
  spawnKuramaFootstepShockwave(pos) {
    this.triggerScreenShake(0.18, 0.15);
    this.spawnFootstepDust(pos, 3.6);
  }

  // Anime Cartoon Footstep Smoke Puff (Multi-puff pufflet with rotation and soft dissipation)
  spawnFootstepDust(pos, scale = 1.0) {
    const puffCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < puffCount; i++) {
      const radius = (0.16 + Math.random() * 0.12) * scale;
      const geo = new THREE.DodecahedronGeometry(radius, 1);
      const mat = new THREE.MeshToonMaterial({
        color: Math.random() > 0.3 ? 0xf8fafc : 0xe2e8f0,
        transparent: true,
        opacity: 0.85
      });
      const dust = new THREE.Mesh(geo, mat);
      const offsetX = (Math.random() - 0.5) * 0.3;
      const offsetZ = (Math.random() - 0.5) * 0.3;
      dust.position.copy(pos).add(new THREE.Vector3(offsetX, 0.08 + Math.random() * 0.08, offsetZ));
      this.scene.add(dust);

      const speed = 0.8 + Math.random() * 0.9;
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 1.4,
        Math.random() * 0.7 + 0.3,
        (Math.random() - 0.5) * 1.4
      );

      const maxLife = 0.36 + Math.random() * 0.14;
      const rotSpeed = (Math.random() - 0.5) * 4.0;
      this.particles.push(new Particle(dust, vel, maxLife, maxLife, (p, dt) => {
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.velocity.multiplyScalar(0.86);
        p.mesh.rotation.x += rotSpeed * dt;
        p.mesh.rotation.y += rotSpeed * 0.8 * dt;
        const prog = p.life / p.maxLife;
        // Expand then fade smoothly
        const curScale = (1.0 + (1.0 - prog) * 1.5) * scale;
        p.mesh.scale.setScalar(curScale);
        p.mesh.material.opacity = Math.pow(prog, 1.2) * 0.85;
      }));
    }
  }

  // Radial Ground Landing Shockwave Dust Puffs
  spawnLandingDust(pos, count = 7) {
    for (let i = 0; i < count; i++) {
      const radius = 0.22 + Math.random() * 0.1;
      const geo = new THREE.DodecahedronGeometry(radius, 1);
      const mat = new THREE.MeshToonMaterial({
        color: 0xf1f5f9,
        transparent: true,
        opacity: 0.82
      });
      const dust = new THREE.Mesh(geo, mat);
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const initDist = 0.25;
      dust.position.copy(pos).add(new THREE.Vector3(Math.cos(angle) * initDist, 0.1, Math.sin(angle) * initDist));
      this.scene.add(dust);

      const speed = 2.4 + Math.random() * 1.8;
      const vel = new THREE.Vector3(
        Math.cos(angle) * speed,
        Math.random() * 0.8 + 0.3,
        Math.sin(angle) * speed
      );

      const maxLife = 0.42 + Math.random() * 0.12;
      this.particles.push(new Particle(dust, vel, maxLife, maxLife, (p, dt) => {
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.velocity.multiplyScalar(0.88);
        p.mesh.rotation.y += 3.5 * dt;
        const prog = p.life / p.maxLife;
        p.mesh.scale.setScalar(1.0 + (1.0 - prog) * 2.0);
        p.mesh.material.opacity = prog * 0.82;
      }));
    }
  }

  // Chakra Wall-Running Footstep Smoke & Energy Burst
  spawnWallPuff(pos, wallNormal) {
    // 1. Smoke puffs popping outward from the vertical wall
    const puffCount = 2;
    for (let i = 0; i < puffCount; i++) {
      const smokeGeo = new THREE.DodecahedronGeometry(0.24 + Math.random() * 0.1, 1);
      const smokeMat = new THREE.MeshToonMaterial({
        color: Math.random() > 0.3 ? 0xffffff : 0xecfeff,
        transparent: true,
        opacity: 0.88
      });
      const puff = new THREE.Mesh(smokeGeo, smokeMat);
      puff.position.copy(pos).add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
      ));
      this.scene.add(puff);

      // Eject outwards from wall and downward along wall surface
      const outward = wallNormal.clone().multiplyScalar(2.2 + Math.random() * 1.8);
      const lateral = new THREE.Vector3(
        (Math.random() - 0.5) * 1.2,
        -Math.random() * 2.5 - 1.2, // Shoot down along wall behind feet!
        (Math.random() - 0.5) * 1.2
      );
      const vel = outward.add(lateral);

      const maxLife = 0.38;
      this.particles.push(new Particle(puff, vel, maxLife, maxLife, (p, dt) => {
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.velocity.multiplyScalar(0.87);
        p.mesh.rotation.x += 4 * dt;
        p.mesh.rotation.z += 4 * dt;
        const prog = p.life / p.maxLife;
        p.mesh.scale.setScalar(1.0 + (1.0 - prog) * 1.4);
        p.mesh.material.opacity = prog * 0.88;
      }));
    }

    // 2. Glowing Cyan Chakra Sparks sticking to the wall
    for (let i = 0; i < 4; i++) {
      const sparkGeo = new THREE.TetrahedronGeometry(0.12);
      const sparkMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const spark = new THREE.Mesh(sparkGeo, sparkMat);
      spark.position.copy(pos);
      this.scene.add(spark);

      const sVel = wallNormal.clone().multiplyScalar(3.5).add(new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      ));

      this.particles.push(new Particle(spark, sVel, 0.28, 0.28, (p, dt) => {
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.mesh.scale.setScalar(p.life / p.maxLife);
      }));
    }
  }

  // Double Jump Mid-Air Chakra Shockwave Disc & Ninja Smoke Burst
  spawnDoubleJumpEffect(pos) {
    // 1. Ninja Smoke poof under feet
    this.spawnSmokePoof(pos, 12, 0.75);

    // 2. Glowing Cyan Chakra Disc Shockwave (Expanding flat ring on XZ plane)
    const ringGeo = new THREE.RingGeometry(0.12, 0.65, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    this.scene.add(ring);

    this.particles.push(new Particle(ring, new THREE.Vector3(0, -0.4, 0), 0.36, 0.36, (p, dt) => {
      p.mesh.position.addScaledVector(p.velocity, dt);
      const prog = 1.0 - (p.life / p.maxLife);
      const s = 1.0 + prog * 4.2;
      p.mesh.scale.set(s, s, s);
      p.mesh.material.opacity = (p.life / p.maxLife) * 0.95;
    }));

    // 3. Cyan chakra sparks bursting outwards
    for (let i = 0; i < 10; i++) {
      const sparkGeo = new THREE.TetrahedronGeometry(0.14);
      const sparkMat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.4 ? 0x00f0ff : 0xffffff,
        blending: THREE.AdditiveBlending
      });
      const spark = new THREE.Mesh(sparkGeo, sparkMat);
      spark.position.copy(pos);
      this.scene.add(spark);

      const angle = (i / 10) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = 4.5 + Math.random() * 3.5;
      const vel = new THREE.Vector3(
        Math.cos(angle) * speed,
        -1.5 - Math.random() * 2.0,
        Math.sin(angle) * speed
      );

      this.particles.push(new Particle(spark, vel, 0.32, 0.32, (p, dt) => {
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.velocity.multiplyScalar(0.92);
        p.mesh.scale.setScalar(p.life / p.maxLife);
      }));
    }
  }

  // Chakra Flame Aura (Rising wisps)
  spawnChakraAuraWisp(pos, isKyuubi = false) {
    const geo = new THREE.TetrahedronGeometry(0.15);
    const color = isKyuubi ? (Math.random() > 0.4 ? 0xff1744 : 0xff9100) : (Math.random() > 0.3 ? 0x00f0ff : 0xffffff);
    const mat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.85
    });

    const wisp = new THREE.Mesh(geo, mat);
    const radius = 0.5 + Math.random() * 0.4;
    const angle = Math.random() * Math.PI * 2;
    wisp.position.set(
      pos.x + Math.cos(angle) * radius,
      pos.y + Math.random() * 0.8,
      pos.z + Math.sin(angle) * radius
    );

    this.scene.add(wisp);
    const vel = new THREE.Vector3(
      -Math.sin(angle) * 1.5,
      isKyuubi ? 4.5 + Math.random() * 2.0 : 3.0 + Math.random() * 1.5,
      Math.cos(angle) * 1.5
    );

    this.particles.push(new Particle(wisp, vel, 0.4, 0.4, (p, dt) => {
      p.mesh.position.addScaledVector(p.velocity, dt);
      p.mesh.rotation.y += 10 * dt;
      p.mesh.scale.setScalar(p.life / p.maxLife);
      p.mesh.material.opacity = (p.life / p.maxLife) * 0.85;
    }));
  }

  triggerScreenShake(duration = 0.3, intensity = 0.2) {
    this.screenShakeTime = duration;
    this.screenShakeIntensity = intensity;
  }

  // Golden Sparkles & Aura on Coin (Ryo) Pickup
  spawnCoinSparkles(pos) {
    const count = 14;
    const colors = [0xffd700, 0xffea00, 0xfff9c4, 0xffa000];

    for (let i = 0; i < count; i++) {
      const size = 0.12 + Math.random() * 0.14;
      const geo = new THREE.TetrahedronGeometry(size);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const mat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending
      });
      const spark = new THREE.Mesh(geo, mat);
      spark.position.copy(pos).add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4
      ));

      const angle = (i / count) * Math.PI * 2;
      const speed = 2.0 + Math.random() * 2.5;
      const vel = new THREE.Vector3(
        Math.cos(angle) * speed,
        Math.random() * 3.5 + 2.0, // floats gracefully upward
        Math.sin(angle) * speed
      );

      this.scene.add(spark);
      const maxLife = 0.45 + Math.random() * 0.2;
      this.particles.push(new Particle(spark, vel, maxLife, maxLife, (p, dt) => {
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.velocity.multiplyScalar(0.92);
        p.mesh.rotation.x += 6 * dt;
        p.mesh.rotation.y += 8 * dt;
        const prog = p.life / p.maxLife;
        p.mesh.scale.setScalar(prog);
        p.mesh.material.opacity = prog * 0.95;
      }));
    }

    // Expanding golden ring
    const ringGeo = new THREE.RingGeometry(0.1, 0.4, 20);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    this.scene.add(ring);
    this.particles.push(new Particle(ring, new THREE.Vector3(0, 1.2, 0), 0.35, 0.35, (p, dt) => {
      p.mesh.position.addScaledVector(p.velocity, dt);
      const prog = 1.0 - (p.life / p.maxLife);
      const s = 1.0 + prog * 4.0;
      p.mesh.scale.set(s, s, s);
      p.mesh.material.opacity = (p.life / p.maxLife) * 0.9;
    }));
  }

  // Anime Katana Razor Slash Arc (Dynamic Crescent Slicing Wave)
  spawnKatanaSlashArc(pos, rotEuler, color = 0x00f0ff, scale = 1.0, arc = Math.PI * 0.85, spinSpeed = 3.5) {
    const group = new THREE.Group();
    group.position.copy(pos);
    if (rotEuler) group.rotation.copy(rotEuler);

    const innerR = 0.75 * scale;
    const outerR = 1.30 * scale;

    // Outer colored anime energy arc (flat in XZ plane, tilted by rotEuler)
    const arcGeo = new THREE.RingGeometry(innerR, outerR, 32, 1, -arc / 2, arc);
    arcGeo.rotateX(-Math.PI / 2);
    const arcMat = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const arcMesh = new THREE.Mesh(arcGeo, arcMat);

    // Inner razor cutting edge (bright white rim on outer edge of arc)
    const coreGeo = new THREE.RingGeometry(outerR - 0.12 * scale, outerR, 32, 1, -arc / 2 + 0.05, arc - 0.1);
    coreGeo.rotateX(-Math.PI / 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 0.005;

    group.add(arcMesh, coreMesh);
    this.scene.add(group);

    const maxLife = 0.28;
    this.particles.push(new Particle(group, new THREE.Vector3(), maxLife, maxLife, (p, dt) => {
      const prog = 1.0 - (p.life / p.maxLife);
      // Dynamic sweep rotation during swing
      group.rotateY(spinSpeed * dt);
      // Expanding blade wave
      const expand = 1.0 + prog * 0.35;
      p.mesh.scale.set(expand, expand, expand);
      // Smooth fade out
      const fade = Math.pow(p.life / p.maxLife, 1.4);
      arcMat.opacity = fade * 0.95;
      coreMat.opacity = fade * 0.98;
    }));

    // Micro cutting flash sparks
    for (let i = 0; i < 6; i++) {
      const sparkGeo = new THREE.SphereGeometry(0.04 * scale, 6, 6);
      const sparkMat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.3 ? color : 0xffffff,
        blending: THREE.AdditiveBlending
      });
      const spark = new THREE.Mesh(sparkGeo, sparkMat);
      const sparkAngle = (Math.random() - 0.5) * arc;
      const sparkR = innerR + Math.random() * (outerR - innerR);
      const sparkOffset = new THREE.Vector3(
        Math.cos(sparkAngle) * sparkR,
        (Math.random() - 0.5) * 0.2,
        Math.sin(sparkAngle) * sparkR
      );
      if (rotEuler) sparkOffset.applyEuler(rotEuler);
      spark.position.copy(pos).add(sparkOffset);
      this.scene.add(spark);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 3.0,
        Math.random() * 2.5,
        (Math.random() - 0.5) * 3.0
      );
      this.particles.push(new Particle(spark, vel, 0.22, 0.22, (sp, sdt) => {
        sp.mesh.position.addScaledVector(sp.velocity, sdt);
        sp.mesh.scale.setScalar(sp.life / sp.maxLife);
      }));
    }
  }

  // Ground Slam Impact Shockwave for Katana Aerial Plunge Attack
  spawnKatanaGroundSlam(pos) {
    this.triggerScreenShake(0.38, 0.3);

    // 1. Dual Shockwave Rings on the ground
    const ringGeo = new THREE.RingGeometry(0.2, 0.8, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos).setY(pos.y + 0.06);
    this.scene.add(ring);

    this.particles.push(new Particle(ring, new THREE.Vector3(), 0.35, 0.35, (p, dt) => {
      const prog = 1.0 - (p.life / p.maxLife);
      const s = 1.0 + prog * 6.5;
      p.mesh.scale.set(s, s, s);
      p.mesh.material.opacity = (p.life / p.maxLife) * 0.95;
    }));

    // 2. Burst of anime dust & debris
    this.spawnLandingDust(pos, 10);

    // 3. Upward cutting sparks
    for (let i = 0; i < 16; i++) {
      const geo = new THREE.ConeGeometry(0.08, 0.35, 4);
      geo.rotateX(Math.PI / 2);
      const sparkMat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.4 ? 0x00f0ff : 0xffffff,
        blending: THREE.AdditiveBlending
      });
      const spark = new THREE.Mesh(geo, sparkMat);
      spark.position.copy(pos).setY(pos.y + 0.1);

      const angle = (i / 16) * Math.PI * 2;
      const speed = 4.5 + Math.random() * 5.0;
      const dir = new THREE.Vector3(
        Math.cos(angle) * speed,
        Math.random() * 5.0 + 3.0,
        Math.sin(angle) * speed
      );
      spark.lookAt(spark.position.clone().add(dir));

      this.scene.add(spark);
      this.particles.push(new Particle(spark, dir, 0.35, 0.35, (p, dt) => {
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.velocity.y -= 12 * dt;
        p.mesh.scale.setScalar(p.life / p.maxLife);
      }));
    }
  }

  setSpeedLines(intensity) {
    this.speedLinesIntensity = THREE.MathUtils.clamp(intensity, 0, 1);
  }

  // Render 2D Dynamic Anime Speed Lines on Canvas
  renderSpeedLines() {
    if (!this.fxCtx || this.speedLinesIntensity <= 0.05) {
      if (this.fxCtx) this.fxCtx.clearRect(0, 0, this.fxCanvas.width, this.fxCanvas.height);
      return;
    }

    const ctx = this.fxCtx;
    const w = this.fxCanvas.width;
    const h = this.fxCanvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    const lineCount = Math.floor(40 * this.speedLinesIntensity);
    const innerRadius = Math.min(w, h) * 0.25;
    const outerRadius = Math.max(w, h) * 0.8;

    ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * this.speedLinesIntensity})`;
    ctx.lineWidth = 2 + 3 * this.speedLinesIntensity;
    ctx.beginPath();

    for (let i = 0; i < lineCount; i++) {
      const angle = (Math.PI * 2 * i) / lineCount + (Math.random() - 0.5) * 0.1;
      const startDist = innerRadius + Math.random() * (innerRadius * 0.8);
      const endDist = outerRadius + Math.random() * 100;

      const x1 = cx + Math.cos(angle) * startDist;
      const y1 = cy + Math.sin(angle) * startDist;
      const x2 = cx + Math.cos(angle) * endDist;
      const y2 = cy + Math.sin(angle) * endDist;

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    }

    ctx.stroke();
  }

  update(dt, camera, targetPos = null) {
    // Animate procedural water caustics texture offset
    if (sharedWaterTexture) {
      sharedWaterTexture.offset.x = (sharedWaterTexture.offset.x + dt * 0.035) % 1;
      sharedWaterTexture.offset.y = (sharedWaterTexture.offset.y + dt * 0.055) % 1;
    }

    // Update floating Sakura blossom petals
    this.updateSakuraPetals(dt, targetPos);

    // Update active particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        if (p.mesh.geometry) p.mesh.geometry.dispose();
        if (p.mesh.material) p.mesh.material.dispose();
        this.particles.splice(i, 1);
      } else {
        p.updateFn(p, dt);
      }
    }

    // Screen Shake effect applied to camera
    if (this.screenShakeTime > 0 && camera) {
      this.screenShakeTime -= dt;
      const shake = this.screenShakeIntensity * (this.screenShakeTime > 0 ? 1 : 0);
      camera.position.x += (Math.random() - 0.5) * shake;
      camera.position.y += (Math.random() - 0.5) * shake;
    }

    // Render 2D Speed Lines
    this.renderSpeedLines();
  }
}
