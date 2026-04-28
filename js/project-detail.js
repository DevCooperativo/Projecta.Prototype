/**
 * project-detail.js
 * Detalhes de um projeto — Projecta
 * RF26 — Gerenciamento de projetos (visualização)
 */

(function () {
  'use strict';

  var deleteModal;
  var projectId = null;

  function statusBadge(status) {
    var map = {
      active:    '<span class="badge bg-success-subtle text-success border border-success-subtle fw-normal">Em andamento</span>',
      concluded: '<span class="badge bg-primary-subtle text-primary border border-primary-subtle fw-normal">Concluído</span>',
      inactive:  '<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-normal">Inativo</span>',
    };
    return map[status] || '';
  }

  function statusLabel(status) {
    var map = { active: 'Em andamento', concluded: 'Concluído', inactive: 'Inativo' };
    return map[status] || status;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    var parts = dateStr.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  function renderCoordinators(coordinators) {
    var tbody = document.getElementById('coordinatorsTableBody');
    if (!coordinators || coordinators.length === 0) {
      tbody.innerHTML = '<tr><td colspan="2" class="text-center text-muted py-4 small">Nenhum coordenador registrado.</td></tr>';
      return;
    }
    tbody.innerHTML = coordinators.map(function (c) {
      return [
        '<tr>',
        '  <td class="ps-3 fw-semibold small">' + c.name + '</td>',
        '  <td><span class="text-muted small">' + c.email + '</span></td>',
        '</tr>',
      ].join('');
    }).join('');
  }

  function renderResearchers(researchers) {
    var tbody = document.getElementById('researchersTableBody');
    if (!researchers || researchers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-4 small">Nenhum pesquisador registrado.</td></tr>';
      return;
    }
    tbody.innerHTML = researchers.map(function (r) {
      var badge = r.type === 'professor'
        ? '<span class="badge bg-primary-subtle text-primary border border-primary-subtle fw-normal">Professor</span>'
        : '<span class="badge bg-info-subtle text-info border border-info-subtle fw-normal">Aluno</span>';
      return [
        '<tr>',
        '  <td class="ps-3 fw-semibold small">' + r.name + '</td>',
        '  <td><span class="text-muted small">' + r.email + '</span></td>',
        '  <td>' + badge + '</td>',
        '</tr>',
      ].join('');
    }).join('');
  }

  function loadProject(id) {
    var project = ProjectData.findById(id);
    if (!project) { window.location.href = 'index.html'; return; }

    var category = ProjectData.findCategoryById(project.categoryId);
    var lab      = ProjectData.findLaboratoryById(project.laboratoryId);

    document.title = project.name + ' — Projecta';
    document.getElementById('breadcrumbName').textContent = project.name;
    document.getElementById('pageTitle').textContent      = project.name;
    document.getElementById('statusBadge').innerHTML      = statusBadge(project.status);
    document.getElementById('editBtn').href               = 'edit.html?id=' + project.id;

    document.getElementById('detailName').textContent            = project.name;
    document.getElementById('detailArea').textContent            = project.areaConhecimento;
    document.getElementById('detailCategory').textContent        = category ? category.name : '—';
    document.getElementById('detailLaboratory').textContent      = lab ? lab.name : '—';
    document.getElementById('detailDescription').textContent     = project.description || '—';
    document.getElementById('detailStatusInline').innerHTML      = statusBadge(project.status);
    document.getElementById('detailParticipantCount').textContent =
      project.coordinators.length + project.researchers.length;
    document.getElementById('detailCreatedAt').textContent  = formatDate(project.createdAt);
    document.getElementById('detailUpdatedAt').textContent  = formatDate(project.updatedAt);

    renderCoordinators(project.coordinators);
    renderResearchers(project.researchers);
  }

  function bindDeleteBtn(id) {
    var deleteBtn      = document.getElementById('deleteBtn');
    var deleteModalBody = document.getElementById('deleteModalBody');
    var deleteModalFooter = document.getElementById('deleteModalFooter');

    deleteBtn.addEventListener('click', function () {
      var project = ProjectData.findById(id);
      if (!project) return;
      var check = ProjectData.canRemove(id);

      if (!check.allowed) {
        deleteModalBody.innerHTML =
          '<span class="text-danger fw-semibold">Não é possível excluir.</span> ' + check.reason;
        deleteModalFooter.innerHTML =
          '<button type="button" class="btn btn-light" data-bs-dismiss="modal">Fechar</button>';
      } else {
        deleteModalBody.innerHTML =
          'Tem certeza que deseja excluir <strong>' + project.name + '</strong>? Esta ação não pode ser desfeita.';
        deleteModalFooter.innerHTML =
          '<button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>' +
          '<button type="button" class="btn btn-danger" id="confirmDeleteBtn">Excluir</button>';

        setTimeout(function () {
          var confirmBtn = document.getElementById('confirmDeleteBtn');
          if (confirmBtn) {
            confirmBtn.addEventListener('click', function () {
              ProjectData.remove(id);
              window.location.href = 'index.html';
            });
          }
        }, 0);
      }

      deleteModal.show();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    var params = new URLSearchParams(window.location.search);
    var id = Number(params.get('id'));
    if (!id) { window.location.href = 'index.html'; return; }

    projectId = id;
    loadProject(projectId);
    bindDeleteBtn(projectId);
  });
})();
