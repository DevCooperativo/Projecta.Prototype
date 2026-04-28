# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Projecta** is a system for managing academic research projects and laboratories. This repository (`Projecta.Prototype`) holds the **UI prototype** for the Projecta frontend — its purpose is to validate design and user flows before full product development begins.

**Single-tenant system** — the client is Instituto Tecnológico do Litoral (ITL). There is no institution selector or multi-tenant architecture.

**User roles**: Administrador (full access), Professor (coordinator or researcher of projects, can request loans), Aluno (limited access, can be a researcher, can request loans).

**Functional modules (from requirements)**:
- Coordenadorias (RF13–RF16) — managed by Administrador; has Bloco field (B0–B10)
- Laboratórios (RF01–RF04) — managed by Administrador
- Categorias de equipamento (RF05–RF08) — managed by Administrador
- Categorias de projeto (RF09–RF12) — managed by Administrador; Área de Conhecimento is a fixed select
- Professores (RF21–RF24) — managed by Administrador
- Alunos (RF17–RF20) — managed by Administrador
- Projetos (RF26) — managed by Professor (coordinator); linked to laboratory and category
- Equipamentos (RF25) — managed by Professor; linked to laboratory, project and category
- Empréstimos (RF27) — requested by Professor or Aluno

The full requirements are documented in `reference/documento_requisitos.md`. **Always consult this document before implementing any screen or feature.**

## Tech Stack

- **HTML5, CSS3, vanilla JavaScript** — no build tools, no bundlers, no server required
- **Bootstrap 5.3** (CDN) — the only UI framework; no other CSS frameworks
- **No custom CSS** in the current phase — use Bootstrap utility classes and components exclusively

## Repository Structure

```
css/         — Custom stylesheets (reserved for future phases; empty now)
js/          — JavaScript files, one per page or feature module
*.html       — One HTML file per screen/page
reference/   — Requirements and reference documentation
```

## Code Conventions

### General
- Each screen is a standalone `.html` file; do not mix multiple screens into one file.
- JavaScript lives in `js/` with filenames matching their corresponding page (e.g., `login.html` → `js/login.js`).
- CSS overrides go in `css/` when needed (future phase); keep them scoped and minimal.
- All files must be clean and well-structured to facilitate migration to React or Angular: separate concerns clearly, avoid inline styles and inline scripts entirely.

### HTML
- Use semantic HTML5 elements (`<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`).
- Load Bootstrap via CDN in every page's `<head>`; load page-specific JS at the end of `<body>`.
- Keep markup lean — avoid unnecessary wrapper `<div>` nesting.

### JavaScript
- Write modular, function-based JS; group related logic into clearly named functions.
- No jQuery. Use the native DOM API and Bootstrap's JS API (`bootstrap.*`).
- Avoid global state; keep data as close to where it's used as possible.

### Design Style
- **Minimalist** — favor whitespace, clear hierarchy, and restrained use of color.
- Use Bootstrap's component library as-is; do not override default styles unless strictly necessary.
- Avoid decorative elements, gradients, and heavy shadows — the interface should look intentional, not generated.
- Prefer neutral tones; use Bootstrap's color system (`text-primary`, `bg-light`, etc.) consistently.
