// Anime VFX: Cel-Shading, Inverted Hull Outlines, Particles, and Speed Lines
import * as THREE from 'three';

// Create 3-tone anime gradient ramp texture for MeshToonMaterial
export function createToonRampTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  
  // 3 crisp anime shading bands: Shadow (0.4), Midtone (0.75), Highlight (1.0)
  ctx.fillStyle = '#666666';
  ctx.fillRect(0, 0, 1, 1);
  ctx.fillStyle = '#b3b3b3';
  ctx.fillRect(1, 0, 2, 1);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(3, 0, 1, 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  return texture;
}

const sharedToonRamp = createToonRampTexture();

export function createToonMaterial(color, options = {}) {
  return new THREE.MeshToonMaterial({
    color: new THREE.Color(color),
    gradientMap: sharedToonRamp,
    roughness: options.roughness !== undefined ? options.roughness : 0.8,
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
    this.fxCanvas = document.getElementById('fx-canvas');
    this.fxCtx = this.fxCanvas ? this.fxCanvas.getContext('2d') : null;
    this.speedLinesIntensity = 0;
    this.screenShakeTime = 0;
    this.screenShakeIntensity = 0;

    this.resizeFxCanvas();
    window.addEventListener('resize', () => this.resizeFxCanvas());
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

  update(dt, camera) {
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
