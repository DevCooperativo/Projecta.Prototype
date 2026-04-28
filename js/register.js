/**
 * register.js
 * Solicitacao de acesso ao Projecta.
 */

(function () {
  'use strict';

  var form = document.getElementById('registerForm');

  document.addEventListener('DOMContentLoaded', function () {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.classList.add('was-validated');
      if (!form.checkValidity()) return;

      window.location.href = 'login.html?registered=1';
    });
  });
})();
