/**
 * professor-data.js
 * Mock data e métodos CRUD de professores — Projecta
 *
 * Requisitos atendidos: RF21 (Inserir), RF22 (Alterar), RF23 (Remover), RF24 (Visualizar)
 * RNF: Não permite remoção de professor vinculado a empréstimos, projetos ou laboratórios.
 *
 * Sistema single-tenant: Instituto Tecnológico do Litoral.
 * Expõe window.ProfessorData para uso pelos scripts do módulo.
 */

(function () {
  'use strict';

  window.ProfessorData = {

    professors: [
      {
        id: 1,
        name: 'Ana Beatriz Carvalho',
        email: 'ana.carvalho@itl.edu.br',
        registration: 'SIAPE-102345',
        coordinationId: 1,
        lattes: 'http://lattes.cnpq.br/1234567890',
        status: 'active',
        projectCount: 2,
        loanCount: 1,
        labCount: 1,
        createdAt: '2020-03-10',
        updatedAt: '2025-08-14',
      },
      {
        id: 2,
        name: 'Carlos Eduardo Mendes',
        email: 'carlos.mendes@itl.edu.br',
        registration: 'SIAPE-203456',
        coordinationId: 2,
        lattes: 'http://lattes.cnpq.br/2345678901',
        status: 'active',
        projectCount: 1,
        loanCount: 0,
        labCount: 2,
        createdAt: '2019-07-22',
        updatedAt: '2025-09-01',
      },
      {
        id: 3,
        name: 'Fernanda Lima Rocha',
        email: 'fernanda.rocha@itl.edu.br',
        registration: 'SIAPE-304567',
        coordinationId: 1,
        lattes: '',
        status: 'active',
        projectCount: 0,
        loanCount: 0,
        labCount: 0,
        createdAt: '2023-01-15',
        updatedAt: '2025-11-03',
      },
      {
        id: 4,
        name: 'Ricardo Sousa Teixeira',
        email: 'ricardo.teixeira@itl.edu.br',
        registration: 'SIAPE-405678',
        coordinationId: 3,
        lattes: 'http://lattes.cnpq.br/3456789012',
        status: 'active',
        projectCount: 3,
        loanCount: 2,
        labCount: 1,
        createdAt: '2018-05-30',
        updatedAt: '2025-10-22',
      },
      {
        id: 5,
        name: 'Juliana Prado Ferreira',
        email: 'juliana.ferreira@itl.edu.br',
        registration: 'SIAPE-506789',
        coordinationId: 4,
        lattes: 'http://lattes.cnpq.br/4567890123',
        status: 'inactive',
        projectCount: 0,
        loanCount: 0,
        labCount: 0,
        createdAt: '2021-09-08',
        updatedAt: '2024-06-17',
      },
      {
        id: 6,
        name: 'Marcos Vinícius Oliveira',
        email: 'marcos.oliveira@itl.edu.br',
        registration: 'SIAPE-607890',
        coordinationId: 2,
        lattes: 'http://lattes.cnpq.br/5678901234',
        status: 'active',
        projectCount: 1,
        loanCount: 0,
        labCount: 1,
        createdAt: '2022-02-14',
        updatedAt: '2025-07-29',
      },
      {
        id: 7,
        name: 'Patrícia Nunes Alves',
        email: 'patricia.alves@itl.edu.br',
        registration: 'SIAPE-708901',
        coordinationId: 6,
        lattes: '',
        status: 'active',
        projectCount: 0,
        loanCount: 0,
        labCount: 0,
        createdAt: '2024-03-01',
        updatedAt: '2025-10-10',
      },
    ],

    findById: function (id) {
      return this.professors.find(function (p) { return p.id === id; }) || null;
    },

    getCoordinationName: function (coordinationId) {
      if (typeof CoordinationData === 'undefined') return '—';
      var c = CoordinationData.findById(coordinationId);
      return c ? c.name : '—';
    },

    /**
     * Verifica se o professor pode ser removido.
     * RNF: não permitir exclusão se houver vínculos com empréstimos, projetos ou laboratórios.
     * @param {number} id
     * @returns {{ allowed: boolean, reason?: string }}
     */
    canRemove: function (id) {
      var professor = this.findById(id);
      if (!professor) return { allowed: false, reason: 'Professor não encontrado.' };

      var links = [];
      if (professor.projectCount > 0) links.push(professor.projectCount + ' projeto(s)');
      if (professor.loanCount > 0)   links.push(professor.loanCount + ' empréstimo(s)');
      if (professor.labCount > 0)    links.push(professor.labCount + ' laboratório(s)');

      if (links.length > 0) {
        return {
          allowed: false,
          reason: 'Este professor possui vínculo com ' + links.join(', ') + ' e não pode ser excluído.',
        };
      }
      return { allowed: true };
    },

    remove: function (id) {
      var check = this.canRemove(id);
      if (!check.allowed) return check;
      var index = this.professors.findIndex(function (p) { return p.id === id; });
      if (index !== -1) this.professors.splice(index, 1);
      return { allowed: true };
    },

    update: function (id, data) {
      var professor = this.findById(id);
      if (!professor) return;
      Object.assign(professor, data, { updatedAt: new Date().toISOString().slice(0, 10) });
    },

    create: function (data) {
      var ids = this.professors.map(function (p) { return p.id; });
      var nextId = ids.length > 0 ? Math.max.apply(null, ids) + 1 : 1;
      var today = new Date().toISOString().slice(0, 10);
      var professor = Object.assign({}, data, {
        id: nextId,
        projectCount: 0,
        loanCount: 0,
        labCount: 0,
        createdAt: today,
        updatedAt: today,
      });
      this.professors.push(professor);
      return professor;
    },

  };
})();
