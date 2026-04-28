/**
 * admin-detail.js
 * Visualização do perfil do administrador — Projecta
 */

(function () {
  'use strict';

  var fields = {
    avatarInitials: document.getElementById('avatarInitials'),
    name:           document.getElementById('detailName'),
    email:          document.getElementById('detailEmail'),
    role:           document.getElementById('detailRole'),
    phone:          document.getElementById('detailPhone'),
    updatedAt:      document.getElementById('detailUpdatedAt'),
  };

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    var p = dateStr.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }

  function getInitials(name) {
    return name.split(' ').filter(function (w) { return w.length > 0; })
      .slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var p = AdminData.profile;

    var params = new URLSearchParams(window.location.search);
    if (params.get('updated') === '1') {
      var toastEl = document.getElementById('feedbackToast');
      var toastMsgEl = document.getElementById('toastMessage');
      toastMsgEl.textContent = 'Perfil atualizado com sucesso.';
      new bootstrap.Toast(toastEl, { delay: 4000 }).show();
    }

    fields.avatarInitials.textContent = getInitials(p.name);
    fields.name.textContent           = p.name;
    fields.email.innerHTML            = '<a href="mailto:' + p.email + '" class="text-decoration-none">' + p.email + '</a>';
    fields.role.textContent           = p.role;
    fields.phone.textContent          = p.phone || '—';
    fields.updatedAt.textContent      = formatDate(p.updatedAt);
  });
})();
