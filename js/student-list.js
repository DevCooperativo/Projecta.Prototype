/**
 * student-list.js
 * Listagem de alunos — Projecta
 * RF20 — Visualizar alunos
 */

(function () {
  'use strict';

  var PAGE_SIZE = 8;

  var currentPage     = 1;
  var filteredData    = [];
  var pendingDeleteId = null;

  var tableBody        = document.getElementById('studentTableBody');
  var tableInfo        = document.getElementById('tableInfo');
  var paginationEl     = document.getElementById('pagination');
  var searchInput      = document.getElementById('searchInput');
  var statusFilter     = document.getElementById('statusFilter');
  var courseFilter     = document.getElementById('courseFilter');
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

  function renderRow(s) {
    var initials = getInitials(s.name);
    return [
      '<tr>',
      '  <td class="ps-4">',
      '    <div class="d-flex align-items-center gap-3">',
      '      <div class="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-semibold small" style="width:36px;height:36px;flex-shrink:0">' + initials + '</div>',
      '      <div>',
      '        <div class="fw-semibold">' + s.name + '</div>',
      '        <div class="small text-muted">' + s.email + '</div>',
      '      </div>',
      '    </div>',
      '  </td>',
      '  <td><span class="small text-muted">' + s.registration + '</span></td>',
      '  <td><span class="small">' + s.course + '</span></td>',
      '  <td>' + statusBadge(s.status) + '</td>',
      '  <td class="text-end pe-4">',
      '    <div class="d-flex gap-2 justify-content-end">',
      '      <a href="detail.html?id=' + s.id + '" class="btn btn-sm btn-outline-secondary">Ver</a>',
      '      <a href="edit.html?id=' + s.id + '" class="btn btn-sm btn-outline-dark">Editar</a>',
      '      <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="' + s.id + '" data-name="' + s.name + '">Excluir</button>',
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
      : '<tr><td colspan="5" class="text-center text-muted py-5">Nenhum aluno encontrado.</td></tr>';

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
    var course = courseFilter.value;

    filteredData = StudentData.students.filter(function (s) {
      var matchesSearch = !search ||
        s.name.toLowerCase().includes(search) ||
        s.email.toLowerCase().includes(search) ||
        s.registration.toLowerCase().includes(search);
      var matchesStatus = !status || s.status === status;
      var matchesCourse = !course || s.course === course;
      return matchesSearch && matchesStatus && matchesCourse;
    });

    currentPage = 1;
    renderTable();
  }

  function populateCourseFilter() {
    var courses = StudentData.students
      .map(function (s) { return s.course; })
      .filter(function (c, i, arr) { return arr.indexOf(c) === i; })
      .sort();

    courses.forEach(function (course) {
      var opt = document.createElement('option');
      opt.value = course;
      opt.textContent = course;
      courseFilter.appendChild(opt);
    });
  }

  // ── Eventos ────────────────────────────────────────────────────────────────

  function bindEvents() {
    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    courseFilter.addEventListener('change', applyFilters);

    clearFiltersBtn.addEventListener('click', function () {
      searchInput.value  = '';
      statusFilter.value = '';
      courseFilter.value = '';
      applyFilters();
    });

    tableBody.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action="delete"]');
      if (!btn) return;

      var id   = Number(btn.dataset.id);
      var name = btn.dataset.name;
      var check = StudentData.canRemove(id);

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
      var target = StudentData.findById(pendingDeleteId);
      StudentData.remove(pendingDeleteId);
      filteredData = filteredData.filter(function (s) { return s.id !== pendingDeleteId; });
      pendingDeleteId = null;
      deleteModal.hide();
      currentPage = Math.min(currentPage, Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE)));
      renderTable();
      showToast((target ? target.name : 'Aluno') + ' removido(a) com sucesso.');
    });
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    deleteModal   = new bootstrap.Modal(document.getElementById('deleteModal'));
    feedbackToast = new bootstrap.Toast(toastEl, { delay: 4000 });

    var params = new URLSearchParams(window.location.search);
    if (params.get('saved') === '1')   showToast('Aluno cadastrado com sucesso.');
    if (params.get('updated') === '1') showToast('Aluno atualizado com sucesso.');

    populateCourseFilter();
    filteredData = StudentData.students.slice();
    renderTable();
    bindEvents();
  });
})();
