/**
 * lab-detail.js
 * Visualizacao de detalhes de um laboratorio - Projecta
 * RF03 - Remover laboratorio
 * RF04 - Visualizar laboratorio
 */

(function () {
  'use strict';

  var pageTitle = document.getElementById('pageTitle');
  var breadcrumbName = document.getElementById('breadcrumbName');
  var acronymBadgeEl = document.getElementById('acronymBadge');
  var statusBadgeEl = document.getElementById('statusBadge');
  var editBtn = document.getElementById('editBtn');
  var deleteBtn = document.getElementById('deleteBtn');
  var deleteModalBody = document.getElementById('deleteModalBody');
  var deleteModalFooter = document.getElementById('deleteModalFooter');

  var fields = {
    name: document.getElementById('detailName'),
    acronym: document.getElementById('detailAcronym'),
    location: document.getElementById('detailLocation'),
    responsible: document.getElementById('detailResponsible'),
    capacity: document.getElementById('detailCapacity'),
    description: document.getElementById('detailDescription'),
    statusInline: document.getElementById('detailStatusInline'),
    activeProjectCount: document.getElementById('detailActiveProjectCount'),
    activeLoanCount: document.getElementById('detailActiveLoanCount'),
    createdAt: document.getElementById('detailCreatedAt'),
    updatedAt: document.getElementById('detailUpdatedAt'),
  };

  var deleteModal;
  var currentLab;

  function statusBadge(status) {
    if (status === 'active') {
      return '<span class="badge bg-success-subtle text-success border border-success-subtle fw-normal">Ativo</span>';
    }
    if (status === 'maintenance') {
      return '<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle fw-normal">Em manutencao</span>';
    }
    return '<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-normal">Inativo</span>';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    var parts = dateStr.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  function renderLab(lab) {
    document.title = lab.name + ' - Projecta';
    pageTitle.textContent = lab.name;
    breadcrumbName.textContent = lab.name;
    acronymBadgeEl.textContent = lab.acronym;
    statusBadgeEl.innerHTML = statusBadge(lab.status);
    editBtn.href = 'edit.html?id=' + lab.id;

    fields.name.textContent = lab.name;
    fields.acronym.textContent = lab.acronym;
    fields.location.textContent = lab.block + ' - Sala ' + lab.room;
    fields.responsible.textContent = lab.responsible;
    fields.capacity.textContent = lab.capacity + ' pessoas';
    fields.description.textContent = lab.description || '-';
    fields.statusInline.innerHTML = statusBadge(lab.status);
    fields.activeProjectCount.textContent = lab.activeProjectCount;
    fields.activeLoanCount.textContent = lab.activeLoanCount;
    fields.createdAt.textContent = formatDate(lab.createdAt);
    fields.updatedAt.textContent = formatDate(lab.updatedAt);
  }

  function buildDeleteModal(lab) {
    var check = LabData.canRemove(lab.id);

    if (!check.allowed) {
      deleteModalBody.innerHTML =
        '<span class="text-danger fw-semibold">Nao e possivel excluir.</span> ' + check.reason;
      deleteModalFooter.innerHTML =
        '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>';
    } else {
      deleteModalBody.innerHTML =
        'Tem certeza que deseja excluir <strong>' + lab.name + '</strong>? Esta acao nao pode ser desfeita.';
      deleteModalFooter.innerHTML =
        '<button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>' +
        '<button type="button" class="btn btn-danger" id="confirmDeleteBtn">Excluir</button>';

      document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
        LabData.remove(lab.id);
        window.location.href = 'index.html';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    var params = new URLSearchParams(window.location.search);
    var id = Number(params.get('id'));

    if (!id) { window.location.href = 'index.html'; return; }

    currentLab = LabData.findById(id);
    if (!currentLab) { window.location.href = 'index.html'; return; }

    renderLab(currentLab);

    deleteBtn.addEventListener('click', function () {
      buildDeleteModal(currentLab);
      deleteModal.show();
    });
  });
})();
