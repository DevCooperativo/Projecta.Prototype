/**
 * admin-data.js
 * Registro único do administrador — Projecta
 *
 * Sistema single-tenant: Instituto Tecnológico do Litoral.
 * Não há criação, listagem nem exclusão do administrador via interface.
 * Expõe window.AdminData para uso pelos scripts do módulo.
 */

(function () {
  'use strict';

  window.AdminData = {

    profile: {
      name:      'Coordenadoria de Pesquisa ITL',
      email:     'coordenacao.pesquisa@itl.edu.br',
      role:      'Coordenador de Pesquisa',
      phone:     '(13) 3368-0000',
      updatedAt: '2025-03-10',
    },

    update: function (data) {
      Object.assign(this.profile, data, {
        updatedAt: new Date().toISOString().slice(0, 10),
      });
    },

  };
})();
