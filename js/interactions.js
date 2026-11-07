/* Tương tác của từng chương */
(function () {
  const $ = s => document.querySelector(s), S = LU.STORY;
  const show = (el, on) => el.classList.toggle('hide', !on);
  const rect = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  /* Chương 1: phong thư */
  LU.enter[1] = () => { $('#envelope').classList.remove('open'); $('#openBtn').disabled = false; };
  function openEnvelope() {
    const e = $('#envelope'); if (e.classList.contains('open')) return;
    e.classList.add('open'); $('#openBtn').disabled = true;
    LU.converge(); document.body.classList.add('glow'); LU.musicStart();
    setTimeout(() => { LU.go(2); document.body.classList.remove('glow'); }, 1900);
  }
  $('#envelope').addEventListener('click', openEnvelope);
  $('#openBtn').addEventListener('click', openEnvelope);

  /* Chương 2: ngôi sao sáng */
  $('#starBtn').addEventListener('click', () => { LU.burst(...rect($('#starBtn')), 'heart', 14); LU.later(() => LU.go(3), 700); });

  /* Chương 3: bốn tấm thẻ (dữ liệu trong story.js) */
  const cards = $('#cards');
  S.cards.forEach((c, i) => {
    const b = document.createElement('button'); b.className = 'card'; b.textContent = c.title;
    b.addEventListener('click', () => { b.classList.add('done'); $('#cardMsg').textContent = c.msg; show($('#next3'), true); });
    cards.appendChild(b);
  });
  LU.enter[3] = () => { cards.querySelectorAll('.card').forEach(c => c.classList.remove('done')); $('#cardMsg').textContent = S.cardHint; show($('#next3'), false); };
  $('#next3').addEventListener('click', () => LU.go(4));

  /* Chương 4: thư dưới ánh trăng */
  LU.enter[4] = () => {
    show($('#keep4'), false);
    LU.type($('#letter4'), S.ch4, 32).then(() => show($('#keep4'), true));
  };
  $('#letter4').addEventListener('click', () => LU.finishType());
  $('#keep4').addEventListener('click', () => LU.go(5));

  /* Chương 5: ba buổi hẹn */
  S.opts.forEach(o => {
    const b = document.createElement('button'); b.className = 'opt';
    b.innerHTML = '<img src="./assets/images/' + o.img + '" alt="' + o.alt + '"><span>' + o.title + '</span>';
    b.addEventListener('click', () => {
      document.querySelectorAll('.opt').forEach(x => x.classList.remove('sel')); b.classList.add('sel');
      $('#optMsg').textContent = o.msg; show($('#next5'), true);
    });
    $('#opts').appendChild(b);
  });
  LU.enter[5] = () => { document.querySelectorAll('.opt').forEach(x => x.classList.remove('sel')); $('#optMsg').textContent = S.optHint; show($('#next5'), false); };
  $('#next5').addEventListener('click', () => LU.go(6));

  /* Chương 6: ngôi sao hóa trái tim */
  LU.enter[6] = () => {
    const w = $('#starWrap'); w.classList.remove('morph'); show($('#next6'), false);
    LU.later(() => w.classList.add('morph'), LU.revealEnd + 800);
    LU.later(() => show($('#next6'), true), LU.revealEnd + 3200);
  };
  $('#next6').addEventListener('click', () => LU.go(7));

  /* Chương 7: hộp quà bất ngờ */
  const resetGift = () => { $('#gift').classList.remove('open'); $('#dim').classList.remove('on'); LU.rain(false); };
  LU.enter[7] = () => { resetGift(); show($('#unlock'), true); show($('#t7'), true); show($('#letter7'), false); show($('#next7'), false); $('#letter7').textContent = ''; };
  LU.leave[7] = resetGift;
  $('#unlock').addEventListener('click', () => {
    show($('#unlock'), false); show($('#t7'), false); $('#dim').classList.add('on');
    LU.later(() => $('#gift').classList.add('open'), 1000);
    LU.later(() => { const [x, y] = rect($('#gift')); LU.burst(x, y, 'petal', 40); LU.burst(x, y, 'heart', 18); LU.rain(true); }, 1800);
    LU.later(() => { show($('#letter7'), true); LU.type($('#letter7'), S.letter7, 34).then(() => show($('#next7'), true)); }, 3000);
  });
  $('#letter7').addEventListener('click', () => LU.finishType());
  $('#next7').addEventListener('click', () => LU.go(8));

  /* Chương 8: chòm sao trái tim + xem lại */
  LU.enter[8] = () => LU.heartSky($('#heartSky'));
  $('#replay').addEventListener('click', () => { LU.resetProgress(); LU.go(1); });
})();
