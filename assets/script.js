/* =========================================================
   BR101 Soluções de Engenharia — Script principal
   Módulos:
   01. Menu mobile (overlay)
   02. Reveal on scroll (IntersectionObserver)
   03. Carousel de soluções
   04. Tilt cards (efeito 3D hover)
   05. Magnetic buttons
   06. Scroll suave para âncoras
   07. Formulário WhatsApp + API PHP
   08. Header scroll behavior
   09. Contador de números animado
========================================================= */

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     01. MENU MOBILE
  ========================================================= */
  function initMobileMenu() {
    const toggle   = document.querySelector('.menu-toggle');
    const navCtr   = document.querySelector('.nav-center');

    if (!toggle || !navCtr) return;

    const links = navCtr.querySelectorAll('a');

    function openMenu() {
      navCtr.classList.add('open');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      navCtr.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      const isOpen = navCtr.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        if (link.getAttribute('target') === '_blank') return;
        closeMenu();
      });
    });

    // Fechar ao redimensionar para desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeMenu();
    }, { passive: true });

    // Fechar ao pressionar Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* =========================================================
     02. REVEAL ON SCROLL
  ========================================================= */
  function initReveal() {
    const elements = document.querySelectorAll('.reveal');

    if (!elements.length) return;

    if (prefersReduced) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => io.observe(el));
  }

  /* =========================================================
     03. CAROUSEL DE SOLUÇÕES
  ========================================================= */
  function initCarousel() {
    const carousel   = document.querySelector('.product-carousel');
    const track      = document.querySelector('.carousel-track');
    const prevBtn    = document.querySelector('.carousel-btn.prev');
    const nextBtn    = document.querySelector('.carousel-btn.next');
    const dotsWrap   = document.querySelector('.carousel-dots');
    const slides     = [...document.querySelectorAll('.product-card')];

    if (!carousel || !track || !slides.length) return;

    const state = {
      index:    0,
      perView:  3,
      maxIndex: 0,
      autoplay: null,
      startX:   0,
      dragging: false
    };

    function getPerView() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 980) return 2;
      return 3;
    }

    function markActive() {
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active',
          i >= state.index && i < state.index + state.perView
        );
      });
    }

    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (let i = 0; i <= state.maxIndex; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
        dot.addEventListener('click', () => { state.index = i; render(); restartAutoplay(); });
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('button').forEach((d, i) => {
        d.classList.toggle('active', i === state.index);
      });
    }

    function render() {
      const gap   = parseFloat(getComputedStyle(track).gap) || 0;
      const width = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${state.index * (width + gap)}px)`;
      updateDots();
      markActive();
    }

    function recalc() {
      state.perView  = getPerView();
      state.maxIndex = Math.max(0, slides.length - state.perView);
      state.index    = Math.min(state.index, state.maxIndex);
      renderDots();
      render();
    }

    function next() {
      state.index = state.index >= state.maxIndex ? 0 : state.index + 1;
      render();
    }

    function prev() {
      state.index = state.index <= 0 ? state.maxIndex : state.index - 1;
      render();
    }

    function startAutoplay() {
      if (prefersReduced) return;
      state.autoplay = setInterval(next, 4500);
    }

    function restartAutoplay() {
      clearInterval(state.autoplay);
      startAutoplay();
    }

    nextBtn?.addEventListener('click', () => { next(); restartAutoplay(); });
    prevBtn?.addEventListener('click', () => { prev(); restartAutoplay(); });

    // Swipe / drag
    carousel.addEventListener('pointerdown', (e) => {
      state.dragging = true;
      state.startX   = e.clientX;
      clearInterval(state.autoplay);
    });

    window.addEventListener('pointerup', (e) => {
      if (!state.dragging) return;
      const dist = e.clientX - state.startX;
      if (Math.abs(dist) > 44) dist < 0 ? next() : prev();
      state.dragging = false;
      restartAutoplay();
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(state.autoplay));
    carousel.addEventListener('mouseleave', () => restartAutoplay());

    window.addEventListener('resize', recalc, { passive: true });

    recalc();
    startAutoplay();
  }

  /* =========================================================
     04. TILT CARDS
  ========================================================= */
  function initTilt() {
    if (prefersReduced) return;

    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x    = e.clientX - rect.left;
        const y    = e.clientY - rect.top;
        const rotX = ((y / rect.height) - 0.5) * -5;
        const rotY = ((x / rect.width)  - 0.5) *  5;
        card.style.transform =
          `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* =========================================================
     05. MAGNETIC BUTTONS
  ========================================================= */
  function initMagnetic() {
    if (prefersReduced) return;

    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x    = e.clientX - rect.left - rect.width  / 2;
        const y    = e.clientY - rect.top  - rect.height / 2;
        btn.style.transform = `translate(${x * 0.08}px, ${y * 0.1}px) translateY(-3px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* =========================================================
     06. SMOOTH SCROLL
  ========================================================= */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (id === '#') return;

        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();

        // header = header-top + nav
        const headerH = document.querySelector('.site-header')?.offsetHeight || 0;
        const offset  = target.getBoundingClientRect().top + window.scrollY - headerH;

        window.scrollTo({ top: offset, behavior: 'smooth' });
      });
    });
  }

  /* =========================================================
     07. FORMULÁRIO — salva no PHP/MySQL e abre WhatsApp
  ========================================================= */
  function initForm() {
    const form       = document.querySelector('#contact-form');
    if (!form) return;

    const statusEl   = form.querySelector('#form-status');
    const submitBtn  = form.querySelector('button[type="submit"]');
    const btnSpan    = submitBtn?.querySelector('span');
    const originalTx = btnSpan?.textContent || 'Enviar';

    function setStatus(msg, cls = '') {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.className   = `form-status ${cls}`.trim();
    }

    function buildWaUrl(data) {
      const nome      = (data.get('nome')      || '').trim();
      const email     = (data.get('email')     || '').trim();
      const telefone  = (data.get('telefone')  || '').trim();
      const mensagem  = (data.get('mensagem')  || '').trim();

      const linhas = [
        'Olá, vim pelo site da BR101 e gostaria de solicitar uma cotação.',
        '',
        `Nome: ${nome}`,
        `E-mail: ${email}`,
        telefone  ? `Telefone/WhatsApp: ${telefone}` : null,
        '',
        mensagem  ? `Mensagem: ${mensagem}` : 'Gostaria de receber uma orientação inicial.'
      ].filter(l => l !== null);

      return `https://wa.me/5521983038369?text=${encodeURIComponent(linhas.join('\n'))}`;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const data = new FormData(form);

      // Honeypot check
      if ((data.get('website') || '').trim()) return;

      const waUrl = buildWaUrl(data);

      if (submitBtn) submitBtn.disabled = true;
      if (btnSpan)   btnSpan.innerHTML  = '<i class="fa-solid fa-spinner fa-spin"></i> &nbsp;Enviando...';
      setStatus('Salvando seus dados com segurança…', 'is-loading');

      try {
        const res    = await fetch(form.action, {
          method:  'POST',
          body:    data,
          headers: { 'Accept': 'application/json' }
        });
        const result = await res.json().catch(() => null);

        if (!res.ok || !result?.success) {
          throw new Error(result?.message || 'Falha ao salvar contato.');
        }

        setStatus('Dados salvos! Abrindo WhatsApp…', 'is-success');
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        form.reset();

      } catch (err) {
        console.error('[BR101 Form]', err);
        // Fallback: abre o WhatsApp mesmo sem salvar no banco
        setStatus(
          'Não foi possível salvar no servidor. Clique para abrir o WhatsApp diretamente.',
          'is-error'
        );
        const fbLink = document.createElement('a');
        fbLink.href   = waUrl;
        fbLink.target = '_blank';
        fbLink.rel    = 'noopener noreferrer';
        fbLink.textContent = 'Abrir WhatsApp';
        fbLink.style.cssText =
          'display:block;margin-top:8px;color:var(--blue);font-weight:700;';
        statusEl?.after(fbLink);

      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnSpan)   btnSpan.innerHTML  =
          '<i class="fa-brands fa-whatsapp"></i> &nbsp;Salvar e abrir WhatsApp';
      }
    });
  }

  /* =========================================================
     08. HEADER — efeito de scroll
  ========================================================= */
  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastY = 0;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;

      if (y > 60) {
        header.style.boxShadow = '0 4px 32px rgba(0,0,0,0.45)';
      } else {
        header.style.boxShadow = 'none';
      }

      // Marcar link ativo conforme seção visível
      document.querySelectorAll('section[id]').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          document.querySelectorAll('.nav-links a').forEach(a => {
            const href = a.getAttribute('href');
            const isMatch =
              href === `#${section.id}` ||
              (href && href.includes(`#${section.id}`));
            a.classList.toggle('active', isMatch);
          });
        }
      });

      lastY = y;
    }, { passive: true });
  }

  /* =========================================================
     09. CONTADOR DE NÚMEROS ANIMADO
  ========================================================= */
  function initCounters() {
    if (prefersReduced) return;

    const counters = document.querySelectorAll('.numbers strong');
    if (!counters.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);

        const el  = entry.target;
        const raw = el.textContent.trim();

        // Só anima valores numéricos simples
        const match = raw.match(/^([+]?)(\d+)([+]?)(.*)$/);
        if (!match) return;

        const prefix = match[1] || match[3];
        const num    = parseInt(match[2], 10);
        const suffix = match[4] || '';
        const dur    = 1200;
        const start  = performance.now();

        const tick = (now) => {
          const p   = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = (prefix || '') + Math.round(num * ease) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });

    counters.forEach(el => io.observe(el));
  }

  /* =========================================================
     INIT
  ========================================================= */
  function init() {
    initMobileMenu();
    initReveal();
    initCarousel();
    initTilt();
    initMagnetic();
    initSmoothScroll();
    initForm();
    initHeader();
    initCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
