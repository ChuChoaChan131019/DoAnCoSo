document.addEventListener("DOMContentLoaded", () => {
  const rail = document.querySelector(".rail-scroll");
  if (!rail) return;

  let speed = 0.7;   // tốc độ (px/frame), chỉnh lớn/nhỏ cho nhanh/chậm
  let direction = 1; // 1 = đi xuống, -1 = đi lên
  let rafId = null;

  function tick() {
    rail.scrollTop += speed * direction;

    // chạm đáy → đổi hướng lên
    if (rail.scrollTop + rail.clientHeight >= rail.scrollHeight) {
      direction = -1;
    }
    // chạm đỉnh → đổi hướng xuống
    if (rail.scrollTop <= 0) {
      direction = 1;
    }

    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (rafId === null) rafId = requestAnimationFrame(tick);
  }
  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // pause khi hover cho user đọc
  rail.addEventListener("mouseenter", stop);
  rail.addEventListener("mouseleave", start);

  start();
});
