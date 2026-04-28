/**
 * admin-form.js
 * Edição do perfil do administrador — Projecta
 */

(function () {
  'use strict';

  var form       = document.getElementById('adminForm');
  var nameInput  = document.getElementById('name');
  var emailInput = document.getElementById('email');
  var roleInput  = document.getElementById('role');
  var phoneInput = document.getElementById('phone');

  document.addEventListener('DOMContentLoaded', function () {
    var p = AdminData.profile;
    nameInput.value  = p.name;
    emailInput.value = p.email;
    roleInput.value  = p.role;
    phoneInput.value = p.phone || '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.classList.add('was-validated');
      if (!form.checkValidity()) return;

      AdminData.update({
        name:  nameInput.value.trim(),
        email: emailInput.value.trim().toLowerCase(),
        role:  roleInput.value.trim(),
        phone: phoneInput.value.trim(),
      });

      window.location.href = 'detail.html?updated=1';
    });
  });
})();
