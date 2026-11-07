/* Khởi tạo: đổ lời nhắn vào trang, nhạc nền, bắt đầu câu chuyện */
(function () {
  const $ = s => document.querySelector(s), S = LU.STORY;
  const paras = (id, arr) => { const el = $(id); arr.forEach(t => { const p = document.createElement('p'); p.className = 'ln'; p.textContent = t; el.appendChild(p); }); };
  paras('#t1', S.ch1); paras('#t2', S.ch2); paras('#t6', S.ch6); paras('#t7', S.ch7); paras('#t8', S.ch8);

  /* Nhạc nền: chỉ phát sau khi người dùng tương tác */
  const btn = $('#musicBtn'), vol = $('#vol'), st = $('#musicState');
  let au = null, on = false, muted = false;
  function audio() {
    if (au) return au;
    au = new Audio('./assets/audio/background.mp3'); au.loop = true; au.volume = +vol.value;
    au.addEventListener('error', () => set(false, 'Chưa có file nhạc'));
    return au;
  }
  function set(v, msg) { on = v; btn.setAttribute('aria-pressed', v); st.textContent = msg || (v ? 'Đang phát ♪' : 'Nhạc: tắt'); }
  function play() { audio().play().then(() => set(true)).catch(() => set(false, 'Chưa có file nhạc')); }
  LU.musicStart = () => { if (!muted && !on) play(); };
  btn.addEventListener('click', () => { if (on) { au.pause(); muted = true; set(false); } else { muted = false; play(); } });
  vol.addEventListener('input', () => { if (au) au.volume = +vol.value; });

  LU.go(1);
})();
