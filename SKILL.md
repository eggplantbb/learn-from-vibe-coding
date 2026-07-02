---
name: learn-from-vibe-coding
description: Use this skill when the user wants to turn vibe-coding projects into a structured, growing skill map; update a tech-map JSON from project evidence; classify technologies into six fixed modules; write project-to-technology application records; or maintain the static dashboard and examples in this repository.
---

# learn from vibe-coding

Use this skill to maintain a lightweight skill map for vibe-coding projects.

The skill is for one job only: extract real technologies used in a project, store them in a consistent JSON structure, and keep the static dashboard in sync.

Do not turn this into:

- a portfolio-writing tool
- a product analysis tool
- a learning roadmap generator
- a scoring or ranking system
- a backend system

## When to use

Use this skill when the user asks for any of the following:

- summarize what technologies were actually used in a vibe-coding project
- add a new project into the skill map
- add or refine technology nodes
- classify a technology into one of the six modules
- write or update `data/tech-map-data.json`
- update example data in `examples/`
- adjust the static dashboard in `dashboard/` to reflect the existing data model
- keep this repository publishable as an open-source template

Do not use this skill when the user mainly wants:

- product strategy or UX critique unrelated to the skill map
- a generic frontend refactor with no relation to the map structure
- a dynamic app, backend, auth, database, or API integration

## Core model

This repository uses one unified JSON file with three arrays:

- `projects`
- `techPoints`
- `projectTechApplications`

The main file is:

- `data/tech-map-data.json`

Treat `projectTechApplications` as the source of truth for whether a technology has been used. Do not add a manual `used` field to `techPoints`.

## Fixed module taxonomy

Every `techPoints.island` must be one of these six values:

- `页面结构岛`
- `交互状态岛`
- `动画表现岛`
- `数据处理岛`
- `工程部署岛`
- `AI 协作岛`

If a technology does not fit cleanly, choose the closest primary module instead of inventing a seventh module.

## Required workflow

When updating the skill map from a project, follow this order:

1. Identify the project and add or update the `projects` record.
2. Extract only meaningful technologies or methods actually used in the project.
3. Reuse existing `techPoints` when possible.
4. Add a new `techPoints` item only when the concept is genuinely new and useful across projects.
5. Add one `projectTechApplications` record per project-to-technology usage.
6. Keep the dashboard compatible with the existing JSON contract.

## Extraction rules

Prefer technologies that represent meaningful implementation choices, not tiny UI behaviors.

Good examples:

- HTML
- React
- Canvas
- API 数据
- localStorage
- Vite
- Git
- Prompt
- 上下文文件
- Bug 修复

Usually avoid items that are too small or too local unless the user explicitly wants them:

- 单个按钮点击
- 某一个弹窗是否出现
- 单次样式微调
- 纯产品背景描述

## Writing rules

### `projects`

Each project should stay lightweight and only act as a source index.

Required fields:

- `id`
- `name`
- `linkOrPath`
- `reviewedAt`

### `techPoints`

Each technology point should describe a reusable concept on the map.

Current fields used by this repository:

- `id`
- `name`
- `island`
- `summary`
- `detail`
- `commonForms`
- `stackMappings`
- `boundaries`

Write explanations in plain language for beginners. Prefer practical meaning over textbook definition.

### `projectTechApplications`

This is the most important table. It records how a technology actually landed in a project.

Fields:

- `id`
- `projectId`
- `techPointId`
- `roleInProject`
- `aiCollaboration`
- `pitfallsAndFixes`
- `reusable`
- `notes`

`reusable` must be `true`, `false`, or `null`.

## Dashboard scope

The dashboard is static and read-only.

Keep these constraints:

- no framework
- no build tool requirement
- no backend
- no auth
- no editing UI
- no search, filter, score, or recommendation system unless the user explicitly changes scope

Main files:

- `dashboard/index.html`
- `dashboard/style.css`
- `dashboard/app.js`

## Open-source hygiene

When preparing this repository for public sharing:

- keep personal project data out of `data/tech-map-data.json` unless the user explicitly wants it public
- put sample content in `examples/`
- avoid local absolute paths
- avoid machine-specific assets unless they are checked into the repo

## File guide

Use these files intentionally:

- `README.md`: public, human-facing overview
- `SKILL.md`: agent-facing instructions for how to use and maintain this repository as a skill
- `data/tech-map-data.json`: primary data source
- `examples/*.json`: sample data only
- `dashboard/*`: static visualization
- `docs/learn-from-vibe-coding.md`: deeper product and field-design context; read this only when changing scope, taxonomy, or data design

## Default output shape

When the user asks to add a project, prefer producing updates in this shape:

1. project record
2. new or reused technology points
3. project-to-technology application records
4. any required dashboard or README adjustments

If the user only wants analysis, you can stop at a structured proposal without editing files.
