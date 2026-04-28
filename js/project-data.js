/**
 * project-data.js
 * Mock data e métodos CRUD de projetos — Projecta
 *
 * Requisitos atendidos: RF26 (Gerenciamento de projetos)
 * RNF: Todo projeto deve ter ao menos um coordenador; laboratório e categoria obrigatórios.
 *
 * Sistema single-tenant: Instituto Tecnológico do Litoral.
 * Expõe window.ProjectData para uso pelos scripts do módulo.
 */

(function () {
  'use strict';

  var AREAS_CONHECIMENTO = [
    'Ciências Exatas e da Terra',
    'Ciências Biológicas',
    'Engenharias',
    'Ciências da Saúde',
    'Ciências Agrárias',
    'Ciências Sociais Aplicadas',
    'Ciências Humanas',
    'Linguística, Letras e Artes',
  ];

  var categories = [
    { id: 1, name: 'Pesquisa Básica' },
    { id: 2, name: 'Pesquisa Aplicada' },
    { id: 3, name: 'Desenvolvimento Tecnológico' },
    { id: 4, name: 'Extensão' },
    { id: 5, name: 'Inovação' },
  ];

  var laboratories = [
    { id: 1, name: 'Laboratório de Computação' },
    { id: 2, name: 'Laboratório de Eletrônica' },
    { id: 3, name: 'Laboratório de Biologia Molecular' },
    { id: 4, name: 'Laboratório de Engenharia Civil' },
    { id: 5, name: 'Laboratório de Química Analítica' },
  ];

  var professors = [
    { id: 1, name: 'Prof. Dr. Marco Antônio Silva', email: 'marco.silva@itl.edu.br', coordination: 'CCT' },
    { id: 2, name: 'Profa. Dra. Carla Rodrigues', email: 'carla.rodrigues@itl.edu.br', coordination: 'CENG' },
    { id: 3, name: 'Prof. Dr. Roberto Figueiredo', email: 'roberto.figueiredo@itl.edu.br', coordination: 'CCE' },
    { id: 4, name: 'Profa. Dra. Ana Paula Mendes', email: 'ana.mendes@itl.edu.br', coordination: 'CCV' },
    { id: 5, name: 'Prof. Dr. José Carlos Lima', email: 'jose.lima@itl.edu.br', coordination: 'CGN' },
  ];

  var students = [
    { id: 1, name: 'João Pedro Oliveira', email: 'joao.oliveira@itl.edu.br', course: 'Ciência da Computação' },
    { id: 2, name: 'Maria Fernanda Costa', email: 'maria.costa@itl.edu.br', course: 'Engenharia Elétrica' },
    { id: 3, name: 'Carlos Eduardo Santos', email: 'carlos.santos@itl.edu.br', course: 'Biologia' },
    { id: 4, name: 'Beatriz Alves Ferreira', email: 'beatriz.ferreira@itl.edu.br', course: 'Administração' },
    { id: 5, name: 'Lucas Henrique Martins', email: 'lucas.martins@itl.edu.br', course: 'Engenharia Civil' },
  ];

  var projects = [
    {
      id: 1,
      name: 'Desenvolvimento de Algoritmos para Análise de Dados Biomédicos',
      categoryId: 1,
      areaConhecimento: 'Ciências Exatas e da Terra',
      laboratoryId: 1,
      description: 'Pesquisa voltada ao desenvolvimento de algoritmos eficientes para processamento e análise de grandes volumes de dados biomédicos gerados em ambiente clínico e laboratorial.',
      status: 'active',
      coordinators: [
        { professorId: 1, name: 'Prof. Dr. Marco Antônio Silva', email: 'marco.silva@itl.edu.br' },
      ],
      researchers: [
        { type: 'professor', userId: 3, name: 'Prof. Dr. Roberto Figueiredo', email: 'roberto.figueiredo@itl.edu.br' },
        { type: 'student', userId: 1, name: 'João Pedro Oliveira', email: 'joao.oliveira@itl.edu.br' },
      ],
      createdAt: '2024-03-10',
      updatedAt: '2025-01-20',
    },
    {
      id: 2,
      name: 'Sistemas Embarcados para Automação Industrial',
      categoryId: 3,
      areaConhecimento: 'Engenharias',
      laboratoryId: 2,
      description: 'Projeto focado na criação de sistemas embarcados de baixo custo para aplicações de automação em ambientes industriais de pequeno e médio porte.',
      status: 'active',
      coordinators: [
        { professorId: 2, name: 'Profa. Dra. Carla Rodrigues', email: 'carla.rodrigues@itl.edu.br' },
      ],
      researchers: [
        { type: 'student', userId: 2, name: 'Maria Fernanda Costa', email: 'maria.costa@itl.edu.br' },
        { type: 'student', userId: 5, name: 'Lucas Henrique Martins', email: 'lucas.martins@itl.edu.br' },
      ],
      createdAt: '2024-05-14',
      updatedAt: '2025-02-10',
    },
    {
      id: 3,
      name: 'Bioprospecção de Organismos Marinhos da Costa Capixaba',
      categoryId: 2,
      areaConhecimento: 'Ciências Biológicas',
      laboratoryId: 3,
      description: 'Estudo exploratório de organismos marinhos endêmicos da costa do Espírito Santo com potencial aplicação em biotecnologia e desenvolvimento de fármacos.',
      status: 'active',
      coordinators: [
        { professorId: 4, name: 'Profa. Dra. Ana Paula Mendes', email: 'ana.mendes@itl.edu.br' },
      ],
      researchers: [
        { type: 'student', userId: 3, name: 'Carlos Eduardo Santos', email: 'carlos.santos@itl.edu.br' },
      ],
      createdAt: '2023-08-01',
      updatedAt: '2025-03-05',
    },
    {
      id: 4,
      name: 'Modelos Estatísticos Aplicados à Gestão de Recursos Hídricos',
      categoryId: 1,
      areaConhecimento: 'Ciências Agrárias',
      laboratoryId: 5,
      description: 'Desenvolvimento e validação de modelos estatísticos para previsão e otimização da gestão de recursos hídricos em bacias hidrográficas regionais.',
      status: 'concluded',
      coordinators: [
        { professorId: 3, name: 'Prof. Dr. Roberto Figueiredo', email: 'roberto.figueiredo@itl.edu.br' },
      ],
      researchers: [
        { type: 'professor', userId: 5, name: 'Prof. Dr. José Carlos Lima', email: 'jose.lima@itl.edu.br' },
        { type: 'student', userId: 4, name: 'Beatriz Alves Ferreira', email: 'beatriz.ferreira@itl.edu.br' },
      ],
      createdAt: '2022-04-20',
      updatedAt: '2024-11-15',
    },
    {
      id: 5,
      name: 'Inovação em Modelos de Negócios para Startups de Base Tecnológica',
      categoryId: 5,
      areaConhecimento: 'Ciências Sociais Aplicadas',
      laboratoryId: 1,
      description: 'Análise e proposição de modelos de negócios inovadores para startups de base tecnológica incubadas no ecossistema do ITL.',
      status: 'inactive',
      coordinators: [
        { professorId: 5, name: 'Prof. Dr. José Carlos Lima', email: 'jose.lima@itl.edu.br' },
      ],
      researchers: [],
      createdAt: '2023-02-28',
      updatedAt: '2024-06-10',
    },
  ];

  window.ProjectData = {

    areasConhecimento: AREAS_CONHECIMENTO,
    categories: categories,
    laboratories: laboratories,
    professors: professors,
    students: students,
    projects: projects,

    findById: function (id) {
      return this.projects.find(function (p) { return p.id === id; }) || null;
    },

    findCategoryById: function (id) {
      return this.categories.find(function (c) { return c.id === id; }) || null;
    },

    findLaboratoryById: function (id) {
      return this.laboratories.find(function (l) { return l.id === id; }) || null;
    },

    findProfessorById: function (id) {
      return this.professors.find(function (p) { return p.id === id; }) || null;
    },

    findStudentById: function (id) {
      return this.students.find(function (s) { return s.id === id; }) || null;
    },

    canRemove: function (id) {
      var project = this.findById(id);
      if (!project) return { allowed: false, reason: 'Projeto não encontrado.' };
      return { allowed: true };
    },

    remove: function (id) {
      var check = this.canRemove(id);
      if (!check.allowed) return check;
      var index = this.projects.findIndex(function (p) { return p.id === id; });
      if (index !== -1) this.projects.splice(index, 1);
      return { allowed: true };
    },

    update: function (id, data) {
      var project = this.findById(id);
      if (!project) return;
      Object.assign(project, data, { updatedAt: new Date().toISOString().slice(0, 10) });
    },

    create: function (data) {
      var ids = this.projects.map(function (p) { return p.id; });
      var nextId = ids.length > 0 ? Math.max.apply(null, ids) + 1 : 1;
      var today = new Date().toISOString().slice(0, 10);
      var project = Object.assign({}, data, {
        id: nextId,
        createdAt: today,
        updatedAt: today,
      });
      this.projects.push(project);
      return project;
    },

  };
})();
