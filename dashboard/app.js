const DATA_PATH = "../data/tech-map-data.json";

function loadData() {
  return fetch(DATA_PATH).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });
}

const ISLAND_ORDER = [
  "页面结构岛",
  "交互状态岛",
  "动画表现岛",
  "数据处理岛",
  "工程部署岛",
  "AI 协作岛"
];

const LABELS = {
  "页面结构岛": "页面结构",
  "交互状态岛": "交互状态",
  "动画表现岛": "动画表现",
  "数据处理岛": "数据处理",
  "工程部署岛": "工程部署",
  "AI 协作岛": "AI 协作"
};

const BUBBLE_LAYOUT = {
  "页面结构岛": {
    baseSize: 206,
    stroke: "#d6b545",
    solid: "#d6b545"
  },
  "交互状态岛": {
    baseSize: 208,
    stroke: "#73b894",
    solid: "#73b894"
  },
  "动画表现岛": {
    baseSize: 196,
    stroke: "#7da9d9",
    solid: "#7da9d9"
  },
  "数据处理岛": {
    baseSize: 194,
    stroke: "#9787da",
    solid: "#9787da"
  },
  "工程部署岛": {
    baseSize: 206,
    stroke: "#a888c9",
    solid: "#a888c9"
  },
  "AI 协作岛": {
    baseSize: 188,
    stroke: "#d9899b",
    solid: "#d9899b"
  }
};

const NODE_TEMPLATES = {
  "页面结构岛": [
    { x: 0.34, y: 0.33 }, { x: 0.51, y: 0.31 }, { x: 0.68, y: 0.33 },
    { x: 0.25, y: 0.49 }, { x: 0.42, y: 0.47 }, { x: 0.60, y: 0.48 }, { x: 0.77, y: 0.49 },
    { x: 0.30, y: 0.66 }, { x: 0.47, y: 0.65 }, { x: 0.64, y: 0.66 }, { x: 0.76, y: 0.68 }
  ],
  "交互状态岛": [
    { x: 0.33, y: 0.32 }, { x: 0.50, y: 0.30 }, { x: 0.67, y: 0.32 },
    { x: 0.24, y: 0.47 }, { x: 0.41, y: 0.47 }, { x: 0.59, y: 0.47 }, { x: 0.76, y: 0.48 },
    { x: 0.29, y: 0.65 }, { x: 0.46, y: 0.64 }, { x: 0.63, y: 0.65 }, { x: 0.74, y: 0.67 }
  ],
  "动画表现岛": [
    { x: 0.34, y: 0.31 }, { x: 0.51, y: 0.30 }, { x: 0.69, y: 0.32 },
    { x: 0.24, y: 0.47 }, { x: 0.42, y: 0.46 }, { x: 0.60, y: 0.47 }, { x: 0.78, y: 0.48 },
    { x: 0.29, y: 0.64 }, { x: 0.46, y: 0.64 }, { x: 0.63, y: 0.65 }, { x: 0.75, y: 0.67 }
  ],
  "数据处理岛": [
    { x: 0.33, y: 0.33 }, { x: 0.51, y: 0.31 }, { x: 0.69, y: 0.33 },
    { x: 0.23, y: 0.48 }, { x: 0.41, y: 0.47 }, { x: 0.60, y: 0.48 }, { x: 0.78, y: 0.49 },
    { x: 0.29, y: 0.66 }, { x: 0.47, y: 0.65 }, { x: 0.65, y: 0.66 }, { x: 0.76, y: 0.68 }
  ],
  "工程部署岛": [
    { x: 0.34, y: 0.32 }, { x: 0.52, y: 0.31 }, { x: 0.70, y: 0.33 },
    { x: 0.24, y: 0.48 }, { x: 0.42, y: 0.48 }, { x: 0.60, y: 0.49 }, { x: 0.77, y: 0.50 },
    { x: 0.30, y: 0.66 }, { x: 0.47, y: 0.65 }, { x: 0.64, y: 0.66 }, { x: 0.75, y: 0.68 }
  ],
  "AI 协作岛": [
    { x: 0.35, y: 0.31 }, { x: 0.52, y: 0.30 }, { x: 0.69, y: 0.32 },
    { x: 0.25, y: 0.47 }, { x: 0.42, y: 0.46 }, { x: 0.60, y: 0.47 }, { x: 0.77, y: 0.48 },
    { x: 0.31, y: 0.64 }, { x: 0.48, y: 0.64 }, { x: 0.65, y: 0.65 }, { x: 0.76, y: 0.67 }
  ]
};

const NODE_SPREAD_FACTORS = {
  "页面结构岛": 0.9,
  "交互状态岛": 0.88,
  "动画表现岛": 0.89,
  "数据处理岛": 0.88,
  "工程部署岛": 0.9,
  "AI 协作岛": 0.88
};

const bubbleMap = document.querySelector("#bubble-map");
const detailBackdrop = document.querySelector("#detail-backdrop");
const detailPanel = document.querySelector("#detail-panel");
const detailClose = document.querySelector("#detail-close");
const detailHeading = document.querySelector("#detail-heading");
const detailEmpty = document.querySelector("#detail-empty");
const detailContent = document.querySelector("#detail-content");

let state = {
  groupedTechPoints: new Map(),
  applicationsByTechPointId: new Map(),
  projectMap: new Map(),
  activeIsland: null,
  activeTechPointId: null
};

detailClose.addEventListener("click", () => {
  state.activeTechPointId = null;
  renderBubbleMap();
  resetDetails();
});

detailBackdrop.addEventListener("click", () => {
  state.activeTechPointId = null;
  renderBubbleMap();
  resetDetails();
});

boot().catch((error) => {
  console.error(error);
  bubbleMap.innerHTML = '<div class="error-message">数据读取失败。请通过本地静态服务打开页面，并确认 data/tech-map-data.json 可访问。</div>';
  resetDetails();
});

async function boot() {
  const data = await loadData();
  validateData(data);

  state.projectMap = new Map(data.projects.map((project) => [project.id, project]));
  state.applicationsByTechPointId = groupApplications(data.projectTechApplications);
  state.groupedTechPoints = groupTechPoints(data.techPoints);

  renderBubbleMap();
}

function validateData(data) {
  const techPointIds = new Set(data.techPoints.map((techPoint) => techPoint.id));
  const projectIds = new Set(data.projects.map((project) => project.id));

  for (const techPoint of data.techPoints) {
    if (!ISLAND_ORDER.includes(techPoint.island)) {
      throw new Error(`Unknown island: ${techPoint.island}`);
    }
  }

  for (const application of data.projectTechApplications) {
    if (!techPointIds.has(application.techPointId)) {
      throw new Error(`Missing techPoint for application ${application.id}`);
    }
    if (!projectIds.has(application.projectId)) {
      throw new Error(`Missing project for application ${application.id}`);
    }
  }
}

function groupApplications(applications) {
  return applications.reduce((map, application) => {
    const list = map.get(application.techPointId) ?? [];
    list.push(application);
    map.set(application.techPointId, list);
    return map;
  }, new Map());
}

function groupTechPoints(techPoints) {
  return techPoints.reduce((map, techPoint) => {
    const list = map.get(techPoint.island) ?? [];
    list.push(techPoint);
    map.set(techPoint.island, list);
    return map;
  }, new Map());
}

function renderBubbleMap() {
  bubbleMap.innerHTML = "";
  const moduleLayouts = ISLAND_ORDER.map((island) => {
    const techPoints = state.groupedTechPoints.get(island) ?? [];
    const config = BUBBLE_LAYOUT[island];
    const nodeMetrics = techPoints.map((techPoint) => ({
      techPoint,
      nodeSize: getNodeSize(techPoint.name)
    }));
    const layout = resolveModuleLayout(island, nodeMetrics, config.baseSize);

    return { island, config, nodeMetrics, layout };
  });
  const placements = resolveMapPlacements(moduleLayouts);
  bubbleMap.style.minHeight = `${placements.height}px`;

  for (const moduleEntry of moduleLayouts) {
    const { island, config, nodeMetrics, layout } = moduleEntry;
    const placement = placements.byIsland.get(island);
    const group = document.createElement("section");

    group.className = "module-bubble";
    group.style.left = `${placement.x}px`;
    group.style.top = `${placement.y}px`;
    group.style.width = `${layout.diameter}px`;
    group.style.height = `${layout.diameter}px`;
    group.style.setProperty("--bubble-stroke", config.stroke);
    group.style.setProperty("--bubble-solid", config.solid);
    group.style.setProperty("--title-top", `${layout.titleTop}px`);

    const title = document.createElement("button");
    title.type = "button";
    title.className = "module-bubble__title";
    title.textContent = LABELS[island];
    title.addEventListener("click", () => {
      state.activeIsland = state.activeIsland === island ? null : island;
      renderBubbleMap();
    });
    group.append(title);

    nodeMetrics.forEach(({ techPoint, nodeSize }, index) => {
      const offset = layout.positions[index];
      const applications = state.applicationsByTechPointId.get(techPoint.id) ?? [];
      const used = applications.length > 0;
      const node = document.createElement("button");
      node.type = "button";
      node.className = "tech-bubble";
      node.dataset.used = String(used);
      node.style.setProperty("--node-size", `${nodeSize.size}px`);
      node.style.setProperty("--node-font-size", `${nodeSize.fontSize}px`);
      node.style.setProperty("--node-line-clamp", String(nodeSize.lineClamp));
      node.style.setProperty("--node-white-space", nodeSize.noWrap ? "nowrap" : "normal");

      if (state.activeTechPointId === techPoint.id) {
        node.classList.add("is-active");
      }

      node.style.left = `${offset.x}px`;
      node.style.top = `${offset.y}px`;
      node.innerHTML = `<span class="${nodeSize.noWrap ? "is-single-line" : ""}">${techPoint.name}</span>`;

      node.addEventListener("click", () => {
        state.activeIsland = island;
        state.activeTechPointId = techPoint.id;
        renderBubbleMap();
        renderDetails(techPoint, applications, state.projectMap);
      });

      group.append(node);
    });

    bubbleMap.append(group);
  }
}

function renderDetails(techPoint, applications, projectMap) {
  detailBackdrop.hidden = false;
  detailPanel.hidden = false;
  document.body.classList.add("detail-open");
  const used = applications.length > 0;
  detailHeading.textContent = techPoint.name;
  detailEmpty.hidden = true;
  detailContent.hidden = false;
  detailContent.innerHTML = "";

  const card = document.createElement("article");
  card.className = "detail-card";
  const knowledgeSections = buildKnowledgeSections(techPoint, applications);
  card.innerHTML = `<p class="detail-summary">${techPoint.summary}</p>`;
  card.append(renderKnowledgeSections(knowledgeSections));
  detailContent.append(card);

  if (!used) {
    return;
  }

  detailContent.append(renderProjectCases(applications, projectMap));
}

function resetDetails() {
  detailBackdrop.hidden = true;
  detailPanel.hidden = true;
  document.body.classList.remove("detail-open");
  detailHeading.textContent = "技术点详情";
  detailEmpty.hidden = false;
  detailContent.hidden = true;
  detailContent.innerHTML = "";
}

function resolveModuleLayout(island, nodeMetrics, baseSize) {
  const template = NODE_TEMPLATES[island] ?? [];
  const rawPositions = template.length >= nodeMetrics.length
    ? template.slice(0, nodeMetrics.length)
    : Array.from({ length: nodeMetrics.length }, (_, index) => getFallbackNodePosition(index, nodeMetrics.length));
  const spreadFactor = NODE_SPREAD_FACTORS[island] ?? 1;
  const seeds = rawPositions.map((position) => spreadPosition(position, spreadFactor));
  return compactClusterLayout(seeds, nodeMetrics, baseSize);
}

function resolveMapPlacements(moduleLayouts) {
  const columns = [
    [moduleLayouts[0], moduleLayouts[3]],
    [moduleLayouts[1], moduleLayouts[4]],
    [moduleLayouts[2], moduleLayouts[5]]
  ];
  const columnGap = 2;
  const columnOverlap = 120;
  const rowGap = -120;
  const marginX = 2;
  const marginY = 0;
  const colWidths = columns.map((column) => Math.max(...column.map((entry) => entry.layout.diameter)));
  const rowHeights = [0, 1].map((rowIndex) => Math.max(...columns.map((column) => column[rowIndex].layout.diameter)));
  const byIsland = new Map();
  const topOffsets = [0, 2, 0];
  const bottomOffsets = [2, 0, 0];

  let currentX = marginX;
  columns.forEach((column, columnIndex) => {
    let currentY = marginY;
    column.forEach((entry, rowIndex) => {
      const rowOffset = rowIndex === 0 ? topOffsets[columnIndex] : bottomOffsets[columnIndex];
      const islandOffsetY = entry.island === "数据处理岛" ? 44 : 0;
      byIsland.set(entry.island, {
        x: currentX + (colWidths[columnIndex] - entry.layout.diameter) / 2,
        y: currentY + (rowHeights[rowIndex] - entry.layout.diameter) / 2 + rowOffset + islandOffsetY
      });
      currentY += rowHeights[rowIndex] + rowGap;
    });
    currentX += colWidths[columnIndex] + columnGap - columnOverlap;
  });

  return {
    byIsland,
    height: marginY * 2 + rowHeights.reduce((sum, value) => sum + value, 0) + rowGap * (rowHeights.length - 1) + Math.max(...bottomOffsets)
  };
}

function getFallbackNodePosition(index, count) {
  const outerCount = Math.min(count, 7);
  const innerCount = Math.max(0, count - outerCount);

  let ringIndex = index;
  let ringCount = outerCount;
  let radius = 34;
  let startAngle = -160;

  if (index >= outerCount) {
    ringIndex = index - outerCount;
    ringCount = innerCount;
    radius = 21;
    startAngle = -135;
  }

  const step = ringCount > 1 ? 320 / ringCount : 0;
  const angle = (startAngle + step * ringIndex) * Math.PI / 180;
  const x = 50 + Math.cos(angle) * radius;
  const y = 50 + Math.sin(angle) * radius;

  return {
    x: clamp(x / 100, 0.16, 0.84),
    y: clamp(y / 100, 0.24, 0.84)
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function spreadPosition(position, factor) {
  return {
    x: 0.5 + (position.x - 0.5) * factor,
    y: 0.5 + (position.y - 0.5) * factor
  };
}

function compactClusterLayout(seeds, nodeMetrics, baseSize) {
  const titleTop = 42;
  const titleZoneHeight = 86;
  const edgePadding = 10;
  const nodeGap = 3;
  const minDiameter = Math.max(baseSize, estimateMinimumDiameter(nodeMetrics, titleZoneHeight));
  let low = minDiameter;
  let high = Math.max(minDiameter + 24, minDiameter * 1.28);
  let best = null;

  while (!best) {
    best = placeNodesInBubble(seeds, nodeMetrics, high, titleZoneHeight, edgePadding, nodeGap);
    if (!best) {
      high += 40;
    }
  }

  while (high - low > 6) {
    const mid = Math.round((low + high) / 2);
    const candidate = placeNodesInBubble(seeds, nodeMetrics, mid, titleZoneHeight, edgePadding, nodeGap);

    if (candidate) {
      best = candidate;
      high = mid;
    } else {
      low = mid + 1;
    }
  }

  return {
    diameter: Math.ceil(high),
    positions: best,
    titleTop
  };
}

function estimateMinimumDiameter(nodeMetrics, titleZoneHeight) {
  const maxNode = Math.max(...nodeMetrics.map(({ nodeSize }) => nodeSize.size));
  const totalArea = nodeMetrics.reduce((sum, { nodeSize }) => {
    const radius = nodeSize.size / 2;
    return sum + Math.PI * radius * radius;
  }, 0);
  const packedRadius = Math.sqrt(totalArea / (Math.PI * 0.54));
  return Math.ceil(Math.max(maxNode * 3.2, packedRadius * 2 + titleZoneHeight + 48));
}

function placeNodesInBubble(seeds, nodeMetrics, diameter, titleZoneHeight, edgePadding, nodeGap) {
  const center = diameter / 2;
  const bubbleRadius = center - edgePadding;
  const clusterCenter = {
    x: center,
    y: titleZoneHeight + Math.max(44, (diameter - titleZoneHeight) * 0.44)
  };
  const titleSafeBottom = titleZoneHeight;
  const positions = new Array(nodeMetrics.length);
  const placementOrder = nodeMetrics
    .map((entry, index) => ({
      index,
      radius: entry.nodeSize.size / 2,
      seed: seeds[index]
    }))
    .sort((a, b) => b.radius - a.radius);

  for (const item of placementOrder) {
    const position = findNodePlacement(
      item,
      placementOrder,
      positions,
      diameter,
      bubbleRadius,
      clusterCenter,
      titleSafeBottom,
      nodeGap
    );

    if (!position) {
      return null;
    }

    positions[item.index] = position;
  }

  return positions;
}

function findNodePlacement(item, placementOrder, positions, diameter, bubbleRadius, clusterCenter, titleSafeBottom, nodeGap) {
  const center = diameter / 2;
  const radius = item.radius;
  const preferred = getPreferredPoint(item.seed, clusterCenter, diameter, titleSafeBottom);
  const baseAngle = Math.atan2(preferred.y - clusterCenter.y, preferred.x - clusterCenter.x);
  const maxOrbit = Math.max(24, bubbleRadius - radius - 10);
  const orbitStep = 6;
  const angleStep = Math.PI / 18;

  const directCandidate = clampCandidate(preferred, radius, diameter, bubbleRadius, titleSafeBottom);
  if (isCandidateValid(directCandidate, radius, positions, placementOrder, nodeGap, center, bubbleRadius, titleSafeBottom)) {
    return directCandidate;
  }

  for (let orbit = 0; orbit <= maxOrbit; orbit += orbitStep) {
    for (let step = 0; step < 36; step += 1) {
      const direction = step % 2 === 0 ? 1 : -1;
      const sweep = Math.ceil(step / 2) * angleStep * direction;
      const angle = baseAngle + sweep;
      const candidate = clampCandidate({
        x: clusterCenter.x + Math.cos(angle) * orbit,
        y: clusterCenter.y + Math.sin(angle) * orbit
      }, radius, diameter, bubbleRadius, titleSafeBottom);

      if (isCandidateValid(candidate, radius, positions, placementOrder, nodeGap, center, bubbleRadius, titleSafeBottom)) {
        return candidate;
      }
    }
  }

  return null;
}

function getPreferredPoint(seed, clusterCenter, diameter, titleSafeBottom) {
  const xRange = diameter * 0.18;
  const yRange = diameter * 0.14;
  const normalizedY = clamp((seed.y - 0.28) / 0.56, 0, 1);

  return {
    x: clusterCenter.x + (seed.x - 0.5) * xRange * 2,
    y: clusterCenter.y - yRange * 0.6 + normalizedY * yRange * 1.25
  };
}

function clampCandidate(candidate, radius, diameter, bubbleRadius, titleSafeBottom) {
  const center = diameter / 2;
  let x = candidate.x;
  let y = Math.max(candidate.y, titleSafeBottom + radius);
  const dx = x - center;
  const dy = y - center;
  const distance = Math.hypot(dx, dy) || 0.001;
  const maxDistance = bubbleRadius - radius;

  if (distance > maxDistance) {
    const scale = maxDistance / distance;
    x = center + dx * scale;
    y = center + dy * scale;
    y = Math.max(y, titleSafeBottom + radius);
  }

  return { x, y };
}

function isCandidateValid(candidate, radius, positions, placementOrder, nodeGap, center, bubbleRadius, titleSafeBottom) {
  if (candidate.y - radius < titleSafeBottom) {
    return false;
  }

  const dx = candidate.x - center;
  const dy = candidate.y - center;
  if (Math.hypot(dx, dy) + radius > bubbleRadius + 0.5) {
    return false;
  }

  for (const placed of placementOrder) {
    const other = positions[placed.index];
    if (!other) {
      continue;
    }
    const minDistance = radius + placed.radius + nodeGap;
    if (Math.hypot(candidate.x - other.x, candidate.y - other.y) < minDistance) {
      return false;
    }
  }

  return true;
}

function getNodeSize(label) {
  if (isSingleEnglishWord(label)) {
    return {
      size: Math.min(150, Math.max(76, 48 + label.length * 8)),
      fontSize: label.length > 12 ? 14 : 15.5,
      lineClamp: 1,
      noWrap: true
    };
  }

  const weight = measureLabelWeight(label);

  if (weight <= 8) {
    return { size: 64, fontSize: 16.5, lineClamp: 3, noWrap: false };
  }
  if (weight <= 14) {
    return { size: 76, fontSize: 16, lineClamp: 4, noWrap: false };
  }
  if (weight <= 20) {
    return { size: 88, fontSize: 15.5, lineClamp: 4, noWrap: false };
  }

  return { size: 100, fontSize: 15, lineClamp: 5, noWrap: false };
}

function measureLabelWeight(label) {
  let weight = 0;

  for (const char of label) {
    if (/[A-Z]/.test(char)) {
      weight += 1.1;
    } else if (/[a-z0-9]/.test(char)) {
      weight += 0.82;
    } else {
      weight += 1.9;
    }
  }

  return weight;
}

function isSingleEnglishWord(label) {
  return /^[A-Za-z0-9.+#_-]+$/.test(label);
}

function buildKnowledgeSections(techPoint, applications) {
  return [
    ["这是什么", techPoint.detail],
    ["常见落地形态", techPoint.commonForms],
    ["不同技术栈里怎么对应", techPoint.stackMappings],
    ["和相邻概念怎么区分", techPoint.boundaries]
  ];
}

function renderKnowledgeSections(sections) {
  const wrapper = document.createElement("div");
  wrapper.className = "knowledge-list";

  for (const [label, value] of sections) {
    if (!value) {
      continue;
    }
    const item = document.createElement("section");
    item.className = "knowledge-item";
    item.innerHTML = `
      <h3>${label}</h3>
      <p>${value}</p>
    `;
    wrapper.append(item);
  }

  return wrapper;
}

function renderProjectCases(applications, projectMap) {
  const section = document.createElement("section");
  section.className = "project-cases";

  const heading = document.createElement("div");
  heading.className = "project-cases__heading";
  heading.innerHTML = `
    <h3>相关项目</h3>
  `;
  section.append(heading);

  const list = document.createElement("div");
  list.className = "project-case-list";
  section.append(list);

  let expandedId = applications[0]?.id ?? null;

  const renderList = () => {
    list.innerHTML = "";

    for (const application of applications) {
      const project = projectMap.get(application.projectId);
      const item = document.createElement("article");
      item.className = "project-case-item";

      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "project-case-trigger";
      trigger.setAttribute("aria-expanded", String(expandedId === application.id));
      trigger.innerHTML = `
        <span>${project.name}</span>
        <span class="project-case-trigger__meta" aria-hidden="true">${expandedId === application.id ? "↑" : "↓"}</span>
      `;
      trigger.addEventListener("click", () => {
        expandedId = expandedId === application.id ? null : application.id;
        renderList();
      });
      item.append(trigger);

      if (expandedId === application.id) {
        item.append(renderApplicationDetails(application));
      }

      list.append(item);
    }
  };

  renderList();
  return section;
}

function renderApplicationDetails(application) {
  const reusable = application.reusable === null ? "未填写" : application.reusable ? "是" : "否";
  const details = document.createElement("div");
  details.className = "application-card";
  details.innerHTML = `
    <dl>
      <div>
        <dt>在项目里的作用</dt>
        <dd>${application.roleInProject}</dd>
      </div>
      <div>
        <dt>弯路与修正</dt>
        <dd>${application.pitfallsAndFixes || "未填写"}</dd>
      </div>
      <div>
        <dt>是否可复用</dt>
        <dd>${reusable}</dd>
      </div>
      <div>
        <dt>备注</dt>
        <dd>${application.notes || "未填写"}</dd>
      </div>
    </dl>
  `;
  return details;
}
