/**
 * project-list.js
 * Listagem de projetos — Projecta
 * RF26 — Gerenciamento de projetos (visualização)
 * RF30 — Projetos por categoria
 * RF31 — Projetos por laboratório
 */

(function () {
  'use strict';

  var PAGE_SIZE = 6;

  var currentPage     = 1;
  var filteredData    = [];
  var pendingDeleteId = null;

  var tableBody        = document.getElementById('projectTableBody');
  var tableInfo        = document.getElementById('tableInfo');
  var paginationEl     = document.getElementById('pagination');
  var searchInput      = document.getElementById('searchInput');
  var categoryFilter   = document.getElementById('categoryFilter');
  var laboratoryFilter = document.getElementById('laboratoryFilter');
  var statusFilter     = document.getElementById('statusFilter');
  var clearFiltersBtn  = document.getElementById('clearFiltersBtn');
  var deleteModalBody  = document.getElementById('deleteModalBody');
  var confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  var toastEl          = document.getElementById('feedbackToast');
  var toastMessageEl   = document.getElementById('toastMessage');

  var deleteModal;
  var feedbackToast;

  // ── Utilitários ────────────────────────────────────────────────────────────

  function statusBadge(status) {
    var map = {
      active:    '<span class="badge bg-success-subtle text-success border border-success-subtle fw-normal">Em andamento</span>',
      concluded: '<span class="badge bg-primary-subtle text-primary border border-primary-subtle fw-normal">Concluído</span>',
      inactive:  '<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-normal">Inativo</span>',
    };
    return map[status] || '';
  }

  function showToast(message) {
    toastMessageEl.textContent = message;
    feedbackToast.show();
  }

  function participantCount(p) {
    return p.coordinators.length + p.researchers.length;
  }

  // ── Renderização ───────────────────────────────────────────────────────────

  function renderRow(p) {
    var category = ProjectData.findCategoryById(p.categoryId);
    var lab      = ProjectData.findLaboratoryById(p.laboratoryId);
    return [
      '<tr>',
      '  <td class="ps-4">',
      '    <div class="fw-semibold">' + p.name + '</div>',
      '    <small class="text-muted">' + p.areaConhecimento + '</small>',
      '  </td>',
      '  <td class="small">' + (category ? category.name : '—') + '</td>',
      '  <td class="small">' + (lab ? lab.name : '—') + '</td>',
      '  <td class="text-center">' + participantCount(p) + '</td>',
      '  <td>' + statusBadge(p.status) + '</td>',
      '  <td class="text-end pe-4">',
      '    <div class="d-flex gap-2 justify-content-end">',
      '      <a href="detail.html?id=' + p.id + '" class="btn btn-sm btn-outline-secondary">Ver</a>',
      '      <a href="edit.html?id=' + p.id + '" class="btn btn-sm btn-outline-dark">Editar</a>',
      '      <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="' + p.id + '" data-name="' + p.name + '">Excluir</button>',
      '    </div>',
      '  </td>',
      '</tr>',
    ].join('\n');
  }

  function renderTable() {
    var start    = (currentPage - 1) * PAGE_SIZE;
    var pageData = filteredData.slice(start, start + PAGE_SIZE);
    var end      = Math.min(start + PAGE_SIZE, filteredData.length);

    tableBody.innerHTML = pageData.length > 0
      ? pageData.map(renderRow).join('')
      : '<tr><td colspan="6" class="text-center text-muted py-5">Nenhum projeto encontrado.</td></tr>';

    tableInfo.textContent = filteredData.length > 0
      ? 'Exibindo ' + (start + 1) + '–' + end + ' de ' + filteredData.length + ' resultado(s)'
      : '0 resultados';

    renderPagination();
  }

  function renderPagination() {
    var totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
    if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }

    var items = [];
    items.push('<li class="page-item ' + (currentPage === 1 ? 'disabled' : '') + '"><button class="page-link" data-page="' + (currentPage - 1) + '">&laquo;</button></li>');
    for (var i = 1; i <= totalPages; i++) {
      items.push('<li class="page-item ' + (i === currentPage ? 'active' : '') + '"><button class="page-link" data-page="' + i + '">' + i + '</button></li>');
    }
    items.push('<li class="page-item ' + (currentPage === totalPages ? 'disabled' : '') + '"><button class="page-link" data-page="' + (currentPage + 1) + '">&raquo;</button></li>');
    paginationEl.innerHTML = items.join('');
  }

  // ── Filtros ────────────────────────────────────────────────────────────────

  function applyFilters() {
    var search   = searchInput.value.trim().toLowerCase();
    var category = categoryFilter.value;
    var lab      = laboratoryFilter.value;
    var status   = statusFilter.value;

    filteredData = ProjectData.projects.filter(function (p) {
      var matchesSearch   = !search   || p.name.toLowerCase().includes(search);
      var matchesCategory = !category || String(p.categoryId) === category;
      var matchesLab      = !lab      || String(p.laboratoryId) === lab;
      var matchesStatus   = !status   || p.status === status;
      return matchesSearch && matchesCategory && matchesLab && matchesStatus;
    });

    filteredData.sort(function (a, b) { return a.name.localeCompare(b.name, 'pt-BR'); });
    currentPage = 1;
    renderTable();
  }

  function populateFilters() {
    ProjectData.categories.forEach(function (cat) {
      var opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name;
      categoryFilter.appendChild(opt);
    });

    ProjectData.laboratories.forEach(function (lab) {
      var opt = document.createElement('option');
      opt.value = lab.id;
      opt.textContent = lab.name;
      laboratoryFilter.appendChild(opt);
    });
  }

  // ── Eventos ────────────────────────────────────────────────────────────────

  function bindEvents() {
    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    laboratoryFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);

    clearFiltersBtn.addEventListener('click', function () {
      searchInput.value      = '';
      categoryFilter.value   = '';
      laboratoryFilter.value = '';
      statusFilter.value     = '';
      applyFilters();
    });

    tableBody.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action="delete"]');
      if (!btn) return;

      var id    = Number(btn.dataset.id);
      var name  = btn.dataset.name;
      var check = ProjectData.canRemove(id);

      if (!check.allowed) {
        deleteModalBody.innerHTML =
          '<span class="text-danger fw-semibold">Não é possível excluir.</span> ' + check.reason;
        confirmDeleteBtn.classList.add('d-none');
        pendingDeleteId = null;
      } else {
        deleteModalBody.innerHTML =
          'Tem certeza que deseja excluir <strong>' + name + '</strong>? Esta ação não pode ser desfeita.';
        confirmDeleteBtn.classList.remove('d-none');
        pendingDeleteId = id;
      }

      deleteModal.show();
    });

    paginationEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-page]');
      if (!btn || btn.parentElement.classList.contains('disabled')) return;
      currentPage = Number(btn.dataset.page);
      renderTable();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    confirmDeleteBtn.addEventListener('click', function () {
      if (pendingDeleteId === null) return;
      var target = ProjectData.findById(pendingDeleteId);
      ProjectData.remove(pendingDeleteId);
      filteredData = filteredData.filter(function (p) { return p.id !== pendingDeleteId; });
      pendingDeleteId = null;
      deleteModal.hide();
      currentPage = Math.min(currentPage, Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE)));
      renderTable();
      showToast((target ? target.name : 'Projeto') + ' removido com sucesso.');
    });
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    deleteModal   = new bootstrap.Modal(document.getElementById('deleteModal'));
    feedbackToast = new bootstrap.Toast(toastEl, { delay: 4000 });

    var params = new URLSearchParams(window.location.search);
    if (params.get('saved')   === '1') showToast('Projeto salvo com sucesso.');
    if (params.get('updated') === '1') showToast('Projeto atualizado com sucesso.');

    populateFilters();
    filteredData = ProjectData.projects.slice();
    filteredData.sort(function (a, b) { return a.name.localeCompare(b.name, 'pt-BR'); });
    renderTable();
    bindEvents();
  });
})();
