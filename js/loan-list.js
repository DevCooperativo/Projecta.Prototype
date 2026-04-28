/**
 * loan-list.js
 * Listagem de empréstimos — Projecta
 * RF27, RF32 (por pessoa), RF33 (por período)
 */

(function () {
  'use strict';

  var PAGE_SIZE = 8;

  var currentPage     = 1;
  var filteredData    = [];

  var tableBody       = document.getElementById('loanTableBody');
  var tableInfo       = document.getElementById('tableInfo');
  var paginationEl    = document.getElementById('pagination');
  var searchInput     = document.getElementById('searchInput');
  var statusFilter    = document.getElementById('statusFilter');
  var typeFilter      = document.getElementById('typeFilter');
  var dateFrom        = document.getElementById('dateFrom');
  var dateTo          = document.getElementById('dateTo');
  var clearFiltersBtn = document.getElementById('clearFiltersBtn');
  var toastEl         = document.getElementById('feedbackToast');
  var toastMessageEl  = document.getElementById('toastMessage');

  var feedbackToast;

  // ── Utilitários ────────────────────────────────────────────────────────────

  function statusBadge(status) {
    return status === 'pending'
      ? '<span class="badge bg-warning-subtle text-warning border border-warning-subtle fw-normal">Pendente</span>'
      : '<span class="badge bg-success-subtle text-success border border-success-subtle fw-normal">Concluído</span>';
  }

  function borrowerTypeBadge(type) {
    return type === 'professor'
      ? '<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-normal small">Professor</span>'
      : '<span class="badge bg-primary-subtle text-primary border border-primary-subtle fw-normal small">Aluno</span>';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    var p = dateStr.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }

  function isOverdue(loan) {
    if (loan.status !== 'pending') return false;
    var today = new Date().toISOString().slice(0, 10);
    return loan.expectedReturnDate < today;
  }

  function showToast(message) {
    toastMessageEl.textContent = message;
    feedbackToast.show();
  }

  // ── Renderização ───────────────────────────────────────────────────────────

  function renderRow(l) {
    var overdue = isOverdue(l);
    var overdueWarning = overdue
      ? ' <span class="badge bg-danger-subtle text-danger border border-danger-subtle fw-normal small ms-1">Atrasado</span>'
      : '';
    var closeBtn = l.status === 'pending'
      ? '<a href="close.html?id=' + l.id + '" class="btn btn-sm btn-outline-dark">Encerrar</a>'
      : '<span class="text-muted small">' + formatDate(l.completionDate) + '</span>';

    var equipment = LoanData.findEquipmentById(l.equipmentId);
    var labName   = equipment ? equipment.laboratory : '';

    return [
      '<tr>',
      '  <td class="ps-4">',
      '    <div class="fw-semibold">' + l.equipmentName + '</div>',
      '    <div class="small text-muted">' + labName + '</div>',
      '  </td>',
      '  <td>',
      '    <div>' + l.borrowerName + '</div>',
      '    <div>' + borrowerTypeBadge(l.borrowerType) + '</div>',
      '  </td>',
      '  <td class="small">' + formatDate(l.startDate) + '</td>',
      '  <td class="small">' + formatDate(l.expectedReturnDate) + overdueWarning + '</td>',
      '  <td>' + statusBadge(l.status) + '</td>',
      '  <td class="text-end pe-4">' + closeBtn + '</td>',
      '</tr>',
    ].join('\n');
  }

  function renderTable() {
    var start    = (currentPage - 1) * PAGE_SIZE;
    var pageData = filteredData.slice(start, start + PAGE_SIZE);
    var end      = Math.min(start + PAGE_SIZE, filteredData.length);

    tableBody.innerHTML = pageData.length > 0
      ? pageData.map(renderRow).join('')
      : '<tr><td colspan="6" class="text-center text-muted py-5">Nenhum empréstimo encontrado.</td></tr>';

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
    var type   = typeFilter.value;
    var from   = dateFrom.value;
    var to     = dateTo.value;

    filteredData = LoanData.loans.filter(function (l) {
      var matchesSearch = !search ||
        l.equipmentName.toLowerCase().includes(search) ||
        l.borrowerName.toLowerCase().includes(search);
      var matchesStatus = !status || l.status === status;
      var matchesType   = !type   || l.borrowerType === type;
      var matchesFrom   = !from   || l.startDate >= from;
      var matchesTo     = !to     || l.startDate <= to;
      return matchesSearch && matchesStatus && matchesType && matchesFrom && matchesTo;
    });

    currentPage = 1;
    renderTable();
  }

  // ── Eventos ────────────────────────────────────────────────────────────────

  function bindEvents() {
    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    dateFrom.addEventListener('change', applyFilters);
    dateTo.addEventListener('change', applyFilters);

    clearFiltersBtn.addEventListener('click', function () {
      searchInput.value  = '';
      statusFilter.value = '';
      typeFilter.value   = '';
      dateFrom.value     = '';
      dateTo.value       = '';
      applyFilters();
    });

    paginationEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-page]');
      if (!btn || btn.parentElement.classList.contains('disabled')) return;
      currentPage = Number(btn.dataset.page);
      renderTable();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    feedbackToast = new bootstrap.Toast(toastEl, { delay: 4000 });

    var params = new URLSearchParams(window.location.search);
    if (params.get('created') === '1') showToast('Empréstimo registrado com sucesso.');
    if (params.get('closed')  === '1') showToast('Empréstimo encerrado com sucesso.');

    filteredData = LoanData.loans.slice().sort(function (a, b) {
      return b.startDate.localeCompare(a.startDate);
    });
    renderTable();
    bindEvents();
  });
})();
