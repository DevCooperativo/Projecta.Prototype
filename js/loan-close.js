/**
 * loan-close.js
 * Encerramento de empréstimo — Projecta
 * RF27 — RNF 3 e 4: status Concluído + data de conclusão automática
 */

(function () {
  'use strict';

  var form          = document.getElementById('closeForm');
  var notesInput    = document.getElementById('notes');
  var confirmBtn    = document.getElementById('confirmCloseBtn');
  var closeModal;

  var fields = {
    equipment:      document.getElementById('detailEquipment'),
    laboratory:     document.getElementById('detailLaboratory'),
    borrowerName:   document.getElementById('detailBorrowerName'),
    borrowerType:   document.getElementById('detailBorrowerType'),
    startDate:      document.getElementById('detailStartDate'),
    expectedReturn: document.getElementById('detailExpectedReturn'),
    overdueAlert:   document.getElementById('overdueAlert'),
  };

  var currentLoan;

  // ── Utilitários ────────────────────────────────────────────────────────────

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    var p = dateStr.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }

  function borrowerTypeLabel(type) {
    return type === 'professor' ? 'Professor' : 'Aluno';
  }

  function isOverdue(loan) {
    var today = new Date().toISOString().slice(0, 10);
    return loan.expectedReturnDate < today;
  }

  // ── Renderização ───────────────────────────────────────────────────────────

  function renderLoan(loan) {
    var equipment = LoanData.findEquipmentById(loan.equipmentId);

    document.title = 'Encerrar empréstimo — Projecta';

    fields.equipment.textContent    = loan.equipmentName;
    fields.laboratory.textContent   = equipment ? equipment.laboratory : '—';
    fields.borrowerName.textContent = loan.borrowerName;
    fields.borrowerType.innerHTML   = borrowerTypeLabel(loan.borrowerType) === 'Professor'
      ? '<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-normal">Professor</span>'
      : '<span class="badge bg-primary-subtle text-primary border border-primary-subtle fw-normal">Aluno</span>';
    fields.startDate.textContent      = formatDate(loan.startDate);
    fields.expectedReturn.textContent = formatDate(loan.expectedReturnDate);

    if (isOverdue(loan)) {
      fields.overdueAlert.classList.remove('d-none');
    }
  }

  // ── Submit via modal ───────────────────────────────────────────────────────

  function bindEvents() {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      closeModal.show();
    });

    confirmBtn.addEventListener('click', function () {
      LoanData.close(currentLoan.id, notesInput.value.trim());
      window.location.href = 'index.html?closed=1';
    });
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    closeModal = new bootstrap.Modal(document.getElementById('confirmModal'));

    var params = new URLSearchParams(window.location.search);
    var id = Number(params.get('id'));

    if (!id) { window.location.href = 'index.html'; return; }

    currentLoan = LoanData.findById(id);

    if (!currentLoan) { window.location.href = 'index.html'; return; }
    if (currentLoan.status !== 'pending') { window.location.href = 'index.html'; return; }

    renderLoan(currentLoan);
    bindEvents();
  });
})();
