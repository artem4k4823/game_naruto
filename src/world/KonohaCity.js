// Konoha (Hidden Leaf Village) - Ultra-Atmospheric Anime City with Perimeter Fortress Walls, Dense Multi-Story Districts, Cables, and Rooftop Bridges
import * as THREE from 'three';
import { createToonMaterial } from '../vfx/AnimeVFX.js';

export class KonohaCity {
  constructor(scene) {
    this.scene = scene;
    this.buildings = [];
    this.clouds = [];
    this.trainingLogs = [];
    this.pickups = [];

    // World Dimensions (Village + Expansive Great Shinobi Outer Forest)
    this.cityWidth = 190;
    this.cityDepth = 200;
    this.forestMinZ = 94;
    this.forestMaxZ = 345;
    this.worldWidth = 460;
    this.chakraSpringPos = new THREE.Vector3(-40, 0.4, 270);

    this.buildTerrainAndRiver();
    this.buildOuterDefensiveWalls();
    this.buildGrandSouthGateDoors();
    this.buildHokageMountain();
    this.buildHokageTowerPlaza();
    this.buildIchirakuRamenComplex();
    this.buildDenseDistricts();
    this.buildOverheadWiresAndLanterns();
    this.buildStreetMarketAndProps();
    this.buildTrainingLogsYard();
    this.buildOuterShinobiForest();
    this.buildForestRiverAndWaterfall();
    this.buildToriiShrineAndTraining44();
    this.buildShinobiWatchtower();
    this.buildChakraSpringAndCampsite();
    this.buildOuterMountainBoundary();
    this.buildSky();
  }

  buildTerrainAndRiver() {
    // Grand Base Landscape Ground (covering both Konoha Village & the Great Outer Shinobi Forest)
    const grandGroundGeo = new THREE.PlaneGeometry(490, 490);
    const grandGroundMat = createToonMaterial(0x274e13, { roughness: 0.9 }); // Deep ancient wild forest turf
    const grandGround = new THREE.Mesh(grandGroundGeo, grandGroundMat);
    grandGround.rotation.x = -Math.PI / 2;
    grandGround.position.set(0, -0.02, 125);
    grandGround.receiveShadow = true;
    this.scene.add(grandGround);

    // Village Turf (inside perimeter fortress walls)
    const groundGeo = new THREE.PlaneGeometry(this.cityWidth, this.cityDepth);
    const groundMat = createToonMaterial(0x388e3c, { roughness: 0.8 }); // Lush village turf
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Broad Paved Main Avenue (from South Gate to Hokage Mansion)
    const aveGeo = new THREE.PlaneGeometry(14, 150);
    const aveMat = createToonMaterial(0xd7ccc8); // Stone pavement
    const ave = new THREE.Mesh(aveGeo, aveMat);
    ave.rotation.x = -Math.PI / 2;
    ave.position.set(0, 0.02, 10);
    ave.receiveShadow = true;
    this.scene.add(ave);

    // Main Forest Trail (continues south through the Grand Gate out into the wild forest)
    const trailMat = createToonMaterial(0x795548, { roughness: 0.85 }); // Beaten dirt/clay forest path
    const forestTrailGeo = new THREE.PlaneGeometry(10, 160);
    const forestTrail = new THREE.Mesh(forestTrailGeo, trailMat);
    forestTrail.rotation.x = -Math.PI / 2;
    forestTrail.position.set(0, 0.015, 175);
    forestTrail.receiveShadow = true;
    this.scene.add(forestTrail);

    // Cross forest trail leading west towards the Waterfall Suspension Bridge
    const westTrailGeo = new THREE.PlaneGeometry(110, 8);
    const westTrail = new THREE.Mesh(westTrailGeo, trailMat);
    westTrail.rotation.x = -Math.PI / 2;
    westTrail.position.set(-50, 0.016, 175);
    this.scene.add(westTrail);

    // Cross forest trail leading east towards the Shinobi Watchtower
    const eastTrailGeo = new THREE.PlaneGeometry(130, 8);
    const eastTrail = new THREE.Mesh(eastTrailGeo, trailMat);
    eastTrail.rotation.x = -Math.PI / 2;
    eastTrail.position.set(65, 0.016, 175);
    this.scene.add(eastTrail);

    // Cross Streets inside Konoha
    const crossGeo1 = new THREE.PlaneGeometry(140, 10);
    const cross1 = new THREE.Mesh(crossGeo1, aveMat);
    cross1.rotation.x = -Math.PI / 2;
    cross1.position.set(0, 0.02, 25);

    const cross2 = new THREE.Mesh(crossGeo1, aveMat);
    cross2.rotation.x = -Math.PI / 2;
    cross2.position.set(0, 0.02, -22);

    const cross3 = new THREE.PlaneGeometry(120, 8);
    const cross3Mesh = new THREE.Mesh(cross3, aveMat);
    cross3Mesh.rotation.x = -Math.PI / 2;
    cross3Mesh.position.set(0, 0.02, 60);

    this.scene.add(cross1, cross2, cross3Mesh);

    // Canal River through the village
    const riverGeo = new THREE.PlaneGeometry(11, 165);
    const riverMat = createToonMaterial(0x0288d1, { roughness: 0.15 });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(-38, 0.015, 10);
    this.scene.add(river);

    // Arched Bridges across canal
    this.buildArchedBridge(-38, 25);
    this.buildArchedBridge(-38, -22);
    this.buildArchedBridge(-38, 60);
  }

  buildArchedBridge(x, z) {
    const bridge = new THREE.Group();
    bridge.position.set(x, 0, z);

    const redMat = createToonMaterial(0xb71c1c);
    const woodMat = createToonMaterial(0x795548);

    const span = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 9), woodMat);
    span.position.y = 0.6;

    const rail1 = new THREE.Mesh(new THREE.BoxGeometry(14, 0.9, 0.2), redMat);
    rail1.position.set(0, 1.1, 4.2);
    const rail2 = new THREE.Mesh(new THREE.BoxGeometry(14, 0.9, 0.2), redMat);
    rail2.position.set(0, 1.1, -4.2);

    bridge.add(span, rail1, rail2);
    this.scene.add(bridge);
  }

  buildOuterDefensiveWalls() {
    // Massive circular/square fortress perimeter walls protecting Konoha (height 18m!)
    const wallHeight = 18;
    const wallThick = 6;
    const wallMat = createToonMaterial(0x607d8b, { roughness: 0.7 });
    const roofMat = createToonMaterial(0x263238);

    const halfW = this.cityWidth / 2;
    const halfD = this.cityDepth / 2;

    const createWallSegment = (minX, maxX, minZ, maxZ) => {
      const w = Math.abs(maxX - minX);
      const d = Math.abs(maxZ - minZ);
      const cx = (minX + maxX) / 2;
      const cz = (minZ + maxZ) / 2;

      const group = new THREE.Group();
      group.position.set(cx, 0, cz);

      // Main concrete/stone fortress wall
      const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(w, wallHeight, d), wallMat);
      wallMesh.position.y = wallHeight / 2;

      // Walkable battlements top walkway
      const battlements = new THREE.Mesh(new THREE.BoxGeometry(w, 1.2, d + 0.6), roofMat);
      battlements.position.y = wallHeight + 0.6;

      group.add(wallMesh, battlements);
      this.scene.add(group);

      this.addBuildingStructure(minX, maxX, minZ, maxZ, wallHeight + 1.2, group, true);
    };

    // East Wall
    createWallSegment(halfW - wallThick, halfW, -halfD, halfD);
    // West Wall
    createWallSegment(-halfW, -halfW + wallThick, -halfD, halfD);

    // South Wall (with Grand Entrance Gate gap in center)
    // Wall segments connect cleanly to the Gate Towers at x = -15.5 and x = 15.5
    createWallSegment(-halfW, -15.5, halfD - wallThick, halfD);
    createWallSegment(15.5, halfW, halfD - wallThick, halfD);

    // Grand South Gate Structure over the entrance gap
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, halfD - wallThick / 2);

    const greenMat = createToonMaterial(0x1b5e20);
    const redMat = createToonMaterial(0xb71c1c);
    const goldMat = createToonMaterial(0xffb300);

    // Two Giant Gate Towers (x = -12 and x = 12, width 7m, depth 8m, height 24m)
    [-12, 12].forEach(x => {
      const tower = new THREE.Mesh(new THREE.BoxGeometry(7, 24, 8), wallMat);
      tower.position.set(x, 12, 0);
      const towerRoof = new THREE.Mesh(new THREE.ConeGeometry(5.5, 3.5, 4), roofMat);
      towerRoof.position.set(x, 25.5, 0);
      towerRoof.rotation.y = Math.PI / 4;
      gateGroup.add(tower, towerRoof);
    });

    // Register solid tower structures
    this.addBuildingStructure(-15.5, -8.5, 93, 101, 24, gateGroup, true);
    this.addBuildingStructure(8.5, 15.5, 93, 101, 24, gateGroup, true);

    // Grand Archway Overhead Beam
    const arch = new THREE.Mesh(new THREE.BoxGeometry(26, 3, 7), redMat);
    arch.position.set(0, 18, 0);

    // Giant Leaf Crest Emblem
    const crest = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.4, 20), goldMat);
    crest.rotation.x = Math.PI / 2;
    crest.position.set(0, 18, 3.6);

    gateGroup.add(arch, crest);
    this.scene.add(gateGroup);
  }

  buildHokageMountain() {
    // Monumental stone cliff (Height: 38m) with carved faces
    const mountainGroup = new THREE.Group();
    mountainGroup.position.set(0, 0, -85);

    const cliffMat = createToonMaterial(0x78909c, { roughness: 0.7 });
    const stoneFaceMat = createToonMaterial(0x90a4ae, { roughness: 0.6 });

    const cliffHeight = 38;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(this.cityWidth, cliffHeight, 32), cliffMat);
    wall.position.y = cliffHeight / 2;
    mountainGroup.add(wall);

    // Promenade summit
    const summit = new THREE.Mesh(new THREE.BoxGeometry(this.cityWidth, 2.5, 30), cliffMat);
    summit.position.y = cliffHeight + 1.25;
    mountainGroup.add(summit);

    this.addBuildingStructure(-this.cityWidth / 2, this.cityWidth / 2, -101, -69, cliffHeight + 2, mountainGroup, true);

    // 4 Hokage Faces (Hashirama, Tobirama, Hiruzen, Minato)
    const faceData = [
      { name: 'Hashirama', x: -45, hair: 'long' },
      { name: 'Tobirama', x: -15, hair: 'spiky' },
      { name: 'Hiruzen', x: 15, hair: 'hat' },
      { name: 'Minato', x: 45, hair: 'spiky' }
    ];

    faceData.forEach(fd => {
      const g = new THREE.Group();
      g.position.set(fd.x, 23, 16);

      const head = new THREE.Mesh(new THREE.BoxGeometry(15, 17, 8), stoneFaceMat);
      g.add(head);

      const band = new THREE.Mesh(new THREE.BoxGeometry(15.5, 3.8, 8.5), stoneFaceMat);
      band.position.y = 5.8;
      g.add(band);

      if (fd.hair === 'spiky') {
        for (let s = -2; s <= 2; s++) {
          const spike = new THREE.Mesh(new THREE.ConeGeometry(2.6, 6.5, 5), stoneFaceMat);
          spike.position.set(s * 3.4, 10.5, 0);
          spike.rotation.z = -s * 0.22;
          g.add(spike);
        }
      } else if (fd.hair === 'hat') {
        const hat = new THREE.Mesh(new THREE.ConeGeometry(9.5, 6.5, 4), stoneFaceMat);
        hat.position.y = 11.5;
        hat.rotation.y = Math.PI / 4;
        g.add(hat);
      } else {
        const hL = new THREE.Mesh(new THREE.BoxGeometry(3.5, 15, 6.5), stoneFaceMat);
        hL.position.set(-8.5, -1, 0);
        const hR = new THREE.Mesh(new THREE.BoxGeometry(3.5, 15, 6.5), stoneFaceMat);
        hR.position.set(8.5, -1, 0);
        g.add(hL, hR);
      }

      mountainGroup.add(g);
    });

    this.scene.add(mountainGroup);
  }

  buildHokageTowerPlaza() {
    // Hokage Tower (Height: 22m) with multi-tiered observation platforms
    const towerGroup = new THREE.Group();
    towerGroup.position.set(0, 0, -45);

    const redWallMat = createToonMaterial(0xc62828);
    const roofGreenMat = createToonMaterial(0x1b5e20);
    const whiteMat = createToonMaterial(0xffffff);
    const goldMat = createToonMaterial(0xffb300);

    const radius = 13;
    const height = 22;

    // 1st Tier (Ground to 10m)
    const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius + 1.2, 10, 32), redWallMat);
    tier1.position.y = 5;

    // 1st Balcony & Overhang Roof
    const roof1 = new THREE.Mesh(new THREE.ConeGeometry(radius + 3.0, 3.0, 32), roofGreenMat);
    roof1.position.y = 11;

    // 2nd Tier (11m to 18m)
    const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(radius - 3, radius - 2.5, 8, 32), redWallMat);
    tier2.position.y = 14.5;

    // 2nd Roof & Spire
    const roof2 = new THREE.Mesh(new THREE.ConeGeometry(radius, 4.0, 32), roofGreenMat);
    roof2.position.y = 19.5;

    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.6, 6, 8), goldMat);
    spire.position.y = 24;

    // Giant Kanji "火" (Fire) Banner
    const banner = new THREE.Mesh(new THREE.CylinderGeometry(radius + 0.1, radius + 0.1, 4.5, 16, 1, false, -0.65, 1.3), whiteMat);
    banner.position.y = 7;
    const kanji = new THREE.Mesh(new THREE.CircleGeometry(1.8, 16), redWallMat);
    kanji.position.set(0, 7, radius + 0.16);

    towerGroup.add(tier1, roof1, tier2, roof2, spire, banner, kanji);
    this.scene.add(towerGroup);

    // Register true multi-tiered cylinder hitboxes for Hokage Tower (circular walls & round roof balcony)
    this.addCylinderStructure(0, -45, 13.0, 11.0, towerGroup);
    this.addCylinderStructure(0, -45, 10.0, 22.0, towerGroup);
  }

  buildIchirakuRamenComplex() {
    const shopGroup = new THREE.Group();
    shopGroup.position.set(16, 0, 22);

    const woodMat = createToonMaterial(0x6d4c41);
    const norenMat = createToonMaterial(0xffffff);
    const redMat = createToonMaterial(0xd50000);
    const tileMat = createToonMaterial(0x37474f);

    const w = 10;
    const d = 8;
    const h = 5.5;

    const base = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), woodMat);
    base.position.y = h / 2;

    const roof = new THREE.Mesh(new THREE.ConeGeometry(7, 2.5, 4), tileMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = h + 1.25;
    roof.scale.set(1.4, 1.0, 1.2);

    // Counter & Stools
    const counter = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1.2, 1.4), woodMat);
    counter.position.set(0, 0.6, d / 2 + 0.7);

    for (let s = -3; s <= 3; s++) {
      const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.7, 8), redMat);
      stool.position.set(s * 1.0, 0.35, d / 2 + 1.8);
      shopGroup.add(stool);
    }

    // Noren & Signs
    const noren = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 1.2), norenMat);
    noren.position.set(0, h - 0.9, d / 2 + 0.05);

    const textRed = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.45), redMat);
    textRed.position.set(0, h - 0.9, d / 2 + 0.06);

    shopGroup.add(base, roof, counter, noren, textRed);
    this.scene.add(shopGroup);

    this.addBuildingStructure(16 - w / 2, 16 + w / 2, 22 - d / 2, 22 + d / 2, h, shopGroup);
  }

  buildDenseDistricts() {
    // 36 Tall, Atmospheric Multi-Story Buildings (Heights: 8m, 12m, 16m, 20m!)
    const wallTones = [0xf5f5f5, 0xe0e0e0, 0xd7ccc8, 0xcfd8dc, 0xbcaaa4, 0xfff8e1];
    const roofTones = [0x263238, 0x1b5e20, 0x4e342e, 0x37474f, 0x2e7d32, 0x004d40];

    const plots = [
      // East District - Commercial & High-Rise Apartments
      { x: 20, z: -8, w: 12, d: 14, h: 12 },
      { x: 38, z: -8, w: 14, d: 16, h: 18 },
      { x: 58, z: -8, w: 16, d: 14, h: 14 },
      { x: 74, z: -8, w: 12, d: 14, h: 10 },

      { x: 34, z: 18, w: 14, d: 12, h: 14 },
      { x: 54, z: 18, w: 16, d: 14, h: 19 }, // 19m High-Rise!
      { x: 72, z: 18, w: 12, d: 12, h: 11 },

      { x: 20, z: 42, w: 12, d: 14, h: 13 },
      { x: 38, z: 42, w: 14, d: 14, h: 17 },
      { x: 58, z: 42, w: 16, d: 16, h: 15 },
      { x: 74, z: 42, w: 12, d: 12, h: 9 },

      { x: 22, z: 66, w: 12, d: 12, h: 10 },
      { x: 42, z: 66, w: 15, d: 14, h: 16 },
      { x: 62, z: 66, w: 14, d: 14, h: 12 },

      // West District - Clan Compounds & Ninja Academy
      { x: -20, z: -8, w: 12, d: 14, h: 13 },
      { x: -20, z: 18, w: 12, d: 14, h: 15 },
      { x: -20, z: 42, w: 12, d: 14, h: 12 },
      { x: -20, z: 66, w: 12, d: 14, h: 11 },

      // Far West Ninja Academy Complex
      { x: -58, z: -8, w: 20, d: 18, h: 20 }, // Grand Academy Tower
      { x: -58, z: 18, w: 16, d: 14, h: 14 },
      { x: -58, z: 42, w: 16, d: 16, h: 16 },
      { x: -58, z: 66, w: 15, d: 14, h: 12 },
      { x: -76, z: 10, w: 12, d: 16, h: 10 },
      { x: -76, z: 38, w: 12, d: 16, h: 13 },

      // North District near Hokage Mountain
      { x: -38, z: -50, w: 16, d: 14, h: 16 },
      { x: -62, z: -50, w: 16, d: 14, h: 12 },
      { x: 38, z: -50, w: 16, d: 14, h: 17 },
      { x: 62, z: -50, w: 16, d: 14, h: 13 }
    ];

    plots.forEach((p, idx) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(p.x, 0, p.z);

      const wallMat = createToonMaterial(wallTones[idx % wallTones.length]);
      const roofMat = createToonMaterial(roofTones[idx % roofTones.length]);
      const woodMat = createToonMaterial(0x4e342e);
      const glassMat = createToonMaterial(0x90caf9, { roughness: 0.2 });

      // Main Building Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(p.w, p.h, p.d), wallMat);
      body.position.y = p.h / 2;
      bGroup.add(body);

      // Traditional Japanese Tiered Hip-and-Gable Roof
      const roofPeakH = 3.2;
      const roofGeo = new THREE.ConeGeometry(Math.max(p.w, p.d) * 0.74, roofPeakH, 4);
      roofGeo.rotateY(Math.PI / 4);
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = p.h + roofPeakH / 2;
      roof.scale.set(p.w / Math.max(p.w, p.d) * 1.16, 1.0, p.d / Math.max(p.w, p.d) * 1.16);

      const eave = new THREE.Mesh(new THREE.BoxGeometry(p.w + 1.2, 0.35, p.d + 1.2), woodMat);
      eave.position.y = p.h + 0.18;
      bGroup.add(roof, eave);

      // Balconies & Exterior Walkways on Multi-Story Buildings
      if (p.h >= 12) {
        const balcGeo = new THREE.BoxGeometry(p.w + 0.6, 0.25, 2.0);
        const balc = new THREE.Mesh(balcGeo, woodMat);
        balc.position.set(0, 7.5, p.d / 2 + 1.0);

        const rail = new THREE.Mesh(new THREE.BoxGeometry(p.w + 0.6, 0.85, 0.15), woodMat);
        rail.position.set(0, 8.0, p.d / 2 + 1.95);
        bGroup.add(balc, rail);
      }

      // Windows Grid
      const floors = Math.floor(p.h / 4);
      for (let f = 1; f <= floors; f++) {
        const win1 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 0.1), glassMat);
        win1.position.set(-p.w * 0.24, f * 3.8 - 1.2, p.d / 2 + 0.06);
        const win2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 0.1), glassMat);
        win2.position.set(p.w * 0.24, f * 3.8 - 1.2, p.d / 2 + 0.06);
        bGroup.add(win1, win2);
      }

      // Rooftop Parkour Props (Water Tanks, Chimneys, Antennas)
      if (idx % 2 === 0) {
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 2.2, 16), createToonMaterial(0x78909c));
        tank.position.set(p.w * 0.22, p.h + 1.1, p.d * 0.22);
        bGroup.add(tank);
      } else {
        const vent = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 1.2), woodMat);
        vent.position.set(-p.w * 0.25, p.h + 0.7, 0);
        bGroup.add(vent);
      }

      this.scene.add(bGroup);

      this.addBuildingStructure(
        p.x - p.w / 2, p.x + p.w / 2,
        p.z - p.d / 2, p.z + p.d / 2,
        p.h, bGroup
      );
    });

    // Rooftop Ninja Walkway Bridges connecting adjacent buildings!
    this.buildRooftopBridge(20, 38, -8, -8, 12);
    this.buildRooftopBridge(38, 58, -8, -8, 14);
    this.buildRooftopBridge(34, 54, 18, 18, 14);
    this.buildRooftopBridge(20, 38, 42, 42, 13);
    this.buildRooftopBridge(-58, -58, -8, 18, 14);
  }

  buildRooftopBridge(x1, x2, z1, z2, height) {
    const bridge = new THREE.Group();
    const cx = (x1 + x2) / 2;
    const cz = (z1 + z2) / 2;
    const len = Math.hypot(x2 - x1, z2 - z1);
    const angle = Math.atan2(z2 - z1, x2 - x1);

    bridge.position.set(cx, height, cz);
    bridge.rotation.y = -angle;

    const woodMat = createToonMaterial(0x8d6e63);
    const redMat = createToonMaterial(0xb71c1c);

    const deck = new THREE.Mesh(new THREE.BoxGeometry(len, 0.3, 2.2), woodMat);
    const rail1 = new THREE.Mesh(new THREE.BoxGeometry(len, 0.8, 0.12), redMat);
    rail1.position.set(0, 0.5, 1.05);
    const rail2 = new THREE.Mesh(new THREE.BoxGeometry(len, 0.8, 0.12), redMat);
    rail2.position.set(0, 0.5, -1.05);

    bridge.add(deck, rail1, rail2);
    this.scene.add(bridge);
  }

  buildOverheadWiresAndLanterns() {
    // Authentic Anime Telephone / Power Cables & Hanging Paper Lanterns between buildings
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const lanternMat = createToonMaterial(0xff1744);
    const lanternGlowMat = createToonMaterial(0xffeb3b);

    const wireSpans = [
      { x1: 20, z1: -8, x2: -20, z2: -8, y: 11 },
      { x1: 34, z1: 18, x2: -20, z2: 18, y: 12 },
      { x1: 20, z1: 42, x2: -20, z2: 42, y: 11 },
      { x1: 22, z1: 66, x2: -20, z2: 66, y: 10 }
    ];

    wireSpans.forEach(w => {
      const len = Math.hypot(w.x2 - w.x1, w.z2 - w.z1);
      const wireGeo = new THREE.CylinderGeometry(0.04, 0.04, len, 6);
      wireGeo.rotateZ(Math.PI / 2);
      const wire = new THREE.Mesh(wireGeo, wireMat);
      wire.position.set((w.x1 + w.x2) / 2, w.y, (w.z1 + w.z2) / 2);
      this.scene.add(wire);

      // Hanging Red Paper Lanterns
      for (let i = -2; i <= 2; i++) {
        const lantern = new THREE.Group();
        lantern.position.set(i * 6, w.y - 0.7, (w.z1 + w.z2) / 2);

        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.8, 10), lanternMat);
        const top = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.1, 10), lanternGlowMat);
        lantern.add(body, top);
        this.scene.add(lantern);
      }
    });
  }

  buildStreetMarketAndProps() {
    const woodMat = createToonMaterial(0x8d6e63);
    const stripeMats = [
      createToonMaterial(0xff5722), // Orange awning
      createToonMaterial(0x0288d1), // Blue awning
      createToonMaterial(0x388e3c)  // Green awning
    ];

    // Market stalls lining the Main Avenue
    for (let z = -12; z <= 55; z += 16) {
      [-8.5, 8.5].forEach((x, idx) => {
        const stall = new THREE.Group();
        stall.position.set(x, 0, z);

        const table = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.1, 2.2), woodMat);
        table.position.y = 0.55;

        // Striped Slanted Fabric Canopy Awning
        const canopy = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.15, 2.8), stripeMats[idx % stripeMats.length]);
        canopy.position.set(0, 2.6, 0);
        canopy.rotation.x = x > 0 ? -0.2 : 0.2;

        // Wooden Crates stacked nearby
        const crate1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), woodMat);
        crate1.position.set(1.5, 0.45, 1.2);
        const crate2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), woodMat);
        crate2.position.set(1.5, 1.25, 1.2);

        stall.add(table, canopy, crate1, crate2);
        this.scene.add(stall);
      });
    }
  }

  buildTrainingLogsYard() {
    const yard = new THREE.Group();
    yard.position.set(-44, 0, -32);

    const barkMat = createToonMaterial(0x6d4c41);
    const woodMat = createToonMaterial(0xd7ccc8);
    const ropeMat = createToonMaterial(0xffe082);

    [-2.2, 0, 2.2].forEach(x => {
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.52, 3.4, 16), barkMat);
      log.position.set(x, 1.7, 0);
      const top = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.05, 16), woodMat);
      top.position.set(x, 3.42, 0);
      const rope = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.08, 8, 16), ropeMat);
      rope.rotation.x = Math.PI / 2;
      rope.position.set(x, 2.4, 0);

      yard.add(log, top, rope);
      this.trainingLogs.push({ pos: new THREE.Vector3(-44 + x, 1.5, -32), radius: 0.8 });
      this.addCylinderStructure(-44 + x, -32, 0.52, 3.45, yard);
    });

    this.scene.add(yard);
  }

  buildSky() {
    const skyGeo = new THREE.SphereGeometry(620, 32, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x4fa3f7,
      side: THREE.BackSide
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyMesh.position.set(0, 0, 120);
    this.scene.add(skyMesh);

    const cloudMat = new THREE.MeshToonMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.88
    });

    for (let i = 0; i < 36; i++) {
      const cloud = new THREE.Group();
      for (let j = 0; j < 5; j++) {
        const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(6 + Math.random() * 6, 1), cloudMat);
        puff.position.set(j * 4.5 - 9, Math.random() * 2.5, Math.random() * 2.5);
        cloud.add(puff);
      }
      cloud.position.set((Math.random() - 0.5) * 480, 60 + Math.random() * 35, (Math.random() - 0.5) * 460 + 120);
      this.scene.add(cloud);
      this.clouds.push(cloud);
    }
  }

  addBuildingStructure(minX, maxX, minZ, maxZ, height, group, isWall = false, bottomY = 0) {
    this.buildings.push({
      shape: 'box',
      minX: Math.min(minX, maxX),
      maxX: Math.max(minX, maxX),
      minZ: Math.min(minZ, maxZ),
      maxZ: Math.max(minZ, maxZ),
      height: height,
      roofY: height,
      bottomY: bottomY,
      isWall: isWall,
      mesh: group
    });
  }

  addCylinderStructure(centerX, centerZ, radius, height, group, isWall = false, bottomY = 0) {
    this.buildings.push({
      shape: 'cylinder',
      centerX: centerX,
      centerZ: centerZ,
      radius: radius,
      height: height,
      roofY: height,
      bottomY: bottomY,
      isWall: isWall,
      mesh: group,
      minX: centerX - radius,
      maxX: centerX + radius,
      minZ: centerZ - radius,
      maxZ: centerZ + radius
    });
  }

  getGroundHeight(x, z, curY = 0) {
    let highestGround = 0;

    for (const b of this.buildings) {
      const bottom = b.bottomY || 0;
      if (curY < bottom - 0.5) continue; // Below an elevated platform/branch

      if (b.shape === 'cylinder') {
        const pad = 0.35;
        const dx = x - b.centerX;
        const dz = z - b.centerZ;
        const maxR = b.radius + pad;
        if (dx * dx + dz * dz <= maxR * maxR) {
          if (curY >= b.roofY - 1.4) {
            if (b.roofY > highestGround) {
              highestGround = b.roofY;
            }
          }
        }
      } else {
        const pad = 0.35;
        if (x >= b.minX - pad && x <= b.maxX + pad && z >= b.minZ - pad && z <= b.maxZ + pad) {
          if (curY >= b.roofY - 1.4) {
            if (b.roofY > highestGround) {
              highestGround = b.roofY;
            }
          }
        }
      }
    }

    return highestGround;
  }

  checkWall(pos, radius = 0.85) {
    let bestHit = null;
    let minDistance = Infinity;

    for (const b of this.buildings) {
      const bottom = b.bottomY || 0;
      // Must be vertically within the wall/cylinder height
      if (pos.y < bottom - 0.25 || pos.y >= b.roofY - 0.25) continue;

      if (b.shape === 'cylinder') {
        const dx = pos.x - b.centerX;
        const dz = pos.z - b.centerZ;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const surfaceDist = Math.abs(dist - b.radius);

        if (surfaceDist <= radius && surfaceDist < minDistance) {
          minDistance = surfaceDist;
          const nx = dist > 0.001 ? (dx / dist) : 0;
          const nz = dist > 0.001 ? (dz / dist) : 1;
          bestHit = {
            hit: true,
            shape: 'cylinder',
            wallNormal: new THREE.Vector3(nx, 0, nz),
            centerX: b.centerX,
            centerZ: b.centerZ,
            radius: b.radius,
            roofY: b.roofY,
            bottomY: bottom,
            building: b
          };
        }
      } else {
        // Broadphase bounding check with radius margin
        if (pos.x < b.minX - radius || pos.x > b.maxX + radius ||
            pos.z < b.minZ - radius || pos.z > b.maxZ + radius) {
          continue;
        }

        const inZ = pos.z >= b.minZ - 0.35 && pos.z <= b.maxZ + 0.35;
        const inX = pos.x >= b.minX - 0.35 && pos.x <= b.maxX + 0.35;

        // Left face (x = minX, exterior is x <= minX, normal = (-1, 0, 0))
        if (inZ && pos.x <= b.minX + 0.35) {
          const d = Math.abs(pos.x - b.minX);
          if (d <= radius && d < minDistance) {
            minDistance = d;
            bestHit = {
              hit: true,
              shape: 'box',
              wallNormal: new THREE.Vector3(-1, 0, 0),
              wallPos: b.minX,
              axis: 'x',
              roofY: b.roofY,
              bottomY: bottom,
              building: b
            };
          }
        }
        // Right face (x = maxX, exterior is x >= maxX, normal = (1, 0, 0))
        if (inZ && pos.x >= b.maxX - 0.35) {
          const d = Math.abs(pos.x - b.maxX);
          if (d <= radius && d < minDistance) {
            minDistance = d;
            bestHit = {
              hit: true,
              shape: 'box',
              wallNormal: new THREE.Vector3(1, 0, 0),
              wallPos: b.maxX,
              axis: 'x',
              roofY: b.roofY,
              bottomY: bottom,
              building: b
            };
          }
        }
        // Back face (z = minZ, exterior is z <= minZ, normal = (0, 0, -1))
        if (inX && pos.z <= b.minZ + 0.35) {
          const d = Math.abs(pos.z - b.minZ);
          if (d <= radius && d < minDistance) {
            minDistance = d;
            bestHit = {
              hit: true,
              shape: 'box',
              wallNormal: new THREE.Vector3(0, 0, -1),
              wallPos: b.minZ,
              axis: 'z',
              roofY: b.roofY,
              bottomY: bottom,
              building: b
            };
          }
        }
        // Front face (z = maxZ, exterior is z >= maxZ, normal = (0, 0, 1))
        if (inX && pos.z >= b.maxZ - 0.35) {
          const d = Math.abs(pos.z - b.maxZ);
          if (d <= radius && d < minDistance) {
            minDistance = d;
            bestHit = {
              hit: true,
              shape: 'box',
              wallNormal: new THREE.Vector3(0, 0, 1),
              wallPos: b.maxZ,
              axis: 'z',
              roofY: b.roofY,
              bottomY: bottom,
              building: b
            };
          }
        }
      }
    }

    return bestHit || { hit: false };
  }

  resolveCollision(pos, radius = 0.55) {
    for (const b of this.buildings) {
      const bottom = b.bottomY || 0;
      // Only collide if character is vertically within the structure span!
      if (pos.y < bottom - 0.2 || pos.y >= b.roofY - 0.25) continue;

      if (b.shape === 'cylinder') {
        const dx = pos.x - b.centerX;
        const dz = pos.z - b.centerZ;
        const distSq = dx * dx + dz * dz;
        const totalR = b.radius + radius;
        if (distSq < totalR * totalR) {
          const dist = Math.sqrt(distSq);
          if (dist > 0.0001) {
            pos.x = b.centerX + (dx / dist) * totalR;
            pos.z = b.centerZ + (dz / dist) * totalR;
          } else {
            pos.z = b.centerZ + totalR;
          }
        }
      } else {
        if (pos.x > b.minX - radius && pos.x < b.maxX + radius &&
            pos.z > b.minZ - radius && pos.z < b.maxZ + radius) {
          // Inside collision box! Find the shallowest penetration to push outside
          const dLeft = pos.x - (b.minX - radius);
          const dRight = (b.maxX + radius) - pos.x;
          const dBack = pos.z - (b.minZ - radius);
          const dFront = (b.maxZ + radius) - pos.z;

          const minD = Math.min(dLeft, dRight, dBack, dFront);
          if (minD === dLeft) pos.x = b.minX - radius;
          else if (minD === dRight) pos.x = b.maxX + radius;
          else if (minD === dBack) pos.z = b.minZ - radius;
          else if (minD === dFront) pos.z = b.maxZ + radius;
        }
      }
    }
  }

  resolveCameraPosition(targetPos, desiredCamPos, camRadius = 0.45) {
    for (const b of this.buildings) {
      const bottom = b.bottomY || 0;
      if (desiredCamPos.y < bottom || desiredCamPos.y >= b.roofY) continue;

      if (b.shape === 'cylinder') {
        const dx = desiredCamPos.x - b.centerX;
        const dz = desiredCamPos.z - b.centerZ;
        const distSq = dx * dx + dz * dz;
        const minCamR = b.radius + camRadius;
        if (distSq < minCamR * minCamR) {
          const dist = Math.sqrt(distSq);
          if (dist > 0.0001) {
            desiredCamPos.x = b.centerX + (dx / dist) * minCamR;
            desiredCamPos.z = b.centerZ + (dz / dist) * minCamR;
          }
        }
      } else {
        if (desiredCamPos.x > b.minX - camRadius && desiredCamPos.x < b.maxX + camRadius &&
            desiredCamPos.z > b.minZ - camRadius && desiredCamPos.z < b.maxZ + camRadius) {
          // Camera inside building! Pull camera towards targetPos outside the wall
          const dir = new THREE.Vector3().subVectors(targetPos, desiredCamPos).normalize();
          for (let step = 0; step < 12; step++) {
            desiredCamPos.addScaledVector(dir, 0.5);
            if (!(desiredCamPos.x > b.minX - camRadius && desiredCamPos.x < b.maxX + camRadius &&
                  desiredCamPos.z > b.minZ - camRadius && desiredCamPos.z < b.maxZ + camRadius)) {
              break;
            }
          }
        }
      }
    }
    return desiredCamPos;
  }

  buildGrandSouthGateDoors() {
    // Grand Opened Wooden Gate Doors leading out into the Great Shinobi Forest
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, 97);

    const darkWoodMat = createToonMaterial(0x3e2723);
    const ironMat = createToonMaterial(0x263238);
    const redMat = createToonMaterial(0xb71c1c);
    const lanternMat = new THREE.MeshBasicMaterial({ color: 0xffd54f });

    // Left Giant Open Door (swung outward towards the forest at 45 deg)
    const leftDoor = new THREE.Group();
    leftDoor.position.set(-9.6, 0, 0);
    leftDoor.rotation.y = -Math.PI / 4;
    const lDoorMesh = new THREE.Mesh(new THREE.BoxGeometry(6.6, 16.5, 0.6), darkWoodMat);
    lDoorMesh.position.set(3.3, 8.25, 0);
    // Iron reinforcement bands
    for (let y = 3; y <= 15; y += 4) {
      const ironBand = new THREE.Mesh(new THREE.BoxGeometry(6.7, 0.35, 0.68), ironMat);
      ironBand.position.set(3.3, y, 0);
      leftDoor.add(ironBand);
    }
    leftDoor.add(lDoorMesh);

    // Right Giant Open Door (swung outward towards the forest at 45 deg)
    const rightDoor = new THREE.Group();
    rightDoor.position.set(9.6, 0, 0);
    rightDoor.rotation.y = Math.PI / 4;
    const rDoorMesh = new THREE.Mesh(new THREE.BoxGeometry(6.6, 16.5, 0.6), darkWoodMat);
    rDoorMesh.position.set(-3.3, 8.25, 0);
    for (let y = 3; y <= 15; y += 4) {
      const ironBand = new THREE.Mesh(new THREE.BoxGeometry(6.7, 0.35, 0.68), ironMat);
      ironBand.position.set(-3.3, y, 0);
      rightDoor.add(ironBand);
    }
    rightDoor.add(rDoorMesh);

    // Giant Red Paper Lanterns suspended from the gate arch
    [-5.5, 5.5].forEach(x => {
      const lanternGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.8, 12);
      const lantern = new THREE.Mesh(lanternGeo, redMat);
      lantern.position.set(x, 15, 1.2);
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), lanternMat);
      glow.position.set(x, 15, 1.2);
      gateGroup.add(lantern, glow);
    });

    gateGroup.add(leftDoor, rightDoor);
    this.scene.add(gateGroup);

    // Register solid hitboxes for the massive open wooden doors (clear passage between -4.8 and 4.8)
    this.addBuildingStructure(-9.6, -4.9, 96.5, 102.0, 16.5, leftDoor, true);
    this.addBuildingStructure(4.9, 9.6, 96.5, 102.0, 16.5, rightDoor, true);
  }

  buildOuterShinobiForest() {
    // The Great Shinobi Forest (Лес Смерти / Великие Леса Страны Огня)
    // 48 Giant Ancient Climbable Trees with massive branches for Ninja Parkour!
    const forestGroup = new THREE.Group();

    const barkMat1 = createToonMaterial(0x4e342e, { roughness: 0.85 });
    const barkMat2 = createToonMaterial(0x3e2723, { roughness: 0.9 });
    const leafMat1 = createToonMaterial(0x1b5e20, { roughness: 0.8 }); // deep forest emerald
    const leafMat2 = createToonMaterial(0x2e7d32, { roughness: 0.75 }); // lush green
    const leafMat3 = createToonMaterial(0x388e3c, { roughness: 0.7 }); // vibrant green
    const leafMat4 = createToonMaterial(0x004d40, { roughness: 0.85 }); // shadow pine
    const stoneMat = createToonMaterial(0x607d8b, { roughness: 0.8 });

    // Procedural deterministic layout of 48 Giant Shinobi Trees
    const treePositions = [];
    let seed = 42;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let gx = -185; gx <= 185; gx += 46) {
      for (let gz = 115; gz <= 325; gz += 44) {
        const jx = gx + (pseudoRandom() - 0.5) * 26;
        const jz = gz + (pseudoRandom() - 0.5) * 26;

        // Avoid clearings: main road, Torii shrine, waterfall gorge, watchtower, chakra spring
        if (Math.abs(jx) < 16 && jz < 185) continue; // main south avenue corridor
        if (jx > -10 && jx < 48 && jz > 165 && jz < 255) continue; // Torii shrine clearing
        if (jx < -60 && jx > -165 && jz > 165 && jz < 235) continue; // Waterfall & river gorge
        if (jx > 105 && jx < 145 && jz > 155 && jz < 195) continue; // Watchtower clearing
        if (jx > -55 && jx < -25 && jz > 255 && jz < 285) continue; // Chakra spring clearing

        treePositions.push({ x: jx, z: jz });
      }
    }

    treePositions.forEach((tp, idx) => {
      const tree = new THREE.Group();
      tree.position.set(tp.x, 0, tp.z);

      const tHeight = 24 + (pseudoRandom() * 14); // 24m to 38m tall!
      const baseR = 2.6 + pseudoRandom() * 1.2; // 2.6m to 3.8m trunk base radius!
      const topR = 1.4 + pseudoRandom() * 0.8;
      const bMat = idx % 2 === 0 ? barkMat1 : barkMat2;

      // Massive Gnarled Trunk (Cylinder)
      const trunkGeo = new THREE.CylinderGeometry(topR, baseR, tHeight, 14);
      const trunkMesh = new THREE.Mesh(trunkGeo, bMat);
      trunkMesh.position.y = tHeight / 2;
      trunkMesh.castShadow = true;
      trunkMesh.receiveShadow = true;
      tree.add(trunkMesh);

      // Flanged ground roots spreading into the turf
      for (let r = 0; r < 4; r++) {
        const rAngle = (r * Math.PI / 2) + (pseudoRandom() * 0.4);
        const rootLen = baseR * 1.8;
        const rootGeo = new THREE.BoxGeometry(0.8, 1.8, rootLen);
        const rootMesh = new THREE.Mesh(rootGeo, bMat);
        rootMesh.position.set(
          Math.sin(rAngle) * (baseR * 0.8 + rootLen * 0.3),
          0.7,
          Math.cos(rAngle) * (baseR * 0.8 + rootLen * 0.3)
        );
        rootMesh.rotation.y = rAngle;
        rootMesh.rotation.x = -0.18;
        tree.add(rootMesh);
      }

      // Register solid trunk cylinder collision (True circular geometry: Naruto hugs trunk smoothly at all 360 deg)
      this.addCylinderStructure(tp.x, tp.z, baseR * 0.95, tHeight, tree);

      // Massive Horizontal Parkour Branches (2 to 4 branches per tree at various heights)
      const branchLevels = [8.5, 14.5, 20.5, 26.5];
      const numBranches = 2 + Math.floor(pseudoRandom() * 3);

      for (let b = 0; b < numBranches; b++) {
        const bHeight = branchLevels[b];
        if (bHeight >= tHeight - 4) continue;

        const bAngle = (b * 1.7) + (pseudoRandom() * 0.8);
        const bLen = 11 + pseudoRandom() * 5; // 11m to 16m long branch!
        const bWidth = 1.9;

        const branchGroup = new THREE.Group();
        branchGroup.position.set(0, bHeight, 0);
        branchGroup.rotation.y = bAngle;

        // Wooden Branch Platform
        const branchMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.3, bLen, 8), bMat);
        branchMesh.rotation.z = Math.PI / 2;
        branchMesh.position.set(bLen / 2 + baseR * 0.5, 0, 0);
        branchGroup.add(branchMesh);

        // Clustered Anime Foliage at branch tip
        const folColor = (idx + b) % 4 === 0 ? leafMat1 : ((idx + b) % 4 === 1 ? leafMat2 : ((idx + b) % 4 === 2 ? leafMat3 : leafMat4));
        const folTipGeo = new THREE.DodecahedronGeometry(4.5 + pseudoRandom() * 3, 1);
        const folTip = new THREE.Mesh(folTipGeo, folColor);
        folTip.position.set(bLen + baseR * 0.5, 1.2, 0);
        branchGroup.add(folTip);

        tree.add(branchGroup);

        // Register Branch as a solid Walkable / Rooftop Platform for Tree Parkour!
        // Elevated with bottomY so characters walk freely underneath on the forest ground!
        const branchWorldX = tp.x + Math.cos(bAngle) * (bLen * 0.55);
        const branchWorldZ = tp.z + Math.sin(bAngle) * (bLen * 0.55);
        this.addBuildingStructure(
          branchWorldX - bWidth * 1.8,
          branchWorldX + bWidth * 1.8,
          branchWorldZ - bWidth * 1.8,
          branchWorldZ + bWidth * 1.8,
          bHeight + 0.85,
          branchMesh,
          false,
          bHeight - 1.2
        );
      }

      // Towering Top Foliage Canopy (clustered faceted spheres)
      const canopyGroup = new THREE.Group();
      canopyGroup.position.y = tHeight;
      const cMats = [leafMat1, leafMat2, leafMat3, leafMat4];

      for (let c = 0; c < 4; c++) {
        const cRad = 6.5 + pseudoRandom() * 3.5;
        const cGeo = new THREE.DodecahedronGeometry(cRad, 1);
        const cMesh = new THREE.Mesh(cGeo, cMats[(idx + c) % 4]);
        const offAngle = c * Math.PI / 2 + pseudoRandom() * 0.5;
        const offDist = 2.5 + pseudoRandom() * 3;
        cMesh.position.set(Math.cos(offAngle) * offDist, (pseudoRandom() - 0.3) * 3, Math.sin(offAngle) * offDist);
        canopyGroup.add(cMesh);
      }
      tree.add(canopyGroup);

      forestGroup.add(tree);
    });

    // Forest Floor Details: Mossy Boulders & Fallen Hollow Logs
    for (let i = 0; i < 22; i++) {
      const bx = (pseudoRandom() - 0.5) * 360;
      const bz = 110 + pseudoRandom() * 220;
      if (Math.abs(bx) < 14 && bz < 185) continue;

      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.8 + pseudoRandom() * 2.2, 1),
        stoneMat
      );
      rock.position.set(bx, 1.2, bz);
      rock.rotation.set(pseudoRandom(), pseudoRandom(), pseudoRandom());
      forestGroup.add(rock);
    }

    this.scene.add(forestGroup);
  }

  buildForestRiverAndWaterfall() {
    // The Great Waterfall & Forest River Gorge
    const riverGroup = new THREE.Group();

    const rockMat = createToonMaterial(0x546e7a, { roughness: 0.75 });
    const waterMat = createToonMaterial(0x0288d1, { roughness: 0.1, transparent: true, opacity: 0.82 });
    const foamMat = new THREE.MeshBasicMaterial({ color: 0xe0f7fa, transparent: true, opacity: 0.9 });
    const ropeMat = createToonMaterial(0xd7ccc8);
    const woodMat = createToonMaterial(0x8d6e63);

    // 1. High Waterfall Cliff in western forest
    const cliffX = -135;
    const cliffZ = 175;
    const cliffHeight = 24;
    const cliffWidth = 34;
    const cliffDepth = 18;

    const cliff = new THREE.Mesh(new THREE.BoxGeometry(cliffWidth, cliffHeight, cliffDepth), rockMat);
    cliff.position.set(cliffX, cliffHeight / 2, cliffZ);
    riverGroup.add(cliff);

    this.addBuildingStructure(
      cliffX - cliffWidth / 2,
      cliffX + cliffWidth / 2,
      cliffZ - cliffDepth / 2,
      cliffZ + cliffDepth / 2,
      cliffHeight,
      cliff,
      true
    );

    // 2. Animated Cascading Waterfall Sheet
    const fallGeo = new THREE.PlaneGeometry(14, cliffHeight - 1);
    this.waterfallMesh = new THREE.Mesh(fallGeo, waterMat);
    this.waterfallMesh.position.set(cliffX, cliffHeight / 2, cliffZ + cliffDepth / 2 + 0.1);
    riverGroup.add(this.waterfallMesh);

    // Foam Splash Pool at Waterfall Base
    const foamMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 6), foamMat);
    foamMesh.rotation.x = -Math.PI / 2;
    foamMesh.position.set(cliffX, 0.15, cliffZ + cliffDepth / 2 + 3);
    riverGroup.add(foamMesh);

    // 3. Lagoon Pool & River Gorge
    const lagoonGeo = new THREE.PlaneGeometry(38, 42);
    const lagoon = new THREE.Mesh(lagoonGeo, waterMat);
    lagoon.rotation.x = -Math.PI / 2;
    lagoon.position.set(cliffX, 0.08, 205);
    riverGroup.add(lagoon);

    // River flowing east towards the village
    const forestRiverGeo = new THREE.PlaneGeometry(85, 14);
    const forestRiver = new THREE.Mesh(forestRiverGeo, waterMat);
    forestRiver.rotation.x = -Math.PI / 2;
    forestRiver.position.set(-80, 0.08, 210);
    riverGroup.add(forestRiver);

    // 4. Walkable Rope Suspension Bridge (crossing the river gorge)
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(-95, 0, 210);

    // Bridge walkway deck (height 3.6m above water, length 24m, width 4.2m)
    const deckGeo = new THREE.BoxGeometry(4.2, 0.35, 24);
    const deck = new THREE.Mesh(deckGeo, woodMat);
    deck.position.y = 3.6;
    bridgeGroup.add(deck);

    // 4 Support timber towers
    [-2.1, 2.1].forEach(tx => {
      [-12, 12].forEach(tz => {
        const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.35, 7.5, 8), woodMat);
        pylon.position.set(tx, 3.75, tz);
        bridgeGroup.add(pylon);
      });
    });

    // Catenary handrails & ropes
    [-2.1, 2.1].forEach(rx => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.25, 24), ropeMat);
      rail.position.set(rx, 4.5, 0);
      bridgeGroup.add(rail);
    });

    riverGroup.add(bridgeGroup);

    // Register Bridge as a Walkable Platform Structure! (With bottomY so water underneath is clear)
    this.addBuildingStructure(-97.5, -92.5, 198, 222, 3.75, bridgeGroup, false, 3.2);

    // 5. River Stepping Stones
    for (let s = 0; s < 5; s++) {
      const stone = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.5, 10), rockMat);
      stone.position.set(-115 + s * 8, 0.22, 210 + Math.sin(s) * 2.2);
      riverGroup.add(stone);
    }

    this.scene.add(riverGroup);
  }

  buildToriiShrineAndTraining44() {
    // Training Ground 44 / Sacred Torii Shrine & Memorial Stone
    const shrineGroup = new THREE.Group();
    shrineGroup.position.set(18, 0, 210);

    const toriiRedMat = createToonMaterial(0xc62828);
    const toriiBlackMat = createToonMaterial(0x212121);
    const goldMat = createToonMaterial(0xffb300);
    const stoneMat = createToonMaterial(0x78909c, { roughness: 0.8 });
    const lanternGlowMat = new THREE.MeshBasicMaterial({ color: 0xffe082 });

    // 1. Seven Majestic Crimson Torii Arches along the path
    const toriiZOffsets = [-40, -30, -20, -10, 0, 10, 20];
    toriiZOffsets.forEach(z => {
      const torii = new THREE.Group();
      torii.position.set(0, 0, z);

      // Two Main Columns
      [-3.2, 3.2].forEach(cx => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 6.8, 14), toriiRedMat);
        col.position.set(cx, 3.4, 0);
        const colBase = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.52, 0.8, 14), toriiBlackMat);
        colBase.position.set(cx, 0.4, 0);
        torii.add(col, colBase);
      });

      // Upper Curved Lintel (Kasagi)
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.55, 0.8), toriiRedMat);
      lintel.position.y = 6.6;
      const lintelTop = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.25, 0.9), toriiBlackMat);
      lintelTop.position.y = 6.95;

      // Tie Beam (Nuki)
      const tieBeam = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.35, 0.5), toriiRedMat);
      tieBeam.position.y = 5.6;

      // Central Tablet (Gakuzuka) with golden leaf emblem
      const tablet = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.3), toriiBlackMat);
      tablet.position.y = 6.1;
      const leafSymbol = new THREE.Mesh(new THREE.CircleGeometry(0.25, 12), goldMat);
      leafSymbol.position.set(0, 6.1, 0.16);

      torii.add(lintel, lintelTop, tieBeam, tablet, leafSymbol);

      // Stone Lanterns on each side
      [-4.6, 4.6].forEach(lx => {
        const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.8, 0.7), stoneMat);
        lantern.position.set(lx, 0.9, 0);
        const glow = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), lanternGlowMat);
        glow.position.set(lx, 1.5, 0);
        torii.add(lantern, glow);
      });

      shrineGroup.add(torii);
    });

    // 2. Circular Sacred Dais & Shinobi Memorial Stone (Памятный камень шиноби)
    const dais = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 9.0, 0.6, 24), stoneMat);
    dais.position.set(0, 0.3, 32);
    shrineGroup.add(dais);
    this.addCylinderStructure(18, 242, 8.8, 0.6, dais);

    // Memorial Stone Monument
    const monument = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.4, 1.2), createToonMaterial(0x37474f));
    monument.position.set(0, 2.5, 32);
    const monEmblem = new THREE.Mesh(new THREE.CircleGeometry(0.55, 16), goldMat);
    monEmblem.position.set(0, 3.2, 32.61);

    // Sacred Straw Shimenawa Rope with white zigzag streamers
    const shimeRope = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.08, 8, 16), createToonMaterial(0xffe082));
    shimeRope.position.set(0, 2.6, 32.55);

    shrineGroup.add(monument, monEmblem, shimeRope);
    this.addBuildingStructure(18 - 1.2, 18 + 1.2, 242 - 0.6, 242 + 0.6, 4.7, monument);

    // 3. Training Ground 44 Target Dummies (Wooden targets with shurikens embedded)
    const targetLocations = [
      { x: -7, z: 30 },
      { x: 7, z: 30 },
      { x: -5, z: 42 },
      { x: 5, z: 42 }
    ];

    targetLocations.forEach(tl => {
      const dummy = new THREE.Group();
      dummy.position.set(tl.x, 0, tl.z);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.45, 3.2, 14), createToonMaterial(0x6d4c41));
      post.position.y = 1.6;

      const targetHead = new THREE.Mesh(new THREE.SphereGeometry(0.48, 12, 10), createToonMaterial(0xd7ccc8));
      targetHead.position.y = 3.3;

      // Bullseye ring
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.15, 0.38, 16), createToonMaterial(0xc62828));
      ring.position.set(0, 2.2, 0.46);

      dummy.add(post, targetHead, ring);
      shrineGroup.add(dummy);

      // Add to training logs so player attacks hit and trigger damage numbers!
      this.trainingLogs.push({
        pos: new THREE.Vector3(18 + tl.x, 1.6, 210 + tl.z),
        radius: 0.85
      });
    });

    this.scene.add(shrineGroup);
  }

  buildShinobiWatchtower() {
    // Ancient Shinobi Outpost Watchtower (26 meters tall with 3 observation decks)
    const towerX = 125;
    const towerZ = 175;
    const towerGroup = new THREE.Group();
    towerGroup.position.set(towerX, 0, towerZ);

    const woodMat = createToonMaterial(0x5d4037, { roughness: 0.85 });
    const deckMat = createToonMaterial(0x8d6e63);
    const roofMat = createToonMaterial(0x263238);

    const pillarH = 26;
    const span = 4.0;

    // 4 Corner Pillars
    [[-span, -span], [span, -span], [-span, span], [span, span]].forEach(([px, pz]) => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, pillarH, 10), woodMat);
      pillar.position.set(px, pillarH / 2, pz);
      towerGroup.add(pillar);
    });

    // Observation Deck 1 (y = 9m, 10x10m) - Walkable with bottomY
    const d1Geo = new THREE.BoxGeometry(10, 0.5, 10);
    const d1 = new THREE.Mesh(d1Geo, deckMat);
    d1.position.y = 9;
    towerGroup.add(d1);
    this.addBuildingStructure(towerX - 5, towerX + 5, towerZ - 5, towerZ + 5, 9.25, d1, false, 8.5);

    // Observation Deck 2 (y = 17m, 8.5x8.5m)
    const d2Geo = new THREE.BoxGeometry(8.5, 0.5, 8.5);
    const d2 = new THREE.Mesh(d2Geo, deckMat);
    d2.position.y = 17;
    towerGroup.add(d2);
    this.addBuildingStructure(towerX - 4.25, towerX + 4.25, towerZ - 4.25, towerZ + 4.25, 17.25, d2, false, 16.5);

    // Observation Deck 3 / Lookout Crow's Nest (y = 25m, 7x7m) with safety railing
    const d3Geo = new THREE.BoxGeometry(7, 0.5, 7);
    const d3 = new THREE.Mesh(d3Geo, deckMat);
    d3.position.y = 25;
    towerGroup.add(d3);
    this.addBuildingStructure(towerX - 3.5, towerX + 3.5, towerZ - 3.5, towerZ + 3.5, 25.25, d3, false, 24.5);

    // Pagoda Roof on top
    const roofGeo = new THREE.ConeGeometry(6.5, 3.8, 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 28.5;
    roof.rotation.y = Math.PI / 4;
    towerGroup.add(roof);

    this.scene.add(towerGroup);
  }

  buildChakraSpringAndCampsite() {
    // Hidden Forest Chakra Spring & Ninja Campsite
    const springGroup = new THREE.Group();
    springGroup.position.copy(this.chakraSpringPos);

    const stoneMat = createToonMaterial(0x546e7a, { roughness: 0.8 });
    const chakraMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const woodMat = createToonMaterial(0x6d4c41);
    const fireMat = new THREE.MeshBasicMaterial({ color: 0xff3d00 });

    // Stone Pool Basin
    const basinGeo = new THREE.TorusGeometry(3.6, 0.55, 12, 24);
    const basin = new THREE.Mesh(basinGeo, stoneMat);
    basin.rotation.x = Math.PI / 2;
    basin.position.y = 0.2;

    // Glowing Cyan Chakra Pool
    const poolGeo = new THREE.CircleGeometry(3.4, 24);
    this.chakraPoolMesh = new THREE.Mesh(poolGeo, chakraMat);
    this.chakraPoolMesh.rotation.x = -Math.PI / 2;
    this.chakraPoolMesh.position.y = 0.25;

    // Pulsing Chakra Crystal Stalagmite at Center
    const crystalGeo = new THREE.ConeGeometry(0.8, 3.2, 6);
    this.chakraCrystal = new THREE.Mesh(crystalGeo, chakraMat);
    this.chakraCrystal.position.y = 1.6;

    springGroup.add(basin, this.chakraPoolMesh, this.chakraCrystal);

    // Cozy Ninja Campfire next to spring
    const campfire = new THREE.Group();
    campfire.position.set(8, 0, -4);
    const fireRing = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.25, 8, 14), stoneMat);
    fireRing.rotation.x = Math.PI / 2;
    const coals = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), fireMat);
    coals.position.y = 0.3;

    // 3 Sitting Logs around fire
    for (let l = 0; l < 3; l++) {
      const angle = l * (Math.PI * 2 / 3);
      const sitLog = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.4, 8), woodMat);
      sitLog.rotation.z = Math.PI / 2;
      sitLog.position.set(Math.cos(angle) * 2.6, 0.35, Math.sin(angle) * 2.6);
      sitLog.rotation.y = angle;
      campfire.add(sitLog);
    }
    campfire.add(fireRing, coals);
    springGroup.add(campfire);

    this.scene.add(springGroup);
  }

  buildOuterMountainBoundary() {
    // Impassable Dramatic Anime Mountain Ridges enclosing the outer world
    const mountainGroup = new THREE.Group();
    const cliffMat = createToonMaterial(0x455a64, { roughness: 0.85 });

    const cliffH = 38;

    // 1. South Mountain Ridge (z = 345 .. 365, x: -230 to 230)
    for (let x = -220; x <= 220; x += 40) {
      const rockW = 46;
      const rockD = 24;
      const rock = new THREE.Mesh(new THREE.BoxGeometry(rockW, cliffH, rockD), cliffMat);
      rock.position.set(x, cliffH / 2, 355);
      mountainGroup.add(rock);
      this.addBuildingStructure(x - rockW / 2, x + rockW / 2, 343, 367, cliffH, rock, true);
    }

    // 2. West Mountain Ridge (x = -225 .. -245, z: 95 to 355)
    for (let z = 105; z <= 345; z += 40) {
      const rockW = 24;
      const rockD = 46;
      const rock = new THREE.Mesh(new THREE.BoxGeometry(rockW, cliffH, rockD), cliffMat);
      rock.position.set(-235, cliffH / 2, z);
      mountainGroup.add(rock);
      this.addBuildingStructure(-247, -223, z - rockD / 2, z + rockD / 2, cliffH, rock, true);
    }

    // 3. East Mountain Ridge (x = 225 .. 245, z: 95 to 355)
    for (let z = 105; z <= 345; z += 40) {
      const rockW = 24;
      const rockD = 46;
      const rock = new THREE.Mesh(new THREE.BoxGeometry(rockW, cliffH, rockD), cliffMat);
      rock.position.set(235, cliffH / 2, z);
      mountainGroup.add(rock);
      this.addBuildingStructure(223, 247, z - rockD / 2, z + rockD / 2, cliffH, rock, true);
    }

    this.scene.add(mountainGroup);
  }

  clampPosition(pos, charRadius = 0.6) {
    const isAtopWall = pos.y >= 16.8;

    // 1. Hard North limit (Hokage Face Mountain)
    if (pos.z < -82) pos.z = -82;

    // 2. Inside Konoha Village vs Great Outer Forest
    if (pos.z <= 94) {
      // Inside Village
      const villageHalfW = (this.cityWidth / 2) - (isAtopWall ? 1.0 : 4.2);
      pos.x = Math.max(-villageHalfW, Math.min(villageHalfW, pos.x));
    } else {
      // Outside in the Great Shinobi Forest (z > 94)
      const forestMinX = -215;
      const forestMaxX = 215;
      const forestMaxZ = 340;

      pos.x = Math.max(forestMinX, Math.min(forestMaxX, pos.x));
      pos.z = Math.min(forestMaxZ, pos.z);
    }

    // 3. Resolve building and tree collisions
    this.resolveCollision(pos, charRadius);

    return pos;
  }

  update(dt) {
    this.clouds.forEach(c => {
      c.position.x += 1.8 * dt;
      if (c.position.x > 250) c.position.x = -250;
    });

    // Dynamic chakra spring pulsing glow
    if (this.chakraPoolMesh) {
      const pulse = 0.80 + Math.sin(performance.now() * 0.004) * 0.20;
      this.chakraPoolMesh.material.opacity = pulse;
    }
    if (this.chakraCrystal) {
      this.chakraCrystal.rotation.y += 0.8 * dt;
    }
  }
}
