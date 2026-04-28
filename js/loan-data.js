/**
 * loan-data.js
 * Mock data e métodos CRUD de empréstimos — Projecta
 *
 * Requisito atendido: RF27 (Empréstimo de equipamentos)
 * RNFs:
 *   1. Equipamento com empréstimo ativo não pode ser emprestado novamente.
 *   2. Data de criação = momento do registro.
 *   3. Status: 'pending' (Pendente) | 'completed' (Concluído).
 *   4. Data de conclusão preenchida automaticamente ao concluir.
 *   5. Aluno: máx. 5 empréstimos pendentes.
 *   6. Professor: máx. 10 empréstimos pendentes.
 *
 * Expõe window.LoanData para uso pelos scripts do módulo.
 */

(function () {
  'use strict';

  var PENDING_LIMIT = { student: 5, professor: 10 };

  // Equipamentos mockados (módulo de equipamentos ainda não implementado)
  var EQUIPMENT = [
    { id: 1,  name: 'Osciloscópio Digital',       category: 'Eletrônica',       laboratory: 'Lab. de Eletrônica' },
    { id: 2,  name: 'Multímetro Digital',          category: 'Eletrônica',       laboratory: 'Lab. de Eletrônica' },
    { id: 3,  name: 'Fonte de Alimentação DC',     category: 'Eletrônica',       laboratory: 'Lab. de Eletrônica' },
    { id: 4,  name: 'Kit Arduino Uno',             category: 'Microcontroladores', laboratory: 'Lab. de Computação' },
    { id: 5,  name: 'Raspberry Pi 4',              category: 'Microcontroladores', laboratory: 'Lab. de Computação' },
    { id: 6,  name: 'Projetor Portátil',           category: 'Audiovisual',      laboratory: 'Lab. Multimídia' },
    { id: 7,  name: 'Câmera DSLR Canon EOS',       category: 'Audiovisual',      laboratory: 'Lab. Multimídia' },
    { id: 8,  name: 'Notebook Dell Latitude',      category: 'Informática',      laboratory: 'Lab. de Computação' },
    { id: 9,  name: 'Sensor de Pressão MPX5700',   category: 'Sensores',         laboratory: 'Lab. de Engenharia' },
    { id: 10, name: 'Estação de Solda Hakko FX888', category: 'Eletrônica',      laboratory: 'Lab. de Eletrônica' },
  ];

  window.LoanData = {

    equipment: EQUIPMENT,

    loans: [
      {
        id: 1,
        equipmentId: 1,
        equipmentName: 'Osciloscópio Digital',
        borrowerType: 'professor',
        borrowerId: 1,
        borrowerName: 'Ana Beatriz Carvalho',
        startDate: '2026-04-01',
        expectedReturnDate: '2026-04-15',
        completionDate: null,
        status: 'pending',
        notes: '',
      },
      {
        id: 2,
        equipmentId: 4,
        equipmentName: 'Kit Arduino Uno',
        borrowerType: 'student',
        borrowerId: 1,
        borrowerName: 'Lucas Ferri Viana',
        startDate: '2026-04-10',
        expectedReturnDate: '2026-04-24',
        completionDate: null,
        status: 'pending',
        notes: '',
      },
      {
        id: 3,
        equipmentId: 8,
        equipmentName: 'Notebook Dell Latitude',
        borrowerType: 'professor',
        borrowerId: 4,
        borrowerName: 'Ricardo Sousa Teixeira',
        startDate: '2026-03-20',
        expectedReturnDate: '2026-04-03',
        completionDate: '2026-04-02',
        status: 'completed',
        notes: 'Devolvido em perfeito estado.',
      },
      {
        id: 4,
        equipmentId: 6,
        equipmentName: 'Projetor Portátil',
        borrowerType: 'student',
        borrowerId: 3,
        borrowerName: 'Nicolas Bassini',
        startDate: '2026-04-05',
        expectedReturnDate: '2026-04-12',
        completionDate: '2026-04-11',
        status: 'completed',
        notes: 'Cabo HDMI devolvido separado.',
      },
      {
        id: 5,
        equipmentId: 2,
        equipmentName: 'Multímetro Digital',
        borrowerType: 'student',
        borrowerId: 6,
        borrowerName: 'Mariana Costa Ramos',
        startDate: '2026-04-20',
        expectedReturnDate: '2026-05-04',
        completionDate: null,
        status: 'pending',
        notes: '',
      },
      {
        id: 6,
        equipmentId: 5,
        equipmentName: 'Raspberry Pi 4',
        borrowerType: 'professor',
        borrowerId: 2,
        borrowerName: 'Carlos Eduardo Mendes',
        startDate: '2026-04-15',
        expectedReturnDate: '2026-04-30',
        completionDate: null,
        status: 'pending',
        notes: '',
      },
      {
        id: 7,
        equipmentId: 9,
        equipmentName: 'Sensor de Pressão MPX5700',
        borrowerType: 'student',
        borrowerId: 2,
        borrowerName: 'Izabelli Delcaro',
        startDate: '2026-03-10',
        expectedReturnDate: '2026-03-24',
        completionDate: '2026-03-23',
        status: 'completed',
        notes: '',
      },
    ],

    // ── Consultas ─────────────────────────────────────────────────────────────

    findById: function (id) {
      return this.loans.find(function (l) { return l.id === id; }) || null;
    },

    findEquipmentById: function (id) {
      return EQUIPMENT.find(function (e) { return e.id === id; }) || null;
    },

    isEquipmentAvailable: function (equipmentId) {
      return !this.loans.some(function (l) {
        return l.equipmentId === equipmentId && l.status === 'pending';
      });
    },

    countPending: function (borrowerType, borrowerId) {
      return this.loans.filter(function (l) {
        return l.borrowerType === borrowerType &&
               l.borrowerId === borrowerId &&
               l.status === 'pending';
      }).length;
    },

    // ── Validação de criação ──────────────────────────────────────────────────

    /**
     * @returns {{ allowed: boolean, reason?: string }}
     */
    canCreate: function (borrowerType, borrowerId, equipmentId) {
      if (!this.isEquipmentAvailable(equipmentId)) {
        return { allowed: false, reason: 'Este equipamento já possui um empréstimo ativo.' };
      }
      var limit  = PENDING_LIMIT[borrowerType];
      var pending = this.countPending(borrowerType, borrowerId);
      if (pending >= limit) {
        var label = borrowerType === 'student' ? 'aluno' : 'professor';
        return {
          allowed: false,
          reason: 'Este ' + label + ' já possui ' + pending + ' empréstimo(s) pendente(s) (limite: ' + limit + ').',
        };
      }
      return { allowed: true };
    },

    // ── CRUD ──────────────────────────────────────────────────────────────────

    create: function (data) {
      var ids    = this.loans.map(function (l) { return l.id; });
      var nextId = ids.length > 0 ? Math.max.apply(null, ids) + 1 : 1;
      var today  = new Date().toISOString().slice(0, 10);
      var loan = Object.assign({}, data, {
        id:             nextId,
        startDate:      today,
        completionDate: null,
        status:         'pending',
        notes:          '',
      });
      this.loans.push(loan);
      return loan;
    },

    close: function (id, notes) {
      var loan = this.findById(id);
      if (!loan || loan.status !== 'pending') return false;
      loan.status         = 'completed';
      loan.completionDate = new Date().toISOString().slice(0, 10);
      loan.notes          = notes || '';
      return true;
    },

  };
})();
