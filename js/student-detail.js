/**
 * student-detail.js
 * Visualização de detalhes de um aluno — Projecta
 * RF19 — Remover aluno (com validação de vínculos)
 * RF20 — Visualizar alunos
 */

(function () {
  'use strict';

  var pageTitle         = document.getElementById('pageTitle');
  var breadcrumbName    = document.getElementById('breadcrumbName');
  var statusBadgeEl     = document.getElementById('statusBadge');
  var editBtn           = document.getElementById('editBtn');
  var deleteBtn         = document.getElementById('deleteBtn');
  var deleteModalBody   = document.getElementById('deleteModalBody');
  var deleteModalFooter = document.getElementById('deleteModalFooter');

  var fields = {
    name:         document.getElementById('detailName'),
    email:        document.getElementById('detailEmail'),
    registration: document.getElementById('detailRegistration'),
    course:       document.getElementById('detailCourse'),
    lattes:       document.getElementById('detailLattes'),
    statusInline: document.getElementById('detailStatusInline'),
    projectCount: document.getElementById('detailProjectCount'),
    loanCount:    document.getElementById('detailLoanCount'),
    createdAt:    document.getElementById('detailCreatedAt'),
    updatedAt:    document.getElementById('detailUpdatedAt'),
  };

  var deleteModal;
  var currentStudent;

  // ── Utilitários ────────────────────────────────────────────────────────────

  function statusBadge(status) {
    return status === 'active'
      ? '<span class="badge bg-success-subtle text-success border border-success-subtle fw-normal">Ativo</span>'
      : '<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-normal">Inativo</span>';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    var parts = dateStr.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  function getInitials(name) {
    return name.split(' ').filter(function (w) { return w.length > 0; })
      .slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join('');
  }

  // ── Renderização ───────────────────────────────────────────────────────────

  function renderStudent(s) {
    var initials = getInitials(s.name);

    document.title             = s.name + ' — Projecta';
    pageTitle.textContent      = s.name;
    breadcrumbName.textContent = s.name;
    statusBadgeEl.innerHTML    = statusBadge(s.status);
    editBtn.href = 'edit.html?id=' + s.id;

    document.getElementById('avatarInitials').textContent = initials;

    fields.name.textContent         = s.name;
    fields.email.innerHTML          = '<a href="mailto:' + s.email + '" class="text-decoration-none">' + s.email + '</a>';
    fields.registration.textContent = s.registration;
    fields.course.textContent       = s.course;

    if (s.lattes) {
      fields.lattes.innerHTML = '<a href="' + s.lattes + '" target="_blank" rel="noopener noreferrer" class="text-decoration-none small">Ver currículo Lattes</a>';
    } else {
      fields.lattes.textContent = '—';
    }

    fields.statusInline.innerHTML   = statusBadge(s.status);
    fields.projectCount.textContent = s.projectCount;
    fields.loanCount.textContent    = s.loanCount;
    fields.createdAt.textContent    = formatDate(s.createdAt);
    fields.updatedAt.textContent    = formatDate(s.updatedAt);
  }

  // ── Modal de exclusão ──────────────────────────────────────────────────────

  function buildDeleteModal(student) {
    var check = StudentData.canRemove(student.id);

    if (!check.allowed) {
      deleteModalBody.innerHTML =
        '<span class="text-danger fw-semibold">Não é possível excluir.</span> ' + check.reason;
      deleteModalFooter.innerHTML =
        '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>';
    } else {
      deleteModalBody.innerHTML =
        'Tem certeza que deseja excluir <strong>' + student.name + '</strong>? Esta ação não pode ser desfeita.';
      deleteModalFooter.innerHTML =
        '<button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>' +
        '<button type="button" class="btn btn-danger" id="confirmDeleteBtn">Excluir</button>';

      document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
        StudentData.remove(student.id);
        window.location.href = 'index.html';
      });
    }
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    var params = new URLSearchParams(window.location.search);
    var id = Number(params.get('id'));

    if (!id) { window.location.href = 'index.html'; return; }

    currentStudent = StudentData.findById(id);
    if (!currentStudent) { window.location.href = 'index.html'; return; }

    renderStudent(currentStudent);

    deleteBtn.addEventListener('click', function () {
      buildDeleteModal(currentStudent);
      deleteModal.show();
    });
  });
})();
