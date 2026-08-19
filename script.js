(function () {
  'use strict';

  /* ---------- LOADER ---------- */
  window.addEventListener('load', function () {
    var loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(function () { loader.classList.add('hide'); }, 700);
  });

  /* ---------- NAV: scroll state + mobile menu ---------- */
  var nav = document.getElementById('nav');
  var ham = document.getElementById('ham');
  var mob = document.getElementById('mob');

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (ham && mob) {
    ham.addEventListener('click', function () {
      var open = mob.classList.toggle('open');
      ham.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mob.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mob.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  var revEls = document.querySelectorAll('.rev');
  if ('IntersectionObserver' in window && revEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revEls.forEach(function (el) { io.observe(el); });
  } else {
    revEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- COUNTERS ---------- */
  function animateCount(el, target, prefix, suffix, duration) {
    var start = 0;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = Math.floor(eased * target);
      el.textContent = prefix + val + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(step);
  }

  var counterEls = document.querySelectorAll('[data-count], [data-hero-count]');
  if (counterEls.length) {
    var counted = new WeakSet();
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted.has(entry.target)) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count') || el.getAttribute('data-hero-count'), 10) || 0;
          var prefix = el.getAttribute('data-prefix') || '';
          var suffix = el.getAttribute('data-suffix') || '';
          counted.add(el);
          animateCount(el, target, prefix, suffix, 1400);
        }
      });
    }, { threshold: 0.4 });
    counterEls.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- HERO TYPEWRITER ---------- */
  var twText = document.getElementById('twText');
  if (twText) {
    var phrases = [
      'Turbocompresores diésel',
      'Turbocompresores a gasolina',
      'Venta de turbos nuevos y reacondicionados',
      'Cambio e instalación',
      'Reparación y reconstrucción'
    ];
    var pIndex = 0, cIndex = 0, deleting = false;
    function tick() {
      var current = phrases[pIndex];
      if (!deleting) {
        cIndex++;
        twText.textContent = current.slice(0, cIndex);
        if (cIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
      } else {
        cIndex--;
        twText.textContent = current.slice(0, cIndex);
        if (cIndex === 0) {
          deleting = false;
          pIndex = (pIndex + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 55);
    }
    tick();
  }

  /* ---------- PARTICLE CANVAS (embers) ---------- */
  function initParticles(canvasId, options) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var count = (options && options.count) || 42;
    var colors = (options && options.colors) || ['#F5C518', '#D2181F', '#E8383D'];
    var w, h;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    }

    function spawn() {
      return {
        x: Math.random() * w,
        y: h + Math.random() * 40,
        r: 0.8 + Math.random() * 2.2,
        speed: 0.25 + Math.random() * 0.6,
        drift: (Math.random() - 0.5) * 0.4,
        alpha: 0.15 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    }

    resize();
    for (var i = 0; i < count; i++) {
      var p = spawn();
      p.y = Math.random() * h;
      particles.push(p);
    }

    var raf;
    function loop() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function (p) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) {
          Object.assign(p, spawn());
          p.y = h + 10;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    }
    loop();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });
  }

  initParticles('pcanvas', { count: 46 });
  initParticles('pcanvasWhy', { count: 30 });
  initParticles('pcanvasGaleria', { count: 26 });

  /* ---------- CONTACT FORM -> WHATSAPP ---------- */
  var cForm = document.getElementById('cForm');
  if (cForm) {
    cForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = document.getElementById('fn').value.trim();
      var telefono = document.getElementById('ft').value.trim();
      var tipo = document.getElementById('fs').value;
      var mensaje = document.getElementById('fm').value.trim();

      if (!nombre || !telefono || !tipo) {
        cForm.reportValidity();
        return;
      }

      var lines = [
        'Hola, soy ' + nombre + '.',
        'Teléfono: ' + telefono,
        'Servicio que busco: ' + tipo
      ];
      if (mensaje) lines.push('Detalles: ' + mensaje);

      var text = encodeURIComponent(lines.join('\n'));
      window.open('https://wa.me/527712165948?text=' + text, '_blank', 'noopener,noreferrer');
    });
  }
})();
