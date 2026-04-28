/**
 * student-data.js
 * Mock data e métodos CRUD de alunos — Projecta
 *
 * Requisitos atendidos: RF17 (Inserir), RF18 (Alterar), RF19 (Remover), RF20 (Visualizar)
 * RNF: Não permite remoção de aluno vinculado a empréstimos ou projetos.
 *
 * Sistema single-tenant: Instituto Tecnológico do Litoral.
 * Expõe window.StudentData para uso pelos scripts do módulo.
 */

(function () {
  'use strict';

  window.StudentData = {

    students: [
      {
        id: 1,
        name: 'Lucas Ferri Viana',
        email: 'lucas.ferri@aluno.itl.edu.br',
        registration: '2022001234',
        course: 'Análise e Desenvolvimento de Sistemas',
        lattes: 'http://lattes.cnpq.br/9876543210',
        status: 'active',
        projectCount: 1,
        loanCount: 2,
        createdAt: '2022-02-07',
        updatedAt: '2025-10-01',
      },
      {
        id: 2,
        name: 'Izabelli Delcaro',
        email: 'izabelli.delcaro@aluno.itl.edu.br',
        registration: '2021005678',
        course: 'Engenharia de Software',
        lattes: '',
        status: 'active',
        projectCount: 2,
        loanCount: 0,
        createdAt: '2021-03-01',
        updatedAt: '2025-09-15',
      },
      {
        id: 3,
        name: 'Nicolas Bassini',
        email: 'nicolas.bassini@aluno.itl.edu.br',
        registration: '2023008901',
        course: 'Ciência da Computação',
        lattes: 'http://lattes.cnpq.br/1122334455',
        status: 'active',
        projectCount: 1,
        loanCount: 1,
        createdAt: '2023-02-20',
        updatedAt: '2025-11-05',
      },
      {
        id: 4,
        name: 'Beatriz Almeida Santos',
        email: 'beatriz.santos@aluno.itl.edu.br',
        registration: '2022003344',
        course: 'Análise e Desenvolvimento de Sistemas',
        lattes: '',
        status: 'active',
        projectCount: 0,
        loanCount: 0,
        createdAt: '2022-02-14',
        updatedAt: '2025-08-22',
      },
      {
        id: 5,
        name: 'Gabriel Moreira Lima',
        email: 'gabriel.lima@aluno.itl.edu.br',
        registration: '2020009988',
        course: 'Engenharia Elétrica',
        lattes: 'http://lattes.cnpq.br/5566778899',
        status: 'inactive',
        projectCount: 0,
        loanCount: 0,
        createdAt: '2020-08-03',
        updatedAt: '2024-12-10',
      },
      {
        id: 6,
        name: 'Mariana Costa Ramos',
        email: 'mariana.ramos@aluno.itl.edu.br',
        registration: '2023006677',
        course: 'Ciência da Computação',
        lattes: '',
        status: 'active',
        projectCount: 0,
        loanCount: 1,
        createdAt: '2023-02-20',
        updatedAt: '2025-10-30',
      },
      {
        id: 7,
        name: 'Pedro Henrique Souza',
        email: 'pedro.souza@aluno.itl.edu.br',
        registration: '2021002211',
        course: 'Engenharia de Software',
        lattes: 'http://lattes.cnpq.br/6677889900',
        status: 'active',
        projectCount: 1,
        loanCount: 0,
        createdAt: '2021-03-01',
        updatedAt: '2025-07-18',
      },
    ],

    findById: function (id) {
      return this.students.find(function (s) { return s.id === id; }) || null;
    },

    /**
     * Verifica se o aluno pode ser removido.
     * RNF: não permitir exclusão se houver vínculos com empréstimos ou projetos.
     * @param {number} id
     * @returns {{ allowed: boolean, reason?: string }}
     */
    canRemove: function (id) {
      var student = this.findById(id);
      if (!student) return { allowed: false, reason: 'Aluno não encontrado.' };

      var links = [];
      if (student.projectCount > 0) links.push(student.projectCount + ' projeto(s)');
      if (student.loanCount > 0)   links.push(student.loanCount + ' empréstimo(s)');

      if (links.length > 0) {
        return {
          allowed: false,
          reason: 'Este aluno possui vínculo com ' + links.join(' e ') + ' e não pode ser excluído.',
        };
      }
      return { allowed: true };
    },

    remove: function (id) {
      var check = this.canRemove(id);
      if (!check.allowed) return check;
      var index = this.students.findIndex(function (s) { return s.id === id; });
      if (index !== -1) this.students.splice(index, 1);
      return { allowed: true };
    },

    update: function (id, data) {
      var student = this.findById(id);
      if (!student) return;
      Object.assign(student, data, { updatedAt: new Date().toISOString().slice(0, 10) });
    },

    create: function (data) {
      var ids = this.students.map(function (s) { return s.id; });
      var nextId = ids.length > 0 ? Math.max.apply(null, ids) + 1 : 1;
      var today = new Date().toISOString().slice(0, 10);
      var student = Object.assign({}, data, {
        id: nextId,
        projectCount: 0,
        loanCount: 0,
        createdAt: today,
        updatedAt: today,
      });
      this.students.push(student);
      return student;
    },

  };
})();
