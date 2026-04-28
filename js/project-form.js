/**
 * project-form.js
 * Formulário de criação e edição de projetos — Projecta
 * RF26 — Gerenciamento de projetos (inserir / alterar)
 *
 * Usado por projects/new.html e projects/edit.html.
 * Detecta modo de edição via parâmetro ?id=X na URL.
 */

(function () {
  'use strict';

  var coordinators = [];
  var researchers  = [];
  var isEditMode   = false;
  var editingId    = null;

  // ── Refs do formulário ─────────────────────────────────────────────────────

  var form          = document.getElementById('projectForm');
  var nameInput     = document.getElementById('name');
  var categoryEl    = document.getElementById('categoryId');
  var areaEl        = document.getElementById('areaConhecimento');
  var labEl         = document.getElementById('laboratoryId');
  var descEl        = document.getElementById('description');
  var submitBtn     = document.getElementById('submitBtn');

  // ── Refs de coordenadores ──────────────────────────────────────────────────

  var coordTableBody      = document.getElementById('coordinatorsTableBody');
  var coordError          = document.getElementById('coordinatorsError');
  var addCoordBtn         = document.getElementById('addCoordinatorBtn');
  var coordProfSelect     = document.getElementById('coordinatorProfessorSelect');
  var coordPreview        = document.getElementById('coordinatorPreview');
  var coordPreviewName    = document.getElementById('coordinatorPreviewName');
  var coordPreviewEmail   = document.getElementById('coordinatorPreviewEmail');
  var coordPreviewCoord   = document.getElementById('coordinatorPreviewCoord');
  var confirmAddCoordBtn  = document.getElementById('confirmAddCoordinatorBtn');

  // ── Refs de pesquisadores ──────────────────────────────────────────────────

  var resTableBody        = document.getElementById('researchersTableBody');
  var addResBtn           = document.getElementById('addResearcherBtn');
  var resTypeSelect       = document.getElementById('researcherTypeSelect');
  var resPersonGroup      = document.getElementById('researcherPersonGroup');
  var resPersonLabel      = document.getElementById('researcherPersonLabel');
  var resPersonSelect     = document.getElementById('researcherPersonSelect');
  var resPreview          = document.getElementById('researcherPreview');
  var resPreviewName      = document.getElementById('researcherPreviewName');
  var resPreviewEmail     = document.getElementById('researcherPreviewEmail');
  var resPreviewInfo      = document.getElementById('researcherPreviewInfo');
  var resTypeError        = document.getElementById('researcherTypeError');
  var resPersonError      = document.getElementById('researcherPersonError');
  var confirmAddResBtn    = document.getElementById('confirmAddResearcherBtn');

  var coordinatorModal;
  var researcherModal;

  // ── População de selects ───────────────────────────────────────────────────

  function populateCategories() {
    ProjectData.categories.forEach(function (cat) {
      var opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name;
      categoryEl.appendChild(opt);
    });
  }

  function populateAreas() {
    ProjectData.areasConhecimento.forEach(function (area) {
      var opt = document.createElement('option');
      opt.value = area;
      opt.textContent = area;
      areaEl.appendChild(opt);
    });
  }

  function populateLaboratories() {
    ProjectData.laboratories.forEach(function (lab) {
      var opt = document.createElement('option');
      opt.value = lab.id;
      opt.textContent = lab.name;
      labEl.appendChild(opt);
    });
  }

  function populateCoordinatorSelect() {
    var added = coordinators.map(function (c) { return c.professorId; });
    coordProfSelect.innerHTML = '<option value="">Selecione um professor...</option>';
    ProjectData.professors.forEach(function (prof) {
      if (added.indexOf(prof.id) !== -1) return;
      var opt = document.createElement('option');
      opt.value = prof.id;
      opt.textContent = prof.name;
      coordProfSelect.appendChild(opt);
    });
  }

  function populateResearcherPersonSelect(type) {
    var list  = type === 'professor' ? ProjectData.professors : ProjectData.students;
    var added = researchers
      .filter(function (r) { return r.type === type; })
      .map(function (r) { return r.userId; });

    resPersonSelect.innerHTML = '<option value="">Selecione...</option>';
    list.forEach(function (person) {
      if (added.indexOf(person.id) !== -1) return;
      var opt = document.createElement('option');
      opt.value = person.id;
      opt.textContent = person.name;
      resPersonSelect.appendChild(opt);
    });
  }

  // ── Renderização das tabelas ───────────────────────────────────────────────

  function renderCoordinatorsTable() {
    if (coordinators.length === 0) {
      coordTableBody.innerHTML =
        '<tr><td colspan="3" class="text-center text-muted py-4 small">Nenhum coordenador adicionado.</td></tr>';
      return;
    }
    coordTableBody.innerHTML = coordinators.map(function (c, idx) {
      return [
        '<tr>',
        '  <td class="ps-3 fw-semibold small">' + c.name + '</td>',
        '  <td><span class="text-muted small">' + c.email + '</span></td>',
        '  <td class="text-end pe-3">',
        '    <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-coordinator" data-idx="' + idx + '">Remover</button>',
        '  </td>',
        '</tr>',
      ].join('');
    }).join('');
  }

  function renderResearchersTable() {
    if (researchers.length === 0) {
      resTableBody.innerHTML =
        '<tr><td colspan="4" class="text-center text-muted py-4 small">Nenhum pesquisador adicionado.</td></tr>';
      return;
    }
    resTableBody.innerHTML = researchers.map(function (r, idx) {
      var badge = r.type === 'professor'
        ? '<span class="badge bg-primary-subtle text-primary border border-primary-subtle fw-normal">Professor</span>'
        : '<span class="badge bg-info-subtle text-info border border-info-subtle fw-normal">Aluno</span>';
      return [
        '<tr>',
        '  <td class="ps-3 fw-semibold small">' + r.name + '</td>',
        '  <td><span class="text-muted small">' + r.email + '</span></td>',
        '  <td>' + badge + '</td>',
        '  <td class="text-end pe-3">',
        '    <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-researcher" data-idx="' + idx + '">Remover</button>',
        '  </td>',
        '</tr>',
      ].join('');
    }).join('');
  }

  // ── Modal de coordenador ───────────────────────────────────────────────────

  function resetCoordinatorModal() {
    coordProfSelect.value = '';
    coordProfSelect.classList.remove('is-invalid');
    coordPreview.classList.add('d-none');
  }

  addCoordBtn.addEventListener('click', function () {
    resetCoordinatorModal();
    populateCoordinatorSelect();
    coordinatorModal.show();
  });

  coordProfSelect.addEventListener('change', function () {
    var id = Number(this.value);
    coordProfSelect.classList.remove('is-invalid');
    if (!id) { coordPreview.classList.add('d-none'); return; }
    var prof = ProjectData.findProfessorById(id);
    if (!prof) return;
    coordPreviewName.textContent  = prof.name;
    coordPreviewEmail.textContent = prof.email;
    coordPreviewCoord.textContent = 'Coordenadoria: ' + prof.coordination;
    coordPreview.classList.remove('d-none');
  });

  confirmAddCoordBtn.addEventListener('click', function () {
    var id = Number(coordProfSelect.value);
    if (!id) { coordProfSelect.classList.add('is-invalid'); return; }
    var prof = ProjectData.findProfessorById(id);
    if (!prof) return;
    coordinators.push({ professorId: prof.id, name: prof.name, email: prof.email });
    renderCoordinatorsTable();
    coordError.classList.add('d-none');
    coordinatorModal.hide();
  });

  // ── Modal de pesquisador ───────────────────────────────────────────────────

  function resetResearcherModal() {
    resTypeSelect.value = '';
    resTypeSelect.classList.remove('is-invalid');
    resPersonGroup.classList.add('d-none');
    resPersonSelect.innerHTML = '<option value="">Selecione...</option>';
    resPersonSelect.classList.remove('is-invalid');
    resPreview.classList.add('d-none');
    resTypeError.classList.add('d-none');
    resPersonError.classList.add('d-none');
  }

  addResBtn.addEventListener('click', function () {
    resetResearcherModal();
    researcherModal.show();
  });

  resTypeSelect.addEventListener('change', function () {
    var type = this.value;
    resTypeSelect.classList.remove('is-invalid');
    resTypeError.classList.add('d-none');
    resPreview.classList.add('d-none');
    resPersonError.classList.add('d-none');

    if (!type) { resPersonGroup.classList.add('d-none'); return; }

    resPersonLabel.innerHTML = (type === 'professor' ? 'Professor' : 'Aluno') + ' <span class="text-danger">*</span>';
    populateResearcherPersonSelect(type);
    resPersonGroup.classList.remove('d-none');
    resPersonSelect.value = '';
    resPersonSelect.classList.remove('is-invalid');
  });

  resPersonSelect.addEventListener('change', function () {
    var type = resTypeSelect.value;
    var id   = Number(this.value);
    resPersonSelect.classList.remove('is-invalid');
    resPersonError.classList.add('d-none');
    if (!id) { resPreview.classList.add('d-none'); return; }

    var person = type === 'professor'
      ? ProjectData.findProfessorById(id)
      : ProjectData.findStudentById(id);
    if (!person) return;

    resPreviewName.textContent  = person.name;
    resPreviewEmail.textContent = person.email;
    resPreviewInfo.textContent  = type === 'professor'
      ? 'Coordenadoria: ' + person.coordination
      : 'Curso: ' + person.course;
    resPreview.classList.remove('d-none');
  });

  confirmAddResBtn.addEventListener('click', function () {
    var type = resTypeSelect.value;
    var id   = Number(resPersonSelect.value);
    var valid = true;

    if (!type) {
      resTypeSelect.classList.add('is-invalid');
      resTypeError.classList.remove('d-none');
      valid = false;
    }
    if (!id) {
      resPersonSelect.classList.add('is-invalid');
      resPersonError.classList.remove('d-none');
      valid = false;
    }
    if (!valid) return;

    var person = type === 'professor'
      ? ProjectData.findProfessorById(id)
      : ProjectData.findStudentById(id);
    if (!person) return;

    researchers.push({ type: type, userId: person.id, name: person.name, email: person.email });
    renderResearchersTable();
    researcherModal.hide();
  });

  // ── Remoção nas tabelas ────────────────────────────────────────────────────

  document.getElementById('coordinatorsSection').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action="remove-coordinator"]');
    if (!btn) return;
    coordinators.splice(Number(btn.dataset.idx), 1);
    renderCoordinatorsTable();
  });

  document.getElementById('researchersSection').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action="remove-researcher"]');
    if (!btn) return;
    researchers.splice(Number(btn.dataset.idx), 1);
    renderResearchersTable();
  });

  // ── Submissão do formulário ────────────────────────────────────────────────

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.classList.add('was-validated');

    var valid = form.checkValidity();

    if (coordinators.length === 0) {
      coordError.classList.remove('d-none');
      valid = false;
    } else {
      coordError.classList.add('d-none');
    }

    if (!valid) return;

    var data = {
      name:             nameInput.value.trim(),
      categoryId:       Number(categoryEl.value),
      areaConhecimento: areaEl.value,
      laboratoryId:     Number(labEl.value),
      description:      descEl.value.trim(),
      status:           document.querySelector('input[name="status"]:checked').value,
      coordinators:     coordinators.slice(),
      researchers:      researchers.slice(),
    };

    if (isEditMode) {
      ProjectData.update(editingId, data);
      window.location.href = 'index.html?updated=1';
    } else {
      ProjectData.create(data);
      window.location.href = 'index.html?saved=1';
    }
  });

  // ── Modo edição ────────────────────────────────────────────────────────────

  function loadProject(id) {
    var project = ProjectData.findById(id);
    if (!project) { window.location.href = 'index.html'; return; }

    document.title = 'Editar projeto — Projecta';
    document.getElementById('pageTitle').textContent = 'Editar projeto';
    document.getElementById('breadcrumbCurrent').textContent = project.name;
    submitBtn.textContent = 'Atualizar projeto';

    nameInput.value  = project.name;
    categoryEl.value = project.categoryId;
    areaEl.value     = project.areaConhecimento;
    labEl.value      = project.laboratoryId;
    descEl.value     = project.description || '';

    var statusInput = document.querySelector('input[name="status"][value="' + project.status + '"]');
    if (statusInput) statusInput.checked = true;

    coordinators = project.coordinators.map(function (c) { return Object.assign({}, c); });
    researchers  = project.researchers.map(function (r)  { return Object.assign({}, r); });
    renderCoordinatorsTable();
    renderResearchersTable();
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    coordinatorModal = new bootstrap.Modal(document.getElementById('coordinatorModal'));
    researcherModal  = new bootstrap.Modal(document.getElementById('researcherModal'));

    populateCategories();
    populateAreas();
    populateLaboratories();
    renderCoordinatorsTable();
    renderResearchersTable();

    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    if (id) {
      isEditMode = true;
      editingId  = Number(id);
      loadProject(editingId);
    }
  });
})();
