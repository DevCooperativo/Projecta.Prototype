/**
 * student-form.js
 * Formulário de cadastro e edição de alunos — Projecta
 *
 * RF17 — Inserir aluno
 * RF18 — Alterar aluno
 *
 * Detecta o modo pelo pathname:
 *   - new.html  → criação (administrador cadastra aluno)
 *   - edit.html → edição (aluno edita os próprios dados)
 */

(function () {
  'use strict';

  var isEditMode = window.location.pathname.includes('edit.html');
  var params     = new URLSearchParams(window.location.search);
  var editId     = isEditMode ? Number(params.get('id')) : null;

  var form              = document.getElementById('studentForm');
  var nameInput         = document.getElementById('name');
  var emailInput        = document.getElementById('email');
  var registrationInput = document.getElementById('registration');
  var courseInput       = document.getElementById('course');
  var lattesInput       = document.getElementById('lattes');
  var cancelBtn         = document.getElementById('cancelBtn');
  var breadcrumbLink    = document.getElementById('breadcrumbDetailLink');

  // ── Utilitários ────────────────────────────────────────────────────────────

  function getStatusValue() {
    var checked = form.querySelector('input[name="status"]:checked');
    return checked ? checked.value : 'active';
  }

  function setStatusValue(value) {
    var radio = form.querySelector('input[name="status"][value="' + value + '"]');
    if (radio) radio.checked = true;
  }

  function collectFormData() {
    return {
      name:         nameInput.value.trim(),
      email:        emailInput.value.trim().toLowerCase(),
      registration: registrationInput.value.trim(),
      course:       courseInput.value.trim(),
      lattes:       lattesInput.value.trim(),
      status:       getStatusValue(),
    };
  }

  // ── Modo edição ────────────────────────────────────────────────────────────

  function populateForm(student) {
    nameInput.value         = student.name;
    emailInput.value        = student.email;
    registrationInput.value = student.registration;
    courseInput.value       = student.course;
    lattesInput.value       = student.lattes || '';
    setStatusValue(student.status);

    if (breadcrumbLink) {
      breadcrumbLink.textContent = student.name;
      breadcrumbLink.href = 'detail.html?id=' + student.id;
    }
    if (cancelBtn) cancelBtn.href = 'detail.html?id=' + student.id;

    document.title = 'Editar ' + student.name + ' — Projecta';
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  function handleSubmit(e) {
    e.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) return;

    var data = collectFormData();

    if (isEditMode) {
      StudentData.update(editId, data);
      window.location.href = 'index.html?updated=1';
    } else {
      StudentData.create(data);
      window.location.href = 'index.html?saved=1';
    }
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    if (isEditMode) {
      if (!editId) { window.location.href = 'index.html'; return; }
      var student = StudentData.findById(editId);
      if (!student) { window.location.href = 'index.html'; return; }
      populateForm(student);
    }

    form.addEventListener('submit', handleSubmit);
  });
})();
