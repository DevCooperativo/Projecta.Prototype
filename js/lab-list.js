/**
 * lab-list.js
 * Listagem de laboratorios - Projecta
 * RF04 - Visualizar laboratorios
 */

(function () {
  'use strict';

  var PAGE_SIZE = 6;

  var currentPage = 1;
  var filteredData = [];
  var pendingDeleteId = null;

  var tableBody = document.getElementById('labTableBody');
  var tableInfo = document.getElementById('tableInfo');
  var paginationEl = document.getElementById('pagination');
  var searchInput = document.getElementById('searchInput');
  var blockFilter = document.getElementById('blockFilter');
  var statusFilter = document.getElementById('statusFilter');
  var clearFiltersBtn = document.getElementById('clearFiltersBtn');
  var deleteTargetEl = document.getElementById('deleteTargetName');
  var deleteModalBody = document.getElementById('deleteModalBody');
  var confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  var toastEl = document.getElementById('feedbackToast');
  var toastMessageEl = document.getElementById('toastMessage');

  var deleteModal;
  var feedbackToast;

  function statusBadge(status) {
    if (status === 'active') {
      return '<span class="badge bg-success-subtle text-success border border-success-subtle fw-normal">Ativo</span>';
    }
    if (status === 'maintenance') {
      return '<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle fw-normal">Em manutencao</span>';
    }
    return '<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-normal">Inativo</span>';
  }

  function showToast(message) {
    toastMessageEl.textContent = message;
    feedbackToast.show();
  }

  function renderRow(lab) {
    return [
      '<tr>',
      '  <td class="ps-4">',
      '    <div class="fw-semibold">' + lab.name + '</div>',
      '    <div><span class="badge bg-light text-dark border fw-normal small">' + lab.acronym + '</span></div>',
      '  </td>',
      '  <td><span class="badge bg-light text-dark border fw-normal">' + lab.block + '</span> <span class="text-muted small">Sala ' + lab.room + '</span></td>',
      '  <td class="small">' + lab.responsible + '</td>',
      '  <td>' + statusBadge(lab.status) + '</td>',
      '  <td class="text-end pe-4">',
      '    <div class="d-flex gap-2 justify-content-end">',
      '      <a href="detail.html?id=' + lab.id + '" class="btn btn-sm btn-outline-secondary">Ver</a>',
      '      <a href="edit.html?id=' + lab.id + '" class="btn btn-sm btn-outline-dark">Editar</a>',
      '      <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="' + lab.id + '" data-name="' + lab.name + '">Excluir</button>',
      '    </div>',
      '  </td>',
      '</tr>',
    ].join('\n');
  }

  function renderTable() {
    var start = (currentPage - 1) * PAGE_SIZE;
    var pageData = filteredData.slice(start, start + PAGE_SIZE);
    var end = Math.min(start + PAGE_SIZE, filteredData.length);

    tableBody.innerHTML = pageData.length > 0
      ? pageData.map(renderRow).join('')
      : '<tr><td colspan="5" class="text-center text-muted py-5">Nenhum laboratorio encontrado.</td></tr>';

    tableInfo.textContent = filteredData.length > 0
      ? 'Exibindo ' + (start + 1) + '-' + end + ' de ' + filteredData.length + ' resultado(s)'
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

  function applyFilters() {
    var search = searchInput.value.trim().toLowerCase();
    var block = blockFilter.value;
    var status = statusFilter.value;

    filteredData = LabData.labs.filter(function (lab) {
      var matchesSearch = !search ||
        lab.name.toLowerCase().includes(search) ||
        lab.acronym.toLowerCase().includes(search) ||
        lab.responsible.toLowerCase().includes(search);
      var matchesBlock = !block || lab.block === block;
      var matchesStatus = !status || lab.status === status;
      return matchesSearch && matchesBlock && matchesStatus;
    });

    currentPage = 1;
    renderTable();
  }

  function populateBlockFilter() {
    LabData.blocos.forEach(function (bloco) {
      var opt = document.createElement('option');
      opt.value = bloco;
      opt.textContent = bloco;
      blockFilter.appendChild(opt);
    });
  }

  function bindEvents() {
    searchInput.addEventListener('input', applyFilters);
    blockFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);

    clearFiltersBtn.addEventListener('click', function () {
      searchInput.value = '';
      blockFilter.value = '';
      statusFilter.value = '';
      applyFilters();
    });

    tableBody.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action="delete"]');
      if (!btn) return;

      var id = Number(btn.dataset.id);
      var name = btn.dataset.name;
      var check = LabData.canRemove(id);

      deleteTargetEl.textContent = name;

      if (!check.allowed) {
        deleteModalBody.innerHTML =
          '<span class="text-danger fw-semibold">Nao e possivel excluir.</span> ' + check.reason;
        confirmDeleteBtn.classList.add('d-none');
        pendingDeleteId = null;
      } else {
        deleteModalBody.innerHTML =
          'Tem certeza que deseja excluir <strong>' + name + '</strong>? Esta acao nao pode ser desfeita.';
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
      var target = LabData.findById(pendingDeleteId);
      LabData.remove(pendingDeleteId);
      filteredData = filteredData.filter(function (lab) { return lab.id !== pendingDeleteId; });
      pendingDeleteId = null;
      deleteModal.hide();
      currentPage = Math.min(currentPage, Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE)));
      renderTable();
      showToast((target ? target.name : 'Laboratorio') + ' removido com sucesso.');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    feedbackToast = new bootstrap.Toast(toastEl, { delay: 4000 });

    var params = new URLSearchParams(window.location.search);
    if (params.get('saved') === '1') showToast('Laboratorio salvo com sucesso.');
    if (params.get('updated') === '1') showToast('Laboratorio atualizado com sucesso.');

    populateBlockFilter();
    filteredData = LabData.labs.slice();
    renderTable();
    bindEvents();
  });
})();
