/**
 * index.js
 * Landing page behavior — Projecta
 */

(function () {
  'use strict';

  // ── Smooth scroll para links internos ──────────────────────────────────────

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Fecha o menu mobile se estiver aberto
        const navbarCollapse = document.querySelector('#navbarMain');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
        }
      });
    });
  }

  // ── Sombra na navbar ao rolar a página ────────────────────────────────────

  function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function onScroll() {
      if (window.scrollY > 8) {
        navbar.classList.add('shadow-sm');
      } else {
        navbar.classList.remove('shadow-sm');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    initSmoothScroll();
    initNavbarScroll();
  });
})();
