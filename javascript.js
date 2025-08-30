const cards = Array.from(document.querySelectorAll('.rail-card'));
  const TOP_BAND = 140;            // vùng trên cùng để làm mờ
  const MIN_OPACITY = 0.45;        // trùng với CSS .dim
  const MAX_OPACITY = 1;

  function onScroll() {
    const vh = window.innerHeight;
    cards.forEach(card => {
      const r = card.getBoundingClientRect();

      // Nếu card nằm trong màn hình
      if (r.bottom > 0 && r.top < vh) {
        // Tính mức mờ theo khoảng cách tới đỉnh màn hình
        const t = Math.max(0, Math.min(1, (r.top / TOP_BAND))); // 0 ở sát đỉnh, 1 khi cách xa
        const opacity = MIN_OPACITY + (MAX_OPACITY - MIN_OPACITY) * t;

        card.style.opacity = opacity.toFixed(3);

        // Thêm class để có thể thêm hiệu ứng khác (shadow/translate)
        if (r.top < TOP_BAND) card.classList.add('dim');
        else card.classList.remove('dim');
      } else {
        // Ngoài viewport thì để mặc định
        card.style.opacity = '';
        card.classList.remove('dim');
      }
    });
  }

  // chạy ngay và khi scroll/resize
  onScroll();
  window.addEventListener('scroll', onScroll, {passive: true});
  window.addEventListener('resize', onScroll);