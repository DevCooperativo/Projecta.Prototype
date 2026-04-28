/**
 * lab-form.js
 * Formulario de cadastro e edicao de laboratorios - Projecta
 *
 * RF01 - Inserir laboratorio
 * RF02 - Alterar laboratorio
 */

(function () {
  'use strict';

  var isEditMode = window.location.pathname.includes('edit.html');
  var params = new URLSearchParams(window.location.search);
  var editId = isEditMode ? Number(params.get('id')) : null;

  var form = document.getElementById('labForm');
  var nameInput = document.getElementById('name');
  var acronymInput = document.getElementById('acronym');
  var blockSelect = document.getElementById('block');
  var roomInput = document.getElementById('room');
  var responsibleInput = document.getElementById('responsible');
  var capacityInput = document.getElementById('capacity');
  var descriptionInput = document.getElementById('description');
  var cancelBtn = document.getElementById('cancelBtn');
  var breadcrumbLink = document.getElementById('breadcrumbDetailLink');

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
      name: nameInput.value.trim(),
      acronym: acronymInput.value.trim().toUpperCase(),
      block: blockSelect.value,
      room: roomInput.value.trim(),
      responsible: responsibleInput.value.trim(),
      capacity: Number(capacityInput.value),
      description: descriptionInput.value.trim(),
      status: getStatusValue(),
    };
  }

  function populateBlockSelect(selectedBlock) {
    LabData.blocos.forEach(function (bloco) {
      var opt = document.createElement('option');
      opt.value = bloco;
      opt.textContent = bloco;
      if (selectedBlock && bloco === selectedBlock) opt.selected = true;
      blockSelect.appendChild(opt);
    });
  }

  function populateForm(lab) {
    nameInput.value = lab.name;
    acronymInput.value = lab.acronym;
    roomInput.value = lab.room;
    responsibleInput.value = lab.responsible;
    capacityInput.value = lab.capacity;
    descriptionInput.value = lab.description || '';
    setStatusValue(lab.status);

    if (breadcrumbLink) {
      breadcrumbLink.textContent = lab.name;
      breadcrumbLink.href = 'detail.html?id=' + lab.id;
    }
    if (cancelBtn) cancelBtn.href = 'detail.html?id=' + lab.id;

    document.title = 'Editar ' + lab.name + ' - Projecta';
  }

  function handleSubmit(e) {
    e.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) return;

    var data = collectFormData();

    if (isEditMode) {
      LabData.update(editId, data);
      window.location.href = 'index.html?updated=1';
    } else {
      LabData.create(data);
      window.location.href = 'index.html?saved=1';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    acronymInput.addEventListener('input', function () {
      acronymInput.value = acronymInput.value.toUpperCase();
    });

    if (isEditMode) {
      if (!editId) { window.location.href = 'index.html'; return; }
      var lab = LabData.findById(editId);
      if (!lab) { window.location.href = 'index.html'; return; }
      populateBlockSelect(lab.block);
      populateForm(lab);
    } else {
      populateBlockSelect(null);
    }

    form.addEventListener('submit', handleSubmit);
  });
})();
