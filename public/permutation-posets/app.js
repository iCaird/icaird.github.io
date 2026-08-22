(() => {
  "use strict";

  // ---------------------------------------------------------------------------
  // Configuration and application state
  // ---------------------------------------------------------------------------

  const CONFIG = Object.freeze({
    maxResults: 250_000,
    maxCompleteCandidates: 500_000,
    maxCachedCollections: 3,
    svg: Object.freeze({margin: 58, span: 520, size: 640})
  });

  const FILTER_CONTROL_IDS = ["size", "pattern321", "patternCollection", "treesOnly"];
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

  const state = {
    permutations: [],
    index: 0,
    listTruncated: false,
    buildToken: 0,
    collectionCache: new Map()
  };

  const byId = id => document.getElementById(id);

  const ui = Object.fromEntries([
    ...FILTER_CONTROL_IDS,
    "ordering", "jump", "go", "previous", "next", "permutation",
    "position", "properties", "diagram", "incidence", "message"
  ].map(id => [id, byId(id)]));

  // ---------------------------------------------------------------------------
  // Permutations and classical-pattern tests
  // ---------------------------------------------------------------------------

  function formatPermutation(permutation) {
    return permutation.length <= 9
      ? permutation.join("")
      : permutation.join(",");
  }

  function parsePermutationInput(text, size) {
    const trimmed = text.trim();
    const values = /[\s,]/.test(trimmed)
      ? trimmed.split(/[\s,]+/).filter(Boolean).map(Number)
      : [...trimmed].map(Number);

    if (values.length !== size) return null;
    const expected = new Set(Array.from({length: size}, (_, i) => i + 1));
    if (values.some(value => !expected.delete(value)) || expected.size) return null;
    return values;
  }

  function samePermutation(left, right) {
    return left.length === right.length && left.every((value, i) => value === right[i]);
  }

  function matchesPattern(values, target) {
    for (let i = 0; i < values.length; i++) {
      for (let j = i + 1; j < values.length; j++) {
        if ((values[i] < values[j]) !== (target[i] < target[j])) return false;
      }
    }
    return true;
  }

  function contains321(permutation) {
    if (permutation.length < 3) return false;
    let prefixMaximum = permutation[0];
    let largestMiddle = -Infinity;

    for (let k = 1; k < permutation.length; k++) {
      if (largestMiddle > permutation[k]) return true;
      if (prefixMaximum > permutation[k]) {
        largestMiddle = Math.max(largestMiddle, permutation[k]);
      }
      prefixMaximum = Math.max(prefixMaximum, permutation[k]);
    }
    return false;
  }

  function creates321AtEnd(permutation) {
    if (permutation.length < 3) return false;
    const lastValue = permutation.at(-1);
    let prefixMaximum = permutation[0];

    for (let j = 1; j < permutation.length - 1; j++) {
      if (prefixMaximum > permutation[j] && permutation[j] > lastValue) return true;
      prefixMaximum = Math.max(prefixMaximum, permutation[j]);
    }
    return false;
  }

  function containsPattern(permutation, target) {
    if (target === "321") return contains321(permutation);
    if (permutation.length < target.length) return false;

    const chosenIndices = [];
    function search(start) {
      if (chosenIndices.length === target.length) {
        return matchesPattern(chosenIndices.map(i => permutation[i]), target);
      }
      const needed = target.length - chosenIndices.length;
      for (let i = start; i <= permutation.length - needed; i++) {
        chosenIndices.push(i);
        if (search(i + 1)) return true;
        chosenIndices.pop();
      }
      return false;
    }
    return search(0);
  }

  function createsPatternAtEnd(permutation, target) {
    if (target === "321") return creates321AtEnd(permutation);
    if (permutation.length < target.length) return false;

    const lastIndex = permutation.length - 1;
    const chosenIndices = [];
    function search(start) {
      if (chosenIndices.length === target.length - 1) {
        const values = [...chosenIndices.map(i => permutation[i]), permutation[lastIndex]];
        return matchesPattern(values, target);
      }
      const needed = target.length - 1 - chosenIndices.length;
      for (let i = start; i <= lastIndex - needed; i++) {
        chosenIndices.push(i);
        if (search(i + 1)) return true;
        chosenIndices.pop();
      }
      return false;
    }
    return search(0);
  }

  // ---------------------------------------------------------------------------
  // Permutation-poset calculations
  // ---------------------------------------------------------------------------

  function isBelow(permutation, lower, upper) {
    return lower < upper && permutation[lower] < permutation[upper];
  }

  function coverRelations(permutation) {
    const edges = [];
    for (let lower = 0; lower < permutation.length; lower++) {
      for (let upper = lower + 1; upper < permutation.length; upper++) {
        if (!isBelow(permutation, lower, upper)) continue;

        let hasIntermediate = false;
        for (let middle = lower + 1; middle < upper; middle++) {
          if (isBelow(permutation, lower, middle)
              && isBelow(permutation, middle, upper)) {
            hasIntermediate = true;
            break;
          }
        }
        if (!hasIntermediate) edges.push([lower, upper]);
      }
    }
    return edges;
  }

  function diagonalSweepOrder(permutation) {
    return permutation.map((_, i) => i).sort((left, right) => {
      const leftLevel = left + 1 + permutation[left];
      const rightLevel = right + 1 + permutation[right];
      return leftLevel - rightLevel || right - left;
    });
  }

  function displayOrder(permutation) {
    return ui.ordering.value === "position"
      ? permutation.map((_, i) => i)
      : diagonalSweepOrder(permutation);
  }

  function connectedComponentCount(vertexCount, edges) {
    const adjacency = Array.from({length: vertexCount}, () => []);
    for (const [left, right] of edges) {
      adjacency[left].push(right);
      adjacency[right].push(left);
    }

    let components = 0;
    const seen = new Set();
    for (let start = 0; start < vertexCount; start++) {
      if (seen.has(start)) continue;
      components++;
      seen.add(start);
      const stack = [start];
      while (stack.length) {
        for (const neighbour of adjacency[stack.pop()]) {
          if (!seen.has(neighbour)) {
            seen.add(neighbour);
            stack.push(neighbour);
          }
        }
      }
    }
    return components;
  }

  function isHasseTree(permutation) {
    const edges = coverRelations(permutation);
    return edges.length === permutation.length - 1
      && connectedComponentCount(permutation.length, edges) === 1;
  }

  function posetProperties(permutation) {
    const edges = coverRelations(permutation);
    const components = connectedComponentCount(permutation.length, edges);
    const cycleRank = edges.length - permutation.length + components;
    return [
      components === 1 && cycleRank === 0 ? "Hasse graph: tree" : "Hasse graph: not a tree",
      `cycle rank: ${cycleRank}`,
      containsPattern(permutation, "1324") ? "contains 1324" : null,
      containsPattern(permutation, "2143") ? "contains 2143" : null
    ].filter(Boolean);
  }

  // ---------------------------------------------------------------------------
  // Filtered permutation generation
  // ---------------------------------------------------------------------------

  function currentFilters() {
    return {
      size: Number(ui.size.value),
      pattern321: ui.pattern321.value,
      patternCollection: ui.patternCollection.value,
      treesOnly: ui.treesOnly.checked
    };
  }

  function filterCacheKey(filters) {
    return [
      filters.size,
      filters.pattern321,
      filters.patternCollection,
      filters.treesOnly
    ].join("|");
  }

  function forbiddenPatternsFor(filters) {
    const forbidden = [];
    if (filters.pattern321 === "avoid") forbidden.push("321");
    if (filters.pattern321 === "avoidFour") forbidden.push("4321");
    if (filters.pattern321 === "avoidFive") forbidden.push("54321");
    if (filters.pattern321 === "avoidSix") forbidden.push("654321");
    if (filters.pattern321 === "avoidSeven") forbidden.push("7654321");
    if (filters.patternCollection === "neither") forbidden.push("1324", "2143");
    if (filters.patternCollection === "1324-only") forbidden.push("2143");
    if (filters.patternCollection === "2143-only") forbidden.push("1324");
    return forbidden;
  }

  function matchesFilters(permutation, filters) {
    if (filters.pattern321 === "contain" && !contains321(permutation)) return false;

    if (filters.patternCollection === "1324-only"
        && !containsPattern(permutation, "1324")) return false;
    if (filters.patternCollection === "2143-only"
        && !containsPattern(permutation, "2143")) return false;
    if (filters.patternCollection === "both"
        && (!containsPattern(permutation, "1324")
            || !containsPattern(permutation, "2143"))) return false;

    return !filters.treesOnly || isHasseTree(permutation);
  }

  function generateCollection(filters) {
    const results = [];
    const partial = [];
    const used = Array(filters.size + 1).fill(false);
    const forbiddenPatterns = forbiddenPatternsFor(filters);
    let completeCandidates = 0;
    let truncated = false;

    function build() {
      if (truncated) return;

      if (partial.length === filters.size) {
        completeCandidates++;
        if (completeCandidates > CONFIG.maxCompleteCandidates) {
          truncated = true;
          return;
        }
        if (!matchesFilters(partial, filters)) return;

        results.push([...partial]);
        if (results.length >= CONFIG.maxResults) truncated = true;
        return;
      }

      for (let value = 1; value <= filters.size; value++) {
        if (used[value]) continue;

        used[value] = true;
        partial.push(value);
        const forbidden = forbiddenPatterns.some(
          target => createsPatternAtEnd(partial, target)
        );
        if (!forbidden) build();
        partial.pop();
        used[value] = false;

        if (truncated) return;
      }
    }

    build();
    return {items: results, truncated};
  }

  function cacheCollection(key, collection) {
    if (state.collectionCache.size >= CONFIG.maxCachedCollections) {
      const oldestKey = state.collectionCache.keys().next().value;
      state.collectionCache.delete(oldestKey);
    }
    state.collectionCache.set(key, collection);
  }

  function rebuildCollection(preferredPermutation = null) {
    const filters = currentFilters();
    const key = filterCacheKey(filters);
    const token = ++state.buildToken;
    ui.message.textContent = "Generating…";

    // Yield once so the status text paints before a large synchronous search.
    setTimeout(() => {
      if (token !== state.buildToken) return;

      let collection = state.collectionCache.get(key);
      if (!collection) {
        collection = generateCollection(filters);
        cacheCollection(key, collection);
      }
      if (token !== state.buildToken) return;

      state.permutations = collection.items;
      state.listTruncated = collection.truncated;
      state.index = 0;

      if (preferredPermutation) {
        const preferredIndex = state.permutations.findIndex(
          permutation => samePermutation(permutation, preferredPermutation)
        );
        if (preferredIndex >= 0) state.index = preferredIndex;
      }

      if (!state.permutations.length) {
        ui.message.textContent = "No permutations match these filters.";
      } else if (state.listTruncated) {
        ui.message.textContent =
          "Large search capped for responsiveness; the displayed list may be incomplete.";
      } else {
        ui.message.textContent = "";
      }
      renderCurrentPermutation();
    }, 0);
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------

  function svgElement(name, attributes = {}) {
    const node = document.createElementNS(SVG_NAMESPACE, name);
    for (const [key, value] of Object.entries(attributes)) {
      node.setAttribute(key, value);
    }
    return node;
  }

  function appendSvgText(svg, text, attributes) {
    const node = svgElement("text", attributes);
    node.textContent = text;
    svg.append(node);
  }

  function renderDiagram(permutation) {
    const svg = ui.diagram;
    svg.replaceChildren();
    if (!permutation) return;

    const {margin, span} = CONFIG.svg;
    const step = span / permutation.length;
    const order = displayOrder(permutation);
    const nodeLabels = Array(permutation.length);
    order.forEach((vertex, label) => { nodeLabels[vertex] = label + 1; });

    const point = vertex => ({
      x: margin + (permutation[vertex] - 0.5) * step,
      y: margin + (vertex + 0.5) * step
    });

    const definitions = svgElement("defs");
    const marker = svgElement("marker", {
      id: "arrowhead",
      markerWidth: 8,
      markerHeight: 8,
      refX: 7,
      refY: 4,
      orient: "auto",
      markerUnits: "strokeWidth"
    });
    marker.append(svgElement("path", {d: "M 0 0 L 8 4 L 0 8 z", fill: "var(--red)"}));
    definitions.append(marker);
    svg.append(definitions);

    for (let line = 0; line <= permutation.length; line++) {
      const coordinate = margin + line * step;
      svg.append(svgElement("line", {
        x1: margin, y1: coordinate, x2: margin + span, y2: coordinate,
        stroke: "var(--line)", "stroke-width": 1
      }));
      svg.append(svgElement("line", {
        x1: coordinate, y1: margin, x2: coordinate, y2: margin + span,
        stroke: "var(--line)", "stroke-width": 1
      }));
    }

    for (let axisIndex = 0; axisIndex < permutation.length; axisIndex++) {
      appendSvgText(svg, String(axisIndex + 1), {
        x: margin - 18,
        y: margin + (axisIndex + 0.56) * step,
        fill: "var(--muted)",
        "text-anchor": "middle",
        "font-size": 13
      });
      appendSvgText(svg, String(axisIndex + 1), {
        x: margin + (axisIndex + 0.5) * step,
        y: margin - 18,
        fill: "var(--muted)",
        "text-anchor": "middle",
        "font-size": 13
      });
    }

    for (const [lower, upper] of coverRelations(permutation)) {
      const start = point(lower);
      const end = point(upper);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.hypot(dx, dy);
      const inset = Math.min(14, length / 4);

      svg.append(svgElement("line", {
        x1: start.x + dx * inset / length,
        y1: start.y + dy * inset / length,
        x2: end.x - dx * inset / length,
        y2: end.y - dy * inset / length,
        stroke: "var(--red)",
        "stroke-width": 2.2,
        "marker-end": "url(#arrowhead)"
      }));
    }

    permutation.forEach((_, vertex) => {
      const position = point(vertex);
      svg.append(svgElement("circle", {
        cx: position.x,
        cy: position.y,
        r: 8,
        fill: "var(--blue)",
        stroke: "var(--panel)",
        "stroke-width": 2
      }));
      appendSvgText(svg, String(nodeLabels[vertex]), {
        x: position.x + 12,
        y: position.y - 10,
        fill: "var(--ink)",
        "font-size": 12,
        "font-weight": 700
      });
    });
  }

  function tableHeaderCell(text = "") {
    const cell = document.createElement("th");
    cell.textContent = text;
    return cell;
  }

  function renderIncidenceMatrix(permutation) {
    ui.incidence.replaceChildren();
    if (!permutation) return;

    const order = displayOrder(permutation);
    const coverSet = new Set(
      coverRelations(permutation).map(([lower, upper]) => `${upper},${lower}`)
    );
    const table = document.createElement("table");
    const header = document.createElement("tr");
    header.append(tableHeaderCell());
    order.forEach((_, column) => header.append(tableHeaderCell(String(column + 1))));
    table.append(header);

    order.forEach((upper, row) => {
      const tableRow = document.createElement("tr");
      tableRow.append(tableHeaderCell(String(row + 1)));

      order.forEach(lower => {
        const cell = document.createElement("td");
        const allowed = lower === upper || isBelow(permutation, lower, upper);
        if (allowed) {
          cell.textContent = "∗";
          cell.classList.add("allowed");
          if (lower === upper) cell.classList.add("diagonal");
          if (coverSet.has(`${upper},${lower}`)) cell.classList.add("cover");
        }
        tableRow.append(cell);
      });
      table.append(tableRow);
    });

    ui.incidence.append(table);
  }

  function renderCurrentPermutation() {
    const permutation = state.permutations[state.index];
    ui.permutation.textContent = permutation ? formatPermutation(permutation) : "—";
    ui.position.textContent = permutation
      ? `${state.index + 1} of ${state.permutations.length.toLocaleString()}`
        + (state.listTruncated ? "+" : "")
      : "0 results";
    ui.previous.disabled = !permutation;
    ui.next.disabled = !permutation;
    ui.properties.textContent = permutation ? posetProperties(permutation).join(" · ") : "";
    renderDiagram(permutation);
    renderIncidenceMatrix(permutation);
  }

  // ---------------------------------------------------------------------------
  // Navigation and events
  // ---------------------------------------------------------------------------

  function move(delta) {
    if (!state.permutations.length) return;
    state.index = (
      state.index + delta + state.permutations.length
    ) % state.permutations.length;
    renderCurrentPermutation();
  }

  function goToPermutation() {
    const target = parsePermutationInput(ui.jump.value, Number(ui.size.value));
    if (!target) {
      ui.message.textContent = "Enter a permutation of the selected size.";
      return;
    }

    const targetIndex = state.permutations.findIndex(
      permutation => samePermutation(permutation, target)
    );
    if (targetIndex < 0) {
      ui.message.textContent = "That permutation is not in the current filtered list.";
      return;
    }

    state.index = targetIndex;
    ui.message.textContent = state.listTruncated
      ? "Large search capped for responsiveness; the displayed list may be incomplete."
      : "";
    renderCurrentPermutation();
  }

  function bindEvents() {
    FILTER_CONTROL_IDS.forEach(id => {
      ui[id].addEventListener("change", () => {
        const current = state.permutations[state.index] ?? null;
        rebuildCollection(current);
      });
    });

    ui.ordering.addEventListener("change", renderCurrentPermutation);
    ui.previous.addEventListener("click", () => move(-1));
    ui.next.addEventListener("click", () => move(1));
    ui.go.addEventListener("click", goToPermutation);
    ui.jump.addEventListener("keydown", event => {
      if (event.key === "Enter") goToPermutation();
    });

    document.addEventListener("keydown", event => {
      if (event.target.matches("input, select, button")) return;
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    });
  }

  bindEvents();
  rebuildCollection();
})();
