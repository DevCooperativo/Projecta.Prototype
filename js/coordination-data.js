/**
 * coordination-data.js
 * Mock data e métodos CRUD de coordenadorias — Projecta
 *
 * Requisitos atendidos: RF13 (Inserir), RF14 (Alterar), RF15 (Remover), RF16 (Visualizar)
 * RNF: Não permite remoção de coordenadoria vinculada a professores.
 *
 * Sistema single-tenant: Instituto Tecnológico do Litoral.
 * Expõe window.CoordinationData para uso pelos scripts do módulo.
 */

(function () {
  'use strict';

  // Opções fixas de bloco (RF requisito: B0–B10)
  var BLOCOS = ['B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10'];

  window.CoordinationData = {

    blocos: BLOCOS,

    coordinations: [
      {
        id: 1,
        name: 'Coordenadoria de Computação e Tecnologia',
        acronym: 'CCT',
        block: 'B2',
        description: 'Responsável pela coordenação dos cursos e projetos de pesquisa na área de computação, sistemas de informação e tecnologias digitais.',
        status: 'active',
        professorCount: 8,
        createdAt: '2019-02-10',
        updatedAt: '2025-10-15',
      },
      {
        id: 2,
        name: 'Coordenadoria de Engenharias',
        acronym: 'CENG',
        block: 'B4',
        description: 'Supervisiona os projetos e laboratórios vinculados às engenharias elétrica, mecânica e civil.',
        status: 'active',
        professorCount: 12,
        createdAt: '2018-08-01',
        updatedAt: '2025-09-20',
      },
      {
        id: 3,
        name: 'Coordenadoria de Ciências Exatas',
        acronym: 'CCE',
        block: 'B1',
        description: 'Abrange os projetos de pesquisa nas áreas de matemática, física e química aplicada.',
        status: 'active',
        professorCount: 6,
        createdAt: '2020-03-22',
        updatedAt: '2025-11-02',
      },
      {
        id: 4,
        name: 'Coordenadoria de Ciências da Vida',
        acronym: 'CCV',
        block: 'B6',
        description: 'Coordena projetos nas áreas de biologia, biomedicina e ciências ambientais.',
        status: 'active',
        professorCount: 5,
        createdAt: '2021-05-14',
        updatedAt: '2025-08-30',
      },
      {
        id: 5,
        name: 'Coordenadoria de Ciências Humanas',
        acronym: 'CCH',
        block: 'B0',
        description: 'Responsável pela gestão de projetos de pesquisa em educação, sociologia e filosofia.',
        status: 'inactive',
        professorCount: 0,
        createdAt: '2017-11-30',
        updatedAt: '2024-02-18',
      },
      {
        id: 6,
        name: 'Coordenadoria de Gestão e Negócios',
        acronym: 'CGN',
        block: 'B3',
        description: 'Atua na coordenação de projetos aplicados à administração, economia e gestão organizacional.',
        status: 'active',
        professorCount: 4,
        createdAt: '2022-01-10',
        updatedAt: '2025-07-05',
      },
      {
        id: 7,
        name: 'Coordenadoria de Saúde e Bem-Estar',
        acronym: 'CSB',
        block: 'B8',
        description: 'Coordena pesquisas nas áreas da saúde coletiva, enfermagem e fisioterapia.',
        status: 'active',
        professorCount: 7,
        createdAt: '2020-09-01',
        updatedAt: '2025-10-28',
      },
    ],

    findById: function (id) {
      return this.coordinations.find(function (c) { return c.id === id; }) || null;
    },

    /**
     * Verifica se a coordenadoria pode ser removida.
     * RNF: não permitir exclusão se houver professores vinculados.
     * @param {number} id
     * @returns {{ allowed: boolean, reason?: string }}
     */
    canRemove: function (id) {
      var coordination = this.findById(id);
      if (!coordination) return { allowed: false, reason: 'Coordenadoria não encontrada.' };
      if (coordination.professorCount > 0) {
        return {
          allowed: false,
          reason: 'Esta coordenadoria possui ' + coordination.professorCount + ' professor(es) vinculado(s) e não pode ser excluída.',
        };
      }
      return { allowed: true };
    },

    remove: function (id) {
      var check = this.canRemove(id);
      if (!check.allowed) return check;
      var index = this.coordinations.findIndex(function (c) { return c.id === id; });
      if (index !== -1) this.coordinations.splice(index, 1);
      return { allowed: true };
    },

    update: function (id, data) {
      var coordination = this.findById(id);
      if (!coordination) return;
      Object.assign(coordination, data, { updatedAt: new Date().toISOString().slice(0, 10) });
    },

    create: function (data) {
      var ids = this.coordinations.map(function (c) { return c.id; });
      var nextId = ids.length > 0 ? Math.max.apply(null, ids) + 1 : 1;
      var today = new Date().toISOString().slice(0, 10);
      var coordination = Object.assign({}, data, {
        id: nextId,
        professorCount: 0,
        createdAt: today,
        updatedAt: today,
      });
      this.coordinations.push(coordination);
      return coordination;
    },

  };
})();
