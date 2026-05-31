const LIMITS = {
  moneyMax: 1e12,
  periodMax: 100000,
  ratePctMax: 1000,
  flowMaxRows: 100
};

function txt(id, t) {
  const el = document.getElementById(id);
  if (el) el.textContent = t;
}

function ok(message) {
  txt('result', `Resultado: ${message}`);
}

function fail(message) {
  txt('result', `Error: ${message}`);
  return null;
}

function isFiniteNumber(n) {
  return Number.isFinite(n);
}

function readRaw(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function readNumber(id, label, opts = {}) {
  const { required = true, min = -Infinity, max = Infinity, integer = false } = opts;
  const raw = readRaw(id);

  if (!raw) {
    if (!required) return null;
    return fail(`${label} es obligatorio.`);
  }

  const n = Number(raw);
  if (!isFiniteNumber(n)) return fail(`${label} no es un número válido.`);
  if (integer && !Number.isInteger(n)) return fail(`${label} debe ser un entero.`);
  if (n < min) return fail(`${label} debe ser mayor o igual a ${min}.`);
  if (n > max) return fail(`${label} supera el máximo permitido (${max}).`);
  return n;
}

function safePow(a, b, context) {
  const val = Math.pow(a, b);
  if (!isFiniteNumber(val)) return fail(`Operación fuera de rango (${context}).`);
  return val;
}

function m(periodo) {
  return { Mensual: 12, Bimestral: 6, Trimestral: 4, Cuatrimestral: 3, Semestral: 2, Anual: 1 }[periodo] || 12;
}

function pct(x) {
  return x / 100;
}

function bindSimple(id, fn) {
  const b = document.getElementById(id);
  if (!b) return;
  b.addEventListener('click', fn);
}

function applyInputGuards() {
  document.querySelectorAll('input[type="number"]').forEach((el) => {
    if (!el.hasAttribute('step')) el.setAttribute('step', 'any');
    el.addEventListener('input', () => {
      const val = el.value;
      if (val.length > 24) el.value = val.slice(0, 24);
    });
  });
}

bindSimple('calc-interes', () => {
  const vpRaw = readRaw('vp');
  const vfRaw = readRaw('vf');
  const iRaw = readRaw('i');
  const nRaw = readRaw('n');
  const filled = [vpRaw, vfRaw, iRaw, nRaw].filter(Boolean).length;

  if (filled !== 3) return fail('Debes llenar exactamente 3 campos y dejar 1 vacío.');

  const VP = vpRaw ? readNumber('vp', 'Valor presente', { min: 0, max: LIMITS.moneyMax }) : null;
  if (VP === null && vpRaw) return;
  const VF = vfRaw ? readNumber('vf', 'Valor futuro', { min: 0, max: LIMITS.moneyMax }) : null;
  if (VF === null && vfRaw) return;
  const iPct = iRaw ? readNumber('i', 'Tasa por periodo (%)', { min: 0, max: LIMITS.ratePctMax }) : null;
  if (iPct === null && iRaw) return;
  const n = nRaw ? readNumber('n', 'Número de periodos', { min: 1, max: LIMITS.periodMax, integer: false }) : null;
  if (n === null && nRaw) return;

  const i = iPct !== null ? pct(iPct) : null;

  if (!vpRaw) {
    const base = 1 + i;
    const p = safePow(base, n, 'VF/(1+i)^n'); if (p === null) return;
    const res = VF / p;
    if (!isFiniteNumber(res)) return fail('No se pudo calcular VP con esos datos.');
    return ok(`VP = ${res.toFixed(4)}`);
  }

  if (!vfRaw) {
    const base = 1 + i;
    const p = safePow(base, n, 'VP*(1+i)^n'); if (p === null) return;
    const res = VP * p;
    if (!isFiniteNumber(res)) return fail('No se pudo calcular VF con esos datos.');
    return ok(`VF = ${res.toFixed(4)}`);
  }

  if (!iRaw) {
    if (VP <= 0 || VF <= 0 || n <= 0) return fail('VP, VF y n deben ser mayores que 0 para hallar i.');
    const ratio = VF / VP;
    if (ratio <= 0) return fail('La razón VF/VP debe ser positiva.');
    const p = safePow(ratio, 1 / n, '((VF/VP)^(1/n))'); if (p === null) return;
    const res = p - 1;
    if (!isFiniteNumber(res)) return fail('No se pudo calcular i con esos datos.');
    return ok(`i = ${(res * 100).toFixed(6)}%`);
  }

  if (i <= 0) return fail('La tasa debe ser mayor que 0 para hallar n.');
  if (VP <= 0 || VF <= 0) return fail('VP y VF deben ser mayores que 0 para hallar n.');
  const num = Math.log(VF / VP);
  const den = Math.log(1 + i);
  if (!isFiniteNumber(num) || !isFiniteNumber(den) || den === 0) return fail('No se puede calcular n con esos datos.');
  const res = num / den;
  if (!isFiniteNumber(res) || res < 0) return fail('Resultado inválido para n.');
  return ok(`n = ${res.toFixed(4)}`);
});

bindSimple('calc-cambio', () => {
  const tasaPct = readNumber('tasa', 'Tasa (%)', { min: 0, max: LIMITS.ratePctMax });
  if (tasaPct === null) return;
  const tipo = document.getElementById('tipo-in').value;
  const p = m(document.getElementById('p-cap').value);
  const tasa = pct(tasaPct);

  let ea;
  if (tipo === 'Nominal anual') {
    const base = 1 + tasa / p;
    if (base <= 0) return fail('La base de capitalización debe ser positiva.');
    ea = safePow(base, p, 'EA nominal') - 1;
  } else {
    ea = tasa;
  }

  if (!isFiniteNumber(ea)) return fail('Resultado fuera de rango.');
  return ok(`EA = ${(ea * 100).toFixed(4)}%`);
});

bindSimple('calc-equiv', () => {
  const i1Pct = readNumber('i1', 'Tasa efectiva conocida (%)', { min: 0, max: LIMITS.ratePctMax });
  if (i1Pct === null) return;
  const p1 = m(document.getElementById('p1').value);
  const p2 = m(document.getElementById('p2').value);
  const i1 = pct(i1Pct);

  const base = 1 + i1;
  if (base <= 0) return fail('La tasa efectiva debe ser mayor a -100%.');
  const i2 = safePow(base, p2 / p1, 'equivalencia') - 1;
  if (!isFiniteNumber(i2)) return fail('No se pudo calcular la equivalencia.');
  return ok(`i₂ = ${(i2 * 100).toFixed(4)}%`);
});

bindSimple('calc-anticipada', () => {
  const tasaPct = readNumber('tasa-ant', 'Tasa por periodo (%)', { min: 0, max: 99.999999 });
  if (tasaPct === null) return;
  const tasa = pct(tasaPct);
  const tipo = document.getElementById('tipo-ant').value;

  let r;
  if (tipo === 'Anticipada') {
    if (tasa >= 1) return fail('La tasa anticipada debe ser menor a 100%.');
    r = tasa / (1 - tasa);
    return ok(`Vencida = ${(r * 100).toFixed(4)}%`);
  }

  r = tasa / (1 + tasa);
  if (!isFiniteNumber(r)) return fail('No se pudo convertir la tasa.');
  return ok(`Anticipada = ${(r * 100).toFixed(4)}%`);
});

function anualidad({ anticipada = false, diferida = false } = {}) {
  const A = readNumber('A', 'Cuota / pago (A)', { min: 0, max: LIMITS.moneyMax });
  if (A === null) return;
  const iPct = readNumber('iA', 'Tasa por periodo (%)', { min: 0.000001, max: LIMITS.ratePctMax });
  if (iPct === null) return;
  const n = readNumber('nA', 'Número de periodos', { min: 1, max: LIMITS.periodMax });
  if (n === null) return;

  const i = pct(iPct);
  const factor = safePow(1 + i, -n, 'anualidad');
  if (factor === null) return;

  let vp = A * ((1 - factor) / i);
  if (anticipada) vp *= (1 + i);

  if (diferida) {
    const k = readNumber('kA', 'Periodos de gracia (k)', { min: 0, max: LIMITS.periodMax });
    if (k === null) return;
    const def = safePow(1 + i, k, 'diferimiento');
    if (def === null || def === 0) return fail('No se pudo aplicar el diferimiento.');
    vp /= def;
  }

  if (!isFiniteNumber(vp)) return fail('Resultado fuera de rango.');
  return ok(`VP = ${vp.toFixed(4)}`);
}

bindSimple('calc-av', () => anualidad({ anticipada: false, diferida: false }));
bindSimple('calc-aa', () => anualidad({ anticipada: true, diferida: false }));
bindSimple('calc-ad', () => anualidad({ anticipada: false, diferida: true }));

bindSimple('calc-ap', () => {
  const A = readNumber('A', 'Cuota / pago (A)', { min: 0, max: LIMITS.moneyMax });
  if (A === null) return;
  const iPct = readNumber('iA', 'Tasa por periodo (%)', { min: 0.000001, max: LIMITS.ratePctMax });
  if (iPct === null) return;
  const i = pct(iPct);
  const vp = A / i;
  if (!isFiniteNumber(vp)) return fail('Resultado fuera de rango.');
  return ok(`VP = ${vp.toFixed(4)}`);
});

bindSimple('calc-amort', () => {
  const VP = readNumber('cred', 'Monto del crédito', { min: 0, max: LIMITS.moneyMax });
  if (VP === null) return;
  const iPct = readNumber('iC', 'Tasa por periodo (%)', { min: 0.000001, max: LIMITS.ratePctMax });
  if (iPct === null) return;
  const n = readNumber('nC', 'Número de cuotas', { min: 1, max: LIMITS.periodMax });
  if (n === null) return;

  const i = pct(iPct);
  const den = 1 - safePow(1 + i, -n, 'amortización');
  if (den === null || den === 0) return fail('No se puede dividir por cero en la fórmula de cuota.');
  const cuota = (VP * i) / den;
  if (!isFiniteNumber(cuota)) return fail('Resultado fuera de rango.');
  txt('result', `Cuota fija: ${cuota.toFixed(4)}`);
});

bindSimple('calc-cap', () => {
  const VF = readNumber('meta', 'Meta de capital (VF)', { min: 0, max: LIMITS.moneyMax });
  if (VF === null) return;
  const iPct = readNumber('iCap', 'Tasa por periodo (%)', { min: 0.000001, max: LIMITS.ratePctMax });
  if (iPct === null) return;
  const n = readNumber('nCap', 'Número de aportes', { min: 1, max: LIMITS.periodMax });
  if (n === null) return;

  const i = pct(iPct);
  const growth = safePow(1 + i, n, 'capitalización');
  if (growth === null) return;
  const den = growth - 1;
  if (den === 0) return fail('No se puede dividir por cero en la fórmula de aporte.');

  const aporte = (VF * i) / den;
  if (!isFiniteNumber(aporte)) return fail('Resultado fuera de rango.');
  txt('result', `Aporte por periodo: ${aporte.toFixed(4)}`);
});

bindSimple('calc-ev', () => {
  const iPct = readNumber('iev', 'Tasa por periodo (%)', { min: 0, max: LIMITS.ratePctMax });
  if (iPct === null) return;
  const f = readNumber('focal', 'Fecha focal (periodo)', { min: 0, max: LIMITS.periodMax, integer: false });
  if (f === null) return;

  const rows = [...document.querySelectorAll('.flow-row')];
  if (!rows.length) return fail('Debes agregar al menos un flujo.');
  if (rows.length > LIMITS.flowMaxRows) return fail(`Máximo ${LIMITS.flowMaxRows} flujos permitidos.`);

  const i = pct(iPct);
  let suma = 0;

  for (let idx = 0; idx < rows.length; idx += 1) {
    const row = rows[idx];
    const montoRaw = row.querySelector('.monto').value.trim();
    const perRaw = row.querySelector('.per').value.trim();
    const tipo = row.querySelector('.tipo').value;

    if (!montoRaw || !perRaw) return fail(`Completa monto y periodo del flujo ${idx + 1}.`);

    const monto = Number(montoRaw);
    const per = Number(perRaw);

    if (!isFiniteNumber(monto) || !isFiniteNumber(per)) return fail(`Flujo ${idx + 1} inválido.`);
    if (monto < 0) return fail(`El monto del flujo ${idx + 1} no puede ser negativo.`);
    if (monto > LIMITS.moneyMax) return fail(`El monto del flujo ${idx + 1} supera el límite.`);
    if (per < 0 || per > LIMITS.periodMax) return fail(`El periodo del flujo ${idx + 1} está fuera de rango.`);

    const fval = safePow(1 + i, f - per, `flujo ${idx + 1}`);
    if (fval === null) return;
    const val = monto * fval;
    if (!isFiniteNumber(val)) return fail(`Flujo ${idx + 1} produce un valor fuera de rango.`);

    suma += (tipo === 'Deuda' ? val : -val);
  }

  if (!isFiniteNumber(suma)) return fail('Resultado fuera de rango.');
  ok(`Neto en fecha focal = ${suma.toFixed(4)}`);
});

bindSimple('add-flow', () => {
  const c = document.getElementById('flows');
  if (!c) return;
  if (c.querySelectorAll('.flow-row').length >= LIMITS.flowMaxRows) {
    fail(`No puedes agregar más de ${LIMITS.flowMaxRows} flujos.`);
    return;
  }

  const row = document.createElement('div');
  row.className = 'row-flow flow-row';
  row.innerHTML = '<input class="monto" placeholder="Monto" type="number" min="0" max="1000000000000" step="any"><input class="per" placeholder="Periodo" type="number" min="0" max="100000" step="any"><select class="tipo"><option>Deuda</option><option>Pago</option></select><button class="icon-btn" type="button">x</button>';
  row.querySelector('button').addEventListener('click', () => row.remove());
  c.appendChild(row);
});

document.querySelectorAll('.flow-row .icon-btn').forEach((b) =>
  b.addEventListener('click', (e) => e.target.closest('.flow-row').remove())
);

applyInputGuards();
