/**
 * lab-data.js
 * Mock data e metodos CRUD de laboratorios - Projecta
 *
 * Requisitos atendidos: RF01 (Inserir), RF02 (Alterar), RF03 (Remover), RF04 (Visualizar)
 * RNF: Nao permite remocao de laboratorio vinculado a projetos ativos ou emprestimos em andamento.
 *
 * Sistema single-tenant: Instituto Tecnologico do Litoral.
 * Expoe window.LabData para uso pelos scripts do modulo.
 */

(function () {
  'use strict';

  var BLOCOS = ['B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10'];

  window.LabData = {

    blocos: BLOCOS,

    labs: [
      {
        id: 1,
        name: 'Laboratorio de Computacao Aplicada',
        acronym: 'LCA',
        block: 'B2',
        room: '204',
        responsible: 'Prof. Dr. Marco Antonio Silva',
        capacity: 32,
        description: 'Ambiente dedicado a projetos de software, analise de dados e prototipacao de solucoes digitais.',
        status: 'active',
        activeProjectCount: 3,
        activeLoanCount: 0,
        createdAt: '2020-02-12',
        updatedAt: '2025-10-21',
      },
      {
        id: 2,
        name: 'Laboratorio de Eletronica e Sistemas Embarcados',
        acronym: 'LESE',
        block: 'B4',
        room: '118',
        responsible: 'Profa. Dra. Carla Rodrigues',
        capacity: 24,
        description: 'Espaco para montagem, teste e documentacao de circuitos, sensores e sistemas embarcados.',
        status: 'active',
        activeProjectCount: 2,
        activeLoanCount: 1,
        createdAt: '2019-08-05',
        updatedAt: '2025-11-03',
      },
      {
        id: 3,
        name: 'Laboratorio de Biologia Molecular',
        acronym: 'LBM',
        block: 'B6',
        room: '301',
        responsible: 'Profa. Dra. Ana Paula Mendes',
        capacity: 18,
        description: 'Laboratorio equipado para preparo de amostras, analises biologicas e pesquisas em biotecnologia.',
        status: 'active',
        activeProjectCount: 1,
        activeLoanCount: 0,
        createdAt: '2021-03-18',
        updatedAt: '2025-09-14',
      },
      {
        id: 4,
        name: 'Laboratorio de Engenharia Civil',
        acronym: 'LEC',
        block: 'B4',
        room: '009',
        responsible: 'Prof. Dr. Roberto Figueiredo',
        capacity: 20,
        description: 'Ambiente para ensaios, modelagem e acompanhamento de pesquisas aplicadas a materiais e estruturas.',
        status: 'active',
        activeProjectCount: 0,
        activeLoanCount: 0,
        createdAt: '2018-05-30',
        updatedAt: '2025-07-19',
      },
      {
        id: 5,
        name: 'Laboratorio de Quimica Analitica',
        acronym: 'LQA',
        block: 'B1',
        room: '112',
        responsible: 'Profa. Dra. Helena Duarte',
        capacity: 16,
        description: 'Espaco voltado para pesquisas com preparo de solucoes, ensaios quimicos e controle de amostras.',
        status: 'maintenance',
        activeProjectCount: 0,
        activeLoanCount: 0,
        createdAt: '2017-10-09',
        updatedAt: '2025-06-25',
      },
      {
        id: 6,
        name: 'Laboratorio de Gestao e Inovacao',
        acronym: 'LGI',
        block: 'B3',
        room: '210',
        responsible: 'Prof. Dr. Jose Carlos Lima',
        capacity: 28,
        description: 'Sala colaborativa para projetos de gestao, modelagem de negocios e inovacao aplicada.',
        status: 'inactive',
        activeProjectCount: 0,
        activeLoanCount: 0,
        createdAt: '2022-01-17',
        updatedAt: '2024-12-04',
      },
    ],

    findById: function (id) {
      return this.labs.find(function (lab) { return lab.id === id; }) || null;
    },

    canRemove: function (id) {
      var lab = this.findById(id);
      if (!lab) return { allowed: false, reason: 'Laboratorio nao encontrado.' };
      if (lab.activeProjectCount > 0) {
        return {
          allowed: false,
          reason: 'Este laboratorio possui ' + lab.activeProjectCount + ' projeto(s) ativo(s) vinculado(s) e nao pode ser excluido.',
        };
      }
      if (lab.activeLoanCount > 0) {
        return {
          allowed: false,
          reason: 'Este laboratorio possui ' + lab.activeLoanCount + ' emprestimo(s) em andamento e nao pode ser excluido.',
        };
      }
      return { allowed: true };
    },

    remove: function (id) {
      var check = this.canRemove(id);
      if (!check.allowed) return check;
      var index = this.labs.findIndex(function (lab) { return lab.id === id; });
      if (index !== -1) this.labs.splice(index, 1);
      return { allowed: true };
    },

    update: function (id, data) {
      var lab = this.findById(id);
      if (!lab) return;
      Object.assign(lab, data, { updatedAt: new Date().toISOString().slice(0, 10) });
    },

    create: function (data) {
      var ids = this.labs.map(function (lab) { return lab.id; });
      var nextId = ids.length > 0 ? Math.max.apply(null, ids) + 1 : 1;
      var today = new Date().toISOString().slice(0, 10);
      var lab = Object.assign({}, data, {
        id: nextId,
        activeProjectCount: 0,
        activeLoanCount: 0,
        createdAt: today,
        updatedAt: today,
      });
      this.labs.push(lab);
      return lab;
    },

  };
})();
