/**
 * professor-form.js
 * Formulário de cadastro e edição de professores — Projecta
 *
 * RF21 — Inserir professor
 * RF22 — Alterar professor
 *
 * Detecta o modo pelo pathname:
 *   - new.html  → criação (administrador cadastra professor)
 *   - edit.html → edição (professor edita os próprios dados)
 */

(function () {
  'use strict';

  var isEditMode = window.location.pathname.includes('edit.html');
  var params     = new URLSearchParams(window.location.search);
  var editId     = isEditMode ? Number(params.get('id')) : null;

  var form               = document.getElementById('professorForm');
  var nameInput          = document.getElementById('name');
  var emailInput         = document.getElementById('email');
  var registrationInput  = document.getElementById('registration');
  var coordinationSelect = document.getElementById('coordinationId');
  var lattesInput        = document.getElementById('lattes');
  var cancelBtn          = document.getElementById('cancelBtn');
  var breadcrumbLink     = document.getElementById('breadcrumbDetailLink');

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
      name:           nameInput.value.trim(),
      email:          emailInput.value.trim().toLowerCase(),
      registration:   registrationInput.value.trim(),
      coordinationId: Number(coordinationSelect.value),
      lattes:         lattesInput.value.trim(),
      status:         getStatusValue(),
    };
  }

  // ── Popula select de coordenadorias ────────────────────────────────────────

  function populateCoordinationSelect(selectedId) {
    if (typeof CoordinationData === 'undefined') return;
    CoordinationData.coordinations
      .filter(function (c) { return c.status === 'active'; })
      .forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        if (selectedId && c.id === selectedId) opt.selected = true;
        coordinationSelect.appendChild(opt);
      });
  }

  // ── Modo edição ────────────────────────────────────────────────────────────

  function populateForm(professor) {
    nameInput.value         = professor.name;
    emailInput.value        = professor.email;
    registrationInput.value = professor.registration;
    lattesInput.value       = professor.lattes || '';
    setStatusValue(professor.status);

    if (breadcrumbLink) {
      breadcrumbLink.textContent = professor.name;
      breadcrumbLink.href = 'detail.html?id=' + professor.id;
    }
    if (cancelBtn) cancelBtn.href = 'detail.html?id=' + professor.id;

    document.title = 'Editar ' + professor.name + ' — Projecta';
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  function handleSubmit(e) {
    e.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) return;

    var data = collectFormData();

    if (isEditMode) {
      ProfessorData.update(editId, data);
      window.location.href = 'index.html?updated=1';
    } else {
      ProfessorData.create(data);
      window.location.href = 'index.html?saved=1';
    }
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    if (isEditMode) {
      if (!editId) { window.location.href = 'index.html'; return; }
      var professor = ProfessorData.findById(editId);
      if (!professor) { window.location.href = 'index.html'; return; }
      populateCoordinationSelect(professor.coordinationId);
      populateForm(professor);
    } else {
      populateCoordinationSelect(null);
    }

    form.addEventListener('submit', handleSubmit);
  });
})();
