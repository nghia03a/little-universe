/* Hiệu ứng: starfield, sao băng, bụi sáng, cánh hoa/trái tim, typewriter, heart constellation */
(function () {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = document.getElementById('sky'), cx = cv.getContext('2d');
  let W, H, D, stars = [], dust = [], parts = [], shoot = null, nextShoot = 3000, convT = 0, px = 0, py = 0, rainOn = false;

  function size() {
    D = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    cv.width = W * D; cv.height = H * D; cx.setTransform(D, 0, 0, D, 0, 0);
    const n = Math.min(220, Math.round(W * H / 7000));
    stars = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, z: Math.random() * .9 + .1, r: Math.random() * 1.3 + .3, p: Math.random() * 6.28, s: Math.random() * 1.5 + .5 }));
    dust = Array.from({ length: 36 }, () => ({ x: Math.random() * W, y: Math.random() * H, vy: -(Math.random() * .2 + .05), r: Math.random() * 1.6 + .6, p: Math.random() * 6.28 }));
  }
  addEventListener('resize', size); size();
  addEventListener('pointermove', e => { px = e.clientX / W - .5; py = e.clientY / H - .5; });

  LU.converge = () => { convT = performance.now(); };        // các ngôi sao hội tụ
  LU.rain = on => { rainOn = on; };                           // cánh hoa rơi
  LU.burst = (x, y, kind, n) => {                             // petal / heart bay lên
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, v = 1 + Math.random() * 3;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, g: .04, life: 1, d: .006 + Math.random() * .006, k: kind, r: 5 + Math.random() * 6, rot: Math.random() * 6, c: Math.random() < .5 ? '#F5B8D2' : '#A78BFA' });
    }
  };

  function loop(t) {
    cx.clearRect(0, 0, W, H);
    let c = 0;
    if (convT) { const k = (t - convT) / 1600; if (k < 1) c = Math.sin(k * Math.PI); else convT = 0; }
    cx.fillStyle = '#F4F1FF';
    for (const s of stars) {
      const tw = RM ? .8 : .55 + .45 * Math.sin(t / 700 * s.s + s.p);
      const x = s.x - px * 30 * s.z, y = s.y - py * 30 * s.z;
      cx.globalAlpha = tw * (.4 + s.z * .6);
      cx.beginPath(); cx.arc(x + (W / 2 - x) * c * .85, y + (H / 2 - y) * c * .85, s.r * (1 + c), 0, 6.283); cx.fill();
    }
    if (!RM) {
      if (!shoot && t > nextShoot) { shoot = { x: W * (.3 + Math.random() * .7), y: Math.random() * H * .4, l: 1 }; nextShoot = t + 4000 + Math.random() * 5000; }
      if (shoot) {
        const g = cx.createLinearGradient(shoot.x, shoot.y, shoot.x + 90, shoot.y - 55);
        g.addColorStop(0, 'rgba(244,241,255,' + shoot.l + ')'); g.addColorStop(1, 'rgba(244,241,255,0)');
        cx.globalAlpha = 1; cx.strokeStyle = g; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(shoot.x, shoot.y); cx.lineTo(shoot.x + 90, shoot.y - 55); cx.stroke();
        shoot.x -= 9; shoot.y += 5.5; shoot.l -= .018; if (shoot.l <= 0) shoot = null;
      }
      cx.fillStyle = '#8EC5FC';
      for (const d of dust) {
        d.y += d.vy; d.x += Math.sin(t / 2000 + d.p) * .15; if (d.y < -5) { d.y = H + 5; d.x = Math.random() * W; }
        cx.globalAlpha = .25 + .2 * Math.sin(t / 900 + d.p); cx.beginPath(); cx.arc(d.x, d.y, d.r, 0, 6.283); cx.fill();
      }
      if (rainOn && Math.random() < .12) parts.push({ x: Math.random() * W, y: -10, vx: 0, vy: 1.3, g: 0, life: 1, d: .002, k: 'petal', r: 5 + Math.random() * 4, rot: Math.random() * 6, c: '#F5B8D2', sway: 1 });
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.vy += p.g; p.x += p.vx + (p.sway ? Math.sin(t / 600 + p.rot) * .6 : 0); p.y += p.vy; p.rot += .03; p.life -= p.d;
      if (p.life <= 0 || p.y > H + 20) { parts.splice(i, 1); continue; }
      cx.globalAlpha = Math.min(1, p.life * 1.5); cx.fillStyle = p.c;
      if (p.k === 'heart') { cx.font = p.r * 2.4 + 'px serif'; cx.fillText('♥', p.x, p.y); }
      else { cx.beginPath(); cx.ellipse(p.x, p.y, p.r, p.r * .55, p.rot, 0, 6.283); cx.fill(); }
    }
    cx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* Typewriter (bấm vào thư để hiện nhanh toàn bộ) */
  let tok = 0, curT = null;
  LU.type = (el, txt, sp = 30) => new Promise(res => {
    const my = ++tok; curT = { el, txt };
    if (RM) { el.textContent = txt; return res(); }
    el.textContent = ''; let i = 0;
    (function step() {
      if (my !== tok || i >= txt.length) return res();
      el.textContent += txt[i++]; el.scrollTop = el.scrollHeight; setTimeout(step, sp);
    })();
  });
  LU.cancelType = () => { tok++; };
  LU.finishType = () => { if (curT) { tok++; curT.el.textContent = curT.txt; } };

  /* Heart Constellation: các ngôi sao ghép thành trái tim */
  LU.heartSky = svg => {
    const NS = 'http://www.w3.org/2000/svg', pts = [];
    svg.innerHTML = '';
    for (let i = 0; i < 30; i++) { const t = i / 30 * 6.2832; pts.push([16 * Math.pow(Math.sin(t), 3), -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]); }
    const line = document.createElementNS(NS, 'polygon');
    line.setAttribute('points', pts.map(p => p.join(',')).join(' ')); line.setAttribute('class', 'h-line'); svg.appendChild(line);
    pts.forEach((p, i) => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', p[0]); c.setAttribute('cy', p[1]); c.setAttribute('r', .55); c.setAttribute('class', 'h-star');
      c.style.animationDelay = (i * .12) + 's'; svg.appendChild(c);
    });
  };
})();
