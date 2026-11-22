/* Розумничка — логіка лендінгу (без залежностей) */
(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  /* =========================================================
     Дані напрямків (демо — замінити на реальні)
     ========================================================= */
  const COURSES = {
    minisad: {
      color: '#253F8C',
      items: [
        { id: 'minisadok', title: 'Мінісадок', age: '3–6 років', schedule: 'Пн–Пт · 09:00–13:00', price: 'Уточнюється', bg: '#EAF4E1', img: 'assets/img/minisad.jpg',
          short: 'Комплексний розвиток, ігри, спілкування та творчість.',
          desc: 'Ігрове навчання, творчість, розвиток комунікації та самостійності у невеликій групі.' },
        { id: 'minyasla', title: 'Міні-ясла', age: '2–3 роки', schedule: 'Пн–Пт · 09:00–12:00', price: 'Уточнюється', bg: '#FCE8F2', img: 'assets/img/nursery.jpg',
          short: 'М’яка адаптація та перші кроки до самостійності.',
          desc: 'Турботливий простір для наймолодших: режим, ігри, сенсорика та знайомство з іншими дітьми.' },
        { id: 'half-day', title: 'Група неповного дня', age: '3–5 років', schedule: 'Пн–Пт · 15:00–18:00', price: 'Уточнюється', bg: '#E3E9F8', img: 'assets/img/half-day.jpg',
          short: 'Розвиток та адаптація у невеликій групі.',
          desc: 'Вечірня група для тих, хто хоче поєднати розвиток, творчість та спілкування з однолітками.' },
      ],
    },
    english: {
      color: '#E06BAA',
      items: [
        { id: 'eng-kids', title: 'English for Kids', age: '3–5 років', schedule: 'Вт, Чт · 10:00', price: 'Уточнюється', bg: '#FCE8F2',
          short: 'Англійська через пісні, ігри та казки.',
          desc: 'Перші слова та фрази англійською в ігровій формі — без стресу та зубріння.' },
        { id: 'eng-school', title: 'Англійська для дошкільнят', age: '5–7 років', schedule: 'Пн, Ср · 16:30', price: 'Уточнюється', bg: '#FFF1CC',
          short: 'Лексика, вимова та перші речення.',
          desc: 'Підготовка до шкільної програми: словниковий запас, вимова, діалоги та читання.' },
        { id: 'eng-speak', title: 'Speaking Club', age: '6–9 років', schedule: 'Сб · 11:00', price: 'Уточнюється', bg: '#EAF4E1',
          short: 'Розмовна практика у дружній атмосфері.',
          desc: 'Ігри, рольові ситуації та проєкти, щоб діти не боялися говорити англійською.' },
      ],
    },
    dev: {
      color: '#6AAA45',
      items: [
        { id: 'school-prep', title: 'Підготовка до школи', age: '5–6 років', schedule: 'Пн, Ср, Пт · 17:00', price: 'Уточнюється', bg: '#E3E9F8',
          short: 'Читання, письмо, лічба та логіка.',
          desc: 'Комплексна програма: грамота, математика, логіка, увага та впевненість перед першим класом.' },
        { id: 'art', title: 'Творча майстерня', age: '3–7 років', schedule: 'Вт, Чт · 17:00', price: 'Уточнюється', bg: '#FFF1CC',
          short: 'Малювання, ліплення та аплікація.',
          desc: 'Розвиток дрібної моторики, фантазії та смаку через різні художні техніки.' },
        { id: 'logo', title: 'Логопед', age: '3–7 років', schedule: 'За записом', price: 'Уточнюється', bg: '#FCE8F2',
          short: 'Індивідуальні заняття з розвитку мовлення.',
          desc: 'Діагностика та корекція звуковимови, розвиток зв’язного мовлення.' },
      ],
    },
  };
  const allCourses = Object.values(COURSES).flatMap((g) => g.items);

  /* =========================================================
     HERO: слова заголовка + сад
     ========================================================= */
  $$('.hero__title .w').forEach((w, i) => w.style.setProperty('--i', i));

  const BRAND = ['#E06BAA', '#253F8C', '#FFC94A', '#F49BC6', '#5B7FD6', '#FFFFFF'];
  const CENTER = { '#E06BAA': '#FFC94A', '#253F8C': '#FFC94A', '#FFC94A': '#E06BAA', '#F49BC6': '#FFFFFF', '#5B7FD6': '#FFFFFF', '#FFFFFF': '#FFC94A' };

  // Голівки квітів (у координатах 0..100, центр 50,50)
  const HEADS = {
    daisy: (c) => {
      let s = '';
      for (let i = 0; i < 8; i++) s += `<ellipse cx="50" cy="26" rx="10" ry="22" fill="${c}" transform="rotate(${i * 45} 50 50)"${c === '#FFFFFF' ? ' stroke="#E6E9F2" stroke-width="2"' : ''}/>`;
      return s + `<circle cx="50" cy="50" r="13" fill="${CENTER[c]}"/>`;
    },
    round: (c) => {
      let s = '';
      for (let i = 0; i < 6; i++) { const a = (i * 60 * Math.PI) / 180; s += `<circle cx="${50 + Math.cos(a) * 20}" cy="${50 + Math.sin(a) * 20}" r="16" fill="${c}"/>`; }
      return s + `<circle cx="50" cy="50" r="12" fill="#fff"/><circle cx="50" cy="50" r="6" fill="${c === '#FFFFFF' ? '#E06BAA' : c}"/>`;
    },
    tulip: (c) => `<path d="M28 34 Q26 76 50 80 Q74 76 72 34 L61 48 L50 26 L39 48 Z" fill="${c === '#FFFFFF' ? '#F49BC6' : c}"/>`,
    star: (c) => {
      let s = '';
      for (let i = 0; i < 5; i++) s += `<path d="M50 50 C40 34 42 16 50 8 C58 16 60 34 50 50Z" fill="${c}" transform="rotate(${i * 72} 50 50)"${c === '#FFFFFF' ? ' stroke="#E6E9F2" stroke-width="2"' : ''}/>`;
      return s + `<circle cx="50" cy="50" r="10" fill="${CENTER[c]}"/>`;
    },
  };
  const HEAD_TYPES = Object.keys(HEADS);

  function flowerSVG(i) {
    const type = HEAD_TYPES[i % HEAD_TYPES.length];
    const color = BRAND[(i * 5 + 1) % BRAND.length];
    const bend = rand(-14, 14);
    const leafY = rand(170, 220);
    const leafSide = i % 2 ? 'r' : 'l';
    const leaf = leafSide === 'r'
      ? `<path class="leaf leaf--r" d="M52 ${leafY} Q74 ${leafY - 26} 92 ${leafY - 18} Q76 ${leafY + 6} 52 ${leafY}Z"/>`
      : `<path class="leaf leaf--l" d="M48 ${leafY} Q26 ${leafY - 26} 8 ${leafY - 18} Q24 ${leafY + 6} 48 ${leafY}Z"/>`;
    return `<svg viewBox="0 0 100 320" preserveAspectRatio="xMidYMax meet">
      <path class="stem" pathLength="1" d="M50 320 C ${50 - bend} 250, ${50 + bend} 150, 50 62"/>
      ${leaf}
      <g class="head"><g class="head__in">${HEADS[type](color)}</g></g>
    </svg>`;
  }

  const garden = $('#garden');
  function buildGarden() {
    const w = innerWidth;
    const count = w < 560 ? 6 : w < 900 ? 8 : w < 1300 ? 11 : 13;
    garden.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'flower';
      // крайні квіти вищі, середні нижчі — щоб не перекривати текст
      const edge = Math.abs(i - (count - 1) / 2) / ((count - 1) / 2);
      el.style.setProperty('--f', (0.5 + edge * 0.45 + rand(-0.06, 0.06)).toFixed(2));
      el.style.setProperty('--d', `${(0.6 + i * 0.12 + rand(0, 0.15)).toFixed(2)}s`);
      el.style.setProperty('--sway', `${rand(2.6, 4.2).toFixed(2)}s`);
      el.style.setProperty('--sd', `${rand(-3, 0).toFixed(2)}s`);
      el.style.setProperty('--amp', `${rand(1.5, 3.5).toFixed(1)}deg`);
      el.innerHTML = `<div class="flower__lean">${flowerSVG(i)}</div>`;
      garden.appendChild(el);
    }
  }
  buildGarden();
  let lastW = innerWidth;
  addEventListener('resize', () => { if (Math.abs(innerWidth - lastW) > 120) { lastW = innerWidth; buildGarden(); } });

  // Клік / наведення на квітку — голівка крутиться
  function twirl(flower) {
    const h = $('.head__in', flower);
    if (!h || h.classList.contains('is-spin')) return;
    h.classList.add('is-spin');
    h.addEventListener('animationend', () => h.classList.remove('is-spin'), { once: true });
  }
  garden.addEventListener('pointerover', (e) => { const f = e.target.closest('.flower'); if (f) twirl(f); });
  garden.addEventListener('click', (e) => { const f = e.target.closest('.flower'); if (f) twirl(f); });

  // Квіти тягнуться до курсора, небо злегка рухається (паралакс)
  const hero = $('.hero');
  const skyItems = $$('[data-depth]');
  if (finePointer && !reduce) {
    let raf = 0;
    hero.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        skyItems.forEach((el) => { const d = +el.dataset.depth; el.style.translate = `${-nx * d * 2}px ${-ny * d * 2}px`; });
        $$('.flower', garden).forEach((f) => {
          const fr = f.getBoundingClientRect();
          const dx = e.clientX - (fr.left + fr.width / 2);
          const dist = Math.abs(dx);
          const lean = dist < 320 ? Math.sign(dx) * (1 - dist / 320) * 14 : 0;
          f.style.setProperty('--lean', `${lean.toFixed(1)}deg`);
        });
      });
    });
    hero.addEventListener('pointerleave', () => {
      skyItems.forEach((el) => { el.style.translate = ''; });
      $$('.flower', garden).forEach((f) => f.style.setProperty('--lean', '0deg'));
    });
  }

  // Сонце обертається при скролі
  const sun = $('.sun');
  addEventListener('scroll', () => { if (scrollY < innerHeight * 1.2) sun.style.rotate = `${scrollY * 0.15}deg`; }, { passive: true });

  /* =========================================================
     Напрямки: таби + картки + модалка
     ========================================================= */
  const SHAPES = [
    (c) => `<span style="left:18%;top:34%;width:72px;height:72px;border-radius:18px;background:${c[0]}"></span>
            <span style="left:44%;top:22%;width:64px;height:64px;border-radius:50%;background:${c[1]}"></span>
            <span style="right:12%;top:12%;width:74px;height:74px;border-radius:50%;background:#fff;opacity:.85"></span>`,
    (c) => `<span style="left:20%;top:30%;width:84px;height:84px;border-radius:50%;background:${c[1]}"></span>
            <span style="left:46%;top:44%;width:80px;height:56px;border-radius:16px;background:${c[0]}"></span>
            <span style="right:14%;top:14%;width:70px;height:70px;border-radius:50%;background:#fff;opacity:.85"></span>`,
    (c) => `<span style="left:22%;top:30%;width:0;height:0;border-left:46px solid transparent;border-right:46px solid transparent;border-bottom:80px solid ${c[0]}"></span>
            <span style="left:52%;top:40%;width:62px;height:62px;border-radius:50%;background:${c[1]}"></span>
            <span style="right:12%;top:12%;width:66px;height:66px;border-radius:50%;background:#fff;opacity:.85"></span>`,
  ];
  const PALETTE = [['#6AAA45', '#E06BAA'], ['#FFC94A', '#253F8C'], ['#E06BAA', '#6AAA45']];

  const cardsEl = $('#cards');
  function renderCards(key) {
    cardsEl.innerHTML = COURSES[key].items.map((c, i) => `
      <button class="card" data-course="${c.id}" aria-haspopup="dialog">
        <div class="card__art" style="--c:${c.bg}" aria-hidden="true">${c.img
          ? `<img src="${c.img}" alt="" width="1200" height="800" loading="lazy" decoding="async">`
          : SHAPES[i % 3](PALETTE[i % 3])}</div>
        <div class="card__body">
          <h3>${c.title}</h3>
          <span class="card__age">${c.age}</span>
          <p class="card__desc">${c.short}</p>
          <span class="card__more">Детальніше <svg class="ic"><use href="#i-up"/></svg></span>
        </div>
      </button>`).join('');
  }

  const pill = $('.tabs__pill');
  $$('.tab').forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach((t) => { t.classList.toggle('is-active', t === tab); t.setAttribute('aria-selected', t === tab); });
      pill.style.transform = `translateX(${idx * 100}%)`;
      pill.style.background = COURSES[tab.dataset.tab].color;
      renderCards(tab.dataset.tab);
    });
  });
  renderCards('minisad');

  let lastFocus = null;
  function openModal(modal) {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    setTimeout(() => $('.modal__close', modal).focus(), 50);
  }
  function closeModal(modal, restoreFocus = true) {
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    if (restoreFocus && lastFocus) lastFocus.focus();
  }
  const courseModal = $('#course-modal');
  courseModal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(courseModal); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !courseModal.hidden) closeModal(courseModal); });

  let currentCourse = null;
  cardsEl.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const c = allCourses.find((x) => x.id === card.dataset.course);
    currentCourse = c;
    $('#cm-head').style.background = c.bg;
    $('#cm-title').textContent = c.title;
    $('#cm-age-sub').textContent = `Для дітей ${c.age}`;
    $('#cm-desc').textContent = c.desc;
    $('#cm-age').textContent = c.age;
    $('#cm-schedule').textContent = c.schedule;
    $('#cm-price').textContent = c.price;
    openModal(courseModal);
  });

  /* =========================================================
     Слайдер «Простір»: дублюємо стрічку для безшовного циклу
     ========================================================= */
  const track = $('.slider__track');
  if (track && !reduce) {
    [...track.children].forEach((li) => {
      const clone = li.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    track.style.setProperty('--dur', `${track.children.length / 2 * 5}s`);
  }

  /* =========================================================
     Форма запису
     ========================================================= */
  const form = $('#signup-form');
  const select = $('#course-select');
  select.insertAdjacentHTML('beforeend', allCourses.map((c) => `<option value="${c.id}">${c.title}</option>`).join(''));

  $('#cm-signup').addEventListener('click', () => {
    closeModal(courseModal, false);
    form.hidden = false; $('.form-success').hidden = true;
    select.value = currentCourse ? currentCourse.id : '';
    $('#signup').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(() => form.elements.name.focus({ preventScroll: true }), 700);
  });

  // Маска телефону: +38 (0XX) XXX-XX-XX
  const phone = form.elements.phone;
  phone.addEventListener('focus', () => { if (!phone.value) phone.value = '+38 (0'; });
  phone.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g, '');
    if (d.startsWith('38')) d = d.slice(2);
    if (d && d[0] !== '0') d = '0' + d;
    d = d.slice(0, 10);
    let out = '+38 (' + d.slice(0, 3);
    if (d.length >= 3) out += ') ' + d.slice(3, 6);
    if (d.length >= 6) out += '-' + d.slice(6, 8);
    if (d.length >= 8) out += '-' + d.slice(8, 10);
    phone.value = out;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    const checks = [
      [form.elements.name, (v) => v.trim().length >= 2],
      [phone, (v) => v.replace(/\D/g, '').length === 12],
      [form.elements.agree, (_, el) => el.checked],
    ];
    checks.forEach(([el, test]) => {
      const bad = !test(el.value, el);
      const target = el.type === 'checkbox' ? el.closest('label') : el;
      target.classList.remove('is-invalid');
      void target.offsetWidth; // перезапуск анімації shake
      target.classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) return;

    // TODO: відправка заявки (Telegram-бот / email / CRM) — дані: new FormData(form)
    const btn = $('.btn--send', form);
    btn.classList.add('is-sending');
    setTimeout(() => {
      form.hidden = true;
      $('.form-success').hidden = false;
      btn.classList.remove('is-sending');
      const r = $('.form-card').getBoundingClientRect();
      confetti(r.left + r.width / 2, r.top + 80);
    }, reduce ? 0 : 700);
  });
  $('#form-again').addEventListener('click', () => {
    form.reset(); form.hidden = false; $('.form-success').hidden = true;
  });

  /* ---------- Конфеті (canvas, без бібліотек) ---------- */
  const cvs = $('#confetti');
  const ctx = cvs.getContext('2d');
  function confetti(x, y) {
    if (reduce) return;
    const dpr = devicePixelRatio || 1;
    cvs.width = innerWidth * dpr; cvs.height = innerHeight * dpr; ctx.scale(dpr, dpr);
    const colors = ['#6AAA45', '#253F8C', '#E06BAA', '#FFC94A', '#5B7FD6'];
    const parts = Array.from({ length: 140 }, () => ({
      x, y, vx: rand(-9, 9), vy: rand(-15, -4), g: 0.38, s: rand(6, 11), r: rand(0, 6.28), vr: rand(-.3, .3),
      c: colors[(Math.random() * colors.length) | 0], shape: Math.random() < .5 ? 'rect' : 'circle', life: 0,
    }));
    let frame = 0;
    (function tick() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach((p) => {
        p.vy += p.g; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        if (p.shape === 'rect') ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        else { ctx.beginPath(); ctx.arc(0, 0, p.s / 2.4, 0, 6.28); ctx.fill(); }
        ctx.restore();
      });
      if (++frame < 170) requestAnimationFrame(tick);
      else { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cvs.width, cvs.height); }
    })();
  }

  /* =========================================================
     Мікро-взаємодії: magnetic-кнопки, 3D-нахил карток
     ========================================================= */
  if (finePointer && !reduce) {
    $$('.magnetic').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = `translate(${x}px, ${y - 2}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });

    document.addEventListener('pointermove', (e) => {
      const el = e.target.closest('.tilt, .card');
      $$('.is-tilting').forEach((t) => { if (t !== el) { t.classList.remove('is-tilting'); t.style.removeProperty('--rx'); t.style.removeProperty('--ry'); } });
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.classList.add('is-tilting');
      el.style.setProperty('--ry', `${(px * 10).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(-py * 10).toFixed(2)}deg`);
    }, { passive: true });
  }

  /* =========================================================
     Меню, хедер, активний пункт
     ========================================================= */
  const burger = $('#burger');
  const nav = $('#nav');
  const closeMenu = () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', nav.classList.toggle('is-open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', closeMenu));

  const header = $('#header');
  const navLinks = $$('.nav a[href^="#"]:not(.btn)');
  const spyIds = ['about', 'directions', 'team', 'reviews', 'contacts'];
  function onScroll() {
    header.classList.toggle('is-scrolled', scrollY > 20);
    const y = scrollY + innerHeight * 0.4;
    let current = '';
    spyIds.forEach((id) => { if (document.getElementById(id).offsetTop <= y) current = id; });
    if ($('#signup').offsetTop <= y && $('#contacts').offsetTop > y) current = '';
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`));
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* =========================================================
     Reveal + лічильники
     ========================================================= */
  function countUp(el) {
    const end = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = end + suf; return; }
    const t0 = performance.now(), dur = 1600;
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const siblings = $$(':scope > .reveal', el.parentElement);
      el.style.transitionDelay = `${Math.min(Math.max(siblings.indexOf(el), 0), 4) * 90}ms`;
      el.classList.add('is-visible');
      setTimeout(() => { el.style.transitionDelay = ''; }, 1400); // щоб не гальмувати hover-ефекти
      const num = $('[data-count]', el);
      if (num) countUp(num);
      io.unobserve(el);
    });
  }, { threshold: 0.15 });
  $$('.reveal').forEach((el) => io.observe(el));

  $('#year').textContent = new Date().getFullYear();
})();
