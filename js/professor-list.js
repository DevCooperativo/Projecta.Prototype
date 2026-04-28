/**
 * professor-list.js
 * Listagem de professores — Projecta
 * RF24 — Visualizar professores
 */

(function () {
  'use strict';

  var PAGE_SIZE = 8;

  var currentPage     = 1;
  var filteredData    = [];
  var pendingDeleteId = null;

  var tableBody        = document.getElementById('professorTableBody');
  var tableInfo        = document.getElementById('tableInfo');
  var paginationEl     = document.getElementById('pagination');
  var searchInput      = document.getElementById('searchInput');
  var statusFilter     = document.getElementById('statusFilter');
  var coordinationFilter = document.getElementById('coordinationFilter');
  var clearFiltersBtn  = document.getElementById('clearFiltersBtn');
  var deleteModalBody  = document.getElementById('deleteModalBody');
  var confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  var toastEl          = document.getElementById('feedbackToast');
  var toastMessageEl   = document.getElementById('toastMessage');

  var deleteModal;
  var feedbackToast;

  // ── Utilitários ────────────────────────────────────────────────────────────

  function statusBadge(status) {
    return status === 'active'
      ? '<span class="badge bg-success-subtle text-success border border-success-subtle fw-normal">Ativo</span>'
      : '<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-normal">Inativo</span>';
  }

  function showToast(message) {
    toastMessageEl.textContent = message;
    feedbackToast.show();
  }

  function getInitials(name) {
    return name.split(' ').filter(function (w) { return w.length > 0; })
      .slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join('');
  }

  // ── Renderização ───────────────────────────────────────────────────────────

  function renderRow(p) {
    var coordinationName = ProfessorData.getCoordinationName(p.coordinationId);
    var initials = getInitials(p.name);
    return [
      '<tr>',
      '  <td class="ps-4">',
      '    <div class="d-flex align-items-center gap-3">',
      '      <div class="rounded-circle bg-secondary-subtle text-secondary d-flex align-items-center justify-content-center fw-semibold small" style="width:36px;height:36px;flex-shrink:0">' + initials + '</div>',
      '      <div>',
      '        <div class="fw-semibold">' + p.name + '</div>',
      '        <div class="small text-muted">' + p.email + '</div>',
      '      </div>',
      '    </div>',
      '  </td>',
      '  <td><span class="small text-muted">' + p.registration + '</span></td>',
      '  <td><span class="small">' + coordinationName + '</span></td>',
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
      : '<tr><td colspan="5" class="text-center text-muted py-5">Nenhum professor encontrado.</td></tr>';

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
    var search = searchInput.value.trim().toLowerCase();
    var status = statusFilter.value;
    var coordId = coordinationFilter.value ? Number(coordinationFilter.value) : null;

    filteredData = ProfessorData.professors.filter(function (p) {
      var matchesSearch = !search ||
        p.name.toLowerCase().includes(search) ||
        p.email.toLowerCase().includes(search) ||
        p.registration.toLowerCase().includes(search);
      var matchesStatus = !status || p.status === status;
      var matchesCoord  = !coordId || p.coordinationId === coordId;
      return matchesSearch && matchesStatus && matchesCoord;
    });

    currentPage = 1;
    renderTable();
  }

  function populateCoordinationFilter() {
    if (typeof CoordinationData === 'undefined') return;
    CoordinationData.coordinations.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      coordinationFilter.appendChild(opt);
    });
  }

  // ── Eventos ────────────────────────────────────────────────────────────────

  function bindEvents() {
    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    coordinationFilter.addEventListener('change', applyFilters);

    clearFiltersBtn.addEventListener('click', function () {
      searchInput.value         = '';
      statusFilter.value        = '';
      coordinationFilter.value  = '';
      applyFilters();
    });

    tableBody.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action="delete"]');
      if (!btn) return;

      var id   = Number(btn.dataset.id);
      var name = btn.dataset.name;
      var check = ProfessorData.canRemove(id);

      pendingDeleteId = null;

      if (!check.allowed) {
        deleteModalBody.innerHTML =
          '<span class="text-danger fw-semibold">Não é possível excluir.</span> ' + check.reason;
        confirmDeleteBtn.classList.add('d-none');
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
      var target = ProfessorData.findById(pendingDeleteId);
      ProfessorData.remove(pendingDeleteId);
      filteredData = filteredData.filter(function (p) { return p.id !== pendingDeleteId; });
      pendingDeleteId = null;
      deleteModal.hide();
      currentPage = Math.min(currentPage, Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE)));
      renderTable();
      showToast((target ? target.name : 'Professor') + ' removido(a) com sucesso.');
    });
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    deleteModal   = new bootstrap.Modal(document.getElementById('deleteModal'));
    feedbackToast = new bootstrap.Toast(toastEl, { delay: 4000 });

    var params = new URLSearchParams(window.location.search);
    if (params.get('saved') === '1')   showToast('Professor cadastrado com sucesso.');
    if (params.get('updated') === '1') showToast('Professor atualizado com sucesso.');

    populateCoordinationFilter();
    filteredData = ProfessorData.professors.slice();
    renderTable();
    bindEvents();
  });
})();
