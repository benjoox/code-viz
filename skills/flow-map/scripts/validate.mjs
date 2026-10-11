// Check JSON shapes before the builder follows references or touches project files.
export function validateShape(flow) {
  const errors = [];
  const object = (value, at) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      errors.push(`${at}: expected an object`); return false;
    }
    return true;
  };
  const string = (value, at) => {
    if (typeof value !== 'string' || !value.trim()) errors.push(`${at}: expected a nonempty string`);
  };
  const list = (value, at, visit, optional = false) => {
    if (value === undefined && optional) return;
    if (!Array.isArray(value)) { errors.push(`${at}: expected an array`); return; }
    value.forEach((item, i) => visit(item, `${at}[${i}]`));
  };
  const records = (value, at, visit, optional = false) => {
    const ids = new Set();
    list(value, at, (item, where) => {
      if (!object(item, where)) return;
      string(item.id, `${where}.id`);
      if (ids.has(item.id)) errors.push(`${where}: duplicate id`);
      ids.add(item.id);
      visit(item, where);
    }, optional);
  };
  const file = (item, at, key) => {
    string(item[key], `${at}.${key}`);
    if (item.lines !== undefined && (!Array.isArray(item.lines) || item.lines.length !== 2 || !item.lines.every(Number.isInteger))) {
      errors.push(`${at}.lines: expected two integers`);
    }
  };
  if (!object(flow, 'flow')) return errors;
  string(flow.title, 'title'); string(flow.root, 'root');
  if (object(flow.views, 'views')) for (const [id, view] of Object.entries(flow.views)) {
    const at = `views.${id}`;
    if (!object(view, at)) continue;
    string(view.title, `${at}.title`);
    records(view.layers, `${at}.layers`, (layer, where) => string(layer.label, `${where}.label`));
    records(view.nodes, `${at}.nodes`, (node, where) => {
      string(node.label, `${where}.label`); string(node.layer, `${where}.layer`); string(node.kind, `${where}.kind`);
      if (node.drill !== undefined) string(node.drill, `${where}.drill`);
      if (node.note !== undefined && typeof node.note !== 'string') errors.push(`${where}.note: expected a string`);
      if (node.file !== undefined || node.lines !== undefined) file(node, where, 'file');
    }, true);
    records(view.edges, `${at}.edges`, (edge, where) => {
      string(edge.from, `${where}.from`); string(edge.to, `${where}.to`);
    }, true);
    records(view.scenarios, `${at}.scenarios`, (scenario, where) => {
      string(scenario.title, `${where}.title`);
      if (scenario.kind !== undefined && !['user', 'data', 'system', 'failure'].includes(scenario.kind)) errors.push(`${where}: unknown scenario kind`);
      list(scenario.steps, `${where}.steps`, (step, stepAt) => {
        if (!object(step, stepAt)) return;
        string(step.say, `${stepAt}.say`);
        for (const key of ['nodes', 'edges']) list(step[key], `${stepAt}.${key}`, string, true);
        if (step.state !== undefined) object(step.state, `${stepAt}.state`);
        list(step.files, `${stepAt}.files`, (ref, refAt) => {
          if (!object(ref, refAt)) return;
          file(ref, refAt, 'path');
          if (ref.note !== undefined && typeof ref.note !== 'string') errors.push(`${refAt}.note: expected a string`);
        }, true);
      });
    });
  }
  records(flow.issues, 'issues', (issue, at) => {
    for (const key of ['severity', 'view', 'file', 'title', 'detail', 'fix']) string(issue[key], `${at}.${key}`);
    for (const key of ['node', 'edge']) if (issue[key] !== undefined) string(issue[key], `${at}.${key}`);
  }, true);
  return errors;
}
