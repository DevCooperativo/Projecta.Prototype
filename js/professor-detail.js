/**
 * professor-detail.js
 * Visualização de detalhes de um professor — Projecta
 * RF23 — Remover professor (com validação de vínculos)
 * RF24 — Visualizar professores
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
    name:             document.getElementById('detailName'),
    email:            document.getElementById('detailEmail'),
    registration:     document.getElementById('detailRegistration'),
    coordination:     document.getElementById('detailCoordination'),
    lattes:           document.getElementById('detailLattes'),
    statusInline:     document.getElementById('detailStatusInline'),
    projectCount:     document.getElementById('detailProjectCount'),
    loanCount:        document.getElementById('detailLoanCount'),
    labCount:         document.getElementById('detailLabCount'),
    createdAt:        document.getElementById('detailCreatedAt'),
    updatedAt:        document.getElementById('detailUpdatedAt'),
  };

  var deleteModal;
  var currentProfessor;

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

  function renderProfessor(p) {
    var coordinationName = ProfessorData.getCoordinationName(p.coordinationId);
    var initials = getInitials(p.name);

    document.title              = p.name + ' — Projecta';
    pageTitle.textContent       = p.name;
    breadcrumbName.textContent  = p.name;
    statusBadgeEl.innerHTML     = statusBadge(p.status);
    editBtn.href = 'edit.html?id=' + p.id;

    document.getElementById('avatarInitials').textContent = initials;

    fields.name.textContent         = p.name;
    fields.email.innerHTML          = '<a href="mailto:' + p.email + '" class="text-decoration-none">' + p.email + '</a>';
    fields.registration.textContent = p.registration;
    fields.coordination.textContent = coordinationName;

    if (p.lattes) {
      fields.lattes.innerHTML = '<a href="' + p.lattes + '" target="_blank" rel="noopener noreferrer" class="text-decoration-none small">Ver currículo Lattes</a>';
    } else {
      fields.lattes.textContent = '—';
    }

    fields.statusInline.innerHTML  = statusBadge(p.status);
    fields.projectCount.textContent = p.projectCount;
    fields.loanCount.textContent    = p.loanCount;
    fields.labCount.textContent     = p.labCount;
    fields.createdAt.textContent    = formatDate(p.createdAt);
    fields.updatedAt.textContent    = formatDate(p.updatedAt);
  }

  // ── Modal de exclusão ──────────────────────────────────────────────────────

  function buildDeleteModal(professor) {
    var check = ProfessorData.canRemove(professor.id);

    if (!check.allowed) {
      deleteModalBody.innerHTML =
        '<span class="text-danger fw-semibold">Não é possível excluir.</span> ' + check.reason;
      deleteModalFooter.innerHTML =
        '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>';
    } else {
      deleteModalBody.innerHTML =
        'Tem certeza que deseja excluir <strong>' + professor.name + '</strong>? Esta ação não pode ser desfeita.';
      deleteModalFooter.innerHTML =
        '<button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>' +
        '<button type="button" class="btn btn-danger" id="confirmDeleteBtn">Excluir</button>';

      document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
        ProfessorData.remove(professor.id);
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

    currentProfessor = ProfessorData.findById(id);
    if (!currentProfessor) { window.location.href = 'index.html'; return; }

    renderProfessor(currentProfessor);

    deleteBtn.addEventListener('click', function () {
      buildDeleteModal(currentProfessor);
      deleteModal.show();
    });
  });
})();
