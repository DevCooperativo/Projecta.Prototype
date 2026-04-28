/**
 * loan-form.js
 * Formulário de registro de empréstimo — Projecta
 * RF27 — Empréstimo de equipamentos
 */

(function () {
  'use strict';

  var form                 = document.getElementById('loanForm');
  var borrowerTypeSelect   = document.getElementById('borrowerType');
  var borrowerSelect       = document.getElementById('borrowerId');
  var equipmentSelect      = document.getElementById('equipmentId');
  var expectedReturnInput  = document.getElementById('expectedReturnDate');
  var validationAlert      = document.getElementById('validationAlert');
  var validationMessage    = document.getElementById('validationMessage');

  // ── Popula selects ─────────────────────────────────────────────────────────

  function populateEquipment() {
    equipmentSelect.innerHTML = '<option value="">Selecione um equipamento...</option>';
    LoanData.equipment.forEach(function (eq) {
      var available = LoanData.isEquipmentAvailable(eq.id);
      var opt = document.createElement('option');
      opt.value = eq.id;
      opt.textContent = eq.name + ' — ' + eq.laboratory + (available ? '' : ' (indisponível)');
      opt.disabled = !available;
      equipmentSelect.appendChild(opt);
    });
  }

  function populateBorrowers(type) {
    borrowerSelect.innerHTML = '<option value="">Selecione o tomador...</option>';
    borrowerSelect.disabled = !type;
    if (!type) return;

    var list = type === 'professor'
      ? (typeof ProfessorData !== 'undefined' ? ProfessorData.professors : [])
      : (typeof StudentData  !== 'undefined' ? StudentData.students    : []);

    list.filter(function (p) { return p.status === 'active'; })
        .forEach(function (p) {
          var opt = document.createElement('option');
          opt.value = p.id;
          opt.textContent = p.name;
          borrowerSelect.appendChild(opt);
        });
  }

  // ── Validação em tempo real ────────────────────────────────────────────────

  function showAlert(message) {
    validationMessage.textContent = message;
    validationAlert.classList.remove('d-none');
  }

  function hideAlert() {
    validationAlert.classList.add('d-none');
  }

  function checkLimits() {
    var type = borrowerTypeSelect.value;
    var id   = Number(borrowerSelect.value);
    if (!type || !id) { hideAlert(); return; }

    var check = LoanData.canCreate(type, id, 0);
    // canCreate with equipmentId=0 won't fail on equipment, only on limit
    if (!check.allowed && check.reason.includes('empréstimo')) {
      showAlert(check.reason);
    } else {
      hideAlert();
    }
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  function handleSubmit(e) {
    e.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) return;

    hideAlert();

    var borrowerType = borrowerTypeSelect.value;
    var borrowerId   = Number(borrowerSelect.value);
    var equipmentId  = Number(equipmentSelect.value);

    var check = LoanData.canCreate(borrowerType, borrowerId, equipmentId);
    if (!check.allowed) {
      showAlert(check.reason);
      return;
    }

    var equipment = LoanData.findEquipmentById(equipmentId);
    var borrowerList = borrowerType === 'professor'
      ? (typeof ProfessorData !== 'undefined' ? ProfessorData.professors : [])
      : (typeof StudentData   !== 'undefined' ? StudentData.students    : []);
    var borrower = borrowerList.find(function (p) { return p.id === borrowerId; });

    LoanData.create({
      equipmentId:        equipmentId,
      equipmentName:      equipment ? equipment.name : '—',
      borrowerType:       borrowerType,
      borrowerId:         borrowerId,
      borrowerName:       borrower ? borrower.name : '—',
      expectedReturnDate: expectedReturnInput.value,
    });

    window.location.href = 'index.html?created=1';
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    var today = new Date().toISOString().slice(0, 10);
    expectedReturnInput.min = today;

    populateEquipment();
    populateBorrowers('');

    borrowerTypeSelect.addEventListener('change', function () {
      populateBorrowers(this.value);
      hideAlert();
    });

    borrowerSelect.addEventListener('change', checkLimits);

    form.addEventListener('submit', handleSubmit);
  });
})();
