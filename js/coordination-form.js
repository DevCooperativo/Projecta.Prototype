/**
 * coordination-form.js
 * Formulário de cadastro e edição de coordenadorias — Projecta
 *
 * RF13 — Inserir coordenadoria
 * RF14 — Alterar coordenadoria
 *
 * Detecta o modo pelo pathname:
 *   - new.html  → criação
 *   - edit.html → edição (lê ?id= da URL)
 */

(function () {
  'use strict';

  var isEditMode = window.location.pathname.includes('edit.html');
  var params     = new URLSearchParams(window.location.search);
  var editId     = isEditMode ? Number(params.get('id')) : null;

  var form             = document.getElementById('coordinationForm');
  var nameInput        = document.getElementById('name');
  var acronymInput     = document.getElementById('acronym');
  var blockSelect      = document.getElementById('block');
  var descriptionInput = document.getElementById('description');
  var cancelBtn        = document.getElementById('cancelBtn');
  var breadcrumbLink   = document.getElementById('breadcrumbDetailLink');

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
      name:        nameInput.value.trim(),
      acronym:     acronymInput.value.trim().toUpperCase(),
      block:       blockSelect.value,
      description: descriptionInput.value.trim(),
      status:      getStatusValue(),
    };
  }

  // ── Popula select de blocos ────────────────────────────────────────────────

  function populateBlocoSelect(selectedBlock) {
    CoordinationData.blocos.forEach(function (bloco) {
      var opt = document.createElement('option');
      opt.value = bloco;
      opt.textContent = bloco;
      if (selectedBlock && bloco === selectedBlock) opt.selected = true;
      blockSelect.appendChild(opt);
    });
  }

  // ── Modo edição ────────────────────────────────────────────────────────────

  function populateForm(coordination) {
    nameInput.value        = coordination.name;
    acronymInput.value     = coordination.acronym;
    descriptionInput.value = coordination.description || '';
    setStatusValue(coordination.status);

    if (breadcrumbLink) {
      breadcrumbLink.textContent = coordination.name;
      breadcrumbLink.href = 'detail.html?id=' + coordination.id;
    }
    if (cancelBtn) cancelBtn.href = 'detail.html?id=' + coordination.id;

    document.title = 'Editar ' + coordination.name + ' — Projecta';
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  function handleSubmit(e) {
    e.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) return;

    var data = collectFormData();

    if (isEditMode) {
      CoordinationData.update(editId, data);
      window.location.href = 'index.html?updated=1';
    } else {
      CoordinationData.create(data);
      window.location.href = 'index.html?saved=1';
    }
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    // Sigla sempre em maiúsculas
    acronymInput.addEventListener('input', function () {
      acronymInput.value = acronymInput.value.toUpperCase();
    });

    if (isEditMode) {
      if (!editId) { window.location.href = 'index.html'; return; }
      var coordination = CoordinationData.findById(editId);
      if (!coordination) { window.location.href = 'index.html'; return; }
      populateBlocoSelect(coordination.block);
      populateForm(coordination);
    } else {
      populateBlocoSelect(null);
    }

    form.addEventListener('submit', handleSubmit);
  });
})();
