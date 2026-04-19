/**
 * coordination-detail.js
 * Visualização de detalhes de uma coordenadoria — Projecta
 * RF15 — Remover coordenadoria (com validação de vínculo com professores)
 * RF16 — Visualizar coordenadoria
 */

(function () {
  'use strict';

  var pageTitle        = document.getElementById('pageTitle');
  var breadcrumbName   = document.getElementById('breadcrumbName');
  var acronymBadgeEl   = document.getElementById('acronymBadge');
  var statusBadgeEl    = document.getElementById('statusBadge');
  var editBtn          = document.getElementById('editBtn');
  var deleteBtn        = document.getElementById('deleteBtn');
  var deleteModalBody  = document.getElementById('deleteModalBody');
  var deleteModalFooter = document.getElementById('deleteModalFooter');

  var fields = {
    name:           document.getElementById('detailName'),
    acronym:        document.getElementById('detailAcronym'),
    block:          document.getElementById('detailBlock'),
    description:    document.getElementById('detailDescription'),
    statusInline:   document.getElementById('detailStatusInline'),
    professorCount: document.getElementById('detailProfessorCount'),
    createdAt:      document.getElementById('detailCreatedAt'),
    updatedAt:      document.getElementById('detailUpdatedAt'),
  };

  var deleteModal;
  var currentCoordination;

  // ── Utilitários ────────────────────────────────────────────────────────────

  function statusBadge(status) {
    return status === 'active'
      ? '<span class="badge bg-success-subtle text-success border border-success-subtle fw-normal">Ativa</span>'
      : '<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-normal">Inativa</span>';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    var parts = dateStr.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  // ── Renderização ───────────────────────────────────────────────────────────

  function renderCoordination(c) {
    document.title             = c.name + ' — Projecta';
    pageTitle.textContent      = c.name;
    breadcrumbName.textContent = c.name;
    acronymBadgeEl.textContent = c.acronym;
    statusBadgeEl.innerHTML    = statusBadge(c.status);
    editBtn.href = 'edit.html?id=' + c.id;

    fields.name.textContent           = c.name;
    fields.acronym.textContent        = c.acronym;
    fields.block.textContent          = c.block;
    fields.description.textContent    = c.description || '—';
    fields.statusInline.innerHTML     = statusBadge(c.status);
    fields.professorCount.textContent = c.professorCount;
    fields.createdAt.textContent      = formatDate(c.createdAt);
    fields.updatedAt.textContent      = formatDate(c.updatedAt);
  }

  // ── Modal de exclusão ──────────────────────────────────────────────────────

  function buildDeleteModal(coordination) {
    var check = CoordinationData.canRemove(coordination.id);

    if (!check.allowed) {
      deleteModalBody.innerHTML =
        '<span class="text-danger fw-semibold">Não é possível excluir.</span> ' + check.reason;
      deleteModalFooter.innerHTML =
        '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>';
    } else {
      deleteModalBody.innerHTML =
        'Tem certeza que deseja excluir <strong>' + coordination.name + '</strong>? Esta ação não pode ser desfeita.';
      deleteModalFooter.innerHTML =
        '<button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>' +
        '<button type="button" class="btn btn-danger" id="confirmDeleteBtn">Excluir</button>';

      document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
        CoordinationData.remove(coordination.id);
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

    currentCoordination = CoordinationData.findById(id);
    if (!currentCoordination) { window.location.href = 'index.html'; return; }

    renderCoordination(currentCoordination);

    deleteBtn.addEventListener('click', function () {
      buildDeleteModal(currentCoordination);
      deleteModal.show();
    });
  });
})();
