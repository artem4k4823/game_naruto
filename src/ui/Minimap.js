// Shinobi Anime Radar Minimap: Visualizes Player, Kakashi, Merchant, Enemies, and Mission Zones
export class Minimap {
  constructor(canvasId = 'minimap-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.cx = this.width / 2;
      this.cy = this.height / 2;
      this.radius = (this.width / 2) - 8;
    }
    this.scale = 0.62; // 1 world unit = ~0.62 radar pixels (shows ~125m range)
  }

  update(player, enemies = [], city = null, questManager = null) {
    if (!this.ctx || !player) return;

    const ctx = this.ctx;
    const cx = this.cx;
    const cy = this.cy;
    const r = this.radius;
    const scale = this.scale;
    const playerX = player.position.x;
    const playerZ = player.position.z;

    // Clear canvas
    ctx.clearRect(0, 0, this.width, this.height);

    // Save for circular clipping
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // 1. Radar Ground Background
    const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, r);
    bgGrad.addColorStop(0, 'rgba(12, 22, 18, 0.94)');
    bgGrad.addColorStop(0.7, 'rgba(10, 18, 26, 0.94)');
    bgGrad.addColorStop(1, 'rgba(6, 10, 16, 0.98)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Concentric Distance Range Rings (40m, 80m)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    [40, 80].forEach(range => {
      ctx.beginPath();
      ctx.arc(cx, cy, range * scale, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 3. Village Walls & Main Road
    const worldToRadar = (wx, wz) => {
      return {
        x: cx + (wx - playerX) * scale,
        y: cy + (wz - playerZ) * scale
      };
    };

    // Main Avenue
    const aveStart = worldToRadar(0, -35);
    const aveEnd = worldToRadar(0, 85);
    ctx.strokeStyle = 'rgba(215, 204, 200, 0.22)';
    ctx.lineWidth = 14 * scale;
    ctx.beginPath();
    ctx.moveTo(aveStart.x, aveStart.y);
    ctx.lineTo(aveEnd.x, aveEnd.y);
    ctx.stroke();

    // Village Fortress Walls Outline
    ctx.strokeStyle = 'rgba(96, 125, 139, 0.35)';
    ctx.lineWidth = 4;
    const wallHalfW = 130;
    const wallHalfD = 100;
    const wTopLeft = worldToRadar(-wallHalfW, -wallHalfD);
    const wTopRight = worldToRadar(wallHalfW, -wallHalfD);
    const wBotRight = worldToRadar(wallHalfW, wallHalfD);
    const wBotLeft = worldToRadar(-wallHalfW, wallHalfD);

    ctx.beginPath();
    ctx.moveTo(wTopLeft.x, wTopLeft.y);
    ctx.lineTo(wTopRight.x, wTopRight.y);
    ctx.lineTo(wBotRight.x, wBotRight.y);
    ctx.lineTo(wBotLeft.x, wBotLeft.y);
    ctx.closePath();
    ctx.stroke();

    // 4. Active Quest Zone Waypoint (Pulsing Circle Beacon)
    if (questManager && questManager.activeQuest) {
      const q = questManager.activeQuest;
      const zonePos = worldToRadar(q.zoneCenter.x, q.zoneCenter.z);
      const time = performance.now() * 0.003;
      const pulseRadius = (q.zoneRadius * scale) * (1 + Math.sin(time * 3) * 0.08);

      // Zone fill
      ctx.fillStyle = 'rgba(255, 152, 0, 0.12)';
      ctx.beginPath();
      ctx.arc(zonePos.x, zonePos.y, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Zone border
      ctx.strokeStyle = 'rgba(255, 170, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(zonePos.x, zonePos.y, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 5. Merchant Blip (Weapon Shop)
    if (city && city.merchantPos) {
      const mPos = worldToRadar(city.merchantPos.x, city.merchantPos.z);
      const d = Math.hypot(mPos.x - cx, mPos.y - cy);
      let renderX = mPos.x;
      let renderY = mPos.y;

      if (d > r - 10) {
        const angle = Math.atan2(mPos.y - cy, mPos.x - cx);
        renderX = cx + Math.cos(angle) * (r - 10);
        renderY = cy + Math.sin(angle) * (r - 10);
      }

      ctx.fillStyle = '#ffb300';
      ctx.beginPath();
      ctx.arc(renderX, renderY, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Mini text tag
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#ffe082';
      ctx.fillText('🪙', renderX - 4.5, renderY - 7);
    }

    // 6. Quest Giver NPC (Kakashi Hatake)
    if (city && city.questNpcPos) {
      const kPos = worldToRadar(city.questNpcPos.x, city.questNpcPos.z);
      const d = Math.hypot(kPos.x - cx, kPos.y - cy);
      let renderX = kPos.x;
      let renderY = kPos.y;

      if (d > r - 10) {
        const angle = Math.atan2(kPos.y - cy, kPos.x - cx);
        renderX = cx + Math.cos(angle) * (r - 10);
        renderY = cy + Math.sin(angle) * (r - 10);
      }

      ctx.fillStyle = '#00e5ff';
      ctx.beginPath();
      ctx.arc(renderX, renderY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Exclamation badge
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#ffd600';
      ctx.fillText('!', renderX - 2, renderY - 8);
    }

    // 7. Enemy Blips
    enemies.forEach(enemy => {
      if (enemy.isDead) return;

      const ePos = worldToRadar(enemy.position.x, enemy.position.z);
      const dist = Math.hypot(ePos.x - cx, ePos.y - cy);
      let renderX = ePos.x;
      let renderY = ePos.y;
      const isClamped = dist > r - 10;

      if (isClamped) {
        const angle = Math.atan2(ePos.y - cy, ePos.x - cx);
        renderX = cx + Math.cos(angle) * (r - 10);
        renderY = cy + Math.sin(angle) * (r - 10);
      }

      const isAkatsuki = enemy.type === 'akatsuki';

      if (isAkatsuki) {
        // Elite Akatsuki Marker (Crimson diamond with white border)
        ctx.fillStyle = '#d50000';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        const size = isClamped ? 4.5 : 5.5;

        ctx.beginPath();
        ctx.moveTo(renderX, renderY - size);
        ctx.lineTo(renderX + size, renderY);
        ctx.lineTo(renderX, renderY + size);
        ctx.lineTo(renderX - size, renderY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        // Rogue Ninja Marker (Red circular dot)
        ctx.fillStyle = '#ff1744';
        ctx.strokeStyle = 'rgba(0,0,0,0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(renderX, renderY, isClamped ? 3.5 : 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    });

    // 8. Player Arrowhead Marker (Naruto) in Center
    ctx.save();
    ctx.translate(cx, cy);
    // Three.js rotationY: 0 is facing +Z (down on map), PI is facing -Z (up on map)
    ctx.rotate(player.rotationY);

    // Arrowhead shape
    ctx.fillStyle = '#ff7700';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(-7, -8);
    ctx.lineTo(0, -4);
    ctx.lineTo(7, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central cyan chakra core
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(0, -1, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Restore clip
    ctx.restore();

    // 9. Brass Anime Outer Bezel & Compass Points
    ctx.strokeStyle = '#ff9d00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
    ctx.stroke();

    // North Compass Indicator "N"
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#ffaa00';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', cx, cy - r + 11);
  }
}
