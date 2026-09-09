// Konoha (Hidden Leaf Village) - Ultra-Atmospheric Anime City with Perimeter Fortress Walls, Dense Multi-Story Districts, Cables, and Rooftop Bridges
import * as THREE from 'three';
import { createToonMaterial, createAnimeWaterMaterial } from '../vfx/AnimeVFX.js';

export class KonohaCity {
  constructor(scene, vfx = null) {
    this.scene = scene;
    this.vfx = vfx;
    this.buildings = [];
    this.clouds = [];
    this.trainingLogs = [];
    this.pickups = [];

    // World Dimensions (Village + Expansive Great Shinobi Outer Forest)
    this.cityWidth = 260; // Expanded to 260m for dense new districts!
    this.cityDepth = 200;
    this.forestMinZ = 94;
    this.forestMaxZ = 345;
    this.worldWidth = 520;
    this.chakraSpringPos = new THREE.Vector3(-40, 0.4, 270);
    this.waterfallPos = new THREE.Vector3(-135, 1.0, 193);
    this.toriiPos = new THREE.Vector3(18, 1.2, 210);

    this.buildTerrainAndRiver();
    this.buildOuterDefensiveWalls();
    this.buildGrandSouthGateDoors();
    this.buildHokageMountain();
    this.buildHokageTowerPlaza();
    this.buildIchirakuRamenComplex();
    this.buildWeaponShopAndMerchant();
    this.buildMissionDeskAndKakashi();
    this.buildDenseDistricts();
    this.buildOverheadWiresAndLanterns();
    this.buildStreetMarketAndProps();
    this.buildSakuraTrees();
    this.buildStoneLanternsAndBenches();
    this.buildBarrelsCratesAndProps();
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

    // Stone Curbs along Main Avenue
    const curbMat = createToonMaterial(0x8d6e63);
    const curbGeo = new THREE.BoxGeometry(0.5, 0.25, 150);
    const curbLeft = new THREE.Mesh(curbGeo, curbMat);
    curbLeft.position.set(-7.1, 0.1, 10);
    curbLeft.receiveShadow = true;
    const curbRight = new THREE.Mesh(curbGeo, curbMat);
    curbRight.position.set(7.1, 0.1, 10);
    curbRight.receiveShadow = true;
    this.scene.add(curbLeft, curbRight);

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

    // Cross Streets and Side Avenues inside expanded Konoha Village
    const crossGeoWide = new THREE.PlaneGeometry(230, 9);
    const cross1 = new THREE.Mesh(crossGeoWide, aveMat);
    cross1.rotation.x = -Math.PI / 2;
    cross1.position.set(0, 0.02, 25);

    const cross2 = new THREE.Mesh(crossGeoWide, aveMat);
    cross2.rotation.x = -Math.PI / 2;
    cross2.position.set(0, 0.02, -22);

    const cross3 = new THREE.Mesh(crossGeoWide, aveMat);
    cross3.rotation.x = -Math.PI / 2;
    cross3.position.set(0, 0.02, 60);

    const crossSouthLane = new THREE.Mesh(new THREE.PlaneGeometry(210, 7), aveMat);
    crossSouthLane.rotation.x = -Math.PI / 2;
    crossSouthLane.position.set(0, 0.02, 80);

    // East Clan Avenue (Uchiha District Main Street)
    const eastAveGeo = new THREE.PlaneGeometry(9, 140);
    const eastAve = new THREE.Mesh(eastAveGeo, aveMat);
    eastAve.rotation.x = -Math.PI / 2;
    eastAve.position.set(52, 0.019, 12);

    // West Academy Avenue (Training & Medical District Main Street)
    const westAveGeo = new THREE.PlaneGeometry(9, 140);
    const westAve = new THREE.Mesh(westAveGeo, aveMat);
    westAve.rotation.x = -Math.PI / 2;
    westAve.position.set(-52, 0.019, 12);

    this.scene.add(cross1, cross2, cross3, crossSouthLane, eastAve, westAve);

    // Canal River through the village - animated anime water shader
    const riverGeo = new THREE.PlaneGeometry(11, 165);
    const riverMat = createAnimeWaterMaterial();
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(-38, 0.015, 10);
    river.receiveShadow = true;
    this.scene.add(river);

    // Stone Embankment walls lining both sides of the canal
    const stoneWallMat = createToonMaterial(0x78909c, { roughness: 0.7 });
    const canalWallGeo = new THREE.BoxGeometry(0.7, 0.55, 165);
    const wallL = new THREE.Mesh(canalWallGeo, stoneWallMat);
    wallL.position.set(-38 - 5.6, 0.22, 10);
    wallL.castShadow = true;
    wallL.receiveShadow = true;
    const wallR = new THREE.Mesh(canalWallGeo, stoneWallMat);
    wallR.position.set(-38 + 5.6, 0.22, 10);
    wallR.castShadow = true;
    wallR.receiveShadow = true;
    this.scene.add(wallL, wallR);

    // Floating Water Lilies & Lotus pads on the canal surface
    const padMat = createToonMaterial(0x2e7d32);
    const flowerMat = createToonMaterial(0xffffff);
    const flowerPinkMat = createToonMaterial(0xf48fb1);
    const padGeo = new THREE.CircleGeometry(0.65, 8);
    padGeo.rotateX(-Math.PI / 2);

    const lotusOffsets = [
      { x: -39, z: -15 }, { x: -37, z: -13 }, { x: -38, z: 2 },
      { x: -36.5, z: 8 }, { x: -39.2, z: 35 }, { x: -37.5, z: 42 },
      { x: -38.5, z: 75 }, { x: -36.8, z: 80 }
    ];

    lotusOffsets.forEach((lp, i) => {
      const lily = new THREE.Mesh(padGeo, padMat);
      lily.position.set(lp.x, 0.035, lp.z);
      lily.rotation.y = i * 1.3;

      // Blossom
      const blossom = new THREE.Mesh(
        new THREE.ConeGeometry(0.22, 0.25, 6),
        (i % 2 === 0) ? flowerMat : flowerPinkMat
      );
      blossom.position.set(0, 0.12, 0);
      lily.add(blossom);
      this.scene.add(lily);
    });

    // Arched Bridges across canal
    this.buildArchedBridge(-38, 25);
    this.buildArchedBridge(-38, -22);
    this.buildArchedBridge(-38, 60);
  }

  buildArchedBridge(x, z) {
    const bridge = new THREE.Group();
    bridge.position.set(x, 0, z);

    const redMat = createToonMaterial(0xb71c1c);
    const darkWoodMat = createToonMaterial(0x4e342e);
    const deckWoodMat = createToonMaterial(0x8d6e63);
    const goldMat = createToonMaterial(0xffb300);

    // Deck span
    const span = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 9), deckWoodMat);
    span.position.y = 0.6;
    span.castShadow = true;
    span.receiveShadow = true;

    // Red lacquered railings
    const rail1 = new THREE.Mesh(new THREE.BoxGeometry(14, 0.9, 0.2), redMat);
    rail1.position.set(0, 1.1, 4.2);
    rail1.castShadow = true;
    const rail2 = new THREE.Mesh(new THREE.BoxGeometry(14, 0.9, 0.2), redMat);
    rail2.position.set(0, 1.1, -4.2);
    rail2.castShadow = true;

    // Corner pillar posts with ornate golden finials
    [[-6.8, 4.2], [6.8, 4.2], [-6.8, -4.2], [6.8, -4.2]].forEach(([px, pz]) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 1.4, 8), redMat);
      post.position.set(px, 1.2, pz);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), goldMat);
      cap.position.set(px, 1.95, pz);
      bridge.add(post, cap);
    });

    // Foundation timber supports
    const pileL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 9), darkWoodMat);
    pileL.position.set(-5.5, 0.1, 0);
    const pileR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 9), darkWoodMat);
    pileR.position.set(5.5, 0.1, 0);

    bridge.add(span, rail1, rail2, pileL, pileR);
    this.scene.add(bridge);
  }

  buildSakuraTrees() {
    const sakuraGroup = new THREE.Group();

    const trunkMat = createToonMaterial(0x3e2723, { roughness: 0.85 });
    const blossomMats = [
      createToonMaterial(0xf8bbd0), // Light pastel sakura
      createToonMaterial(0xf48fb1), // Vibrant pink sakura
      createToonMaterial(0xf06292), // Deep blush sakura
      createToonMaterial(0xffcdd2)  // Soft blossom white-pink
    ];

    const createSakura = (x, z, scale = 1.0) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);

      // Curved organic trunk (2 connected angled segments)
      const h1 = 3.6 * scale;
      const trunk1 = new THREE.Mesh(new THREE.CylinderGeometry(0.6 * scale, 0.9 * scale, h1, 10), trunkMat);
      trunk1.position.set(0, h1 / 2, 0);
      trunk1.rotation.z = 0.08;
      trunk1.castShadow = true;
      tree.add(trunk1);

      const h2 = 3.2 * scale;
      const trunk2 = new THREE.Mesh(new THREE.CylinderGeometry(0.42 * scale, 0.6 * scale, h2, 10), trunkMat);
      trunk2.position.set(0.35 * scale, h1 + h2 / 2 - 0.2, 0);
      trunk2.rotation.z = -0.12;
      trunk2.castShadow = true;
      tree.add(trunk2);

      // Gnarled spreading branches
      const branchAngles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
      branchAngles.forEach((ang, bIdx) => {
        const brLen = (3.5 + (bIdx % 2) * 1.0) * scale;
        const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * scale, 0.35 * scale, brLen, 8), trunkMat);
        branch.rotation.z = Math.PI / 2.8;
        branch.rotation.y = ang;
        branch.position.set(
          Math.cos(ang) * (brLen * 0.4),
          h1 + h2 - 0.2 + (bIdx * 0.4),
          Math.sin(ang) * (brLen * 0.4)
        );
        tree.add(branch);
      });

      // Cloud Canopy Clusters (Faceted Sakura Blossom Volumes)
      const canopyCenterY = (h1 + h2 + 0.8) * scale;
      const clusterOffsets = [
        { x: 0, y: canopyCenterY + 1.2 * scale, z: 0, r: 3.6 * scale, m: 0 },
        { x: 2.2 * scale, y: canopyCenterY + 0.2 * scale, z: 1.2 * scale, r: 3.0 * scale, m: 1 },
        { x: -2.4 * scale, y: canopyCenterY + 0.5 * scale, z: 1.0 * scale, r: 3.2 * scale, m: 2 },
        { x: 0.8 * scale, y: canopyCenterY - 0.4 * scale, z: -2.6 * scale, r: 2.9 * scale, m: 3 },
        { x: -1.6 * scale, y: canopyCenterY - 0.2 * scale, z: -1.8 * scale, r: 2.7 * scale, m: 1 },
        { x: 1.8 * scale, y: canopyCenterY + 1.8 * scale, z: -0.8 * scale, r: 2.4 * scale, m: 0 }
      ];

      clusterOffsets.forEach(c => {
        const blossom = new THREE.Mesh(
          new THREE.DodecahedronGeometry(c.r, 1),
          blossomMats[c.m % blossomMats.length]
        );
        blossom.position.set(c.x, c.y, c.z);
        blossom.castShadow = true;
        tree.add(blossom);
      });

      sakuraGroup.add(tree);

      // Register solid trunk obstacle for smooth collision
      this.addCylinderStructure(x, z, 0.9 * scale, h1 + h2, tree);
    };

    // Strategic locations of Sakura across Konoha
    const sakuraLocs = [
      // Main Avenue line
      { x: -9.8, z: -32, s: 1.1 },
      { x: 9.8, z: -32, s: 1.1 },
      { x: -9.8, z: 4, s: 1.05 },
      { x: 9.8, z: 4, s: 1.05 },
      { x: -9.8, z: 40, s: 1.1 },
      { x: 9.8, z: 40, s: 1.1 },
      // Near South Entrance Gate
      { x: -19, z: 82, s: 1.2 },
      { x: 19, z: 82, s: 1.2 },
      // Beside Canal Embankment & Bridges
      { x: -31, z: 12, s: 1.0 },
      { x: -31, z: 48, s: 1.15 },
      { x: -46, z: 12, s: 1.05 },
      { x: -46, z: -8, s: 1.1 },
      // Hokage Plaza courtyard
      { x: -24, z: -38, s: 1.25 },
      { x: 24, z: -38, s: 1.25 },
      // Training Ground corner
      { x: -52, z: -25, s: 1.1 }
    ];

    sakuraLocs.forEach(loc => createSakura(loc.x, loc.z, loc.s));
    this.scene.add(sakuraGroup);
  }

  buildStoneLanternsAndBenches() {
    const propGroup = new THREE.Group();

    const stoneMat = createToonMaterial(0x78909c, { roughness: 0.8 });
    const woodMat = createToonMaterial(0x5d4037);
    const lanternGlowMat = new THREE.MeshBasicMaterial({ color: 0xffd54f });

    // 1. Japanese Kasuga Stone Lanterns (Tōrō)
    const createStoneLantern = (x, z) => {
      const lantern = new THREE.Group();
      lantern.position.set(x, 0, z);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.58, 0.35, 6), stoneMat);
      base.position.y = 0.175;
      base.castShadow = true;

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 1.3, 6), stoneMat);
      post.position.y = 0.95;
      post.castShadow = true;

      const shelf = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.35, 0.22, 6), stoneMat);
      shelf.position.y = 1.65;

      const firebox = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.45, 6), lanternGlowMat);
      firebox.position.y = 1.95;

      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.72, 0.45, 6), stoneMat);
      roof.position.y = 2.35;
      roof.castShadow = true;

      const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 6), stoneMat);
      jewel.position.y = 2.65;

      lantern.add(base, post, shelf, firebox, roof, jewel);
      propGroup.add(lantern);

      this.addCylinderStructure(x, z, 0.5, 2.7, lantern);
    };

    // 2. Traditional Wooden Resting Benches
    const createBench = (x, z, rotY = 0) => {
      const bench = new THREE.Group();
      bench.position.set(x, 0, z);
      bench.rotation.y = rotY;

      const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 0.8), woodMat);
      seat.position.y = 0.5;
      seat.castShadow = true;

      const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.1), woodMat);
      back.position.set(0, 0.9, -0.35);
      back.castShadow = true;

      [-0.95, 0.95].forEach(lx => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.7), woodMat);
        leg.position.set(lx, 0.25, 0);
        bench.add(leg);
      });

      bench.add(seat, back);
      propGroup.add(bench);
    };

    // Place Stone Lanterns along street borders and bridge entrances
    const lanternLocs = [
      { x: -8.0, z: -15 }, { x: 8.0, z: -15 },
      { x: -8.0, z: 20 }, { x: 8.0, z: 20 },
      { x: -8.0, z: 55 }, { x: 8.0, z: 55 },
      { x: -30.5, z: 25 }, { x: -45.5, z: 25 },
      { x: -30.5, z: -22 }, { x: -45.5, z: -22 },
      { x: -30.5, z: 60 }, { x: -45.5, z: 60 },
      { x: -14, z: -42 }, { x: 14, z: -42 },
      { x: -8.5, z: 86 }, { x: 8.5, z: 86 }
    ];
    lanternLocs.forEach(l => createStoneLantern(l.x, l.z));

    // Place Benches under Sakura trees along the Avenue
    createBench(-8.2, -6, Math.PI / 2);
    createBench(8.2, -6, -Math.PI / 2);
    createBench(-8.2, 32, Math.PI / 2);
    createBench(8.2, 32, -Math.PI / 2);
    createBench(0, -38, 0);

    this.scene.add(propGroup);
  }

  buildBarrelsCratesAndProps() {
    const propGroup = new THREE.Group();

    const barrelMat = createToonMaterial(0x6d4c41);
    const hoopMat = createToonMaterial(0x37474f);
    const crateMat = createToonMaterial(0x8d6e63);
    const leafSymbolMat = createToonMaterial(0xd32f2f);
    const bannerMat = createToonMaterial(0xfff8e1);
    const bannerRedMat = createToonMaterial(0xc62828);
    const grassMat1 = createToonMaterial(0x4caf50);
    const grassMat2 = createToonMaterial(0x2e7d32);

    // 1. Detailed Wooden Barrels
    const createBarrel = (x, y, z, rotX = 0, rotZ = 0) => {
      const barrel = new THREE.Group();
      barrel.position.set(x, y + 0.6, z);
      barrel.rotation.set(rotX, 0, rotZ);

      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 1.2, 12), barrelMat);
      body.castShadow = true;

      [-0.42, 0.42].forEach(hy => {
        const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.53, 0.035, 6, 14), hoopMat);
        hoop.rotation.x = Math.PI / 2;
        hoop.position.y = hy;
        barrel.add(hoop);
      });

      barrel.add(body);
      propGroup.add(barrel);
      return barrel;
    };

    // 2. Reinforced Ninja Supply Crates
    const createCrate = (x, y, z, size = 1.0, rotY = 0) => {
      const crate = new THREE.Group();
      crate.position.set(x, y + size / 2, z);
      crate.rotation.y = rotY;

      const box = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), crateMat);
      box.castShadow = true;

      const plaque = new THREE.Mesh(new THREE.PlaneGeometry(size * 0.45, size * 0.45), leafSymbolMat);
      plaque.position.set(0, 0, size / 2 + 0.01);
      crate.add(box, plaque);
      propGroup.add(crate);
      return crate;
    };

    // Stacks near Weapon Merchant
    createBarrel(-21, 0, 1);
    createBarrel(-21, 0, 2.4);
    createBarrel(-21.8, 0, 1.7);
    createCrate(-21.2, 0, 3.8, 1.1, 0.2);
    createCrate(-21.2, 1.1, 3.8, 0.9, -0.1);

    // Stacks near Ichiraku Ramen
    createBarrel(21.5, 0, -1.5);
    createBarrel(21.5, 0, -2.8);
    createCrate(21.8, 0, -4.2, 1.0, 0.3);

    // Stacks along South Gate
    createBarrel(-14, 0, 86);
    createBarrel(-14.8, 0, 87.2);
    createCrate(-14, 0, 88.5, 1.2, 0.15);
    createBarrel(14, 0, 86);
    createCrate(14.2, 0, 87.5, 1.0, -0.2);

    // 3. Konoha Crest Banners on Street Poles
    const createBannerPole = (x, z) => {
      const pole = new THREE.Group();
      pole.position.set(x, 0, z);

      const woodPole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 6.5, 8), hoopMat);
      woodPole.position.y = 3.25;
      woodPole.castShadow = true;

      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 6), hoopMat);
      bar.rotation.z = Math.PI / 2;
      bar.position.set(0.6, 5.8, 0);

      const cloth = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 3.2), bannerMat);
      cloth.position.set(0.6, 4.1, 0);
      const emblem = new THREE.Mesh(new THREE.CircleGeometry(0.35, 12), bannerRedMat);
      emblem.position.set(0.6, 4.5, 0.01);

      pole.add(woodPole, bar, cloth, emblem);
      propGroup.add(pole);
    };

    createBannerPole(-9.2, 70);
    createBannerPole(9.2, 70);
    createBannerPole(-9.2, -40);
    createBannerPole(9.2, -40);

    // 4. Stylized 3D Grass Tufts across village
    const grassGeo = new THREE.ConeGeometry(0.35, 0.7, 4);
    grassGeo.rotateX(Math.PI);
    grassGeo.translate(0, 0.35, 0);

    for (let g = 0; g < 45; g++) {
      const gx = (Math.random() - 0.5) * 160;
      const gz = (Math.random() - 0.5) * 160;
      if (Math.abs(gx) < 8.5) continue;
      if (gx > -44 && gx < -32) continue;

      const tuft = new THREE.Group();
      tuft.position.set(gx, 0, gz);
      for (let b = 0; b < 3; b++) {
        const blade = new THREE.Mesh(grassGeo, (b % 2 === 0) ? grassMat1 : grassMat2);
        blade.position.set((Math.random() - 0.5) * 0.4, 0, (Math.random() - 0.5) * 0.4);
        blade.rotation.y = Math.random() * Math.PI;
        blade.rotation.z = (Math.random() - 0.5) * 0.4;
        tuft.add(blade);
      }
      propGroup.add(tuft);
    }

    this.scene.add(propGroup);
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

    // Register Ichiraku with roofPeak = 2.5 for traditional tiled sloped roof
    this.addBuildingStructure(16 - w / 2, 16 + w / 2, 22 - d / 2, 22 + d / 2, h, shopGroup, false, 0, 2.5);
  }

  buildWeaponShopAndMerchant() {
    const shopGroup = new THREE.Group();
    shopGroup.position.set(-16, 0, 22);

    const woodMat = createToonMaterial(0x5d4037);
    const darkWoodMat = createToonMaterial(0x3e2723);
    const norenMat = createToonMaterial(0x1a237e); // Royal navy blue noren
    const goldMat = createToonMaterial(0xffb300);
    const tileMat = createToonMaterial(0x263238);
    const steelMat = createToonMaterial(0xf0f4f8, { roughness: 0.15 });
    const ironMat = createToonMaterial(0x37474f, { roughness: 0.5 });
    const redMat = createToonMaterial(0xd50000);
    const skinMat = createToonMaterial(0xffcca0, { roughness: 0.45 });
    const brassMat = createToonMaterial(0xffb74d, { roughness: 0.3 });
    const lensMat = createToonMaterial(0x00e5ff, { roughness: 0.1 });

    const w = 11;
    const d = 8.5;
    const h = 5.5;

    // 1. Building base & roof
    const base = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), woodMat);
    base.position.y = h / 2;

    const roof = new THREE.Mesh(new THREE.ConeGeometry(7.5, 2.6, 4), tileMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = h + 1.3;
    roof.scale.set(1.45, 1.0, 1.25);

    // Front Overhang Eaves & Lanterns
    const eave = new THREE.Mesh(new THREE.BoxGeometry(w + 1.0, 0.3, 2.4), darkWoodMat);
    eave.position.set(0, h - 0.2, d / 2 + 0.85);
    shopGroup.add(eave);

    for (let lx of [-4.2, 4.2]) {
      const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.75, 12), createToonMaterial(0xff7043));
      lantern.position.set(lx, h - 0.85, d / 2 + 0.85);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.09, 12), darkWoodMat);
      cap.position.set(lx, h - 0.45, d / 2 + 0.85);
      shopGroup.add(lantern, cap);
    }

    // 2. Wide Trade Counter
    const counter = new THREE.Mesh(new THREE.BoxGeometry(7.6, 1.2, 1.4), darkWoodMat);
    counter.position.set(0, 0.6, d / 2 + 0.7);

    // 3. Katana Stand (Katanakake) displaying 3 Mastercraft Combat Katanas
    const standGroup = new THREE.Group();
    standGroup.position.set(-2.0, 1.25, d / 2 + 0.7);

    const standBase = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.09, 0.45), darkWoodMat);
    const standPillar1 = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.65, 0.22), darkWoodMat);
    standPillar1.position.set(-0.65, 0.32, 0);
    const standPillar2 = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.65, 0.22), darkWoodMat);
    standPillar2.position.set(0.65, 0.32, 0);
    standGroup.add(standBase, standPillar1, standPillar2);

    const scabbardColors = [0x111111, 0xb71c1c, 0xf5f5f5];
    for (let k = 0; k < 3; k++) {
      const kGroup = new THREE.Group();
      kGroup.position.set(0, 0.18 + k * 0.18, 0);

      // Scabbard
      const scabbard = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 1.45, 8), createToonMaterial(scabbardColors[k]));
      scabbard.rotation.z = Math.PI / 2;

      // Golden Tsuba (Crossguard)
      const tsuba = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.022, 10), goldMat);
      tsuba.position.set(0.74, 0, 0);
      tsuba.rotation.z = Math.PI / 2;

      // Handle (Tsuka) with wrapping
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.40, 8), k === 1 ? goldMat : woodMat);
      handle.position.set(0.95, 0, 0);
      handle.rotation.z = Math.PI / 2;

      kGroup.add(scabbard, tsuba, handle);
      standGroup.add(kGroup);
    }
    shopGroup.add(standGroup);

    // 4. Blacksmith's Heavy Cast-Iron Anvil with Glowing Red-Hot Iron
    const anvilGroup = new THREE.Group();
    anvilGroup.position.set(2.4, 0, d / 2 + 1.8);

    const anvilLog = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.60, 0.75, 12), darkWoodMat);
    anvilLog.position.y = 0.375;

    const anvilBase = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.2, 0.55), ironMat);
    anvilBase.position.y = 0.85;
    const anvilWaist = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.3, 0.35), ironMat);
    anvilWaist.position.y = 1.05;
    const anvilTop = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.24, 0.48), steelMat);
    anvilTop.position.y = 1.25;

    // Conical Anvil Horn
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.45, 10), steelMat);
    horn.rotation.z = -Math.PI / 2;
    horn.position.set(0.68, 1.25, 0);

    // Glowing Red-Hot Steel Blade Blank
    const hotSteelMat = new THREE.MeshBasicMaterial({ color: 0xff3d00 });
    const hotBlade = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.04, 0.12), hotSteelMat);
    hotBlade.position.set(-0.1, 1.39, 0);

    // Subtle forge glow aura
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xff6d00, transparent: true, opacity: 0.35 });
    const forgeGlow = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), glowMat);
    forgeGlow.position.set(-0.1, 1.45, 0);

    anvilGroup.add(anvilLog, anvilBase, anvilWaist, anvilTop, horn, hotBlade, forgeGlow);
    shopGroup.add(anvilGroup);

    // Target Board with Kunai & Shuriken pinned
    const targetBoard = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.09, 16), woodMat);
    targetBoard.position.set(2.4, 1.7, d / 2 + 0.3);
    targetBoard.rotation.x = Math.PI / 2;

    const bullseye = new THREE.Mesh(new THREE.RingGeometry(0.12, 0.34, 16), redMat);
    bullseye.position.set(2.4, 1.7, d / 2 + 0.35);
    shopGroup.add(targetBoard, bullseye);

    // Embedded Kunai in target board
    for (let sh of [-0.18, 0.15]) {
      const kunaiBlade = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.22, 4), steelMat);
      kunaiBlade.rotation.x = -Math.PI / 2;
      kunaiBlade.position.set(2.4 + sh, 1.7 + sh * 0.5, d / 2 + 0.42);
      shopGroup.add(kunaiBlade);
    }

    // Ninjutsu Scrolls on counter
    for (let sc = 0; sc < 3; sc++) {
      const scroll = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.7, 10), createToonMaterial(0xffecb3));
      scroll.rotation.x = Math.PI / 2;
      scroll.position.set(0.6 + sc * 0.35, 1.25, d / 2 + 0.7);
      shopGroup.add(scroll);
    }

    // Shop Noren & Golden Crest Banner
    const noren = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 1.35), norenMat);
    noren.position.set(0, h - 0.85, d / 2 + 0.05);

    // Gold "WEAPONS / 武器" text plate
    const signPlate = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 0.6), darkWoodMat);
    signPlate.position.set(0, h - 0.85, d / 2 + 0.06);

    const crest = new THREE.Mesh(new THREE.CircleGeometry(0.38, 16), goldMat);
    crest.position.set(0, h - 0.85, d / 2 + 0.07);

    shopGroup.add(base, roof, counter, noren, signPlate, crest);

    // 5. HIGH-DETAIL 3D MASTER WEAPONSMITH NPC
    this.merchantGroup = new THREE.Group();
    this.merchantGroup.position.set(0, 0, d / 2 + 0.2); // Comfortably behind counter

    // Torso
    this.merchantTorso = new THREE.Group();
    this.merchantTorso.position.y = 1.1;

    // Indigo craftsman tunic (Samue)
    const mBody = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.34, 0.72, 18), createToonMaterial(0x0d47a1));
    // Heavy Stitched Blacksmith Apron
    const mApron = new THREE.Mesh(new THREE.CylinderGeometry(0.41, 0.36, 0.55, 18, 1, false, -1.0, 2.0), createToonMaterial(0x3e2723));
    mApron.position.y = -0.06;

    // Brass corner studs on apron
    for (let ax of [-0.22, 0.22]) {
      const stud = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), brassMat);
      stud.position.set(ax, 0.16, 0.39);
      mApron.add(stud);
    }

    // Sturdy leather tool belt
    const mBelt = new THREE.Mesh(new THREE.CylinderGeometry(0.415, 0.415, 0.11, 18), createToonMaterial(0x1a1a1a));
    mBelt.position.y = -0.16;
    const beltBuckle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.04), brassMat);
    beltBuckle.position.set(0, -0.16, 0.42);

    // Smithing Tongs tucked into belt on left hip
    const tongs = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.06), ironMat);
    tongs.position.set(-0.44, -0.18, 0.08);
    tongs.rotation.z = 0.25;

    this.merchantTorso.add(mBody, mApron, mBelt, beltBuckle, tongs);

    // Head
    this.merchantHead = new THREE.Group();
    this.merchantHead.position.y = 0.68;
    const mFace = new THREE.Mesh(new THREE.SphereGeometry(0.30, 18, 16), skinMat);
    mFace.scale.set(1.0, 1.15, 1.05);

    // Crimson Bandana
    const mBandana = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.14, 18), createToonMaterial(0xc62828));
    mBandana.position.y = 0.16;

    // Brass Smithing Goggles pushed up on forehead
    const goggleStrap = new THREE.Mesh(new THREE.CylinderGeometry(0.325, 0.325, 0.06, 18), createToonMaterial(0x1a1a1a));
    goggleStrap.position.y = 0.18;
    const goggleR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 10), brassMat);
    goggleR.rotation.x = Math.PI / 2;
    goggleR.position.set(0.12, 0.18, 0.30);
    const goggleLensR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.065, 10), lensMat);
    goggleLensR.rotation.x = Math.PI / 2;
    goggleLensR.position.set(0.12, 0.18, 0.305);

    const goggleL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 10), brassMat);
    goggleL.rotation.x = Math.PI / 2;
    goggleL.position.set(-0.12, 0.18, 0.30);
    const goggleLensL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.065, 10), lensMat);
    goggleLensL.rotation.x = Math.PI / 2;
    goggleLensL.position.set(-0.12, 0.18, 0.305);

    // Determined anime craftsman eyes & thick master mustache
    const mEyeMat = createToonMaterial(0x1a1a1a);
    const brow1 = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 0.02), mEyeMat);
    brow1.position.set(-0.11, 0.12, 0.31);
    brow1.rotation.z = -0.15;
    const brow2 = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 0.02), mEyeMat);
    brow2.position.set(0.11, 0.12, 0.31);
    brow2.rotation.z = 0.15;

    const eye1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.02), mEyeMat);
    eye1.position.set(-0.11, 0.06, 0.31);
    const eye2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.02), mEyeMat);
    eye2.position.set(0.11, 0.06, 0.31);

    // Thick master craftsman mustache & goatee
    const mStache = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.06), createToonMaterial(0x212121));
    mStache.position.set(0, -0.06, 0.32);
    const mBeard = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.20, 8), createToonMaterial(0x212121));
    mBeard.position.set(0, -0.24, 0.28);
    mBeard.rotation.x = 0.35;

    this.merchantHead.add(mFace, mBandana, goggleStrap, goggleR, goggleLensR, goggleL, goggleLensL, brow1, brow2, eye1, eye2, mStache, mBeard);
    this.merchantTorso.add(this.merchantHead);

    // Left Arm (resting relaxed on counter with white wrist wrap)
    const mArmGeo = new THREE.CylinderGeometry(0.12, 0.10, 0.65, 12);
    this.merchantLArm = new THREE.Mesh(mArmGeo, createToonMaterial(0x0d47a1));
    this.merchantLArm.position.set(-0.50, 0.24, 0);
    this.merchantLArm.rotation.set(0.4, 0, 0.22);
    const lWristWrap = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.16, 10), createToonMaterial(0xf5f5f5));
    lWristWrap.position.y = -0.22;
    this.merchantLArm.add(lWristWrap);

    // Right Arm: Welcoming Wave holding a Blacksmith Hammer!
    this.merchantRArm = new THREE.Group();
    this.merchantRArm.position.set(0.50, 0.24, 0);
    const rArmMesh = new THREE.Mesh(mArmGeo, createToonMaterial(0x0d47a1));
    rArmMesh.position.y = -0.32;
    const rWristWrap = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.16, 10), createToonMaterial(0xf5f5f5));
    rWristWrap.position.y = -0.22;
    rArmMesh.add(rWristWrap);

    // Smithing Hammer in hand
    const hammerHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.50, 8), darkWoodMat);
    hammerHandle.position.set(0, -0.38, 0.12);
    hammerHandle.rotation.x = 0.5;
    const hammerHead = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.18), steelMat);
    hammerHead.position.set(0, 0.22, 0);
    hammerHandle.add(hammerHead);

    this.merchantRArm.add(rArmMesh, hammerHandle);
    this.merchantRArm.rotation.set(0.2, 0, -0.2);

    this.merchantTorso.add(this.merchantLArm, this.merchantRArm);

    // Legs
    const mLegGeo = new THREE.CylinderGeometry(0.13, 0.11, 0.72, 12);
    const mLegL = new THREE.Mesh(mLegGeo, darkWoodMat);
    mLegL.position.set(-0.18, -0.65, 0);
    const mLegR = new THREE.Mesh(mLegGeo, darkWoodMat);
    mLegR.position.set(0.18, -0.65, 0);
    this.merchantTorso.add(mLegL, mLegR);

    this.merchantGroup.add(this.merchantTorso);
    shopGroup.add(this.merchantGroup);

    this.scene.add(shopGroup);

    // Save world position of merchant for player proximity interaction check
    this.merchantPos = new THREE.Vector3(-16, 0, 22 + d / 2 + 1.2);

    // Register building structure with sloped roof so it is solid and parkour-friendly!
    this.addBuildingStructure(-16 - w / 2, -16 + w / 2, 22 - d / 2, 22 + d / 2, h, shopGroup, false, 0, 2.6);
  }

  buildMissionDeskAndKakashi() {
    const postGroup = new THREE.Group();
    postGroup.position.set(7, 0, -22);

    const woodMat = createToonMaterial(0x5d4037);
    const darkWoodMat = createToonMaterial(0x3e2723);
    const redMat = createToonMaterial(0xb71c1c);
    const goldMat = createToonMaterial(0xffb300);
    const whiteMat = createToonMaterial(0xffffff);
    const tileMat = createToonMaterial(0x263238);
    const skinMat = createToonMaterial(0xffcca0, { roughness: 0.45 });
    const silverMat = createToonMaterial(0xe8ecef, { roughness: 0.3 }); // Crisp silver-white hair
    const navyMat = createToonMaterial(0x101a3c, { roughness: 0.5 }); // Dark navy shinobi uniform
    const flakMat = createToonMaterial(0x2e7d32, { roughness: 0.6 }); // Jonin green flak jacket
    const metalMat = createToonMaterial(0xf0f4f8, { roughness: 0.15 }); // Polished steel
    const orangeMat = createToonMaterial(0xff6d00); // Icha Icha orange
    const brassMat = createToonMaterial(0xffb300, { roughness: 0.3 });

    // 1. Mission Pavilion Canopy Roof
    const pillarMat = createToonMaterial(0x8d4f13);
    for (let px of [-2.4, 2.4]) {
      for (let pz of [-1.5, 1.5]) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 4.2, 10), pillarMat);
        pillar.position.set(px, 2.1, pz);
        postGroup.add(pillar);
      }
    }

    const canopy = new THREE.Mesh(new THREE.ConeGeometry(3.8, 1.5, 4), tileMat);
    canopy.rotation.y = Math.PI / 4;
    canopy.position.set(0, 4.45, 0);
    canopy.scale.set(1.4, 1.0, 1.1);

    // Hanging Red Lanterns on corners
    for (let lx of [-2.2, 2.2]) {
      const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.55, 10), createToonMaterial(0xff5722));
      lantern.position.set(lx, 3.4, 1.4);
      postGroup.add(lantern);
    }

    // 2. Mission Desk
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.15, 1.3), darkWoodMat);
    desk.position.set(0, 0.58, 0.6);

    // Front Leaf Mission Crest Banner
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.9), whiteMat);
    banner.position.set(0, 0.58, 1.26);
    const crest = new THREE.Mesh(new THREE.CircleGeometry(0.34, 16), redMat);
    crest.position.set(0, 0.58, 1.27);

    // Mission Scrolls stacked on desk
    const colors = [0x4caf50, 0x2196f3, 0xff9800, 0xe91e63, 0x9c27b0];
    for (let s = 0; s < 5; s++) {
      const scroll = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.6, 10), createToonMaterial(colors[s]));
      scroll.rotation.z = Math.PI / 2;
      scroll.position.set(-1.2 + s * 0.22, 1.22, 0.5);
      postGroup.add(scroll);
    }

    // Ink Pot and Feather Quill
    const inkPot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.14, 10), createToonMaterial(0x111111));
    inkPot.position.set(1.4, 1.22, 0.5);
    const quill = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.35, 6), whiteMat);
    quill.position.set(1.42, 1.35, 0.5);
    quill.rotation.z = -0.3;

    postGroup.add(canopy, desk, banner, crest, inkPot, quill);

    // 3. ULTRA-DETAILED 3D KAKASHI HATAKE MODEL
    this.kakashiGroup = new THREE.Group();
    this.kakashiGroup.position.set(0, 0, -0.2); // Positioned behind desk

    // Torso
    this.kakashiTorso = new THREE.Group();
    this.kakashiTorso.position.y = 1.15;

    // Dark navy inner shinobi shirt
    const innerShirt = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.32, 0.72, 18), navyMat);
    this.kakashiTorso.add(innerShirt);

    // Konoha Jonin Flak Jacket
    const vestGeo = new THREE.CylinderGeometry(0.40, 0.37, 0.54, 18);
    const vest = new THREE.Mesh(vestGeo, flakMat);
    vest.position.y = 0.08;

    // Rigid Protective High Neck Collar
    const collarGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.26, 16, 1, false, -2.0, 4.0);
    const collar = new THREE.Mesh(collarGeo, flakMat);
    collar.position.set(0, 0.38, -0.04);
    vest.add(collar);

    // Shoulder Epaulets
    for (let ex of [-0.42, 0.42]) {
      const epaulet = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.22), flakMat);
      epaulet.position.set(ex, 0.28, 0);
      vest.add(epaulet);
    }

    // 4 Distinct 3D Chest Utility Pouches with Brass Buttons
    const pouchPositions = [
      { x: -0.22, y: 0.12 },
      { x: 0.22, y: 0.12 },
      { x: -0.22, y: -0.08 },
      { x: 0.22, y: -0.08 }
    ];
    pouchPositions.forEach(pp => {
      const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.14, 0.10), flakMat);
      pouch.position.set(pp.x, pp.y, 0.38);
      const snap = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 6), brassMat);
      snap.position.set(0, 0.04, 0.055);
      pouch.add(snap);
      vest.add(pouch);
    });

    // Red Spiral Uzumaki Clan Crest on back
    const backSwirl = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.03, 8, 20), redMat);
    backSwirl.position.set(0, 0.08, -0.39);
    vest.add(backSwirl);

    this.kakashiTorso.add(vest);

    // Head
    this.kakashiHead = new THREE.Group();
    this.kakashiHead.position.y = 0.70;

    const headGeo = new THREE.SphereGeometry(0.28, 18, 16);
    const face = new THREE.Mesh(headGeo, skinMat);
    face.scale.set(0.98, 1.12, 1.02);

    // Blue Ninja Face Mask (anatomically covers mouth, jaw, and neck)
    const maskGeo = new THREE.CylinderGeometry(0.29, 0.26, 0.34, 18, 1, false, -0.4, 3.9);
    const mask = new THREE.Mesh(maskGeo, navyMat);
    mask.position.set(0, -0.08, 0.02);

    // Multi-Layered 16-Spike Silver Hair (Swept leftwards in true Kakashi style)
    this.kakashiHair = new THREE.Group();
    const hairSpikesData = [
      { x: 0.12, y: 0.25, z: 0.10, rx: -0.3, ry: 0.2, rz: 0.45, w: 0.13, h: 0.44 },
      { x: -0.06, y: 0.32, z: 0.12, rx: -0.2, ry: -0.1, rz: 0.55, w: 0.14, h: 0.48 },
      { x: -0.20, y: 0.28, z: 0.08, rx: -0.1, ry: -0.3, rz: 0.65, w: 0.13, h: 0.42 },
      { x: 0.18, y: 0.22, z: -0.08, rx: 0.2, ry: 0.3, rz: 0.40, w: 0.13, h: 0.45 },
      { x: 0.04, y: 0.38, z: -0.05, rx: 0.0, ry: 0.1, rz: 0.50, w: 0.15, h: 0.52 },
      { x: -0.15, y: 0.35, z: -0.06, rx: 0.1, ry: -0.2, rz: 0.60, w: 0.14, h: 0.48 },
      { x: -0.24, y: 0.25, z: -0.10, rx: 0.2, ry: -0.4, rz: 0.70, w: 0.12, h: 0.40 },
      { x: 0.10, y: 0.20, z: -0.18, rx: 0.4, ry: 0.2, rz: 0.35, w: 0.12, h: 0.42 },
      { x: -0.08, y: 0.26, z: -0.18, rx: 0.4, ry: -0.2, rz: 0.55, w: 0.13, h: 0.44 },
      { x: -0.02, y: 0.44, z: 0.02, rx: -0.1, ry: 0.0, rz: 0.48, w: 0.16, h: 0.54 },
      { x: 0.20, y: 0.14, z: 0.02, rx: 0.0, ry: 0.4, rz: 0.30, w: 0.11, h: 0.38 },
      { x: -0.22, y: 0.16, z: 0.00, rx: 0.0, ry: -0.5, rz: 0.75, w: 0.11, h: 0.38 }
    ];
    hairSpikesData.forEach(hd => {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(hd.w, hd.h, 6), silverMat);
      spike.position.set(hd.x, hd.y, hd.z);
      spike.rotation.set(hd.rx, hd.ry, hd.rz);
      this.kakashiHair.add(spike);
    });

    // Angled Leaf Village Forehead Protector (Tilted sharply over left eye)
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, 0.12, 18), navyMat);
    band.position.set(0, 0.14, 0);
    band.rotation.z = -0.28;

    // Curved Metallic Plate with Rivets
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.09, 14, 1, false, -0.65, 1.3), metalMat);
    plate.position.set(-0.04, 0.14, 0.04);
    plate.rotation.z = -0.28;

    // Engraved Leaf Insignia Symbol (Spiral + Leaf Tip)
    const leafSwirl = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.012, 6, 12), createToonMaterial(0x1a237e));
    leafSwirl.position.set(-0.06, 0.15, 0.33);
    leafSwirl.rotation.z = -0.28;
    const leafTriangle = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.06, 3), createToonMaterial(0x1a237e));
    leafTriangle.position.set(-0.02, 0.17, 0.33);
    leafTriangle.rotation.z = -0.7;

    // Right Eye: Sharp anime eye with pupil
    const eyeMat = createToonMaterial(0x111111);
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.02, 0.02), eyeMat);
    brow.position.set(0.12, 0.10, 0.28);
    brow.rotation.z = -0.15;
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.025, 0.02), eyeMat);
    eye.position.set(0.12, 0.05, 0.28);

    // Left Eye Sharingan hint: faint mysterious crimson glint under tilted headband
    const sharinganHint = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshBasicMaterial({ color: 0xd50000 }));
    sharinganHint.position.set(-0.08, 0.02, 0.29);

    this.kakashiHead.add(face, mask, this.kakashiHair, band, plate, leafSwirl, leafTriangle, brow, eye, sharinganHint);
    this.kakashiTorso.add(this.kakashiHead);

    // Left Arm (relaxed on desk with white wrist wraps and fingerless glove)
    const armGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.62, 10);
    this.lArm = new THREE.Mesh(armGeo, navyMat);
    this.lArm.position.set(-0.46, 0.22, 0.15);
    this.lArm.rotation.set(0.65, 0, 0.25);
    const lWrap = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.18, 10), whiteMat);
    lWrap.position.y = -0.22;
    this.lArm.add(lWrap);
    this.kakashiTorso.add(this.lArm);

    // Right Arm: Reading Signature Book (Icha Icha Tactics)
    this.kakashiRArm = new THREE.Group();
    this.kakashiRArm.position.set(0.46, 0.22, 0.05);
    const rArmMesh = new THREE.Mesh(armGeo, navyMat);
    rArmMesh.position.y = -0.26;
    rArmMesh.rotation.x = 0.85;
    rArmMesh.rotation.z = -0.2;
    const rWrap = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.18, 10), whiteMat);
    rWrap.position.y = -0.22;
    rArmMesh.add(rWrap);

    // Signature Book (Icha Icha Tactics) with Green Ribbon Bookmark
    const book = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.30, 0.08), orangeMat);
    book.position.set(0, -0.42, 0.28);
    book.rotation.set(0.4, 0.2, 0);

    const bookTitle = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.14), whiteMat);
    bookTitle.position.set(0, 0.04, 0.042);
    const bookmark = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.02), createToonMaterial(0x00e676));
    bookmark.position.set(0.04, 0.18, 0);
    book.add(bookTitle, bookmark);

    this.kakashiRArm.add(rArmMesh, book);
    this.kakashiTorso.add(this.kakashiRArm);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.72, 10);
    const lLeg = new THREE.Mesh(legGeo, navyMat);
    lLeg.position.set(-0.16, -0.65, 0);
    const rLeg = new THREE.Mesh(legGeo, navyMat);
    rLeg.position.set(0.16, -0.65, 0);

    // White bandage & kunai holster on right leg
    const bandage = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.20, 10), whiteMat);
    bandage.position.set(0.16, -0.55, 0);
    const holster = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.08), createToonMaterial(0x1a1a1a));
    holster.position.set(0.25, -0.55, 0);

    // Miniature kunai handles sticking out of holster
    for (let kh of [-0.03, 0.03]) {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 6), whiteMat);
      handle.position.set(0.25, -0.45, kh);
      this.kakashiTorso.add(handle);
    }

    this.kakashiTorso.add(lLeg, rLeg, bandage, holster);
    this.kakashiGroup.add(this.kakashiTorso);

    // 4. FLOATING 3D GOLDEN QUEST EXCLAMATION MARK (!)
    this.kakashiQuestIcon = new THREE.Group();
    this.kakashiQuestIcon.position.set(0, 2.75, 0);

    const goldGlowMat = new THREE.MeshBasicMaterial({ color: 0xffd600 });
    const markBar = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.52, 8), goldGlowMat);
    markBar.rotation.x = Math.PI;
    markBar.position.y = 0.28;

    const markDot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), goldGlowMat);
    markDot.position.y = -0.12;

    const markHalo = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.03, 8, 20), new THREE.MeshBasicMaterial({ color: 0xffab00, transparent: true, opacity: 0.8 }));
    markHalo.rotation.x = Math.PI / 2;
    markHalo.position.y = 0.18;

    this.kakashiQuestIcon.add(markBar, markDot, markHalo);
    this.kakashiGroup.add(this.kakashiQuestIcon);

    postGroup.add(this.kakashiGroup);
    this.scene.add(postGroup);

    // Store position for player proximity check
    this.questNpcPos = new THREE.Vector3(7, 0, -20.5);

    // Solid desk structure so player can't walk through it
    this.addBuildingStructure(4.8, 9.2, -23.0, -20.5, 1.4, postGroup, false);
  }

  buildDenseDistricts() {
    // 56 Authentic, Atmospheric Japanese Shinobi Buildings across East & West Districts
    const wallTones = [0xf5f5f5, 0xe8e8e8, 0xd7ccc8, 0xcfd8dc, 0xbcaaa4, 0xfff8e1, 0xefebe9];
    const roofTones = [0x263238, 0x1b5e20, 0x4e342e, 0x37474f, 0x2e7d32, 0x1a237e, 0x3e2723];

    const plots = [
      // -------------------------------------------------------------
      // EAST DISTRICT: Uchiha Clan Quarter, Tea Houses, Dango & High-Rises
      // -------------------------------------------------------------
      // Row 1 (z = -10): Commercial & Clan Street
      { x: 20, z: -10, w: 12, d: 12, h: 9, type: 'dango' },
      { x: 38, z: -10, w: 14, d: 14, h: 12, type: 'teahouse' },
      { x: 60, z: -10, w: 18, d: 16, h: 16, type: 'uchiha' },
      { x: 84, z: -10, w: 14, d: 14, h: 14, type: 'residential' },
      { x: 106, z: -10, w: 14, d: 14, h: 18, type: 'tower' },

      // Row 2 (z = 18): High-Rise Apartments & Clan Lane
      { x: 38, z: 18, w: 14, d: 14, h: 15, type: 'residential' },
      { x: 60, z: 18, w: 16, d: 16, h: 20, type: 'highrise' }, // 20m High-Rise!
      { x: 84, z: 18, w: 14, d: 14, h: 14, type: 'residential' },
      { x: 106, z: 18, w: 14, d: 14, h: 12, type: 'residential' },

      // Row 3 (z = 44): Residential & Commercial Alley
      { x: 20, z: 44, w: 12, d: 14, h: 13, type: 'residential' },
      { x: 38, z: 44, w: 14, d: 14, h: 17, type: 'highrise' },
      { x: 60, z: 44, w: 16, d: 16, h: 15, type: 'uchiha' },
      { x: 84, z: 44, w: 14, d: 14, h: 13, type: 'residential' },
      { x: 106, z: 44, w: 14, d: 14, h: 11, type: 'residential' },

      // Row 4 (z = 70): South-East Residential Quarter
      { x: 22, z: 70, w: 12, d: 12, h: 11, type: 'residential' },
      { x: 42, z: 70, w: 15, d: 14, h: 16, type: 'highrise' },
      { x: 64, z: 70, w: 16, d: 14, h: 13, type: 'residential' },
      { x: 86, z: 70, w: 14, d: 12, h: 10, type: 'residential' },
      { x: 108, z: 70, w: 14, d: 12, h: 9, type: 'residential' },

      // -------------------------------------------------------------
      // WEST DISTRICT: Ninja Academy, Hospital, Clan Estates & Dojos
      // -------------------------------------------------------------
      // Row 1 (z = -10): Academy Front & Archives
      { x: -20, z: -10, w: 12, d: 14, h: 13, type: 'residential' },
      { x: -64, z: -10, w: 22, d: 20, h: 22, type: 'academy' }, // Grand Academy Tower!
      { x: -94, z: -10, w: 18, d: 16, h: 14, type: 'library' },
      { x: -114, z: -10, w: 14, d: 14, h: 16, type: 'tower' },

      // Row 2 (z = 18): Academy Wing & Central Hospital
      { x: -44, z: 18, w: 14, d: 14, h: 14, type: 'residential' },
      { x: -68, z: 18, w: 18, d: 16, h: 15, type: 'residential' },
      { x: -94, z: 18, w: 18, d: 16, h: 17, type: 'hospital' }, // Konoha Central Hospital
      { x: -114, z: 18, w: 14, d: 14, h: 11, type: 'residential' },

      // Row 3 (z = 44): Yamanaka Flower Shop & Clan Compounds
      { x: -20, z: 44, w: 12, d: 14, h: 11, type: 'flowershop' },
      { x: -44, z: 44, w: 14, d: 14, h: 15, type: 'residential' },
      { x: -68, z: 44, w: 18, d: 16, h: 16, type: 'hyuga' },
      { x: -94, z: 44, w: 18, d: 16, h: 14, type: 'residential' },
      { x: -114, z: 44, w: 14, d: 14, h: 10, type: 'residential' },

      // Row 4 (z = 70): Clan Dojos & South-West Keep
      { x: -55, z: 70, w: 18, d: 14, h: 13, type: 'dojo' },
      { x: -85, z: 70, w: 16, d: 14, h: 12, type: 'residential' },
      { x: -110, z: 70, w: 14, d: 12, h: 10, type: 'residential' },

      // -------------------------------------------------------------
      // NORTH DISTRICT: Hokage Mountain Promenade & Administration
      // -------------------------------------------------------------
      { x: -36, z: -52, w: 18, d: 16, h: 16, type: 'anbu' },
      { x: -64, z: -52, w: 18, d: 16, h: 14, type: 'residential' },
      { x: -92, z: -52, w: 16, d: 14, h: 12, type: 'residential' },
      { x: -114, z: -52, w: 14, d: 14, h: 10, type: 'residential' },

      { x: 36, z: -52, w: 18, d: 16, h: 17, type: 'council' },
      { x: 64, z: -52, w: 18, d: 16, h: 14, type: 'residential' },
      { x: 92, z: -52, w: 16, d: 14, h: 12, type: 'residential' },
      { x: 114, z: -52, w: 14, d: 14, h: 10, type: 'residential' }
    ];

    plots.forEach((p, idx) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(p.x, 0, p.z);

      const wallMat = createToonMaterial(wallTones[idx % wallTones.length]);
      const roofMat = createToonMaterial(roofTones[idx % roofTones.length]);
      const timberMat = createToonMaterial(0x3e2723, {
        polygonOffset: true,
        polygonOffsetFactor: -1.0,
        polygonOffsetUnits: -4.0
      }); // Dark timber beams with polygonOffset depth priority
      const woodTrimMat = createToonMaterial(0x5d4037);
      const glassMat = createToonMaterial(0x90caf9, { roughness: 0.2 });
      const redMat = createToonMaterial(0xb71c1c);
      const whiteMat = createToonMaterial(0xffffff);

      // 1. Main Building Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(p.w, p.h, p.d), wallMat);
      body.position.y = p.h / 2;
      bGroup.add(body);

      // 2. 3D Timber Framework: 4 Vertical Corner Beams
      // Physically protrude outward from wall planes to eliminate Z-fighting noise completely
      const colW = 0.58;
      const colProtrude = 0.08; // 8cm protrusion past building wall surfaces
      for (let signX of [-1, 1]) {
        for (let signZ of [-1, 1]) {
          const cx = signX * (p.w / 2 + colProtrude - colW / 2);
          const cz = signZ * (p.d / 2 + colProtrude - colW / 2);
          const col = new THREE.Mesh(new THREE.BoxGeometry(colW, p.h + 0.04, colW), timberMat);
          col.position.set(cx, p.h / 2, cz);
          bGroup.add(col);
        }
      }

      // Horizontal Floor Dividers (Timber trims wrapping around exterior walls with positive depth margin)
      const floors = Math.max(1, Math.floor(p.h / 3.8));
      for (let f = 1; f < floors; f++) {
        const hBeam1 = new THREE.Mesh(new THREE.BoxGeometry(p.w + 0.24, 0.28, p.d + 0.24), timberMat);
        hBeam1.position.y = f * 3.8;
        bGroup.add(hBeam1);
      }

      // 3. Traditional Japanese Tiered Hip-and-Gable Roof (Irimoya-zukuri)
      const roofPeakH = 3.2;
      const roofGeo = new THREE.ConeGeometry(Math.max(p.w, p.d) * 0.74, roofPeakH, 4);
      roofGeo.rotateY(Math.PI / 4);
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = p.h + roofPeakH / 2;
      roof.scale.set(p.w / Math.max(p.w, p.d) * 1.16, 1.0, p.d / Math.max(p.w, p.d) * 1.16);

      // Overhang Eaves
      const eave = new THREE.Mesh(new THREE.BoxGeometry(p.w + 1.2, 0.35, p.d + 1.2), timberMat);
      eave.position.y = p.h + 0.18;
      bGroup.add(roof, eave);

      // Ridge Cap (Ornamental top finial)
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(p.w * 0.5, 0.28, 0.4), timberMat);
      ridge.position.y = p.h + roofPeakH;
      bGroup.add(ridge);

      // 4. Balconies & Exterior Walkways on Multi-Story Buildings
      if (p.h >= 12) {
        const balcGeo = new THREE.BoxGeometry(p.w + 0.6, 0.25, 2.0);
        const balc = new THREE.Mesh(balcGeo, woodTrimMat);
        balc.position.set(0, 7.5, p.d / 2 + 1.0);

        const rail = new THREE.Mesh(new THREE.BoxGeometry(p.w + 0.6, 0.85, 0.15), timberMat);
        rail.position.set(0, 8.0, p.d / 2 + 1.95);
        bGroup.add(balc, rail);

        // Decorative paper lantern under balcony
        const bLantern = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.5, 8), createToonMaterial(0xff3d00));
        bLantern.position.set(p.w * 0.35, 6.8, p.d / 2 + 0.8);
        bGroup.add(bLantern);
      }

      // 5. Windows Grid with Shoji Lattices
      for (let f = 1; f <= floors; f++) {
        for (let side of [-p.w * 0.26, p.w * 0.26]) {
          const winFrame = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.5, 0.16), timberMat);
          winFrame.position.set(side, f * 3.8 - 1.2, p.d / 2 + 0.08);
          const winGlass = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.2, 0.12), glassMat);
          winGlass.position.set(side, f * 3.8 - 1.2, p.d / 2 + 0.09);

          // Shoji cross grilles
          const grilleH = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.06, 0.16), timberMat);
          grilleH.position.set(side, f * 3.8 - 1.2, p.d / 2 + 0.11);
          const grilleV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.2, 0.16), timberMat);
          grilleV.position.set(side, f * 3.8 - 1.2, p.d / 2 + 0.11);

          bGroup.add(winFrame, winGlass, grilleH, grilleV);
        }
      }

      // 6. Ground-Floor Sliding Entrance Door & Stone Step
      const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.6, 0.22), timberMat);
      doorFrame.position.set(0, 1.3, p.d / 2 + 0.08);
      const doorLeaf1 = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.3, 0.08), woodTrimMat);
      doorLeaf1.position.set(-0.48, 1.25, p.d / 2 + 0.13);
      const doorLeaf2 = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.3, 0.08), woodTrimMat);
      doorLeaf2.position.set(0.48, 1.25, p.d / 2 + 0.13);
      const doorStep = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.2, 0.8), createToonMaterial(0x78909c));
      doorStep.position.set(0, 0.1, p.d / 2 + 0.45);
      bGroup.add(doorFrame, doorLeaf1, doorLeaf2, doorStep);

      // 7. Thematic Architectural Customizations
      if (p.type === 'uchiha') {
        // Uchiha Clan Crest on Gable
        const fanWhite = new THREE.Mesh(new THREE.CircleGeometry(0.7, 16, 0, Math.PI), whiteMat);
        fanWhite.position.set(0, p.h + 1.2, p.d / 2 + 0.3);
        const fanRed = new THREE.Mesh(new THREE.CircleGeometry(0.7, 16, Math.PI, Math.PI), redMat);
        fanRed.position.set(0, p.h + 1.2, p.d / 2 + 0.31);
        const fanHandle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.04), whiteMat);
        fanHandle.position.set(0, p.h + 0.4, p.d / 2 + 0.32);
        bGroup.add(fanWhite, fanRed, fanHandle);

      } else if (p.type === 'dango') {
        // Dango Shop: Colorful Awning & Outdoor Bench
        const awning = new THREE.Mesh(new THREE.BoxGeometry(p.w * 0.7, 0.15, 1.8), createToonMaterial(0xef5350));
        awning.position.set(0, 3.2, p.d / 2 + 0.9);
        awning.rotation.x = 0.15;
        // Outdoor Wooden Bench
        const bench = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 0.7), timberMat);
        bench.position.set(p.w * 0.25, 0.25, p.d / 2 + 1.4);
        bGroup.add(awning, bench);

      } else if (p.type === 'hospital') {
        // Medical Hospital Green Cross Emblem
        const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.6, 0.08), createToonMaterial(0x00e676));
        crossV.position.set(0, p.h * 0.75, p.d / 2 + 0.12);
        const crossH = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.08), createToonMaterial(0x00e676));
        crossH.position.set(0, p.h * 0.75, p.d / 2 + 0.13);
        bGroup.add(crossV, crossH);

      } else if (p.type === 'academy') {
        // Ninja Academy Rooftop Bell / Clock Tower
        const towerMat = createToonMaterial(0xb71c1c);
        const aTower = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 6), towerMat);
        aTower.position.y = p.h + roofPeakH + 3.0;
        const aRoof = new THREE.Mesh(new THREE.ConeGeometry(5, 2.5, 4), roofMat);
        aRoof.rotation.y = Math.PI / 4;
        aRoof.position.y = p.h + roofPeakH + 7.25;
        // Clock disc
        const clock = new THREE.Mesh(new THREE.CircleGeometry(1.2, 16), whiteMat);
        clock.position.set(0, p.h + roofPeakH + 3.0, 3.05);
        bGroup.add(aTower, aRoof, clock);

      } else if (p.type === 'flowershop') {
        // Yamanaka Flower Shop: Green Awning & Flower Planters
        const awning = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.15, 1.6), createToonMaterial(0x43a047));
        awning.position.set(0, 3.0, p.d / 2 + 0.8);
        awning.rotation.x = 0.15;
        const planter = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.4, 0.6), woodTrimMat);
        planter.position.set(0, 0.2, p.d / 2 + 1.2);
        // Colorful blossoms
        for (let fl = -2.2; fl <= 2.2; fl += 0.55) {
          const flower = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), createToonMaterial(fl % 2 === 0 ? 0xff4081 : 0xffeb3b));
          flower.position.set(fl, 0.45, p.d / 2 + 1.2);
          bGroup.add(flower);
        }
        bGroup.add(awning, planter);

      } else if (p.type === 'anbu') {
        // Anbu Mask Shield Badge on front
        const anbuBadge = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 16), whiteMat);
        anbuBadge.rotation.x = Math.PI / 2;
        anbuBadge.position.set(0, p.h * 0.72, p.d / 2 + 0.12);
        const anbuSymbol = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.6, 16), redMat);
        anbuSymbol.position.set(0, p.h * 0.72, p.d / 2 + 0.18);
        bGroup.add(anbuBadge, anbuSymbol);
      }

      // 8. Rooftop Parkour Props (Water Tanks, Chimneys, Antennas)
      if (idx % 3 === 0) {
        // Water Tank on timber stilts
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.2, 16), createToonMaterial(0x78909c));
        tank.position.set(p.w * 0.22, p.h + 1.1, p.d * 0.22);
        bGroup.add(tank);
      } else if (idx % 3 === 1) {
        // Brick Chimney
        const vent = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 1.2), createToonMaterial(0x8d6e63));
        vent.position.set(-p.w * 0.25, p.h + 0.8, 0);
        bGroup.add(vent);
      } else {
        // Metal Antenna
        const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.5, 6), createToonMaterial(0x37474f));
        antenna.position.set(p.w * 0.25, p.h + 1.75, -p.d * 0.2);
        bGroup.add(antenna);
      }

      this.scene.add(bGroup);

      // Register building structure with roofPeakH = 3.2m so sloped Japanese roof is fully solid and walkable!
      this.addBuildingStructure(
        p.x - p.w / 2, p.x + p.w / 2,
        p.z - p.d / 2, p.z + p.d / 2,
        p.h, bGroup, false, 0, roofPeakH
      );
    });

    // Rooftop Ninja Walkway Bridges connecting adjacent buildings for parkour!
    this.buildRooftopBridge(20, 38, -10, -10, 12);
    this.buildRooftopBridge(38, 60, -10, -10, 14);
    this.buildRooftopBridge(60, 84, -10, -10, 14);
    this.buildRooftopBridge(38, 60, 18, 18, 15);
    this.buildRooftopBridge(60, 84, 18, 18, 14);
    this.buildRooftopBridge(20, 38, 44, 44, 13);
    this.buildRooftopBridge(38, 60, 44, 44, 15);
    this.buildRooftopBridge(-64, -94, -10, -10, 14);
    this.buildRooftopBridge(-68, -94, 18, 18, 15);
    this.buildRooftopBridge(-44, -68, 44, 44, 15);
    this.buildRooftopBridge(36, 64, -52, -52, 14);
    this.buildRooftopBridge(-36, -64, -52, -52, 14);
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

    // Register solid walkable platform structure for the ninja rooftop bridge
    const minBx = Math.min(x1, x2) - 1.2;
    const maxBx = Math.max(x1, x2) + 1.2;
    const minBz = Math.min(z1, z2) - 1.2;
    const maxBz = Math.max(z1, z2) + 1.2;
    this.addBuildingStructure(minBx, maxBx, minBz, maxBz, height + 0.3, bridge, false, height - 0.4);
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
    const skyGeo = new THREE.SphereGeometry(680, 32, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x64b5f6,
      side: THREE.BackSide,
      fog: false
    });
    this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.skyMesh.position.set(0, 0, 120);
    this.scene.add(this.skyMesh);

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

  addBuildingStructure(minX, maxX, minZ, maxZ, height, group, isWall = false, bottomY = 0, roofPeak = 0) {
    this.buildings.push({
      shape: 'box',
      minX: Math.min(minX, maxX),
      maxX: Math.max(minX, maxX),
      minZ: Math.min(minZ, maxZ),
      maxZ: Math.max(minZ, maxZ),
      height: height,
      roofY: height,
      roofPeak: roofPeak,
      bottomY: bottomY,
      isWall: isWall,
      mesh: group
    });
  }

  addCylinderStructure(centerX, centerZ, radius, height, group, isWall = false, bottomY = 0, roofPeak = 0) {
    this.buildings.push({
      shape: 'cylinder',
      centerX: centerX,
      centerZ: centerZ,
      radius: radius,
      height: height,
      roofY: height,
      roofPeak: roofPeak,
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
          let surfaceY = b.roofY;
          if (b.roofPeak && b.roofPeak > 0) {
            const curR = Math.sqrt(dx * dx + dz * dz);
            const normR = Math.min(1.0, curR / (b.radius + 0.3));
            surfaceY = b.roofY + 0.2 + (1.0 - normR) * b.roofPeak;
          }
          if (curY >= b.roofY - 1.5) {
            if (surfaceY > highestGround) {
              highestGround = surfaceY;
            }
          }
        }
      } else {
        const pad = 0.5;
        if (x >= b.minX - pad && x <= b.maxX + pad && z >= b.minZ - pad && z <= b.maxZ + pad) {
          let surfaceY = b.roofY;

          // If the building has a traditional sloped hip-and-gable roof
          if (b.roofPeak && b.roofPeak > 0) {
            const cx = (b.minX + b.maxX) / 2;
            const cz = (b.minZ + b.maxZ) / 2;
            const hw = Math.max(0.001, (b.maxX - b.minX) / 2);
            const hd = Math.max(0.001, (b.maxZ - b.minZ) / 2);
            // Distance fraction from peak ridge to eaves (0 at center peak, 1 at eaves edge)
            const nx = Math.abs(x - cx) / (hw + 0.6);
            const nz = Math.abs(z - cz) / (hd + 0.6);
            const distFromPeak = Math.min(1.0, Math.max(nx, nz));
            // Exact Japanese roof slope: eaves are at roofY + 0.35, rising to peak at roofY + roofPeak
            surfaceY = b.roofY + 0.35 + (1.0 - distFromPeak) * (b.roofPeak - 0.15);
          }

          if (curY >= b.roofY - 1.5) {
            if (surfaceY > highestGround) {
              highestGround = surfaceY;
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
      const roofTop = b.roofY + (b.roofPeak || 0);
      if (desiredCamPos.y < bottom || desiredCamPos.y >= roofTop) continue;

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
    const waterMat = createAnimeWaterMaterial();
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

  update(dt, camera = null) {
    if (camera && this.skyMesh) {
      this.skyMesh.position.copy(camera.position);
    }

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

    // Merchant NPC Idle & Greeting Animation
    if (this.merchantTorso) {
      const time = performance.now() * 0.003;
      // Gentle breathing
      this.merchantTorso.position.y = 1.1 + Math.sin(time * 2.2) * 0.02;
      if (this.merchantHead) {
        this.merchantHead.rotation.y = Math.sin(time * 1.2) * 0.12;
      }
      if (this.merchantRArm) {
        // Welcoming greeting wave
        this.merchantRArm.rotation.x = -1.2 + Math.sin(time * 3.5) * 0.25;
        this.merchantRArm.rotation.z = -0.5 + Math.sin(time * 4.0) * 0.2;
      }
    }

    // Kakashi Hatake NPC Idle & Floating Quest Icon Animation
    if (this.kakashiTorso) {
      const time = performance.now() * 0.003;
      this.kakashiTorso.position.y = 1.15 + Math.sin(time * 2.0) * 0.015;
      if (this.kakashiHead) {
        this.kakashiHead.rotation.y = Math.sin(time * 0.9) * 0.08;
      }
      if (this.kakashiRArm) {
        // Reading signature book / subtle tilt
        this.kakashiRArm.rotation.x = 0.85 + Math.sin(time * 1.5) * 0.05;
      }
      if (this.kakashiQuestIcon) {
        this.kakashiQuestIcon.position.y = 2.75 + Math.sin(time * 3.5) * 0.12;
        this.kakashiQuestIcon.rotation.y += 0.03;
      }
    }

    // Atmospheric Waterfall Spray & Sacred Forest Fireflies
    if (this.vfx) {
      if (Math.random() < 0.38 && this.waterfallPos) {
        this.vfx.spawnWaterfallMist(this.waterfallPos, 2);
      }
      if (Math.random() < 0.12 && this.toriiPos) {
        this.vfx.spawnForestFireflies(this.toriiPos, 2);
      }
      if (Math.random() < 0.16 && this.chakraSpringPos) {
        this.vfx.spawnForestFireflies(this.chakraSpringPos, 2);
      }
    }
  }
}
