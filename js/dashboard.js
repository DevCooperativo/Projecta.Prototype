/**
 * dashboard.js
 * Visao geral administrativa do Projecta.
 */

(function () {
  'use strict';

  function statusBadge(status) {
    if (status === 'active') {
      return '<span class="badge bg-success-subtle text-success border border-success-subtle fw-normal">Em andamento</span>';
    }
    if (status === 'concluded') {
      return '<span class="badge bg-primary-subtle text-primary border border-primary-subtle fw-normal">Concluído</span>';
    }
    return '<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-normal">Inativo</span>';
  }

  function labStatusBadge(status) {
    if (status === 'active') {
      return '<span class="badge bg-success-subtle text-success border border-success-subtle fw-normal">Ativo</span>';
    }
    if (status === 'maintenance') {
      return '<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle fw-normal">Em manutenção</span>';
    }
    return '<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-normal">Inativo</span>';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    var parts = dateStr.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  function countMembers(projects) {
    return projects.reduce(function (total, project) {
      return total + project.coordinators.length + project.researchers.length;
    }, 0);
  }

  function renderCounts() {
    var activeProjects = ProjectData.projects.filter(function (project) { return project.status === 'active'; });
    var activeLabs = LabData.labs.filter(function (lab) { return lab.status === 'active'; });
    var pendingLoans = LoanData.loans.filter(function (loan) { return loan.status === 'pending'; });

    document.getElementById('activeProjectsCount').textContent = activeProjects.length;
    document.getElementById('activeLabsCount').textContent = activeLabs.length;
    document.getElementById('pendingLoansCount').textContent = pendingLoans.length;
    document.getElementById('researchMembersCount').textContent = countMembers(ProjectData.projects);
  }

  function renderRecentProjects() {
    var recentProjects = ProjectData.projects
      .slice()
      .sort(function (a, b) { return b.updatedAt.localeCompare(a.updatedAt); })
      .slice(0, 5);

    document.getElementById('recentProjectsBody').innerHTML = recentProjects.map(function (project) {
      return [
        '<tr>',
        '  <td class="ps-3">',
        '    <div class="fw-semibold">' + project.name + '</div>',
        '    <div class="text-muted small">' + project.coordinators[0].name + '</div>',
        '  </td>',
        '  <td class="small">' + project.areaConhecimento + '</td>',
        '  <td>' + statusBadge(project.status) + '</td>',
        '  <td class="text-end pe-3"><a href="../projects/detail.html?id=' + project.id + '" class="btn btn-sm btn-outline-secondary">Ver</a></td>',
        '</tr>',
      ].join('\n');
    }).join('');
  }

  function renderPendingLoans() {
    var pendingLoans = LoanData.loans
      .filter(function (loan) { return loan.status === 'pending'; })
      .sort(function (a, b) { return a.expectedReturnDate.localeCompare(b.expectedReturnDate); })
      .slice(0, 5);

    document.getElementById('pendingLoansBody').innerHTML = pendingLoans.length > 0
      ? pendingLoans.map(function (loan) {
        return [
          '<tr>',
          '  <td class="ps-3 fw-semibold small">' + loan.equipmentName + '</td>',
          '  <td class="small">' + loan.borrowerName + '</td>',
          '  <td class="small">' + formatDate(loan.expectedReturnDate) + '</td>',
          '</tr>',
        ].join('\n');
      }).join('')
      : '<tr><td colspan="3" class="text-center text-muted py-4">Nenhum empréstimo pendente.</td></tr>';
  }

  function renderLabs() {
    var labs = LabData.labs.slice(0, 5);

    document.getElementById('labStatusList').innerHTML = labs.map(function (lab) {
      return [
        '<div class="d-flex justify-content-between align-items-start gap-3">',
        '  <div>',
        '    <p class="fw-semibold mb-1 small">' + lab.name + '</p>',
        '    <p class="text-muted mb-0 small">' + lab.block + ' - Sala ' + lab.room + ' · ' + lab.capacity + ' pessoas</p>',
        '  </div>',
        '  ' + labStatusBadge(lab.status),
        '</div>',
      ].join('\n');
    }).join('');
  }

  function renderAttention() {
    var maintenanceLabs = LabData.labs.filter(function (lab) { return lab.status === 'maintenance'; });
    var pendingLoans = LoanData.loans.filter(function (loan) { return loan.status === 'pending'; });
    var inactiveProjects = ProjectData.projects.filter(function (project) { return project.status === 'inactive'; });

    var items = [];

    maintenanceLabs.forEach(function (lab) {
      items.push({
        title: lab.name,
        description: 'Laboratório em manutenção.',
        href: '../labs/detail.html?id=' + lab.id,
      });
    });

    pendingLoans.slice(0, 2).forEach(function (loan) {
      items.push({
        title: loan.equipmentName,
        description: 'Devolução prevista para ' + formatDate(loan.expectedReturnDate) + '.',
        href: '../loans/index.html',
      });
    });

    inactiveProjects.forEach(function (project) {
      items.push({
        title: project.name,
        description: 'Projeto marcado como inativo.',
        href: '../projects/detail.html?id=' + project.id,
      });
    });

    document.getElementById('attentionCount').textContent = items.length + ' item(ns)';
    document.getElementById('attentionList').innerHTML = items.length > 0
      ? items.map(function (item) {
        return [
          '<a href="' + item.href + '" class="text-decoration-none text-reset">',
          '  <div class="border rounded p-3 bg-light">',
          '    <p class="fw-semibold mb-1 small">' + item.title + '</p>',
          '    <p class="text-muted mb-0 small">' + item.description + '</p>',
          '  </div>',
          '</a>',
        ].join('\n');
      }).join('')
      : '<p class="text-muted small mb-0">Nenhum ponto de atenção no momento.</p>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderCounts();
    renderRecentProjects();
    renderPendingLoans();
    renderLabs();
    renderAttention();
  });
})();
