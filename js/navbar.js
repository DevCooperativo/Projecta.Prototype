/**
 * navbar.js
 * Navbar compartilhada do sistema — Projecta
 *
 * Detecta a seção ativa pelo pathname e computa o caminho base
 * para montar os hrefs corretamente de qualquer subdiretório.
 *
 * Uso: adicionar <div id="navbar-placeholder"></div> no topo do <body>
 * e carregar este script antes dos scripts de página (após Bootstrap).
 */

(function () {
  'use strict';

  var path = window.location.pathname;

  // Todos os arquivos de app estão um nível abaixo da raiz
  var segments = path.split('/').filter(Boolean);
  var base = segments.length >= 2 ? '..' : '.';

  // Seção ativa detectada pelo pathname
  var active = '';
  if      (path.includes('/projects/'))     active = 'projects';
  else if (path.includes('/coordination/')) active = 'coordination';
  else if (path.includes('/professors/'))   active = 'professors';
  else if (path.includes('/students/'))     active = 'students';
  else if (path.includes('/loans/'))        active = 'loans';

  function navLink(href, label, key) {
    var isActive = Boolean(key) && active === key;
    return [
      '<li class="nav-item">',
      '<a class="nav-link' + (isActive ? ' active' : '') + '"' +
        (isActive ? ' aria-current="page"' : '') +
        ' href="' + href + '">' + label + '</a>',
      '</li>',
    ].join('');
  }

  var navHTML = [
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">',
    '<div class="container-fluid px-4">',
    '<a class="navbar-brand fw-bold" href="' + base + '/index.html">Projecta</a>',
    '<button class="navbar-toggler border-0" type="button"',
    '  data-bs-toggle="collapse" data-bs-target="#navbarApp"',
    '  aria-controls="navbarApp" aria-expanded="false" aria-label="Alternar navegação">',
    '  <span class="navbar-toggler-icon"></span>',
    '</button>',
    '<div class="collapse navbar-collapse" id="navbarApp">',
    '<ul class="navbar-nav me-auto ms-3 gap-1">',
    navLink('#', 'Dashboard', ''),
    navLink(base + '/projects/index.html',    'Projetos',       'projects'),
    navLink(base + '/coordination/index.html', 'Coordenadorias', 'coordination'),
    navLink('#',                               'Laboratórios',   'labs'),
    navLink(base + '/professors/index.html',  'Professores',    'professors'),
    navLink(base + '/students/index.html',    'Alunos',         'students'),
    navLink(base + '/loans/index.html',       'Empréstimos',    'loans'),
    '</ul>',
    '<div class="dropdown mt-3 mt-lg-0">',
    '<button class="btn btn-sm btn-outline-light dropdown-toggle" type="button"',
    '  data-bs-toggle="dropdown" aria-expanded="false">Administrador</button>',
    '<ul class="dropdown-menu dropdown-menu-end">',
    '<li><a class="dropdown-item" href="' + base + '/admin/detail.html">Meu perfil</a></li>',
    '<li><hr class="dropdown-divider"></li>',
    '<li><a class="dropdown-item" href="' + base + '/index.html">Sair</a></li>',
    '</ul>',
    '</div>',
    '</div>',
    '</div>',
    '</nav>',
  ].join('\n');

  // O script é carregado no final do <body>, então o DOM já está disponível.
  var placeholder = document.getElementById('navbar-placeholder');
  if (placeholder) {
    var tmp = document.createElement('div');
    tmp.innerHTML = navHTML;
    placeholder.parentNode.replaceChild(tmp.firstElementChild, placeholder);
  }
})();
