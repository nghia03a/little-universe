/* Chuyển chương mượt mà (fade). Chỉ cho phép tiến tới chương đã mở khóa. */
(function () {
  const chs = [...document.querySelectorAll(".chapter")],
    N = chs.length;
  const count = document.getElementById("count"),
    prev = document.getElementById("prev"),
    next = document.getElementById("next");
  let cur = 0,
    busy = false,
    timers = [];
  LU.max = 1;
  LU.enter = {};
  LU.leave = {};
  LU.later = (fn, ms) => {
    timers.push(setTimeout(fn, ms));
  };
  LU.clearTimers = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };

  LU.reveal = (chapter, gap) => {
    // hiện từng dòng chữ
    const ls = chapter.querySelectorAll(".ln");
    ls.forEach((l) => l.classList.remove("on"));
    ls.forEach((l, i) => LU.later(() => l.classList.add("on"), 500 + i * gap));
    return 500 + ls.length * gap;
  };

  function update() {
    count.textContent = cur + " / " + N;
    prev.disabled = cur <= 1;
    next.disabled = cur >= LU.max;
  }
  LU.go = (n) => {
    if (busy || n < 1 || n > N || n === cur) return;
    busy = true;
    LU.clearTimers();
    LU.cancelType();
    const from = chs[cur - 1];
    if (from) {
      from.classList.remove("active");
      if (LU.leave[cur]) LU.leave[cur]();
    }
    setTimeout(
      () => {
        cur = n;
        LU.max = Math.max(LU.max, n);
        document.body.dataset.ch = n;
        const el = chs[n - 1];
        el.classList.add("active");
        el.scrollTop = 0;
        const hookGap = n === 6 ? 1800 : 700;
        LU.revealEnd = LU.reveal(el, hookGap);
        if (LU.enter[n]) LU.enter[n]();
        update();
        busy = false;
      },
      from ? 700 : 0,
    );
  };
  prev.addEventListener("click", () => LU.go(cur - 1));
  next.addEventListener("click", () => LU.go(cur + 1));
  addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") LU.go(cur - 1);
    if (e.key === "ArrowRight" && cur < LU.max) LU.go(cur + 1);
  });
  LU.resetProgress = () => {
    LU.max = 1;
  };
})();
