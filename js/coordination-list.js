/**
 * coordination-list.js
 * Listagem de coordenadorias — Projecta
 * RF16 — Visualizar coordenadorias
 */

(function () {
  'use strict';

  var PAGE_SIZE = 6;

  var currentPage     = 1;
  var filteredData    = [];
  var pendingDeleteId = null;

  var tableBody        = document.getElementById('coordinationTableBody');
  var tableInfo        = document.getElementById('tableInfo');
  var paginationEl     = document.getElementById('pagination');
  var searchInput      = document.getElementById('searchInput');
  var statusFilter     = document.getElementById('statusFilter');
  var blockFilter      = document.getElementById('blockFilter');
  var clearFiltersBtn  = document.getElementById('clearFiltersBtn');
  var deleteTargetEl   = document.getElementById('deleteTargetName');
  var deleteModalBody  = document.getElementById('deleteModalBody');
  var confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  var toastEl          = document.getElementById('feedbackToast');
  var toastMessageEl   = document.getElementById('toastMessage');

  var deleteModal;
  var feedbackToast;

  // ── Utilitários ────────────────────────────────────────────────────────────

  function statusBadge(status) {
    return status === 'active'
      ? '<span class="badge bg-success-subtle text-success border border-success-subtle fw-normal">Ativa</span>'
      : '<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-normal">Inativa</span>';
  }

  function showToast(message) {
    toastMessageEl.textContent = message;
    feedbackToast.show();
  }

  // ── Renderização ───────────────────────────────────────────────────────────

  function renderRow(c) {
    return [
      '<tr>',
      '  <td class="ps-4">',
      '    <div class="fw-semibold">' + c.name + '</div>',
      '    <div><span class="badge bg-light text-dark border fw-normal small">' + c.acronym + '</span></div>',
      '  </td>',
      '  <td><span class="badge bg-light text-dark border fw-normal">' + c.block + '</span></td>',
      '  <td>' + statusBadge(c.status) + '</td>',
      '  <td class="text-end pe-4">',
      '    <div class="d-flex gap-2 justify-content-end">',
      '      <a href="detail.html?id=' + c.id + '" class="btn btn-sm btn-outline-secondary">Ver</a>',
      '      <a href="edit.html?id=' + c.id + '" class="btn btn-sm btn-outline-dark">Editar</a>',
      '      <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="' + c.id + '" data-name="' + c.name + '">Excluir</button>',
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
      : '<tr><td colspan="4" class="text-center text-muted py-5">Nenhuma coordenadoria encontrada.</td></tr>';

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
    var block  = blockFilter.value;

    filteredData = CoordinationData.coordinations.filter(function (c) {
      var matchesSearch = !search || c.name.toLowerCase().includes(search) || c.acronym.toLowerCase().includes(search);
      var matchesStatus = !status || c.status === status;
      var matchesBlock  = !block  || c.block === block;
      return matchesSearch && matchesStatus && matchesBlock;
    });

    currentPage = 1;
    renderTable();
  }

  function populateBlockFilter() {
    CoordinationData.blocos.forEach(function (bloco) {
      var opt = document.createElement('option');
      opt.value = bloco;
      opt.textContent = bloco;
      blockFilter.appendChild(opt);
    });
  }

  // ── Eventos ────────────────────────────────────────────────────────────────

  function bindEvents() {
    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    blockFilter.addEventListener('change', applyFilters);

    clearFiltersBtn.addEventListener('click', function () {
      searchInput.value  = '';
      statusFilter.value = '';
      blockFilter.value  = '';
      applyFilters();
    });

    tableBody.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action="delete"]');
      if (!btn) return;

      var id   = Number(btn.dataset.id);
      var name = btn.dataset.name;
      var check = CoordinationData.canRemove(id);

      deleteTargetEl.textContent = name;

      if (!check.allowed) {
        // Exibe modal informando impedimento (sem botão de confirmar)
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
      var target = CoordinationData.findById(pendingDeleteId);
      CoordinationData.remove(pendingDeleteId);
      filteredData = filteredData.filter(function (c) { return c.id !== pendingDeleteId; });
      pendingDeleteId = null;
      deleteModal.hide();
      currentPage = Math.min(currentPage, Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE)));
      renderTable();
      showToast((target ? target.name : 'Coordenadoria') + ' removida com sucesso.');
    });
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    deleteModal   = new bootstrap.Modal(document.getElementById('deleteModal'));
    feedbackToast = new bootstrap.Toast(toastEl, { delay: 4000 });

    var params = new URLSearchParams(window.location.search);
    if (params.get('saved') === '1')   showToast('Coordenadoria salva com sucesso.');
    if (params.get('updated') === '1') showToast('Coordenadoria atualizada com sucesso.');

    populateBlockFilter();
    filteredData = CoordinationData.coordinations.slice();
    renderTable();
    bindEvents();
  });
})();
