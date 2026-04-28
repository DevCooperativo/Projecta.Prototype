/**
 * login.js
 * Fluxo de entrada do prototipo - Projecta
 */

(function () {
  'use strict';

  var form = document.getElementById('loginForm');
  var toastEl = document.getElementById('feedbackToast');
  var toastMessageEl = document.getElementById('toastMessage');
  var feedbackToast;

  function showToast(message) {
    toastMessageEl.textContent = message;
    feedbackToast.show();
  }

  function destinationFor(profile) {
    if (profile === 'admin') return '../dashboard/index.html';
    if (profile === 'professor') return '../dashboard/index.html';
    return '../dashboard/index.html';
  }

  document.addEventListener('DOMContentLoaded', function () {
    feedbackToast = new bootstrap.Toast(toastEl, { delay: 4000 });

    var params = new URLSearchParams(window.location.search);
    if (params.get('registered') === '1') {
      showToast('Solicitação enviada. Quando aprovada, o convite chegará por e-mail.');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.classList.add('was-validated');
      if (!form.checkValidity()) return;

      var profile = document.getElementById('profile').value;
      window.location.href = destinationFor(profile);
    });
  });
})();
