// Naruto Uzumaki Ultra-High Quality 3D Model with Chakra Wall-Running & Rooftop Parkour
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createToonMaterial } from '../vfx/AnimeVFX.js';
import { sound } from '../audio/SoundFX.js';

export class Naruto {
  constructor(scene, vfx) {
    this.scene = scene;
    this.vfx = vfx;

    // Stats
    this.maxHp = 500;
    this.hp = 500;
    this.maxChakra = 150;
    this.chakra = 150;
    this.isDead = false;

    // Movement & Physics
    this.position = new THREE.Vector3(0, 0, 15);
    this.velocity = new THREE.Vector3();
    this.rotationY = Math.PI;
    this.targetRotationY = Math.PI;
    this.speed = 14.0;
    this.isGrounded = true;
    this.jumpForce = 16;
    this.gravity = 35;
    this.currentGroundY = 0;

    // Wall-Running (Chakra Wall Walking) State
    this.isWallRunning = false;
    this.wallNormal = new THREE.Vector3();
    this.wallRoofY = 0;

    // 5-Hit Taijutsu Combo & Running Combat State
    this.state = 'IDLE'; // IDLE, RUN, JUMP, WALL_RUN, ATTACK, CHARGE_CHAKRA, RASENGAN_DASH
    this.comboStep = 0;
    this.comboTimer = 0;
    this.attackMode = 'STAND_ATTACK'; // 'STAND_ATTACK' or 'RUN_ATTACK'
    this.runAttackStep = 0;
    this.runAttackTimer = 0;
    this.attackProgress = 0;
    this.attackDuration = 0.35;
    this.attackCooldown = 0;
    this.isAttacking = false;
    this.attackHitboxRadius = 3.2;

    // Weapon & Inventory System (Ryo, Katana, Upgrades)
    this.ryo = 0;
    this.hasKatana = false;
    this.equippedWeapon = 'FISTS'; // 'FISTS' or 'KATANA'
    this.katanaDamageBonus = 1.0;
    this.hasExplosiveKunai = false;

    // Katana Kenjutsu States
    this.katanaComboStep = 0;
    this.katanaComboTimer = 0;
    this.katanaSprintStep = 0;
    this.katanaSprintTimer = 0;

    // Level & Skill Progression System
    this.level = 1;
    this.currentXp = 0;
    this.xpToNextLevel = 100;
    this.skillPoints = 0;
    this.unlockedSkills = new Set(['shuriken_base', 'clones_base', 'rasengan_base', 'kyuubi_base']);
    this.justLeveledUp = false;

    // Nine-Tails Mode & Sage Mode Transformations
    this.isKyuubiMode = false;
    this.kyuubiTimeLeft = 0;
    this.isSageMode = false;
    this.sageTimeLeft = 0;

    // Chakra Charge
    this.isChargingChakra = false;

    // Smooth Rig Blending & Physics States
    this.boneTargets = {
      torso: { rot: new THREE.Euler(), pos: new THREE.Vector3(0, 1.15, 0) },
      head: { rot: new THREE.Euler() },
      leftArm: { rot: new THREE.Euler() },
      leftForearm: { rot: new THREE.Euler() },
      rightArm: { rot: new THREE.Euler() },
      rightForearm: { rot: new THREE.Euler() },
      leftLeg: { rot: new THREE.Euler() },
      leftShin: { rot: new THREE.Euler() },
      rightLeg: { rot: new THREE.Euler() },
      rightShin: { rot: new THREE.Euler() }
    };
    this.bankAngle = 0;
    this.wasGrounded = true;
    this.wasMoving = false;
    this.runCycle = 0;
    this.lastSinRun = 0;
    this.wallPuffTimer = 0;
    this.lastSinWall = 0;
    this.wallKickCooldown = 0;
    this.airFlipTimer = 0;
    this.pitchAngle = 0;

    // Double Jump & Sprint States
    this.canDoubleJump = true;
    this.doubleFlipTimer = 0;
    this.isSprinting = false;
    this.wasSprinting = false;
    this.sprintAuraTimer = 0;
    this.prevSpace = false;

    // Animated Naruto 3D Model & Skeletal Animation System (naruto_animaciones.glb)
    this.narutoAnimatedGroup = null;
    this.narutoAnimatedScene = null;
    this.narutoMixer = null;
    this.narutoActions = {};
    this.currentNarutoAction = null;
    this.isNarutoAnimatedLoaded = false;
    this.winTimer = 0;
    this.attackTriggered = false;
    this.jumpFlipTriggered = false;
    this.rWeaponBone = null;
    this.rHandBone = null;
    this.spineBone = null;
    this.lFootBone = null;
    this.rFootBone = null;
    this.headBone = null;

    // Kurama (Nine-Tails Beast) 3D Model & Animation System
    this.kuramaGroup = null;
    this.kuramaScene = null;
    this.kuramaMixer = null;
    this.kuramaActions = {};
    this.currentKuramaAction = null;
    this.kuramaAttackTimer = 0;
    this.kuramaStepDustTimer = 0;
    this.kuramaMouthBone = null;
    this.isKuramaLoaded = false;

    // Build Model & Rig
    this.buildModel();
    this.buildKatanaWeapon();
    this.buildSlashTrail();
  }

  buildModel() {
    this.group = new THREE.Group();
    this.group.rotation.order = 'YXZ';
    this.group.position.copy(this.position);
    this.group.scale.set(1.34, 1.34, 1.34);

    this.rig = {};

    // 1. Torso
    this.rig.torso = new THREE.Group();
    this.rig.torso.position.y = 1.15;

    // 2. Head
    this.rig.head = new THREE.Group();
    this.rig.head.position.set(0, 0.25, 0);

    // Sage Mode Eye Pigmentation (Toad Sage Orange eyeshadow)
    this.rig.sageEyes = new THREE.Group();
    const sageEyeMat = createToonMaterial(0xff7700);
    [-0.065, 0.065].forEach(ex => {
      const mark = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.02), sageEyeMat);
      mark.position.set(ex, 0.12, 0.10);
      this.rig.sageEyes.add(mark);
    });
    this.rig.sageEyes.visible = false;
    this.rig.head.add(this.rig.sageEyes);

    // Headband fluttering ribbons
    this.rig.headbandTails = new THREE.Group();
    this.rig.headbandTails.position.set(0, 0.16, -0.11);
    const tailMat = createToonMaterial(0x1a1a1a);
    const tailGeo = new THREE.BoxGeometry(0.04, 0.32, 0.01);
    const tail1 = new THREE.Mesh(tailGeo, tailMat);
    tail1.position.set(-0.03, -0.14, -0.02);
    tail1.rotation.z = -0.15;
    const tail2 = new THREE.Mesh(tailGeo, tailMat);
    tail2.position.set(0.03, -0.14, -0.02);
    tail2.rotation.z = 0.15;
    this.rig.headbandTails.add(tail1, tail2);
    this.rig.head.add(this.rig.headbandTails);

    this.rig.torso.add(this.rig.head);

    // 3. Limbs & Joint Rig
    this.rig.leftArm = new THREE.Group();
    this.rig.leftArm.position.set(-0.21, 0.19, 0);

    this.rig.leftForearm = new THREE.Group();
    this.rig.leftForearm.position.set(0, -0.27, 0);
    this.rig.leftArm.add(this.rig.leftForearm);

    this.rig.rightArm = new THREE.Group();
    this.rig.rightArm.position.set(0.21, 0.19, 0);

    this.rig.rightForearm = new THREE.Group();
    this.rig.rightForearm.position.set(0, -0.27, 0);

    // Rasengan Anchor in right palm
    this.rasenganAnchor = new THREE.Group();
    this.rasenganAnchor.position.set(0, -0.34, 0);
    this.rig.rightForearm.add(this.rasenganAnchor);

    this.rig.rightArm.add(this.rig.rightForearm);

    this.rig.torso.add(this.rig.leftArm, this.rig.rightArm);

    // 4. Legs
    this.rig.leftLeg = new THREE.Group();
    this.rig.leftLeg.position.set(-0.10, -0.25, 0);

    this.rig.leftShin = new THREE.Group();
    this.rig.leftShin.position.set(0, -0.40, 0);

    // Glowing Chakra Soles (for wall running & ninja sprints)
    const chakraSoleMatL = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    this.leftChakraSole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.02, 12), chakraSoleMatL);
    this.leftChakraSole.scale.set(1.0, 1.0, 1.8);
    this.leftChakraSole.position.set(0, -0.50, 0.05);
    this.rig.leftShin.add(this.leftChakraSole);
    this.rig.leftLeg.add(this.rig.leftShin);

    this.rig.rightLeg = new THREE.Group();
    this.rig.rightLeg.position.set(0.10, -0.25, 0);

    this.rig.rightShin = new THREE.Group();
    this.rig.rightShin.position.set(0, -0.40, 0);

    const chakraSoleMatR = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    this.rightChakraSole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.02, 12), chakraSoleMatR);
    this.rightChakraSole.scale.set(1.0, 1.0, 1.8);
    this.rightChakraSole.position.set(0, -0.50, 0.05);
    this.rig.rightShin.add(this.rightChakraSole);
    this.rig.rightLeg.add(this.rig.rightShin);

    this.rig.torso.add(this.rig.leftLeg, this.rig.rightLeg);
    this.group.add(this.rig.torso);

    this.scene.add(this.group);

    // Lightweight initial silhouette placeholders while GLB loads
    this.buildInitialPlaceholders();

    // Load authentic animated 3D GLB Model: naruto_animaciones.glb
    this.loadAnimatedNarutoGLB('/src/assets/naruto_animaciones.glb');

    // Load authentic 3D GLB Model: kurama.glb for 9-Tails Mode
    this.loadKuramaGLBModel('/src/assets/kurama.glb');
  }

  buildInitialPlaceholders() {
    this.placeholderMeshes = [];
    const orangeMat = createToonMaterial(0xff7300, { roughness: 0.5 });
    const skinMat = createToonMaterial(0xffcca0, { roughness: 0.45 });
    const hairMat = createToonMaterial(0xffea00, { roughness: 0.3 });

    const pTorso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.52, 0.28), orangeMat);
    pTorso.position.y = 0;
    this.rig.torso.add(pTorso);
    this.placeholderMeshes.push(pTorso);

    const pHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), skinMat);
    pHead.position.y = 0.15;
    const pHair = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.22, 6), hairMat);
    pHair.position.y = 0.28;
    this.rig.head.add(pHead, pHair);
    this.placeholderMeshes.push(pHead, pHair);
  }

  loadAnimatedNarutoGLB(url) {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        this.onAnimatedNarutoLoaded(gltf);
      },
      undefined,
      (err) => {
        console.error('Failed to load Animated Naruto GLB model:', err);
      }
    );
  }

  onAnimatedNarutoLoaded(gltf) {
    this.narutoAnimatedScene = gltf.scene;
    this.narutoAnimatedGroup = new THREE.Group();
    // Calibrate scale: Naruto stands ~1.68m tall
    this.narutoAnimatedGroup.scale.set(1.0, 1.0, 1.0);
    this.narutoAnimatedScene.updateMatrixWorld(true);

    this.narutoAnimatedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          if (child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace;
          }
          if (child.material.name === 'M_Line' || (child.name && child.name.includes('M_Line'))) {
            child.material.color = new THREE.Color(0x111111);
            child.material.roughness = 0.95;
            child.material.metalness = 0.0;
          } else {
            child.material.roughness = 0.65;
            child.material.metalness = 0.05;
          }
        }
      }
      if (child.name) {
        if (!this.rWeaponBone && (child.name === 'R_Hand_Weapon_cnt_tr_0159' || child.name.includes('R_Hand_Weapon'))) {
          this.rWeaponBone = child;
        } else if (!this.rHandBone && child.name.includes('RightHand')) {
          this.rHandBone = child;
        } else if (!this.spineBone && (child.name.includes('Spine_05') || child.name.includes('Spine1') || child.name.includes('Hips'))) {
          this.spineBone = child;
        } else if (!this.lFootBone && (child.name.includes('LeftFoot') || child.name.includes('LeftToe'))) {
          this.lFootBone = child;
        } else if (!this.rFootBone && (child.name.includes('RightFoot') || child.name.includes('RightToe'))) {
          this.rFootBone = child;
        } else if (!this.headBone && child.name.includes('Head')) {
          this.headBone = child;
        }
      }
    });

    if (!this.rWeaponBone && this.rHandBone) this.rWeaponBone = this.rHandBone;

    // Attach Katana & Rasengan socket to weapon bone
    if (this.rWeaponBone) {
      if (this.handKatana) {
        if (this.handKatana.parent) this.handKatana.parent.remove(this.handKatana);
        const kSocket = new THREE.Group();
        kSocket.scale.set(100, 100, 100);
        kSocket.position.set(0, 0, 0);
        kSocket.rotation.set(-Math.PI / 2, 0, 0);
        this.handKatana.position.set(0, 0, 0);
        this.handKatana.rotation.set(0, 0, 0);
        kSocket.add(this.handKatana);
        this.rWeaponBone.add(kSocket);
      }
      if (this.rasenganAnchor) {
        if (this.rasenganAnchor.parent) this.rasenganAnchor.parent.remove(this.rasenganAnchor);
        const rSocket = new THREE.Group();
        rSocket.scale.set(100, 100, 100);
        rSocket.position.set(5, 5, 2);
        this.rasenganAnchor.position.set(0, 0, 0);
        this.rasenganAnchor.rotation.set(0, 0, 0);
        rSocket.add(this.rasenganAnchor);
        this.rWeaponBone.add(rSocket);
      }
    }

    // Attach Scabbard to spine bone
    if (this.spineBone && this.scabbardGroup) {
      if (this.scabbardGroup.parent) this.scabbardGroup.parent.remove(this.scabbardGroup);
      const scabbardSocket = new THREE.Group();
      scabbardSocket.scale.set(100, 100, 100);
      scabbardSocket.position.set(-18, -12, -10);
      scabbardSocket.rotation.set(0.35, 0.2, -0.4);
      this.scabbardGroup.position.set(0, 0, 0);
      this.scabbardGroup.rotation.set(0, 0, 0);
      scabbardSocket.add(this.scabbardGroup);
      this.spineBone.add(scabbardSocket);
    }

    // Attach Chakra Soles to feet
    if (this.lFootBone && this.leftChakraSole) {
      if (this.leftChakraSole.parent) this.leftChakraSole.parent.remove(this.leftChakraSole);
      const lSocket = new THREE.Group();
      lSocket.scale.set(100, 100, 100);
      lSocket.position.set(0, -5, 2);
      this.leftChakraSole.position.set(0, 0, 0);
      lSocket.add(this.leftChakraSole);
      this.lFootBone.add(lSocket);
    }
    if (this.rFootBone && this.rightChakraSole) {
      if (this.rightChakraSole.parent) this.rightChakraSole.parent.remove(this.rightChakraSole);
      const rSocket = new THREE.Group();
      rSocket.scale.set(100, 100, 100);
      rSocket.position.set(0, -5, 2);
      this.rightChakraSole.position.set(0, 0, 0);
      rSocket.add(this.rightChakraSole);
      this.rFootBone.add(rSocket);
    }

    // Attach Sage Eyes to head
    if (this.headBone && this.rig && this.rig.sageEyes) {
      if (this.rig.sageEyes.parent) this.rig.sageEyes.parent.remove(this.rig.sageEyes);
      const sageSocket = new THREE.Group();
      sageSocket.scale.set(100, 100, 100);
      sageSocket.position.set(0, 12, 10);
      this.rig.sageEyes.position.set(0, 0, 0);
      sageSocket.add(this.rig.sageEyes);
      this.headBone.add(sageSocket);
    }

    // Hide placeholder meshes & procedural rig
    if (this.placeholderMeshes) {
      this.placeholderMeshes.forEach(m => m.visible = false);
    }
    if (this.rig && this.rig.torso) {
      this.rig.torso.visible = false;
    }

    // Initialize AnimationMixer with all authentic animation clips
    this.narutoMixer = new THREE.AnimationMixer(this.narutoAnimatedScene);
    const clips = gltf.animations || [];
    clips.forEach((clip) => {
      let key = clip.name;
      if (key.includes('idle')) key = 'idle';
      else if (key.includes('walk')) key = 'walk';
      else if (key.includes('run')) key = 'run';
      else if (key.includes('punch')) key = 'punch';
      else if (key.includes('kick2')) key = 'kick2';
      else if (key.includes('kick')) key = 'kick1';
      else if (key.includes('rasengan')) key = 'rasengan';
      else if (key.includes('win2')) key = 'win2';
      else if (key.includes('win')) key = 'win';

      const action = this.narutoMixer.clipAction(clip);
      if (['idle', 'walk', 'run'].includes(key)) {
        action.setLoop(THREE.LoopRepeat);
      } else {
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
      }
      this.narutoActions[key] = action;
      this.narutoActions[clip.name] = action;
    });

    if (this.narutoActions['idle']) {
      this.narutoActions['idle'].play();
      this.currentNarutoAction = 'idle';
    }

    this.narutoAnimatedGroup.add(this.narutoAnimatedScene);
    this.group.add(this.narutoAnimatedGroup);
    this.isNarutoAnimatedLoaded = true;
    this.isModelLoaded = true;
    this.updateWeaponVisibility();
  }

  playNarutoAction(name, crossfade = 0.18, force = false) {
    if (!this.narutoMixer || !this.narutoActions[name]) return;
    if (!force && this.currentNarutoAction === name && this.narutoActions[name].isRunning()) return;

    const prev = this.currentNarutoAction ? this.narutoActions[this.currentNarutoAction] : null;
    const next = this.narutoActions[name];

    if (force || !next.isRunning()) {
      next.reset();
    }
    if (prev && prev !== next) {
      next.play();
      prev.crossFadeTo(next, crossfade, true);
    } else {
      next.fadeIn(crossfade).play();
    }
    this.currentNarutoAction = name;
  }

  updateNarutoAnimation(dt) {
    if (this.narutoMixer) {
      this.narutoMixer.update(dt);
    }

    // 1. Victory / Level-up celebration pose
    if (this.winTimer > 0) {
      this.winTimer -= dt;
      this.playNarutoAction('win', 0.22);
      return;
    }

    // 2. Rasengan Dash / Charge
    if (this.state === 'RASENGAN_DASH' || this.isChargingChakra) {
      this.playNarutoAction('rasengan', 0.12);
      if (this.narutoActions['rasengan']) {
        this.narutoActions['rasengan'].timeScale = 1.6;
      }
      return;
    }

    // 3. Attack animations (Combo punches, kicks, katana slashes)
    if (this.isAttacking) {
      if (this.attackMode === 'RASENSHURIKEN') {
        if (this.attackTriggered) {
          this.playNarutoAction('punch', 0.06, true);
          if (this.narutoActions['punch']) {
            this.narutoActions['punch'].timeScale = 2.6;
            this.narutoActions['punch'].time = 0.0;
          }
          this.attackTriggered = false;
        } else {
          this.playNarutoAction('punch', 0.06, false);
        }
      } else if (this.attackMode === 'AIR_ATTACK') {
        if (this.attackTriggered) {
          this.playNarutoAction('kick2', 0.08, true);
          if (this.narutoActions['kick2']) this.narutoActions['kick2'].timeScale = 2.0;
          this.attackTriggered = false;
        } else {
          this.playNarutoAction('kick2', 0.08, false);
        }
      } else if (this.attackMode === 'RUN_ATTACK') {
        if (this.attackTriggered) {
          this.playNarutoAction('kick1', 0.08, true);
          if (this.narutoActions['kick1']) this.narutoActions['kick1'].timeScale = 2.2;
          this.attackTriggered = false;
        } else {
          this.playNarutoAction('kick1', 0.08, false);
        }
      } else {
        const step = (this.equippedWeapon === 'KATANA') ? this.katanaComboStep : this.comboStep;
        if (this.attackTriggered) {
          if (step === 1) {
            this.playNarutoAction('punch', 0.06, true);
            if (this.narutoActions['punch']) {
              this.narutoActions['punch'].timeScale = 2.4;
              this.narutoActions['punch'].time = 0.0;
            }
          } else if (step === 2) {
            this.playNarutoAction('kick1', 0.06, true);
            if (this.narutoActions['kick1']) {
              this.narutoActions['kick1'].timeScale = 2.2;
              this.narutoActions['kick1'].time = 0.0;
            }
          } else if (step === 3) {
            this.playNarutoAction('punch', 0.06, true);
            if (this.narutoActions['punch']) {
              this.narutoActions['punch'].timeScale = 2.4;
              this.narutoActions['punch'].time = 1.2;
            }
          } else if (step === 4) {
            this.playNarutoAction('kick1', 0.06, true);
            if (this.narutoActions['kick1']) {
              this.narutoActions['kick1'].timeScale = 2.4;
              this.narutoActions['kick1'].time = 0.8;
            }
          } else {
            this.playNarutoAction('kick2', 0.08, true);
            if (this.narutoActions['kick2']) {
              this.narutoActions['kick2'].timeScale = 2.0;
              this.narutoActions['kick2'].time = 0.0;
            }
          }
          this.attackTriggered = false;
        }
      }
      return;
    }

    // 4. In-air Jump & Somersault (Frontflip)
    if (!this.isGrounded && !this.isWallRunning) {
      if (this.doubleFlipTimer > 0) {
        if (this.jumpFlipTriggered) {
          this.playNarutoAction('kick2', 0.06, true);
          this.jumpFlipTriggered = false;
        } else {
          this.playNarutoAction('kick2', 0.06, false);
        }
        if (this.narutoActions['kick2']) {
          this.narutoActions['kick2'].timeScale = 2.0;
        }
      } else {
        if (this.jumpFlipTriggered) {
          this.playNarutoAction('kick2', 0.12, true);
          this.jumpFlipTriggered = false;
        } else {
          this.playNarutoAction('kick2', 0.16, false);
        }
        if (this.narutoActions['kick2']) {
          this.narutoActions['kick2'].timeScale = 1.0;
        }
      }
      return;
    }

    // 5. Wall-Running
    if (this.isWallRunning) {
      this.playNarutoAction('run', 0.14);
      if (this.narutoActions['run']) {
        this.narutoActions['run'].timeScale = 1.6;
      }
      return;
    }

    // 6. Ground Locomotion
    const horizSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    if (horizSpeed > 1.5) {
      if (this.isSprinting || horizSpeed > 9.0) {
        this.playNarutoAction('run', 0.14);
        if (this.narutoActions['run']) {
          this.narutoActions['run'].timeScale = Math.min(1.85, Math.max(1.0, horizSpeed / 8.5));
        }
      } else {
        this.playNarutoAction('walk', 0.18);
        if (this.narutoActions['walk']) {
          this.narutoActions['walk'].timeScale = Math.min(1.6, Math.max(0.85, horizSpeed / 4.8));
        }
      }
    } else {
      this.playNarutoAction('idle', 0.24);
    }
  }

  triggerRasenshurikenPose() {
    this.isAttacking = true;
    this.attackTriggered = true;
    this.attackMode = 'RASENSHURIKEN';
    this.attackDuration = 0.42;
    this.attackProgress = 0;
  }

  loadKuramaGLBModel(url) {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        this.onKuramaGLBLoaded(gltf);
      },
      undefined,
      (err) => {
        console.error('Failed to load Kurama GLB model:', err);
      }
    );
  }

  onKuramaGLBLoaded(gltf) {
    this.kuramaScene = gltf.scene;
    this.kuramaGroup = new THREE.Group();
    // Colossal anime scale: Kurama stands ~8.3 meters tall, towering over Konoha buildings
    this.kuramaGroup.scale.set(11.5, 11.5, 11.5);
    this.kuramaGroup.visible = false;

    this.kuramaScene.updateMatrixWorld(true);

    this.kuramaScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          if (child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace;
          }
          if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
            child.material.roughness = 0.55;
            child.material.metalness = 0.05;
            child.material.emissive = new THREE.Color(0x380500);
            child.material.emissiveIntensity = 0.35;
          }
        }
      }
      if (child.name) {
        if (child.name.includes('Mouth_032') || (!this.kuramaMouthBone && child.name.includes('Mouth'))) {
          this.kuramaMouthBone = child;
        } else if (!this.kuramaHeadBone && child.name.includes('Head')) {
          this.kuramaHeadBone = child;
        }
      }
    });

    // AnimationMixer with all 9 authentic animation clips
    this.kuramaMixer = new THREE.AnimationMixer(this.kuramaScene);
    const clips = gltf.animations || [];
    clips.forEach((clip) => {
      let key = clip.name;
      if (key.includes('|')) key = key.split('|')[1];
      if (key === 'skill01_1') key = 'skill01';

      const action = this.kuramaMixer.clipAction(clip);
      if (['stand', 'run', 'atstand', 'wait'].includes(key)) {
        action.setLoop(THREE.LoopRepeat);
      } else {
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
      }
      this.kuramaActions[key] = action;
    });

    // Default to stand
    if (this.kuramaActions['stand']) {
      this.kuramaActions['stand'].play();
      this.currentKuramaAction = 'stand';
    }

    this.kuramaGroup.add(this.kuramaScene);
    this.scene.add(this.kuramaGroup);
    this.isKuramaLoaded = true;
  }

  playKuramaAction(name, crossfade = 0.22, force = false) {
    if (!this.kuramaMixer || !this.kuramaActions[name]) return;
    if (!force && this.currentKuramaAction === name && this.kuramaActions[name].isRunning()) return;

    const prev = this.currentKuramaAction ? this.kuramaActions[this.currentKuramaAction] : null;
    const next = this.kuramaActions[name];

    next.reset();
    if (prev && prev !== next) {
      next.play();
      prev.crossFadeTo(next, crossfade, true);
    } else {
      next.fadeIn(crossfade).play();
    }
    this.currentKuramaAction = name;
  }

  updateKuramaAnimation(dt) {
    if (this.kuramaMixer) {
      this.kuramaMixer.update(dt);
    }

    if (this.kuramaAttackTimer > 0) {
      this.kuramaAttackTimer -= dt;
      return;
    }

    const horizSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    if (horizSpeed > 1.8) {
      this.playKuramaAction('run', 0.16);

      // Heavy paw footstep thuds and ground shockwaves timed to giant strides
      this.kuramaStepDustTimer += dt * horizSpeed * 0.14;
      if (this.kuramaStepDustTimer > 0.40) {
        this.kuramaStepDustTimer = 0;
        sound.playHeavyPawThud();
        if (this.vfx && this.vfx.spawnKuramaFootstepShockwave) {
          this.vfx.spawnKuramaFootstepShockwave(this.position);
        }
      }
    } else {
      this.playKuramaAction('stand', 0.24);
    }
  }

  buildKatanaWeapon() {
    // Premium Anime Katana Materials
    const steelBladeMat = createToonMaterial(0xf8fafc, { roughness: 0.12 });
    const edgeBladeMat = createToonMaterial(0xffffff, { roughness: 0.05 });
    const goldMat = createToonMaterial(0xffb300, { roughness: 0.25 });
    const darkMat = createToonMaterial(0x11161d, { roughness: 0.3 });
    const tsukaItoMat = createToonMaterial(0x0f1d40, { roughness: 0.5 }); // Dark navy wrap
    const redMat = createToonMaterial(0xd50000);

    // 1. KATANA IN RIGHT HAND
    this.handKatana = new THREE.Group();
    // Position katana handle right in Naruto's right hand palm (y = -0.31)
    this.handKatana.position.set(0, -0.31, 0.02);
    // Orient blade extending forward and angled slightly upward from right fist
    this.handKatana.rotation.set(-0.18, 0.06, -0.12);

    // Tsuka (Hilt / Handle)
    const tsukaGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.28, 10);
    tsukaGeo.rotateX(Math.PI / 2);
    const tsuka = new THREE.Mesh(tsukaGeo, tsukaItoMat);
    tsuka.position.z = -0.10; // Centered through grip

    // Kashira (Pommel cap)
    const kashiraGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.04, 10);
    kashiraGeo.rotateX(Math.PI / 2);
    const kashira = new THREE.Mesh(kashiraGeo, goldMat);
    kashira.position.z = -0.24;

    // Fuchi (Collar)
    const fuchi = new THREE.Mesh(kashiraGeo.clone(), goldMat);
    fuchi.position.z = 0.01;

    // Tsuba (Guard) - Ornate Leaf Guard
    const tsubaGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.022, 16);
    tsubaGeo.rotateX(Math.PI / 2);
    const tsuba = new THREE.Mesh(tsubaGeo, goldMat);
    tsuba.position.z = 0.03;

    // Habaki (Blade collar)
    const habaki = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.065, 0.04), goldMat);
    habaki.position.z = 0.055;

    // Blade Spine & Body (Curved steel blade)
    const bladeGroup = new THREE.Group();
    bladeGroup.position.z = 0.08;

    const bladeLen = 1.15;
    const spineMesh = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.048, bladeLen), steelBladeMat);
    spineMesh.position.z = bladeLen / 2;

    // Sharp Cutting Edge with Hamon
    const edgeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.02, bladeLen), edgeBladeMat);
    edgeMesh.position.set(0, -0.028, bladeLen / 2);

    // Kissaki (Tapered blade tip)
    const tipGeo = new THREE.ConeGeometry(0.035, 0.14, 4);
    tipGeo.rotateX(Math.PI / 2);
    const tipMesh = new THREE.Mesh(tipGeo, edgeBladeMat);
    tipMesh.position.set(0, -0.01, bladeLen + 0.06);

    bladeGroup.add(spineMesh, edgeMesh, tipMesh);

    this.handKatana.add(tsuka, kashira, fuchi, tsuba, habaki, bladeGroup);
    this.rig.rightForearm.add(this.handKatana);

    // 2. SCABBARD (SAYA) ON LEFT HIP
    this.scabbardGroup = new THREE.Group();
    // Mounted at Naruto's left hip/belt
    this.scabbardGroup.position.set(-0.24, -0.18, 0.02);
    this.scabbardGroup.rotation.set(0.35, 0.18, -0.38);

    const sayaGeo = new THREE.CylinderGeometry(0.034, 0.028, 1.25, 10);
    sayaGeo.rotateX(Math.PI / 2);
    const sayaMesh = new THREE.Mesh(sayaGeo, darkMat);
    sayaMesh.position.z = -0.62; // Scabbard mouth at hip, extends back

    const kojiri = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.06, 10), goldMat);
    kojiri.rotateX(Math.PI / 2);
    kojiri.position.z = -1.24;

    const koiguchi = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.05, 10), goldMat);
    koiguchi.rotateX(Math.PI / 2);
    koiguchi.position.z = -0.02;

    const sageo = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.015, 8, 14), redMat);
    sageo.position.z = -0.15;

    this.scabbardGroup.add(sayaMesh, kojiri, koiguchi, sageo);

    // 3. SHEATHED HILT (Visible in scabbard when weapon is NOT held in hand)
    this.sheathedHilt = new THREE.Group();
    this.sheathedHilt.position.z = 0.02;

    const sTsuka = tsuka.clone();
    sTsuka.position.z = 0.16;
    const sKashira = kashira.clone();
    sKashira.position.z = 0.32;
    const sTsuba = tsuba.clone();
    sTsuba.position.z = 0.01;

    this.sheathedHilt.add(sTsuka, sKashira, sTsuba);
    this.scabbardGroup.add(this.sheathedHilt);

    this.rig.torso.add(this.scabbardGroup);

    // Initial state
    this.updateWeaponVisibility();
  }

  updateWeaponVisibility() {
    if (!this.handKatana || !this.scabbardGroup) return;

    if (this.hasKatana) {
      this.scabbardGroup.visible = true;
      if (this.equippedWeapon === 'KATANA') {
        this.handKatana.visible = true;
        this.sheathedHilt.visible = false;
      } else {
        this.handKatana.visible = false;
        this.sheathedHilt.visible = true;
      }
    } else {
      this.handKatana.visible = false;
      this.scabbardGroup.visible = false;
    }
  }

  addRyo(amount) {
    this.ryo = (this.ryo || 0) + amount;
  }

  buyKatana() {
    this.hasKatana = true;
    this.equippedWeapon = 'KATANA';
    this.updateWeaponVisibility();
    sound.playKatanaDraw();
    if (this.vfx && this.vfx.spawnCoinSparkles) {
      this.vfx.spawnCoinSparkles(this.position.clone().setY(this.position.y + 1.2));
    }
  }

  toggleWeapon() {
    if (!this.hasKatana) return;
    this.equippedWeapon = (this.equippedWeapon === 'KATANA') ? 'FISTS' : 'KATANA';
    this.updateWeaponVisibility();
    sound.playKatanaDraw();
  }

  buildSlashTrail() {
    const trailGeo = new THREE.RingGeometry(0.6, 1.4, 24, 1, 0, Math.PI * 0.9);
    const trailMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });
    this.slashTrail = new THREE.Mesh(trailGeo, trailMat);
    this.slashTrail.position.set(0, 1.2, 0.6);
    this.slashTrail.rotation.x = Math.PI / 2;
    this.group.add(this.slashTrail);
  }

  showSlashTrail(color = 0x00f0ff, rotZ = 0) {
    this.slashTrail.material.color.setHex(color);
    this.slashTrail.rotation.z = rotZ;
    this.slashTrail.material.opacity = 0.85;

    let fade = 0.85;
    const fadeTimer = setInterval(() => {
      fade -= 0.15;
      if (fade <= 0) {
        this.slashTrail.material.opacity = 0;
        clearInterval(fadeTimer);
      } else {
        this.slashTrail.material.opacity = fade;
      }
    }, 25);
  }

  update(dt, input, cameraAngle, city) {
    if (this.isDead) return;

    // Passive Health Regeneration
    const hpRegen = (this.isSageMode ? 14.0 : 8.0) * dt;
    this.hp = Math.min(this.maxHp, this.hp + hpRegen);

    if (this.isKyuubiMode) {
      this.kyuubiTimeLeft -= dt;
      this.vfx.spawnChakraAuraWisp(this.position, true);
      if (this.kyuubiTimeLeft <= 0) this.deactivateKyuubiMode();
    }

    if (this.isSageMode) {
      this.sageTimeLeft -= dt;
      if (Math.random() < 0.28) {
        this.vfx.spawnChakraAuraWisp(this.position, false);
      }
      if (this.sageTimeLeft <= 0) this.deactivateSageMode();
    }

    // Chakra Concentration & Passive Recovery
    const focusMultiplier = this.hasSkill('chakra_focus') ? 1.35 : 1.0;
    if (this.isChargingChakra && this.isGrounded && !this.isAttacking) {
      this.chakra = Math.min(this.maxChakra, this.chakra + (65 * focusMultiplier) * dt);
      this.vfx.spawnChakraAuraWisp(this.position, false);
      const cv = document.getElementById('chakra-vignette');
      if (cv) cv.classList.add('charging');
    } else {
      const naturalChakraRegen = (this.isSageMode ? 20.0 : (this.hasSkill('chakra_focus') ? 14.0 : 8.0)) * dt;
      this.chakra = Math.min(this.maxChakra, this.chakra + naturalChakraRegen);
      const cv = document.getElementById('chakra-vignette');
      if (cv) cv.classList.remove('charging');
    }

    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.wallKickCooldown > 0) this.wallKickCooldown -= dt;
    if (this.airFlipTimer > 0) this.airFlipTimer -= dt;
    if (this.doubleFlipTimer > 0) this.doubleFlipTimer -= dt;

    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0 && !this.isAttacking) this.comboStep = 0;
    }
    if (this.runAttackTimer > 0) {
      this.runAttackTimer -= dt;
      if (this.runAttackTimer <= 0 && !this.isAttacking) this.runAttackStep = 0;
    }
    if (this.katanaComboTimer > 0) {
      this.katanaComboTimer -= dt;
      if (this.katanaComboTimer <= 0 && !this.isAttacking) this.katanaComboStep = 0;
    }
    if (this.katanaSprintTimer > 0) {
      this.katanaSprintTimer -= dt;
      if (this.katanaSprintTimer <= 0 && !this.isAttacking) this.katanaSprintStep = 0;
    }

    if (this.isAttacking) {
      this.attackProgress += dt / this.attackDuration;
      if (this.attackProgress >= 1.0) {
        this.isAttacking = false;
        this.attackProgress = 0;
        if (this.isGrounded) {
          const isStillMoving = !!(input && (input.w || input.s || input.a || input.d));
          this.state = isStillMoving ? 'RUN' : 'IDLE';
        }
      }
    }

    // Single-frame edge trigger for space jump / double jump
    const spaceJustPressed = !!(input.space && !this.prevSpace);
    this.prevSpace = !!input.space;

    // Movement Input
    const moveX = (input.d ? 1 : 0) - (input.a ? 1 : 0);
    const moveZ = (input.s ? 1 : 0) - (input.w ? 1 : 0);
    const isMoving = (moveX !== 0 || moveZ !== 0) && !this.isChargingChakra && this.state !== 'RASENGAN_DASH';

    // High-Speed Ninja Sprint (Shift + Movement)
    this.isSprinting = !!input.shift && isMoving && !this.isChargingChakra && this.state !== 'CHARGE_CHAKRA';

    // Initial dash smoke burst when sprint engages
    if (this.isSprinting && !this.wasSprinting) {
      sound.playDash();
      this.vfx.spawnSmokePoof(this.position, 10, 0.65);
    }
    this.wasSprinting = this.isSprinting;

    let sprintMult = 1.0;
    if (this.isSprinting) {
      sprintMult = 1.65;
      if (this.chakra > 1) {
        this.chakra = Math.max(0, this.chakra - 3.5 * dt);
      } else {
        sprintMult = 1.35; // Still brisk sprint even if chakra depleted
      }

      // Dynamic speed lines & trailing chakra flame wisps
      this.vfx.setSpeedLines(0.65);
      this.sprintAuraTimer = (this.sprintAuraTimer || 0) + dt;
      if (this.sprintAuraTimer > 0.07) {
        this.sprintAuraTimer = 0;
        this.vfx.spawnChakraAuraWisp(this.position, this.isKyuubiMode);
      }
    } else if (this.state !== 'RASENGAN_DASH') {
      this.vfx.setSpeedLines(0);
    }

    let targetSpeed = this.speed * sprintMult * (this.isKyuubiMode ? 1.45 : 1.0);

    // Check Wall Collision for Chakra Wall Running!
    let wallCheck = { hit: false };
    if (city && city.checkWall) {
      wallCheck = city.checkWall(this.position, 0.85);
    }

    // Trigger Chakra Wall Running when moving into a building wall! (Forbidden for giant Kurama)
    if (!this.isKyuubiMode && wallCheck.hit && isMoving && this.position.y < wallCheck.roofY - 0.25) {
      this.isWallRunning = true;
      this.state = 'WALL_RUN';
      this.wallRoofY = wallCheck.roofY;

      // Smoothly orient body to face directly into the wall surface
      const targetWallYaw = Math.atan2(-wallCheck.wallNormal.x, -wallCheck.wallNormal.z);
      let wallAngleDiff = targetWallYaw - this.rotationY;
      while (wallAngleDiff > Math.PI) wallAngleDiff -= Math.PI * 2;
      while (wallAngleDiff < -Math.PI) wallAngleDiff += Math.PI * 2;
      this.rotationY += wallAngleDiff * Math.min(1.0, 24 * dt);

      // Fast vertical climb velocity straight UP (NO velocity pushing inside the building!)
      const climbSpeed = targetSpeed * 1.15;
      this.velocity.y = climbSpeed;
      this.velocity.x = 0;
      this.velocity.z = 0;

      // Player movement inputs in world space for lateral wall navigation
      const inputAngle = Math.atan2(moveX, moveZ);
      const moveDirAngle = cameraAngle + inputAngle;
      const moveDirX = Math.sin(moveDirAngle);
      const moveDirZ = Math.cos(moveDirAngle);

      // Lock Naruto's position strictly so feet are planted right on the wall / cylinder surface
      if (wallCheck.shape === 'cylinder') {
        // Direction from cylinder center to player:
        let dx = this.position.x - wallCheck.centerX;
        let dz = this.position.z - wallCheck.centerZ;
        let curDist = Math.sqrt(dx * dx + dz * dz) || 1;

        // Tangent vector along circular cylinder circumference
        const tangX = -dz / curDist;
        const tangZ = dx / curDist;

        // Lateral steering around the circular tree trunk or round tower!
        const lateralIntent = moveDirX * tangX + moveDirZ * tangZ;
        const circSpeed = lateralIntent * targetSpeed * 0.7;
        this.position.x += tangX * circSpeed * dt;
        this.position.z += tangZ * circSpeed * dt;

        // Strictly re-project to circle radius so feet hug the trunk bark / curved wall without floating
        dx = this.position.x - wallCheck.centerX;
        dz = this.position.z - wallCheck.centerZ;
        curDist = Math.sqrt(dx * dx + dz * dz) || 1;
        const surfaceOffset = wallCheck.radius + 0.14;
        this.position.x = wallCheck.centerX + (dx / curDist) * surfaceOffset;
        this.position.z = wallCheck.centerZ + (dz / curDist) * surfaceOffset;
      } else {
        if (wallCheck.axis === 'x') {
          this.position.x = wallCheck.wallPos + wallCheck.wallNormal.x * 0.14;
          this.position.z += moveDirZ * targetSpeed * 0.7 * dt;
          if (wallCheck.building) {
            this.position.z = Math.max(wallCheck.building.minZ + 0.15, Math.min(wallCheck.building.maxZ - 0.15, this.position.z));
          }
        } else if (wallCheck.axis === 'z') {
          this.position.z = wallCheck.wallPos + wallCheck.wallNormal.z * 0.14;
          this.position.x += moveDirX * targetSpeed * 0.7 * dt;
          if (wallCheck.building) {
            this.position.x = Math.max(wallCheck.building.minX + 0.15, Math.min(wallCheck.building.maxX - 0.15, this.position.x));
          }
        }
      }

      // Pulse bright cyan Chakra Soles
      const solePulse = 0.85 + Math.sin(performance.now() * 0.02) * 0.15;
      if (this.leftChakraSole) this.leftChakraSole.material.opacity = solePulse;
      if (this.rightChakraSole) this.rightChakraSole.material.opacity = solePulse;

      // Advance runCycle dynamically so the wall-running animation vigorously pumps legs!
      this.runCycle += dt * targetSpeed * 1.35;

      // Periodic alternating wall footsteps smoke puffs from each foot impact
      const sinWall = Math.sin(this.runCycle * 1.8);
      if ((sinWall > 0.85 && this.lastSinWall <= 0.85) || (sinWall < -0.85 && this.lastSinWall >= -0.85)) {
        const isLeft = sinWall > 0;
        const footPos = this.position.clone();
        if (wallCheck.shape === 'cylinder') {
          const tangX = -wallCheck.wallNormal.z;
          const tangZ = wallCheck.wallNormal.x;
          footPos.x += tangX * (isLeft ? -0.2 : 0.2);
          footPos.z += tangZ * (isLeft ? -0.2 : 0.2);
        } else if (wallCheck.axis === 'x') {
          footPos.x = wallCheck.wallPos;
          footPos.z += isLeft ? -0.2 : 0.2;
        } else {
          footPos.z = wallCheck.wallPos;
          footPos.x += isLeft ? -0.2 : 0.2;
        }
        footPos.y += 0.2;
        this.vfx.spawnWallPuff(footPos, wallCheck.wallNormal);
        this.vfx.spawnChakraAuraWisp(footPos, false);
      }
      this.lastSinWall = sinWall;

      // Wall-Kick / Eject with Space (Acrobatic backflip off the wall)
      if (spaceJustPressed && this.wallKickCooldown <= 0) {
        this.wallKickCooldown = 0.5;
        sound.playDash();
        this.isWallRunning = false;
        this.isGrounded = false;
        this.canDoubleJump = true; // Allow double jump after kicking off wall
        this.state = 'JUMP';
        this.airFlipTimer = 0.6; // Backflip rotation in air
        this.velocity.y = this.jumpForce * 1.25;
        this.velocity.x = wallCheck.wallNormal.x * 14.0;
        this.velocity.z = wallCheck.wallNormal.z * 14.0;
        this.position.x += wallCheck.wallNormal.x * 0.5;
        this.position.z += wallCheck.wallNormal.z * 0.5;
        this.vfx.spawnSmokePoof(this.position, 16, 0.9);
        this.vfx.spawnWallPuff(this.position, wallCheck.wallNormal);
      }

      // Reached the roof ledge? Smoothly vault onto the roof!
      if (this.position.y >= wallCheck.roofY - 0.25) {
        this.isWallRunning = false;
        const forward = wallCheck.wallNormal.clone().negate();
        this.position.x += forward.x * 1.35;
        this.position.z += forward.z * 1.35;
        const roofLandY = (city && city.getGroundHeight) ? city.getGroundHeight(this.position.x, this.position.z, wallCheck.roofY + 0.8) : wallCheck.roofY;
        this.position.y = Math.max(roofLandY, wallCheck.roofY + 0.45);
        this.velocity.x = forward.x * 7.5;
        this.velocity.z = forward.z * 7.5;
        this.velocity.y = 2.4;
        this.isGrounded = true;
        this.canDoubleJump = true;
        this.doubleFlipTimer = 0;
        this.state = 'RUN';
        this.vfx.spawnLandingDust(this.position, 7);
      }
    } else {
      this.isWallRunning = false;
      const soleSprint = this.isSprinting ? 0.75 : 0;
      if (this.leftChakraSole) this.leftChakraSole.material.opacity = Math.max(0, THREE.MathUtils.lerp(this.leftChakraSole.material.opacity, soleSprint, Math.min(1.0, 10 * dt)));
      if (this.rightChakraSole) this.rightChakraSole.material.opacity = Math.max(0, THREE.MathUtils.lerp(this.rightChakraSole.material.opacity, soleSprint, Math.min(1.0, 10 * dt)));
    }

    // Normal Horizontal Ground Movement (Smooth acceleration, turn banking & footstep dust)
    if (isMoving && !this.isAttacking && !this.isWallRunning) {
      const inputAngle = Math.atan2(moveX, moveZ);
      this.targetRotationY = cameraAngle + inputAngle;

      let angleDiff = this.targetRotationY - this.rotationY;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      this.rotationY += angleDiff * Math.min(1.0, 16 * dt);

      // Smooth banking lean into turns
      this.bankAngle = THREE.MathUtils.damp(this.bankAngle, -angleDiff * 0.42, 12, dt);

      // Smooth responsive acceleration with organic ease
      const desiredVx = Math.sin(this.targetRotationY) * targetSpeed;
      const desiredVz = Math.cos(this.targetRotationY) * targetSpeed;
      const accel = this.isGrounded ? 18.0 : 7.0;
      this.velocity.x += (desiredVx - this.velocity.x) * Math.min(1.0, accel * dt);
      this.velocity.z += (desiredVz - this.velocity.z) * Math.min(1.0, accel * dt);

      if (this.isGrounded) {
        this.state = 'RUN';

        // Sprint kick-off smoke burst when starting to run
        if (!this.wasMoving) {
          this.vfx.spawnFootstepDust(this.position, 1.4);
        }

        // Alternating footstep smoke puffs during sprint
        this.runCycle += dt * targetSpeed * (this.isSprinting ? 1.25 : 0.95);
        const sinRun = Math.sin(this.runCycle);
        if ((sinRun > 0.85 && this.lastSinRun <= 0.85) || (sinRun < -0.85 && this.lastSinRun >= -0.85)) {
          const isLeft = sinRun > 0;
          const footOffset = new THREE.Vector3(
            isLeft ? -0.22 : 0.22,
            0.05,
            -0.12
          ).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationY);
          const dustScale = this.isSprinting ? 1.35 : 0.88;
          this.vfx.spawnFootstepDust(this.position.clone().add(footOffset), dustScale);
        }
        this.lastSinRun = sinRun;
      }
    } else if (this.state !== 'RASENGAN_DASH' && !this.isAttacking && !this.isWallRunning) {
      // Smooth natural deceleration damping
      const friction = this.isGrounded ? 13.0 : 3.5;
      this.velocity.x += (0 - this.velocity.x) * Math.min(1.0, friction * dt);
      this.velocity.z += (0 - this.velocity.z) * Math.min(1.0, friction * dt);
      this.bankAngle = THREE.MathUtils.damp(this.bankAngle, 0, 14, dt);
      if (this.isGrounded && !this.isChargingChakra) {
        this.state = 'IDLE';
      }
    } else if (this.isAttacking && !this.isWallRunning && this.state !== 'RASENGAN_DASH') {
      // Attack deceleration damping: prevents runaway acceleration while keeping punch/slide momentum organic!
      if (this.attackMode === 'RUN_ATTACK') {
        const slideFriction = this.isGrounded ? (this.runAttackStep === 1 ? 4.6 : 5.6) : 2.6;
        this.velocity.x += (0 - this.velocity.x) * Math.min(1.0, slideFriction * dt);
        this.velocity.z += (0 - this.velocity.z) * Math.min(1.0, slideFriction * dt);

        // While sliding in Move 1, spawn continuous slide dust on the ground
        if (this.runAttackStep === 1 && this.isGrounded && Math.random() < 0.45) {
          this.vfx.spawnFootstepDust(this.position, 1.25);
        }
      } else {
        // Standing attack: crisp martial arts step that settles quickly into the strike stance
        const standFriction = this.isGrounded ? 15.0 : 4.0;
        this.velocity.x += (0 - this.velocity.x) * Math.min(1.0, standFriction * dt);
        this.velocity.z += (0 - this.velocity.z) * Math.min(1.0, standFriction * dt);
      }
      this.bankAngle = THREE.MathUtils.damp(this.bankAngle, 0, 14, dt);
    }
    this.wasMoving = isMoving;

    // Jump & Double Jump System with Frontflip Somersault
    if (spaceJustPressed && !this.isChargingChakra && this.state !== 'RASENGAN_DASH' && !this.isWallRunning) {
      if (this.isGrounded) {
        // Ground / Rooftop Jump
        this.velocity.y = this.isKyuubiMode ? this.jumpForce * 1.15 : this.jumpForce;
        this.isGrounded = false;
        this.canDoubleJump = !this.isKyuubiMode; // Colossal Kurama does heavy leaps, no ninja flips
        this.state = 'JUMP';
        this.jumpFlipTriggered = true;
        if (this.isKyuubiMode) {
          sound.playHeavyPawThud();
          if (this.vfx && this.vfx.spawnKuramaFootstepShockwave) {
            this.vfx.spawnKuramaFootstepShockwave(this.position);
          }
        } else {
          this.vfx.spawnFootstepDust(this.position, 1.35);
          sound.playDash();
        }
      } else if (this.canDoubleJump && !this.isKyuubiMode) {
        // Mid-air Double Jump with 360° Frontflip Somersault (Кувырок в воздухе)
        this.canDoubleJump = false;
        this.state = 'JUMP';
        this.doubleFlipTimer = 0.48;
        this.jumpFlipTriggered = true;
        this.velocity.y = this.jumpForce * 1.18;

        if (isMoving) {
          const inputAngle = Math.atan2(moveX, moveZ);
          const jumpYaw = cameraAngle + inputAngle;
          this.rotationY = jumpYaw;
          const airPush = this.speed * (this.isSprinting ? 1.45 : 1.15);
          this.velocity.x = Math.sin(jumpYaw) * airPush;
          this.velocity.z = Math.cos(jumpYaw) * airPush;
        }

        const footPos = this.position.clone().setY(this.position.y - 0.2);
        if (this.vfx.spawnDoubleJumpEffect) {
          this.vfx.spawnDoubleJumpEffect(footPos);
        } else {
          this.vfx.spawnSmokePoof(footPos, 14, 0.85);
        }
        sound.playDash();
      }
    }

    // Gravity applied when not wall-running
    if (!this.isGrounded && !this.isWallRunning) {
      this.velocity.y -= this.gravity * dt;
    }

    // Apply Velocity
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
    this.position.z += this.velocity.z * dt;

    // Solid collision with buildings: if NOT wall-running, resolve building collision so player NEVER penetrates inside!
    const charRadius = this.isKyuubiMode ? 1.9 : 0.55;
    if (!this.isWallRunning && city && city.resolveCollision) {
      city.resolveCollision(this.position, charRadius);
      if (this.isKyuubiMode) {
        // Multi-pass resolution for giant model ensures smooth sliding around building corners
        city.resolveCollision(this.position, charRadius);
      }
    }

    // Rooftop & Terrain Height System
    const groundHeight = city && city.getGroundHeight ? city.getGroundHeight(this.position.x, this.position.z, this.position.y) : 0;
    this.currentGroundY = groundHeight;

    if (this.position.y <= groundHeight) {
      this.position.y = groundHeight;
      this.velocity.y = 0;
      if (!this.isGrounded) {
        this.isGrounded = true;
        this.canDoubleJump = !this.isKyuubiMode;
        this.doubleFlipTimer = 0;
        this.jumpFlipTriggered = false;
        if (this.isKyuubiMode) {
          sound.playHeavyPawThud();
          if (this.vfx && this.vfx.spawnKuramaFootstepShockwave) {
            this.vfx.spawnKuramaFootstepShockwave(this.position);
          }
        } else {
          this.vfx.spawnLandingDust(this.position, 8);
        }
        if (this.isAttacking && this.attackMode === 'AIR_ATTACK') {
          if (this.vfx && this.vfx.spawnKatanaGroundSlam) {
            this.vfx.spawnKatanaGroundSlam(this.position);
          }
          sound.playKatanaHit(true);
        }
      }
    } else if (this.position.y > groundHeight + 0.3 && !this.isWallRunning) {
      this.isGrounded = false;
    }
    this.wasGrounded = this.isGrounded;

    // Clamp inside Konoha borders (only when not wall running)
    if (!this.isWallRunning && city && city.clampPosition) {
      city.clampPosition(this.position, charRadius);
    }

    // Smooth dynamic pitch angle for wall running: tilts body so feet are planted on wall and upper body/belly are held out in open air!
    const targetPitch = this.isWallRunning ? -0.72 : 0;
    this.pitchAngle = THREE.MathUtils.damp(this.pitchAngle, targetPitch, 16, dt);

    this.group.position.copy(this.position);
    this.group.rotation.set(this.pitchAngle, this.rotationY, 0, 'YXZ');

    if (this.isKyuubiMode && this.kuramaGroup) {
      this.group.visible = false;
      this.kuramaGroup.visible = true;
      this.kuramaGroup.position.copy(this.position);
      this.kuramaGroup.rotation.set(0, this.rotationY, 0);

      this.updateKuramaAnimation(dt);
      return;
    } else if (this.kuramaGroup) {
      this.kuramaGroup.visible = false;
      this.group.visible = true;
    }

    // Animated Naruto 3D Model Integration (naruto_animaciones.glb)
    if (this.isNarutoAnimatedLoaded && this.narutoAnimatedGroup) {
      // 360° Mid-Air Frontflip Somersault (Кувырок в воздухе)
      // When double jump is active (doubleFlipTimer > 0), roll full 360° forward around X axis
      const flipPitch = (this.doubleFlipTimer > 0) ? Math.PI * 2 * (1.0 - this.doubleFlipTimer / 0.48) : 0;
      this.narutoAnimatedGroup.rotation.x = flipPitch;
      this.narutoAnimatedGroup.rotation.z = this.bankAngle;

      this.updateNarutoAnimation(dt);
      return;
    }

    // Procedural Rig Animation with Smooth Blending (fallback)
    this.animateRig(dt);
  }

  animateRig(dt) {
    const time = performance.now() * 0.006;
    const runFreq = this.runCycle;
    const target = this.boneTargets;

    // Secondary animation: Headband tails flutter dynamically with wind & velocity
    const horizSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    const tailFlutter = Math.sin(time * 5.5) * (0.22 + horizSpeed * 0.035);
    this.rig.headbandTails.rotation.x = THREE.MathUtils.lerp(
      this.rig.headbandTails.rotation.x,
      tailFlutter,
      Math.min(1.0, 16 * dt)
    );

    if (this.isAttacking) {
      if (this.equippedWeapon === 'KATANA') {
        if (this.attackMode === 'AIR_ATTACK') {
          this.animateKatanaAirPose(this.attackProgress);
        } else if (this.attackMode === 'RUN_ATTACK') {
          this.animateKatanaSprintPose(this.attackProgress, this.katanaSprintStep);
        } else {
          this.animateKatanaComboPose(this.attackProgress, this.katanaComboStep);
        }
      } else {
        if (this.attackMode === 'RUN_ATTACK') {
          this.animateRunningAttackPose(this.attackProgress, this.runAttackStep);
        } else {
          this.animateAttackPose(this.attackProgress, this.comboStep);
        }
      }
      this.applyRigSmoothing(dt);
      return;
    }

    if (this.isWallRunning) {
      // Iconic Naruto Ninja Wall-Run: High-speed athletic leg pump, streamlined arms, dynamic stride bob
      const wallFreq = runFreq * 1.8;
      const bob = Math.abs(Math.sin(wallFreq)) * 0.06;
      target.torso.pos.set(0, 1.12 + bob, 0);
      target.torso.rot.set(0.22, 0, 0); // Spine curvature
      target.head.rot.set(-0.35, 0, 0); // Head looks up towards roof ledge

      // Iconic Naruto Run arms streamlined straight back with wind flutter
      const armFlutter = Math.sin(time * 11) * 0.05;
      const wallArmBack = 0.62;
      target.leftArm.rot.set(wallArmBack + armFlutter, 0, -0.20);
      target.leftForearm.rot.set(0.08, 0, 0);
      target.rightArm.rot.set(wallArmBack - armFlutter, 0, 0.20);
      target.rightForearm.rot.set(0.08, 0, 0);

      // Deep athletic leg sprint cycle against the wall surface
      const sinWall = Math.sin(wallFreq);
      const cosWall = Math.cos(wallFreq);
      target.leftLeg.rot.set(-sinWall * 0.85, 0, 0);
      target.leftShin.rot.set(sinWall < 0 ? (-sinWall) * 1.35 : Math.max(0, cosWall) * 0.45, 0, 0);

      target.rightLeg.rot.set(sinWall * 0.85, 0, 0);
      target.rightShin.rot.set(sinWall > 0 ? sinWall * 1.35 : Math.max(0, -cosWall) * 0.45, 0, 0);

    } else if (this.state === 'RUN') {
      // The Iconic Naruto Ninja Run with dynamic lean & arms trailing straight behind
      const isSprint = this.isSprinting;
      const bob = Math.abs(Math.sin(runFreq)) * (isSprint ? 0.05 : 0.04);
      const torsoLean = isSprint ? 0.48 : 0.36;
      target.torso.pos.set(0, (isSprint ? 1.10 : 1.14) + bob, 0);
      target.torso.rot.set(torsoLean, 0, this.bankAngle);
      target.head.rot.set(isSprint ? -0.26 : -0.18, 0, 0);

      // Arms locked aerodynamically behind the back with high-frequency wind flutter
      const flutterRate = isSprint ? 14 : 9;
      const flutterAmp = isSprint ? 0.04 : 0.03;
      const armFlutter = Math.sin(time * flutterRate) * flutterAmp;
      const armBackAngle = isSprint ? 0.72 : 0.55;
      const armSpread = isSprint ? 0.24 : 0.18;

      target.leftArm.rot.set(armBackAngle + armFlutter, 0, -armSpread);
      target.leftForearm.rot.set(0.08, 0, 0);
      target.rightArm.rot.set(armBackAngle - armFlutter, 0, armSpread);
      target.rightForearm.rot.set(0.08, 0, 0);

      // Dynamic athletic leg strides with natural knee flexion and ground clearance
      const legSwing = isSprint ? 0.85 : 0.65;
      const shinBend = isSprint ? 1.40 : 1.15;
      const sinLeg = Math.sin(runFreq);
      const cosLeg = Math.cos(runFreq);

      target.leftLeg.rot.set(-sinLeg * legSwing, 0, 0);
      target.leftShin.rot.set(sinLeg < 0 ? (-sinLeg) * shinBend : Math.max(0, cosLeg) * 0.40, 0, 0);

      target.rightLeg.rot.set(sinLeg * legSwing, 0, 0);
      target.rightShin.rot.set(sinLeg > 0 ? sinLeg * shinBend : Math.max(0, -cosLeg) * 0.40, 0, 0);

    } else if (this.state === 'JUMP') {
      target.torso.pos.set(0, 1.15, 0);
      if (this.doubleFlipTimer > 0) {
        // Acrobatic 360-degree frontflip somersault (Кувырок вперед в воздухе)
        const flipProgress = 1.0 - (this.doubleFlipTimer / 0.48);
        const flipAngle = Math.PI * 2 * flipProgress;
        target.torso.rot.set(flipAngle, 0, 0);

        if (flipProgress < 0.75) {
          // Compact ninja somersault ball tuck pose
          target.head.rot.set(0.45, 0, 0);
          target.leftArm.rot.set(0.65, 0, -0.30);
          target.leftForearm.rot.set(0.9, 0, 0);
          target.rightArm.rot.set(0.65, 0, 0.30);
          target.rightForearm.rot.set(0.9, 0, 0);
          target.leftLeg.rot.set(-1.2, 0, 0);
          target.leftShin.rot.set(1.6, 0, 0);
          target.rightLeg.rot.set(-1.2, 0, 0);
          target.rightShin.rot.set(1.6, 0, 0);
        } else {
          // Snap out cleanly into landing ready stance
          target.head.rot.set(-0.20, 0, 0);
          target.leftArm.rot.set(0.55, 0, -0.32);
          target.leftForearm.rot.set(0.2, 0, 0);
          target.rightArm.rot.set(0.55, 0, 0.32);
          target.rightForearm.rot.set(0.2, 0, 0);
          target.leftLeg.rot.set(-0.4, 0, 0);
          target.leftShin.rot.set(0.8, 0, 0);
          target.rightLeg.rot.set(-0.2, 0, 0);
          target.rightShin.rot.set(0.5, 0, 0);
        }
      } else if (this.airFlipTimer > 0) {
        // Acrobatic backflip rotation off wall kick
        const flipProgress = 1.0 - (this.airFlipTimer / 0.6);
        target.torso.rot.set(-Math.PI * 2 * flipProgress, 0, 0);
        target.head.rot.set(-0.25, 0, 0);
        target.leftArm.rot.set(0.55, 0, -0.35);
        target.leftForearm.rot.set(0.2, 0, 0);
        target.rightArm.rot.set(0.55, 0, 0.35);
        target.rightForearm.rot.set(0.2, 0, 0);
        target.leftLeg.rot.set(-0.65, 0, 0);
        target.leftShin.rot.set(1.15, 0, 0);
        target.rightLeg.rot.set(-0.35, 0, 0);
        target.rightShin.rot.set(0.85, 0, 0);
      } else {
        target.torso.rot.set(0.25, 0, 0);
        target.head.rot.set(-0.20, 0, 0);
        target.leftArm.rot.set(0.55, 0, -0.32);
        target.leftForearm.rot.set(0.15, 0, 0);
        target.rightArm.rot.set(0.55, 0, 0.32);
        target.rightForearm.rot.set(0.15, 0, 0);
        target.leftLeg.rot.set(-0.45, 0, -0.08);
        target.leftShin.rot.set(0.85, 0, 0);
        target.rightLeg.rot.set(0.25, 0, 0.08);
        target.rightShin.rot.set(0.45, 0, 0);
      }

    } else if (this.state === 'CHARGE_CHAKRA') {
      target.torso.pos.set(0, 1.05, 0);
      target.torso.rot.set(0.18, 0, 0);
      target.head.rot.set(0.2, 0, 0);
      target.leftArm.rot.set(0.8, 0.4, -0.5);
      target.rightArm.rot.set(0.8, -0.4, 0.5);
      target.leftForearm.rot.set(0.7, 0, 0);
      target.rightForearm.rot.set(0.7, 0, 0);
      target.leftLeg.rot.set(0.15, 0, -0.12);
      target.rightLeg.rot.set(0.15, 0, 0.12);

    } else if (this.state === 'RASENGAN_DASH') {
      target.torso.pos.set(0, 1.10, 0);
      target.torso.rot.set(0.40, 0, 0);
      target.head.rot.set(-0.25, 0, 0);
      target.rightArm.rot.set(-1.15, -0.15, 0.12);
      target.rightForearm.rot.set(0.30, 0, 0);
      target.leftArm.rot.set(0.55, 0, -0.25);
      target.leftForearm.rot.set(0.10, 0, 0);
      const sinDash = Math.sin(runFreq * 1.4);
      const cosDash = Math.cos(runFreq * 1.4);
      target.leftLeg.rot.set(-sinDash * 0.85, 0, 0);
      target.leftShin.rot.set(sinDash < 0 ? (-sinDash) * 1.35 : Math.max(0, cosDash) * 0.40, 0, 0);
      target.rightLeg.rot.set(sinDash * 0.85, 0, 0);
      target.rightShin.rot.set(sinDash > 0 ? sinDash * 1.35 : Math.max(0, -cosDash) * 0.40, 0, 0);

    } else {
      if (this.equippedWeapon === 'KATANA') {
        // Authentic Kenjutsu Ready Stance (Chūdan-no-kamae): poised two-handed forward blade guard
        const breath = Math.sin(time * 2.2) * 0.024;
        target.torso.pos.set(0, 1.15 + breath, 0);
        target.torso.rot.set(0.06, -0.22, 0); // 3/4 combat angle
        target.head.rot.set(Math.sin(time * 1.3) * 0.02, 0.22, 0); // Eyes locked forward

        // Right arm holding blade forward in classic samurai guard
        target.rightArm.rot.set(-0.62, -0.24, -0.22);
        target.rightForearm.rot.set(-0.58, 0, 0);

        // Left hand near hilt supporting in two-handed grip ready position
        target.leftArm.rot.set(-0.48, 0.28, 0.32);
        target.leftForearm.rot.set(-0.72, 0, 0);

        // Solid, poised ninja stance
        target.leftLeg.rot.set(0.16, 0, -0.10);
        target.leftShin.rot.set(0.12, 0, 0);
        target.rightLeg.rot.set(-0.22, 0, 0.10);
        target.rightShin.rot.set(0.15, 0, 0);
      } else {
        // IDLE: Organic breathing and subtle living stance
        const breath = Math.sin(time * 2.2) * 0.025;
        target.torso.pos.set(0, 1.15 + breath, 0);
        target.torso.rot.set(0, 0, 0);
        target.head.rot.set(Math.sin(time * 1.3) * 0.03, Math.sin(time * 0.8) * 0.04, 0);

        target.leftArm.rot.set(0.04, 0, -0.12 - breath * 0.2);
        target.leftForearm.rot.set(0.10, 0, 0);
        target.rightArm.rot.set(0.04, 0, 0.12 + breath * 0.2);
        target.rightForearm.rot.set(0.10, 0, 0);

        target.leftLeg.rot.set(0, 0, -0.06);
        target.leftShin.rot.set(0, 0, 0);
        target.rightLeg.rot.set(0, 0, 0.06);
        target.rightShin.rot.set(0, 0, 0);
      }
    }

    this.applyRigSmoothing(dt);
  }

  smoothstep(min, max, val) {
    const x = Math.max(0, Math.min(1, (val - min) / (max - min)));
    return x * x * (3 - 2 * x);
  }

  applyRigSmoothing(dt) {
    const speed = this.isAttacking ? 22.0 : 16.0;
    const t = Math.min(1.0, speed * dt);

    for (const [name, target] of Object.entries(this.boneTargets)) {
      const bone = this.rig[name];
      if (!bone || !target) continue;

      bone.rotation.x += (target.rot.x - bone.rotation.x) * t;
      bone.rotation.y += (target.rot.y - bone.rotation.y) * t;
      bone.rotation.z += (target.rot.z - bone.rotation.z) * t;

      if (target.pos) {
        bone.position.x += (target.pos.x - bone.position.x) * t;
        bone.position.y += (target.pos.y - bone.position.y) * t;
        bone.position.z += (target.pos.z - bone.position.z) * t;
      }
    }
  }

  animateAttackPose(p, step) {
    const target = this.boneTargets;

    if (step === 1) {
      // Step 1: Left Lead Jab / Hook with full forward extension & hip rotation
      if (p < 0.25) {
        const w = p / 0.25;
        target.torso.rot.set(-0.06 * w, -0.32 * w, 0);
        target.torso.pos.set(0, 1.15, -0.05 * w);
        target.leftArm.rot.set(-0.35 * w, -0.2 * w, 0.25 * w);
        target.leftForearm.rot.set(1.25 * w, 0, 0);
        target.rightArm.rot.set(-0.65 * w, 0.1 * w, -0.25 * w);
        target.rightForearm.rot.set(1.15 * w, 0, 0);
        target.leftLeg.rot.set(0.3 * w, 0, 0);
        target.leftShin.rot.set(0.35 * w, 0, 0);
        target.rightLeg.rot.set(-0.25 * w, 0, 0);
        target.head.rot.set(-0.05 * w, 0.2 * w, 0);
      } else if (p < 0.65) {
        const s = (p - 0.25) / 0.40;
        const strikeCurve = Math.sin(s * Math.PI);
        target.torso.rot.set(0.22 * Math.sin(s * Math.PI * 0.5), -0.32 + 0.92 * s, 0);
        target.torso.pos.set(0, 1.15 - 0.03 * strikeCurve, 0.35 * strikeCurve);
        target.leftArm.rot.set(-1.54 - 0.12 * strikeCurve, 0.12 * s, -0.10 * s);
        target.leftForearm.rot.set(0.08 * (1 - s), 0, 0);
        target.rightArm.rot.set(0.15 * s, 0, -0.28);
        target.rightForearm.rot.set(0.95, 0, 0);
        target.leftLeg.rot.set(0.4, 0, 0);
        target.leftShin.rot.set(0.4, 0, 0);
        target.rightLeg.rot.set(-0.4, 0, 0);
        target.rightShin.rot.set(0.1, 0, 0);
        target.head.rot.set(-0.15 * strikeCurve, -0.25 * s, 0);
      } else {
        const r = (p - 0.65) / 0.35;
        const rec = 1 - r;
        target.torso.rot.set(0.22 * rec, 0.60 * rec, 0);
        target.torso.pos.set(0, 1.15, 0.35 * rec);
        target.leftArm.rot.set(-1.54 * rec + 0.18 * r, 0.12 * rec, -0.10 * rec + 0.18 * r);
        target.leftForearm.rot.set(0.08 * rec + 0.35 * r, 0, 0);
        target.rightArm.rot.set(0.15 * rec + 0.18 * r, 0, -0.28 * rec - 0.18 * r);
        target.rightForearm.rot.set(0.95 * rec + 0.35 * r, 0, 0);
        target.leftLeg.rot.set(0.4 * rec, 0, 0.08);
        target.rightLeg.rot.set(-0.4 * rec, 0, -0.08);
        target.head.rot.set(-0.15 * rec, -0.25 * rec, 0);
      }

    } else if (step === 2) {
      // Step 2: Right Power Cross with deep torso wind-up and heavy forward punch
      if (p < 0.25) {
        const w = p / 0.25;
        target.torso.rot.set(-0.06 * w, 0.48 * w, 0);
        target.torso.pos.set(0, 1.15, -0.06 * w);
        target.rightArm.rot.set(-0.38 * w, -0.35 * w, -0.35 * w);
        target.rightForearm.rot.set(1.35 * w, 0, 0);
        target.leftArm.rot.set(-0.75 * w, 0, 0.25 * w);
        target.leftForearm.rot.set(0.95 * w, 0, 0);
        target.rightLeg.rot.set(-0.35 * w, 0, 0);
        target.rightShin.rot.set(0.35 * w, 0, 0);
        target.leftLeg.rot.set(0.3 * w, 0, 0);
        target.head.rot.set(-0.05 * w, -0.25 * w, 0);
      } else if (p < 0.65) {
        const s = (p - 0.25) / 0.40;
        const strikeCurve = Math.sin(s * Math.PI);
        target.torso.rot.set(0.24 * Math.sin(s * Math.PI * 0.5), 0.48 - 1.15 * s, 0);
        target.torso.pos.set(0, 1.15 - 0.03 * strikeCurve, 0.42 * strikeCurve);
        target.rightArm.rot.set(-1.58 - 0.15 * strikeCurve, -0.15 * s, 0.10 * s);
        target.rightForearm.rot.set(0.06 * (1 - s), 0, 0);
        target.leftArm.rot.set(0.20 * s, 0, 0.32);
        target.leftForearm.rot.set(0.85, 0, 0);
        target.rightLeg.rot.set(-0.45, 0, 0);
        target.rightShin.rot.set(0.25, 0, 0);
        target.leftLeg.rot.set(0.45, 0, 0);
        target.leftShin.rot.set(0.35, 0, 0);
        target.head.rot.set(-0.15 * strikeCurve, 0.35 * s, 0);
      } else {
        const r = (p - 0.65) / 0.35;
        const rec = 1 - r;
        target.torso.rot.set(0.24 * rec, -0.67 * rec, 0);
        target.torso.pos.set(0, 1.15, 0.42 * rec);
        target.rightArm.rot.set(-1.58 * rec + 0.18 * r, -0.15 * rec, 0.10 * rec - 0.18 * r);
        target.rightForearm.rot.set(0.06 * rec + 0.35 * r, 0, 0);
        target.leftArm.rot.set(0.20 * rec + 0.18 * r, 0, 0.32 * rec + 0.18 * r);
        target.leftForearm.rot.set(0.85 * rec + 0.35 * r, 0, 0);
        target.head.rot.set(-0.15 * rec, 0.35 * rec, 0);
      }

    } else if (step === 3) {
      // Step 3: Spinning 360° Whirlwind Crescent Roundhouse Kick
      const spinAngle = -Math.PI * 2 * p;
      const kickP = Math.sin(p * Math.PI);
      target.torso.rot.set(0.14 * kickP, spinAngle, 0);
      target.torso.pos.set(0, 1.15 + 0.24 * kickP, 0.25 * kickP);
      target.rightLeg.rot.set(-1.58 * kickP, 0, -1.25 * kickP);
      target.rightShin.rot.set(0.08, 0, 0);
      target.leftLeg.rot.set(0.25 * kickP, 0, 0);
      target.leftShin.rot.set(0.45 * kickP, 0, 0);
      target.leftArm.rot.set(-0.68, 0, 0.72);
      target.leftForearm.rot.set(0.35, 0, 0);
      target.rightArm.rot.set(-0.68, 0, -0.72);
      target.rightForearm.rot.set(0.35, 0, 0);
      target.head.rot.set(-0.1, 0, 0);

    } else if (step === 4) {
      // Step 4: Rising Dragon Uppercut + Flying Knee Launch
      if (p < 0.24) {
        const w = p / 0.24;
        target.torso.pos.set(0, 1.15 - 0.22 * w, -0.06 * w);
        target.torso.rot.set(0.16 * w, 0.26 * w, 0);
        target.rightArm.rot.set(-0.25 * w, 0.2 * w, -0.2 * w);
        target.rightForearm.rot.set(1.42 * w, 0, 0);
        target.leftArm.rot.set(-0.55 * w, 0, 0.3 * w);
        target.leftForearm.rot.set(0.85 * w, 0, 0);
        target.leftLeg.rot.set(0.65 * w, 0, 0);
        target.leftShin.rot.set(0.85 * w, 0, 0);
        target.rightLeg.rot.set(0.65 * w, 0, 0);
        target.rightShin.rot.set(0.85 * w, 0, 0);
      } else if (p < 0.70) {
        const s = (p - 0.24) / 0.46;
        const launchY = Math.sin(s * Math.PI);
        target.torso.pos.set(0, 1.15 + 0.65 * launchY, 0.35 * s);
        target.torso.rot.set(-0.25 * s, -0.25 * s, 0);
        target.rightArm.rot.set(-2.22, -0.12, 0.16);
        target.rightForearm.rot.set(0.52, 0, 0);
        target.rightLeg.rot.set(-1.68 * launchY, 0, 0);
        target.rightShin.rot.set(1.60 * launchY, 0, 0);
        target.leftLeg.rot.set(0.15, 0, 0);
        target.leftShin.rot.set(0.12, 0, 0);
        target.leftArm.rot.set(0.45, 0, 0.3);
        target.leftForearm.rot.set(0.2, 0, 0);
        target.head.rot.set(-0.5, 0, 0);
      } else {
        const r = (p - 0.70) / 0.30;
        const rec = 1 - r;
        target.torso.pos.set(0, 1.15 + 0.65 * rec, 0.35 * rec);
        target.torso.rot.set(-0.25 * rec, -0.25 * rec, 0);
        target.rightArm.rot.set(-2.22 * rec + 0.18 * r, 0, -0.18 * r);
        target.rightForearm.rot.set(0.52 * rec + 0.35 * r, 0, 0);
        target.rightLeg.rot.set(-1.68 * rec, 0, -0.08 * r);
        target.rightShin.rot.set(1.60 * rec, 0, 0);
        target.head.rot.set(-0.5 * rec, 0, 0);
      }

    } else if (step === 5) {
      // Step 5: Uzumaki Finisher: High Flying Hammer Slam with Two-Handed Strike
      if (p < 0.40) {
        const w = p / 0.40;
        const leapY = Math.sin(w * Math.PI * 0.5);
        target.torso.pos.set(0, 1.15 + 1.1 * leapY, 0.25 * w);
        target.torso.rot.set(-0.25 * w, 0, 0);
        target.leftArm.rot.set(-2.28 * w, 0.15, -0.15);
        target.leftForearm.rot.set(0.38 * w, 0, 0);
        target.rightArm.rot.set(-2.28 * w, -0.15, 0.15);
        target.rightForearm.rot.set(0.38 * w, 0, 0);
        target.rightLeg.rot.set(-1.82 * w, 0, 0);
        target.rightShin.rot.set(0.15, 0, 0);
        target.leftLeg.rot.set(-0.65 * w, 0, 0);
        target.leftShin.rot.set(0.9 * w, 0, 0);
        target.head.rot.set(-0.35 * w, 0, 0);
      } else if (p < 0.72) {
        const s = (p - 0.40) / 0.32;
        const slamCurve = Math.sin(s * Math.PI);
        target.torso.pos.set(0, 1.15 + 1.1 * (1 - s) - 0.25 * slamCurve, 0.55 * s);
        target.torso.rot.set(-0.25 * (1 - s) + 0.68 * s, 0, 0);
        target.leftArm.rot.set(-0.48, 0, -0.12);
        target.leftForearm.rot.set(0.12, 0, 0);
        target.rightArm.rot.set(-0.48, 0, 0.12);
        target.rightForearm.rot.set(0.12, 0, 0);
        target.rightLeg.rot.set(0.55, 0, -0.2);
        target.rightShin.rot.set(0.7, 0, 0);
        target.leftLeg.rot.set(0.55, 0, 0.2);
        target.leftShin.rot.set(0.7, 0, 0);
        target.head.rot.set(0.25 * s, 0, 0);
      } else {
        const r = (p - 0.72) / 0.28;
        const rec = 1 - r;
        target.torso.pos.set(0, 1.15 - 0.25 * rec, 0.55 * rec);
        target.torso.rot.set(0.68 * rec, 0, 0);
        target.leftArm.rot.set(-0.48 * rec + 0.18 * r, 0, -0.12 * rec + 0.18 * r);
        target.leftForearm.rot.set(0.12 * rec + 0.35 * r, 0, 0);
        target.rightArm.rot.set(-0.48 * rec + 0.18 * r, 0, 0.12 * rec - 0.18 * r);
        target.rightForearm.rot.set(0.12 * rec + 0.35 * r, 0, 0);
        target.leftLeg.rot.set(0.55 * rec, 0, 0.08);
        target.rightLeg.rot.set(0.55 * rec, 0, -0.08);
        target.head.rot.set(0.25 * rec, 0, 0);
      }
    }
  }

  animateRunningAttackPose(p, step) {
    const target = this.boneTargets;

    if (step === 1) {
      // Run Attack 1: Low Shinobi Ground Slide Sweep Kick (Низкий подкат с подсечкой под врага)
      if (p < 0.65) {
        const s = p / 0.65;
        const slideCurve = Math.sin(s * Math.PI * 0.5);
        // Naruto drops low under enemy strikes
        target.torso.pos.set(0, 0.56 + 0.06 * (1 - slideCurve), 0.18 * slideCurve);
        target.torso.rot.set(-0.36, 0.28 * slideCurve, 0);
        target.head.rot.set(0.40, -0.20 * slideCurve, 0);

        // Right leg shoots out forward flat along the ground to sweep legs
        target.rightLeg.rot.set(-1.62, 0, -0.15);
        target.rightShin.rot.set(0.04, 0, 0);

        // Left leg folded neatly under hips
        target.leftLeg.rot.set(0.85, 0, 0.22);
        target.leftShin.rot.set(1.68, 0, 0);

        // Right arm trailing back touching ground for balance
        target.rightArm.rot.set(1.42, -0.22, -0.32);
        target.rightForearm.rot.set(0.12, 0, 0);

        // Left arm guarding chest and face
        target.leftArm.rot.set(-0.65, 0.25, 0.42);
        target.leftForearm.rot.set(1.25, 0, 0);
      } else {
        // Recovery: spring back up onto feet into run
        const r = (p - 0.65) / 0.35;
        const rec = 1 - r;
        target.torso.pos.set(0, 0.56 * rec + 1.05 * r, 0.18 * rec);
        target.torso.rot.set(-0.36 * rec + 0.68 * r, 0.28 * rec, 0);
        target.head.rot.set(0.40 * rec - 0.55 * r, -0.20 * rec, 0);

        target.rightLeg.rot.set(-1.62 * rec + 0.4 * r, 0, -0.15 * rec);
        target.rightShin.rot.set(0.04 * rec + 0.3 * r, 0, 0);

        target.leftLeg.rot.set(0.85 * rec - 0.4 * r, 0, 0.22 * rec);
        target.leftShin.rot.set(1.68 * rec + 0.2 * r, 0, 0);

        target.rightArm.rot.set(1.42 * rec + 1.55 * r, 0, -0.32 * rec - 0.22 * r);
        target.rightForearm.rot.set(0.12 * rec + 0.06 * r, 0, 0);

        target.leftArm.rot.set(-0.65 * rec + 1.55 * r, 0, 0.42 * rec + 0.22 * r);
        target.leftForearm.rot.set(1.25 * rec + 0.06 * r, 0, 0);
      }

    } else if (step === 2) {
      // Run Attack 2: Flying Dragon Dropkick (Удар двумя ногами в прыжке с налета)
      if (p < 0.72) {
        const s = p / 0.72;
        const airCurve = Math.sin(s * Math.PI);
        // Airborne horizontal dropkick pose
        target.torso.pos.set(0, 1.28 + 0.18 * airCurve, 0.30 * s);
        target.torso.rot.set(-0.58, 0, 0);
        target.head.rot.set(0.55, 0, 0);

        // Both legs thrust together straight forward
        target.rightLeg.rot.set(-1.68, 0, -0.08);
        target.rightShin.rot.set(0.05, 0, 0);
        target.leftLeg.rot.set(-1.68, 0, 0.08);
        target.leftShin.rot.set(0.05, 0, 0);

        // Arms swept outward like wings for momentum and aerodynamic balance
        target.rightArm.rot.set(1.38, -0.22, -0.58);
        target.rightForearm.rot.set(0.18, 0, 0);
        target.leftArm.rot.set(1.38, 0.22, 0.58);
        target.leftForearm.rot.set(0.18, 0, 0);
      } else {
        // Recovery: tuck legs for clean landing
        const r = (p - 0.72) / 0.28;
        const rec = 1 - r;
        target.torso.pos.set(0, 1.28 * rec + 1.05 * r, 0.30 * rec);
        target.torso.rot.set(-0.58 * rec + 0.68 * r, 0, 0);
        target.head.rot.set(0.55 * rec - 0.55 * r, 0, 0);

        target.rightLeg.rot.set(-1.68 * rec + 0.3 * r, 0, -0.08 * rec);
        target.rightShin.rot.set(0.05 * rec + 0.8 * r, 0, 0);
        target.leftLeg.rot.set(-1.68 * rec - 0.3 * r, 0, 0.08 * rec);
        target.leftShin.rot.set(0.05 * rec + 0.8 * r, 0, 0);

        target.rightArm.rot.set(1.38 * rec + 1.55 * r, 0, -0.58 * rec - 0.22 * r);
        target.rightForearm.rot.set(0.18 * rec + 0.06 * r, 0, 0);
        target.leftArm.rot.set(1.38 * rec + 1.55 * r, 0, 0.58 * rec + 0.22 * r);
        target.leftForearm.rot.set(0.18 * rec + 0.06 * r, 0, 0);
      }

    } else if (step === 3) {
      // Run Attack 3: High-Speed Chakra Palm Drive (Стремительный выпад ладонью с чакрой)
      if (p < 0.28) {
        const w = p / 0.28;
        // Deep forward coil & windup
        target.torso.pos.set(0, 1.02 - 0.08 * w, -0.05 * w);
        target.torso.rot.set(0.52 * w, -0.32 * w, 0);
        target.head.rot.set(-0.35 * w, 0.22 * w, 0);

        target.rightArm.rot.set(0.35 * w, 0.28 * w, -0.22 * w);
        target.rightForearm.rot.set(1.38 * w, 0, 0);
        target.leftArm.rot.set(1.48 * w, 0, 0.25 * w);
        target.leftForearm.rot.set(0.08 * w, 0, 0);

        target.leftLeg.rot.set(0.45 * w, 0, 0);
        target.leftShin.rot.set(0.65 * w, 0, 0);
        target.rightLeg.rot.set(-0.45 * w, 0, 0);
        target.rightShin.rot.set(0.25 * w, 0, 0);
      } else if (p < 0.68) {
        const s = (p - 0.28) / 0.40;
        const strikeCurve = Math.sin(s * Math.PI);
        // Explosive palm strike lunge
        target.torso.pos.set(0, 0.94, 0.45 * s);
        target.torso.rot.set(0.72, 0.28 * s, 0);
        target.head.rot.set(-0.55, -0.18 * s, 0);

        // Right palm thrusts forward like a spear
        target.rightArm.rot.set(-1.66 - 0.12 * strikeCurve, -0.16, 0.06);
        target.rightForearm.rot.set(0.04 * (1 - s), 0, 0);

        // Left arm locked straight behind
        target.leftArm.rot.set(1.72, 0, 0.22);
        target.leftForearm.rot.set(0.05, 0, 0);

        // Deep aggressive shinobi sprint stance
        target.leftLeg.rot.set(0.78, 0, 0);
        target.leftShin.rot.set(0.88, 0, 0);
        target.rightLeg.rot.set(-0.86, 0, 0);
        target.rightShin.rot.set(0.12, 0, 0);
      } else {
        // Recovery smoothly back to run
        const r = (p - 0.68) / 0.32;
        const rec = 1 - r;
        target.torso.pos.set(0, 0.94 * rec + 1.05 * r, 0.45 * rec);
        target.torso.rot.set(0.72 * rec + 0.68 * r, 0.28 * rec, 0);
        target.head.rot.set(-0.55 * rec - 0.55 * r, -0.18 * rec, 0);

        target.rightArm.rot.set(-1.66 * rec + 1.55 * r, -0.16 * rec, 0.06 * rec - 0.22 * r);
        target.rightForearm.rot.set(0.04 * rec + 0.06 * r, 0, 0);

        target.leftArm.rot.set(1.72 * rec + 1.55 * r, 0, 0.22);
        target.leftForearm.rot.set(0.05 * rec + 0.06 * r, 0, 0);

        target.leftLeg.rot.set(0.78 * rec, 0, 0);
        target.leftShin.rot.set(0.88 * rec, 0, 0);
        target.rightLeg.rot.set(-0.86 * rec, 0, 0);
        target.rightShin.rot.set(0.12 * rec, 0, 0);
      }
    }
  }

  animateKatanaComboPose(p, step) {
    const target = this.boneTargets;

    // Continuous 3-phase Hermite interpolation: Ready Stance -> Windup -> Strike -> Ready Stance
    // Zero angular velocity discontinuities, zero jerking!
    const blend3 = (readyVal, windupVal, strikeVal) => {
      if (p <= 0.26) {
        const w = this.smoothstep(0.0, 0.26, p);
        return readyVal + (windupVal - readyVal) * w;
      } else if (p <= 0.62) {
        const s = this.smoothstep(0.26, 0.62, p);
        return windupVal + (strikeVal - windupVal) * s;
      } else {
        const r = this.smoothstep(0.62, 1.0, p);
        return strikeVal + (readyVal - strikeVal) * r;
      }
    };

    if (step === 1) {
      // Step 1: Downward Diagonal Slash (Kesagiri - right shoulder to left hip)
      target.torso.pos.set(0, blend3(1.15, 1.14, 1.08), blend3(0, -0.06, 0.28));
      target.torso.rot.set(blend3(0.06, 0.04, 0.22), blend3(-0.22, 0.42, -0.48), 0);
      target.head.rot.set(blend3(0, -0.08, -0.12), blend3(0.22, -0.38, 0.35), 0);

      target.rightArm.rot.set(blend3(-0.62, -1.75, -0.35), blend3(-0.24, 0.32, -0.65), blend3(-0.22, 0.40, -0.55));
      target.rightForearm.rot.set(blend3(-0.58, -0.75, -0.25), 0, 0);

      target.leftArm.rot.set(blend3(-0.48, -1.15, 0.32), blend3(0.28, 0.48, 0.18), blend3(0.32, 0.22, 0.42));
      target.leftForearm.rot.set(blend3(-0.72, -0.85, -0.32), 0, 0);

      target.leftLeg.rot.set(blend3(0.16, 0.28, 0.45), 0, blend3(0.12, 0.10, 0));
      target.leftShin.rot.set(blend3(0.12, 0.15, 0.55), 0, 0);
      target.rightLeg.rot.set(blend3(-0.22, -0.32, -0.45), 0, blend3(-0.12, -0.10, 0));
      target.rightShin.rot.set(blend3(0.15, 0.15, 0.12), 0, 0);

    } else if (step === 2) {
      // Step 2: Horizontal Slash (Yoko-giri - sweeping cut from left to right)
      target.torso.pos.set(0, blend3(1.15, 1.14, 1.10), blend3(0, -0.05, 0.28));
      target.torso.rot.set(blend3(0.06, 0.02, 0.12), blend3(-0.22, -0.55, 0.58), 0);
      target.head.rot.set(blend3(0, 0, -0.08), blend3(0.22, 0.45, -0.45), 0);

      target.rightArm.rot.set(blend3(-0.62, -0.75, -0.85), blend3(-0.24, 0.75, -0.85), blend3(-0.22, -0.65, 0.75));
      target.rightForearm.rot.set(blend3(-0.58, -0.95, -0.18), 0, 0);

      target.leftArm.rot.set(blend3(-0.48, -0.25, 0.42), blend3(0.28, 0.35, -0.22), blend3(0.32, 0.25, -0.32));
      target.leftForearm.rot.set(blend3(-0.72, -0.55, -0.25), 0, 0);

      target.leftLeg.rot.set(blend3(0.16, 0.25, -0.38), 0, blend3(0.12, 0.05, 0));
      target.rightLeg.rot.set(blend3(-0.22, -0.25, 0.42), 0, blend3(-0.12, -0.05, 0));

    } else if (step === 3) {
      // Step 3: Rising Dragon Slash (Kiriage - explosive upward vertical cut)
      target.torso.pos.set(0, blend3(1.15, 0.88, 1.48), blend3(0, -0.08, 0.32));
      target.torso.rot.set(blend3(0.06, 0.35, -0.25), blend3(-0.22, 0.35, -0.15), 0);
      target.head.rot.set(blend3(0, -0.30, -0.50), blend3(0.22, -0.30, 0), 0);

      target.rightArm.rot.set(blend3(-0.62, 0.25, -2.45), blend3(-0.24, -0.45, 0.15), blend3(-0.22, -0.25, 0.15));
      target.rightForearm.rot.set(blend3(-0.58, -0.45, -0.15), 0, 0);

      target.leftArm.rot.set(blend3(-0.48, -0.35, -1.85), blend3(0.28, 0.30, 0.25), blend3(0.32, 0.20, -0.15));
      target.leftForearm.rot.set(blend3(-0.72, -0.55, -0.25), 0, 0);

      target.leftLeg.rot.set(blend3(0.16, 0.65, 0.20), 0, blend3(0.12, 0, 0));
      target.leftShin.rot.set(blend3(0.12, 0.90, 0.40), 0, 0);
      target.rightLeg.rot.set(blend3(-0.22, 0.65, -1.10), 0, blend3(-0.12, 0, 0));
      target.rightShin.rot.set(blend3(0.15, 0.90, 0.20), 0, 0);

    } else if (step === 4) {
      // Step 4: Whirlwind 360° Slash Finisher (Senpuu Zankou - fluid continuous horizontal spin)
      if (p <= 0.20) {
        const w = this.smoothstep(0, 0.20, p);
        target.torso.pos.set(0, 1.15 - 0.08 * w, 0);
        target.torso.rot.set(0.06 * (1 - w) + 0.12 * w, -0.22 * (1 - w) + 0.65 * w, 0);
        target.head.rot.set(0, 0.22 * (1 - w) - 0.35 * w, 0);

        target.rightArm.rot.set(-0.62 * (1 - w) - 0.85 * w, -0.24 * (1 - w) + 0.50 * w, -0.22 * (1 - w) - 0.40 * w);
        target.rightForearm.rot.set(-0.58 * (1 - w) - 0.65 * w, 0, 0);
        target.leftArm.rot.set(-0.48 * (1 - w) - 0.75 * w, 0.28 * (1 - w) + 0.50 * w, 0.32 * (1 - w) + 0.30 * w);
        target.leftForearm.rot.set(-0.72 * (1 - w) - 0.65 * w, 0, 0);
      } else if (p <= 0.72) {
        const spinT = this.smoothstep(0.20, 0.72, p);
        const spinY = Math.sin(spinT * Math.PI) * 0.22;
        target.torso.pos.set(0, 1.07 + spinY, 0.25 * spinT);
        target.torso.rot.set(0.08, 0.65 - Math.PI * 2 * spinT, 0);
        target.head.rot.set(-0.1, 0, 0);

        target.rightArm.rot.set(-0.85, 0, 1.15);
        target.rightForearm.rot.set(-0.1, 0, 0);
        target.leftArm.rot.set(-0.85, 0, -1.15);
        target.leftForearm.rot.set(-0.1, 0, 0);

        target.leftLeg.rot.set(-0.45, 0, 0.32);
        target.rightLeg.rot.set(-0.45, 0, -0.32);
      } else {
        const r = this.smoothstep(0.72, 1.0, p);
        target.torso.pos.set(0, 1.07 * (1 - r) + 1.15 * r, 0.25 * (1 - r));
        target.torso.rot.set(0.08 * (1 - r) + 0.06 * r, -0.22 * r, 0);
        target.head.rot.set(-0.1 * (1 - r), 0.22 * r, 0);

        target.rightArm.rot.set(-0.85 * (1 - r) - 0.62 * r, -0.24 * r, 1.15 * (1 - r) - 0.22 * r);
        target.rightForearm.rot.set(-0.1 * (1 - r) - 0.58 * r, 0, 0);
        target.leftArm.rot.set(-0.85 * (1 - r) - 0.48 * r, 0.28 * r, -1.15 * (1 - r) + 0.32 * r);
        target.leftForearm.rot.set(-0.1 * (1 - r) - 0.72 * r, 0, 0);

        target.leftLeg.rot.set(-0.45 * (1 - r) + 0.16 * r, 0, 0.32 * (1 - r) + 0.12 * r);
        target.rightLeg.rot.set(-0.45 * (1 - r) - 0.22 * r, 0, -0.32 * (1 - r) - 0.12 * r);
      }
    }
  }

  animateKatanaSprintPose(p, step) {
    const target = this.boneTargets;

    if (step === 1) {
      // Sprint Attack 1: Iaijutsu Flash Dash (Low aerodynamic strike across the front)
      if (p <= 0.28) {
        const w = this.smoothstep(0, 0.28, p);
        target.torso.pos.set(0, 0.98 - 0.22 * w, 0.25 * w);
        target.torso.rot.set(0.86 - 0.25 * w, 0.35 * w, 0);
        target.head.rot.set(-0.72 + 0.20 * w, -0.25 * w, 0);

        target.rightArm.rot.set(1.68 * (1 - w) - 0.65 * w, 0.55 * w, -0.35 * w);
        target.rightForearm.rot.set(-0.75 * w, 0, 0);
        target.leftArm.rot.set(1.68, 0, 0.2);
        target.leftForearm.rot.set(0.05, 0, 0);
      } else if (p <= 0.65) {
        const s = this.smoothstep(0.28, 0.65, p);
        target.torso.pos.set(0, 0.76 + 0.12 * s, 0.25 + 0.20 * s);
        target.torso.rot.set(0.61 + 0.15 * s, 0.35 - 0.70 * s, 0);
        target.head.rot.set(-0.52, 0.35 * s, 0);

        target.rightArm.rot.set(-0.65 * (1 - s) - 0.85 * s, 0.55 - 1.25 * s, -0.35 + 0.95 * s);
        target.rightForearm.rot.set(-0.75 * (1 - s) - 0.15 * s, 0, 0);
        target.leftArm.rot.set(1.68, 0, 0.2);
        target.leftForearm.rot.set(0.05, 0, 0);

        target.rightLeg.rot.set(-1.15, 0, 0);
        target.rightShin.rot.set(0.3, 0, 0);
        target.leftLeg.rot.set(0.85, 0, 0);
        target.leftShin.rot.set(0.9, 0, 0);
      } else {
        const r = this.smoothstep(0.65, 1.0, p);
        target.torso.pos.set(0, 0.88 * (1 - r) + 0.98 * r, 0.45 * (1 - r));
        target.torso.rot.set(0.76 * (1 - r) + 0.86 * r, -0.35 * (1 - r), 0);
        target.head.rot.set(-0.52 * (1 - r) - 0.72 * r, 0, 0);

        target.rightArm.rot.set(-0.85 * (1 - r) + 1.68 * r, -0.70 * (1 - r), 0.60 * (1 - r) - 0.22 * r);
        target.rightForearm.rot.set(-0.15 * (1 - r) + 0.06 * r, 0, 0);
        target.leftArm.rot.set(1.68, 0, 0.2);
        target.leftForearm.rot.set(0.05, 0, 0);
      }
    } else {
      // Sprint Attack 2: Running Leaping Spin Slash (Cyclone Leap)
      if (p <= 0.22) {
        const w = this.smoothstep(0, 0.22, p);
        target.torso.pos.set(0, 0.98 + 0.35 * w, 0.2 * w);
        target.torso.rot.set(0.86 * (1 - w) + 0.25 * w, 0.55 * w, 0);
        target.rightArm.rot.set(-0.82 * w, 0.45 * w, -0.35 * w);
        target.rightForearm.rot.set(-0.65 * w, 0, 0);
      } else if (p <= 0.72) {
        const spinT = this.smoothstep(0.22, 0.72, p);
        target.torso.pos.set(0, 1.33 + Math.sin(spinT * Math.PI) * 0.35, 0.2 + 0.3 * spinT);
        target.torso.rot.set(0.25, 0.55 - Math.PI * 2 * spinT, 0);
        target.head.rot.set(-0.1, 0, 0);

        target.rightArm.rot.set(-0.85, 0, 1.15);
        target.rightForearm.rot.set(-0.1, 0, 0);
        target.leftArm.rot.set(-0.85, 0, -1.15);
        target.leftForearm.rot.set(-0.1, 0, 0);

        target.rightLeg.rot.set(-0.9, 0, 0);
        target.leftLeg.rot.set(-0.9, 0, 0);
      } else {
        const r = this.smoothstep(0.72, 1.0, p);
        target.torso.pos.set(0, 1.33 * (1 - r) + 0.98 * r, 0.5 * (1 - r));
        target.torso.rot.set(0.25 * (1 - r) + 0.86 * r, 0, 0);

        target.rightArm.rot.set(-0.85 * (1 - r) + 1.68 * r, 0, 1.15 * (1 - r) - 0.22 * r);
        target.rightForearm.rot.set(-0.1 * (1 - r) + 0.06 * r, 0, 0);
        target.leftArm.rot.set(-0.85 * (1 - r) + 1.68 * r, 0, -1.15 * (1 - r) + 0.22 * r);
        target.leftForearm.rot.set(-0.1 * (1 - r) + 0.06 * r, 0, 0);
      }
    }
  }

  animateKatanaAirPose(p) {
    const target = this.boneTargets;
    if (p <= 0.30) {
      // Aerial flip & two-handed overhead katana raise
      const w = this.smoothstep(0, 0.30, p);
      const flip = w * Math.PI * 2;
      target.torso.pos.set(0, 1.25, 0);
      target.torso.rot.set(flip, 0, 0);
      target.head.rot.set(-0.25, 0, 0);

      target.rightArm.rot.set(-1.85 * w, 0, 0.12 * w);
      target.rightForearm.rot.set(-0.35 * w, 0, 0);
      target.leftArm.rot.set(-1.85 * w, 0, -0.12 * w);
      target.leftForearm.rot.set(-0.35 * w, 0, 0);
      target.rightLeg.rot.set(-0.85 * w, 0, 0);
      target.leftLeg.rot.set(-0.85 * w, 0, 0);
    } else if (p <= 0.68) {
      // Powerful vertical plunge with blade driven downward
      const s = this.smoothstep(0.30, 0.68, p);
      target.torso.pos.set(0, 1.15, 0.25 * s);
      target.torso.rot.set(0.75, 0, 0);
      target.head.rot.set(-0.6, 0, 0);

      target.rightArm.rot.set(-2.1, 0, 0.08);
      target.rightForearm.rot.set(-0.15, 0, 0);
      target.leftArm.rot.set(-2.1, 0, -0.08);
      target.leftForearm.rot.set(-0.15, 0, 0);

      target.rightLeg.rot.set(0.65, 0, -0.15);
      target.rightShin.rot.set(0.85, 0, 0);
      target.leftLeg.rot.set(0.65, 0, 0.15);
      target.leftShin.rot.set(0.85, 0, 0);
    } else {
      // Ground impact superhero landing pose
      const r = this.smoothstep(0.68, 1.0, p);
      target.torso.pos.set(0, 0.65 * (1 - r) + 1.15 * r, 0.25 * (1 - r));
      target.torso.rot.set(0.55 * (1 - r) + 0.06 * r, -0.22 * r, 0);
      target.head.rot.set(-0.35 * (1 - r), 0.22 * r, 0);

      target.rightArm.rot.set(-1.45 * (1 - r) - 0.62 * r, -0.24 * r, -0.22 * r);
      target.rightForearm.rot.set(-0.25 * (1 - r) - 0.58 * r, 0, 0);
      target.leftArm.rot.set(0.35 * (1 - r) - 0.48 * r, 0.28 * r, 0.32 * r);
      target.leftForearm.rot.set(-0.35 * (1 - r) - 0.72 * r, 0, 0);

      target.leftLeg.rot.set(0.85 * (1 - r) + 0.16 * r, 0, 0.25 * (1 - r) + 0.12 * r);
      target.leftShin.rot.set(1.1 * (1 - r) + 0.12 * r, 0, 0);
      target.rightLeg.rot.set(-0.85 * (1 - r) - 0.22 * r, 0, -0.25 * (1 - r) - 0.12 * r);
      target.rightShin.rot.set(0.4 * (1 - r) + 0.15 * r, 0, 0);
    }
  }

  executeKuramaClawAttack(onHitCallback) {
    if (this.kuramaAttackTimer > 0.4) return;
    this.playKuramaAction('attack01', 0.12, true);
    this.kuramaAttackTimer = 0.95;
    this.attackCooldown = 0.85;

    sound.playHeavyPawThud();

    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationY);
    const hitCenter = this.position.clone().add(forward.clone().multiplyScalar(8.5)).setY(this.position.y + 3.2);

    setTimeout(() => {
      if (this.vfx) {
        this.vfx.triggerScreenShake(0.55, 0.45);
        this.vfx.spawnHitSparks(hitCenter, true);
      }
      sound.playHeavyPawThud();
      if (onHitCallback) {
        const dmg = 550 * (this.hasSkill('kyuubi_mantle_2') ? 1.35 : 1.0);
        onHitCallback(hitCenter, 9.5, dmg, true, 'KURAMA_CLAW');
      }
    }, 320);
  }

  executeKuramaTailSweep(onHitCallback) {
    if (this.kuramaAttackTimer > 0.5) return;
    this.playKuramaAction('skill01', 0.18, true);
    this.kuramaAttackTimer = 1.35;
    this.attackCooldown = 1.25;

    sound.playTailSweep();

    setTimeout(() => {
      if (this.vfx) {
        this.vfx.spawnKuramaTailSweepShockwave(this.position);
      }
      sound.playTailSweep();
      if (onHitCallback) {
        const dmg = 680 * (this.hasSkill('kyuubi_mantle_2') ? 1.35 : 1.0);
        onHitCallback(this.position.clone().setY(this.position.y + 2.5), 15.0, dmg, true, 'KURAMA_TAILS');
      }
    }, 460);
  }

  executeKuramaRoar(onHitCallback) {
    if (this.kuramaAttackTimer > 0.5) return;
    this.playKuramaAction('skill02', 0.18, true);
    this.kuramaAttackTimer = 1.4;
    this.attackCooldown = 1.3;

    sound.playKyuubiRoar();

    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationY);
    if (this.vfx) {
      this.vfx.spawnKuramaRoarWave(this.position, forward);
    }

    setTimeout(() => {
      if (onHitCallback) {
        const dmg = 450 * (this.hasSkill('kyuubi_mantle_2') ? 1.35 : 1.0);
        const roarCenter = this.position.clone().add(forward.clone().multiplyScalar(10.5)).setY(this.position.y + 4.5);
        onHitCallback(roarCenter, 12.0, dmg, true, 'KURAMA_ROAR');
      }
    }, 300);
  }

  executeKuramaBijuuDama(spawnProjectileCallback) {
    if (this.kuramaAttackTimer > 0.5) return;
    this.playKuramaAction('skill03', 0.2, true);
    this.kuramaAttackTimer = 1.7;
    this.attackCooldown = 1.6;

    sound.playBijuuDamaCharge();

    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationY);
    const mouthPos = this.position.clone().add(forward.clone().multiplyScalar(8.2)).setY(this.position.y + 5.5);

    if (this.vfx) {
      this.vfx.triggerScreenShake(0.4, 0.6);
    }

    setTimeout(() => {
      sound.playTailSweep();
      if (spawnProjectileCallback) {
        spawnProjectileCallback({
          pos: mouthPos.clone(),
          dir: forward.clone(),
          speed: 40,
          damage: 1600 * (this.hasSkill('kyuubi_mantle_2') ? 1.35 : 1.0),
          blastRadius: 18.0
        });
      }
    }, 720);
  }

  performAttack(onHitCallback, inputKeys) {
    if (this.attackCooldown > 0 || this.isChargingChakra || this.state === 'RASENGAN_DASH') return;

    if (this.isKyuubiMode) {
      this.executeKuramaClawAttack(onHitCallback);
      return;
    }

    this.isAttacking = true;
    this.attackProgress = 0;
    this.attackTriggered = true;

    const horizSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    const hasMoveKeys = inputKeys && (inputKeys.w || inputKeys.s || inputKeys.a || inputKeys.d);
    const isShiftPressed = inputKeys ? !!inputKeys.shift : false;
    // Running combat animations activate ONLY when sprinting on Shift!
    const isSprintAttack = (this.isSprinting || isShiftPressed) && (hasMoveKeys || this.state === 'RUN' || horizSpeed > 3.0);
    const isAirborne = (!this.isGrounded || this.state === 'JUMP') && !this.isWallRunning;

    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationY);

    if (this.equippedWeapon === 'KATANA') {
      // ==========================================
      // KATANA KENJUTSU COMBAT SYSTEM
      // ==========================================
      if (isAirborne) {
        // 1. Aerial Helm Splitter / Plunge Attack
        this.attackMode = 'AIR_ATTACK';
        this.attackDuration = 0.62;
        this.attackCooldown = 0.25;

        // Plunge downwards with cutting force
        this.velocity.y = Math.min(this.velocity.y, -18.0);
        sound.playKatanaSlash(true);

        const hitDelay = 180;
        const baseDmg = 220 * this.katanaDamageBonus;

        setTimeout(() => {
          const arcPos = this.position.clone().add(forward.clone().multiplyScalar(0.95)).setY(this.position.y + 1.0);
          if (this.vfx && this.vfx.spawnKatanaSlashArc) {
            this.vfx.spawnKatanaSlashArc(arcPos, new THREE.Euler(Math.PI / 2.2, this.rotationY, 0), 0x00f0ff, 1.1, Math.PI * 0.9, 0);
          }
          if (onHitCallback) {
            const damage = baseDmg * (this.isKyuubiMode ? 2.2 : 1.0);
            onHitCallback(this.getAttackCenter(), this.attackHitboxRadius + 0.6, damage, true, 'KATANA_AIR');
          }
        }, hitDelay);

      } else if (isSprintAttack) {
        // 2. Sprint Katana Slashes
        this.attackMode = 'RUN_ATTACK';
        this.katanaSprintStep = (this.katanaSprintStep % 2) + 1;
        this.katanaSprintTimer = 1.8;

        let isFinisher = false;
        let hitDelay = 140;
        let baseDmg = 180 * this.katanaDamageBonus;

        if (this.katanaSprintStep === 1) {
          // Move 1: Iaijutsu Dash Slash
          this.attackDuration = 0.46;
          this.attackCooldown = 0.12;
          const dashSpeed = 16.0;
          this.velocity.x = forward.x * dashSpeed;
          this.velocity.z = forward.z * dashSpeed;

          this.vfx.setSpeedLines(0.75);
          setTimeout(() => this.vfx.setSpeedLines(0), 220);
          sound.playKatanaSlash(true);

          hitDelay = 140;
          baseDmg = 190 * this.katanaDamageBonus;

          setTimeout(() => {
            const arcPos = this.position.clone().add(forward.clone().multiplyScalar(0.95)).setY(this.position.y + 0.9);
            if (this.vfx && this.vfx.spawnKatanaSlashArc) {
              this.vfx.spawnKatanaSlashArc(arcPos, new THREE.Euler(0.08, this.rotationY, 0), 0x00f0ff, 1.15, Math.PI * 0.95, 4.0);
            }
          }, 110);
        } else {
          // Move 2: Running Leaping Spin Slash
          this.attackDuration = 0.54;
          this.attackCooldown = 0.20;
          const jumpSpeed = 15.0;
          this.velocity.x = forward.x * jumpSpeed;
          this.velocity.z = forward.z * jumpSpeed;
          this.velocity.y = 4.2;
          this.isGrounded = false;

          sound.playKatanaSlash(true);
          hitDelay = 170;
          baseDmg = 260 * this.katanaDamageBonus;
          isFinisher = true;

          setTimeout(() => {
            const arcPos = this.position.clone().add(forward.clone().multiplyScalar(0.95)).setY(this.position.y + 1.2);
            if (this.vfx && this.vfx.spawnKatanaSlashArc) {
              this.vfx.spawnKatanaSlashArc(arcPos, new THREE.Euler(-0.12, this.rotationY, 0), 0xff9100, 1.25, Math.PI * 1.6, 5.0);
            }
          }, 130);
        }

        const stepKey = 'KATANA_RUN_' + this.katanaSprintStep;
        setTimeout(() => {
          if (onHitCallback) {
            const damage = baseDmg * (this.isKyuubiMode ? 2.2 : 1.0);
            onHitCallback(this.getAttackCenter(), this.attackHitboxRadius + 0.5, damage, isFinisher, stepKey);
          }
        }, hitDelay);

      } else {
        // 3. Ground 4-Hit Kenjutsu Combo
        this.attackMode = 'STAND_ATTACK';
        this.katanaComboStep = (this.katanaComboStep % 4) + 1;
        this.katanaComboTimer = 1.6;

        if (this.katanaComboStep === 1) this.attackDuration = 0.44;
        else if (this.katanaComboStep === 2) this.attackDuration = 0.46;
        else if (this.katanaComboStep === 3) this.attackDuration = 0.52;
        else if (this.katanaComboStep === 4) this.attackDuration = 0.65;

        const isFinisher = this.katanaComboStep === 4;
        this.attackCooldown = isFinisher ? 0.30 : 0.10;

        sound.playKatanaSlash(this.katanaComboStep >= 3);

        const stepPower = this.katanaComboStep === 4 ? 4.0 : (this.katanaComboStep === 3 ? 3.0 : (this.katanaComboStep === 2 ? 2.6 : 2.2));
        this.velocity.x = forward.x * stepPower;
        this.velocity.z = forward.z * stepPower;

        const colors = [0x00f0ff, 0xffea00, 0x00e5ff, 0xff1744];
        const rotEulers = [
          new THREE.Euler(0.40, this.rotationY, 0.35),
          new THREE.Euler(0.08, this.rotationY, -0.15),
          new THREE.Euler(Math.PI / 2.2, this.rotationY, 0),
          new THREE.Euler(0, this.rotationY, 0)
        ];
        const arcScales = [1.05, 1.10, 1.15, 1.30];
        const arcAngles = [Math.PI * 0.9, Math.PI * 0.95, Math.PI * 0.85, Math.PI * 2.0];
        const spinSpeeds = [3.5, -3.5, 0.0, 6.0];

        const hitDelays = [135, 145, 165, 220];
        const vfxDelay = hitDelays[this.katanaComboStep - 1] * 0.85;

        setTimeout(() => {
          const arcPos = this.position.clone().add(forward.clone().multiplyScalar(0.95)).setY(this.position.y + 1.15);
          if (this.vfx && this.vfx.spawnKatanaSlashArc) {
            this.vfx.spawnKatanaSlashArc(
              arcPos,
              rotEulers[this.katanaComboStep - 1],
              colors[this.katanaComboStep - 1],
              arcScales[this.katanaComboStep - 1],
              arcAngles[this.katanaComboStep - 1],
              spinSpeeds[this.katanaComboStep - 1]
            );
          }
        }, vfxDelay);

        setTimeout(() => {
          if (onHitCallback) {
            let baseDmg = 110;
            if (this.katanaComboStep === 2) baseDmg = 145;
            if (this.katanaComboStep === 3) baseDmg = 190;
            if (this.katanaComboStep === 4) baseDmg = 320;

            const damage = baseDmg * this.katanaDamageBonus * (this.isKyuubiMode ? 2.2 : 1.0);
            onHitCallback(this.getAttackCenter(), this.attackHitboxRadius + 0.4, damage, isFinisher, 'KATANA_' + this.katanaComboStep);
          }
        }, hitDelays[this.katanaComboStep - 1]);
      }

    } else if (isSprintAttack) {
      // Sprint Combat System: Only activated when attacking while sprinting on Shift!
      this.attackMode = 'RUN_ATTACK';
      this.runAttackStep = (this.runAttackStep % 3) + 1;
      this.runAttackTimer = 1.8;

      let isFinisher = false;
      let hitDelay = 110;
      let baseDmg = 85;

      if (this.runAttackStep === 1) {
        // Move 1: Shinobi Low Slide Sweep Kick
        this.attackDuration = 0.42;
        this.attackCooldown = 0.16;
        const slideSpeed = 14.5;
        // Set velocity directly, NEVER += accumulate!
        this.velocity.x = forward.x * slideSpeed;
        this.velocity.z = forward.z * slideSpeed;
        this.vfx.spawnFootstepDust(this.position, 1.6);
        this.showSlashTrail(0x00f0ff, 0.15);
        sound.playHit(false);
        hitDelay = 100;
        baseDmg = 85;
      } else if (this.runAttackStep === 2) {
        // Move 2: Flying Dragon Dropkick
        this.attackDuration = 0.48;
        this.attackCooldown = 0.22;
        const kickSpeed = 15.5;
        // Set velocity directly, NEVER += accumulate!
        this.velocity.x = forward.x * kickSpeed;
        this.velocity.z = forward.z * kickSpeed;
        this.velocity.y = 4.2;
        this.isGrounded = false;
        this.vfx.spawnFootstepDust(this.position, 1.4);
        this.showSlashTrail(0xff9100, -0.25);
        sound.playHit(true);
        hitDelay = 140;
        baseDmg = 125;
        isFinisher = true;
      } else {
        // Move 3: High-Speed Chakra Palm Drive
        this.attackDuration = 0.40;
        this.attackCooldown = 0.28;
        const palmSpeed = 16.5;
        // Set velocity directly, NEVER += accumulate!
        this.velocity.x = forward.x * palmSpeed;
        this.velocity.z = forward.z * palmSpeed;
        this.vfx.setSpeedLines(0.75);
        setTimeout(() => this.vfx.setSpeedLines(0), 220);
        this.vfx.spawnChakraAuraWisp(this.position, this.isKyuubiMode);
        this.showSlashTrail(0x00e5ff, 1.25);
        sound.playHit(true);
        hitDelay = 120;
        baseDmg = 160;
        isFinisher = true;
      }

      const stepKey = 'RUN_' + this.runAttackStep;
      setTimeout(() => {
        if (onHitCallback) {
          const damage = baseDmg * (this.isKyuubiMode ? 2.2 : 1.0);
          onHitCallback(this.getAttackCenter(), this.attackHitboxRadius + 0.3, damage, isFinisher, stepKey);
        }
      }, hitDelay);

    } else {
      // Standing 5-Hit Taijutsu Combo
      this.attackMode = 'STAND_ATTACK';
      this.comboStep = (this.comboStep % 5) + 1;
      this.comboTimer = 1.6;

      if (this.comboStep === 1) this.attackDuration = 0.26;
      else if (this.comboStep === 2) this.attackDuration = 0.30;
      else if (this.comboStep === 3) this.attackDuration = 0.38;
      else if (this.comboStep === 4) this.attackDuration = 0.36;
      else if (this.comboStep === 5) this.attackDuration = 0.54;

      const isFinisher = this.comboStep === 5;
      this.attackCooldown = isFinisher ? 0.38 : 0.16;

      sound.playHit(isFinisher);

      // Controlled martial arts lunge step (REPLACES velocity, NEVER += accumulates!)
      const stepPower = this.comboStep === 5 ? 4.2 : (this.comboStep === 4 ? 3.5 : (this.comboStep === 3 ? 3.0 : 2.2));
      this.velocity.x = forward.x * stepPower;
      this.velocity.z = forward.z * stepPower;

      const colors = [0x00f0ff, 0xffea00, 0xff9100, 0x00e5ff, 0xff1744];
      const slashAngles = [0.2, -0.3, 0.0, 1.4, -1.2];
      this.showSlashTrail(colors[this.comboStep - 1], slashAngles[this.comboStep - 1]);

      const hitDelays = [75, 90, 130, 110, 240];
      setTimeout(() => {
        if (onHitCallback) {
          let baseDmg = 55;
          if (this.comboStep === 2) baseDmg = 75;
          if (this.comboStep === 3) baseDmg = 95;
          if (this.comboStep === 4) baseDmg = 120;
          if (this.comboStep === 5) baseDmg = 200;

          const damage = baseDmg * (this.isKyuubiMode ? 2.2 : 1.0);
          onHitCallback(this.getAttackCenter(), this.attackHitboxRadius, damage, isFinisher, this.comboStep);
        }
      }, hitDelays[this.comboStep - 1]);
    }
  }

  getAttackCenter() {
    const dir = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationY);
    if (this.isKyuubiMode) {
      return this.position.clone().add(dir.multiplyScalar(8.5)).setY(this.position.y + 3.2);
    }
    if (this.equippedWeapon === 'KATANA') {
      if (this.attackMode === 'AIR_ATTACK') {
        return this.position.clone().add(dir.multiplyScalar(2.4)).setY(this.position.y + 0.5);
      }
      if (this.attackMode === 'RUN_ATTACK') {
        const reach = this.katanaSprintStep === 1 ? 2.9 : 3.2;
        const height = this.katanaSprintStep === 1 ? 0.75 : 1.3;
        return this.position.clone().add(dir.multiplyScalar(reach)).setY(this.position.y + height);
      }
      const reach = this.katanaComboStep === 4 ? 3.0 : (this.katanaComboStep === 3 ? 2.7 : 2.5);
      const height = this.katanaComboStep === 3 ? 1.8 : 1.2;
      return this.position.clone().add(dir.multiplyScalar(reach)).setY(this.position.y + height);
    }

    if (this.attackMode === 'RUN_ATTACK') {
      const reach = this.runAttackStep === 1 ? 2.5 : (this.runAttackStep === 2 ? 2.8 : 2.4);
      const height = this.runAttackStep === 1 ? 0.45 : (this.runAttackStep === 2 ? 1.4 : 1.1);
      return this.position.clone().add(dir.multiplyScalar(reach)).setY(this.position.y + height);
    }
    const reach = this.comboStep === 5 ? 2.4 : (this.comboStep === 3 ? 2.2 : 1.9);
    const height = this.comboStep === 4 ? 2.0 : 1.2;
    return this.position.clone().add(dir.multiplyScalar(reach)).setY(this.position.y + height);
  }

  takeDamage(amount) {
    if (this.isDead) return;

    // Colossal Nine-Tails beast armor: 65% damage reduction in Kyuubi Mode!
    const defenseMult = this.isKyuubiMode ? 0.35 : 0.5;
    const actualDamage = Math.max(1, amount * defenseMult);
    this.hp = Math.max(0, this.hp - actualDamage);

    const dv = document.getElementById('damage-vignette');
    if (dv) {
      dv.classList.add('active');
      setTimeout(() => dv.classList.remove('active'), 250);
    }

    this.vfx.spawnHitSparks(this.position.clone().setY(this.position.y + 1.2), false);
    sound.playHit(false);

    if (this.hp <= 0) {
      this.die();
    }
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    sound.playPickup();
    this.vfx.spawnChakraAuraWisp(this.position, false);
  }

  addChakra(amount) {
    this.chakra = Math.min(this.maxChakra, this.chakra + amount);
    sound.playPickup();
    this.vfx.spawnChakraAuraWisp(this.position, false);
  }

  activateKyuubiMode() {
    this.isKyuubiMode = true;
    this.isWallRunning = false;
    this.kyuubiTimeLeft = this.hasSkill('kyuubi_mantle_2') ? 28 : 20;
    sound.playKyuubiRoar();
    this.vfx.triggerScreenShake(0.7, 0.5);
    this.vfx.spawnSmokePoof(this.position, 45, 3.0);

    if (this.kuramaGroup) {
      this.kuramaGroup.visible = true;
      this.kuramaGroup.position.copy(this.position);
      this.kuramaGroup.rotation.set(0, this.rotationY, 0);
      this.group.visible = false;
      this.playKuramaAction('skill02', 0.15, true); // Entrance roar
      this.kuramaAttackTimer = 1.1;
    }

    const avatar = document.getElementById('avatar-img');
    if (avatar) avatar.classList.add('kyuubi');

    const badge = document.getElementById('kyuubi-status');
    if (badge) badge.classList.remove('hidden');
  }

  deactivateKyuubiMode() {
    this.isKyuubiMode = false;
    this.kyuubiTimeLeft = 0;

    if (this.kuramaGroup) {
      this.kuramaGroup.visible = false;
    }
    this.group.visible = true;

    this.vfx.spawnSmokePoof(this.position, 35, 2.2);

    const avatar = document.getElementById('avatar-img');
    if (avatar) avatar.classList.remove('kyuubi');

    const badge = document.getElementById('kyuubi-status');
    if (badge) badge.classList.add('hidden');
  }

  activateSageMode() {
    this.isSageMode = true;
    this.sageTimeLeft = 25;
    sound.playHandSeal();
    this.vfx.triggerScreenShake(0.4, 0.3);
    this.vfx.spawnSmokePoof(this.position, 22, 1.3);

    if (this.rig && this.rig.sageEyes) {
      this.rig.sageEyes.visible = true;
    }

    const badge = document.getElementById('sage-status');
    if (badge) badge.classList.remove('hidden');
  }

  deactivateSageMode() {
    this.isSageMode = false;
    this.sageTimeLeft = 0;

    if (this.rig && this.rig.sageEyes) {
      this.rig.sageEyes.visible = false;
    }

    const badge = document.getElementById('sage-status');
    if (badge) badge.classList.add('hidden');
  }

  getNinjaRank() {
    if (this.level >= 20) return 'HOKAGE (火影)';
    if (this.level >= 15) return 'SANNIN (三忍)';
    if (this.level >= 10) return 'JONIN (上忍)';
    if (this.level >= 5) return 'CHUNIN (中忍)';
    return 'GENIN (下忍)';
  }

  addXp(amount) {
    this.currentXp += amount;
    let leveledUp = false;

    while (this.currentXp >= this.xpToNextLevel) {
      this.currentXp -= this.xpToNextLevel;
      this.level++;
      this.skillPoints++;
      this.xpToNextLevel = Math.floor(100 * Math.pow(1.30, this.level - 1));

      // Level-up reward: Full Health & Chakra restore
      this.hp = this.maxHp;
      this.chakra = this.maxChakra;
      leveledUp = true;
      this.justLeveledUp = true;
      this.winTimer = 2.4;

      if (this.vfx && this.vfx.spawnLevelUpBurst) {
        this.vfx.spawnLevelUpBurst(this.position);
      }
      sound.playLevelUp();
    }

    return leveledUp;
  }

  hasSkill(skillId) {
    return this.unlockedSkills.has(skillId);
  }

  unlockSkill(skillId) {
    if (this.unlockedSkills.has(skillId)) return false;
    if (this.skillPoints < 1) return false;

    const prereqs = {
      'oodama_rasengan': 'chakra_focus',
      'rasenshuriken': 'oodama_rasengan',
      'tajuu_clones': 'razor_edge',
      'uzumaki_rendan': 'tajuu_clones',
      'kyuubi_mantle_2': 'uzumaki_body',
      'sage_mode': 'kyuubi_mantle_2'
    };

    const req = prereqs[skillId];
    if (req && !this.unlockedSkills.has(req)) {
      return false;
    }

    this.skillPoints--;
    this.unlockedSkills.add(skillId);

    // Immediate passive bonuses
    if (skillId === 'chakra_focus') {
      this.maxChakra += 50;
      this.chakra = this.maxChakra;
    } else if (skillId === 'razor_edge') {
      this.katanaDamageBonus += 0.35;
    } else if (skillId === 'uzumaki_body') {
      this.maxHp += 150;
      this.hp = this.maxHp;
      this.speed *= 1.15;
    }

    sound.playSkillUnlock();
    return true;
  }

  triggerSprintDash() {
    if (this.isDead || this.isChargingChakra) return;
    sound.playDash();
    this.vfx.spawnSmokePoof(this.position, 10, 0.7);
    this.vfx.setSpeedLines(0.75);
    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationY);
    this.velocity.x += forward.x * 6.5;
    this.velocity.z += forward.z * 6.5;
  }

  die() {
    this.isDead = true;
    this.vfx.spawnSmokePoof(this.position, 30, 1.5);
    sound.playSmokePoof();
    this.group.visible = false;
  }

  reset() {
    this.isDead = false;
    this.hp = this.maxHp;
    this.chakra = this.maxChakra;
    this.position.set(0, 0, 15);
    this.velocity.set(0, 0, 0);
    this.state = 'IDLE';
    this.comboStep = 0;
    this.attackMode = 'STAND_ATTACK';
    this.runAttackStep = 0;
    this.runAttackTimer = 0;
    this.isAttacking = false;
    this.isWallRunning = false;
    this.pitchAngle = 0;
    this.bankAngle = 0;
    this.wallKickCooldown = 0;
    this.airFlipTimer = 0;
    this.canDoubleJump = true;
    this.doubleFlipTimer = 0;
    this.isSprinting = false;
    this.wasSprinting = false;
    this.prevSpace = false;
    if (this.leftChakraSole) this.leftChakraSole.material.opacity = 0;
    if (this.rightChakraSole) this.rightChakraSole.material.opacity = 0;
    this.katanaComboStep = 0;
    this.katanaComboTimer = 0;
    this.katanaSprintStep = 0;
    this.katanaSprintTimer = 0;
    this.updateWeaponVisibility();
    this.group.visible = true;
    this.deactivateKyuubiMode();
    this.deactivateSageMode();
  }
}
