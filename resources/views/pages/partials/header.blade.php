<header class="cf-header">
  <div class="cf-wrap brand-row">
    <a class="brand" href="/index.html">
      <img src="/img/Logo.png" alt="Logo">
      <div>
        <h2 class="brand-title">Calculadora Financiera</h2>
        <p class="brand-subtitle">Matemáticas financieras y simulador de crédito</p>
      </div>
    </a>
  </div>
  <div class="cf-wrap nav-block">
    <div class="nav-row"><span>TASAS</span>
      <a href="/pages/interes_compuesto.html" class="chip {{ request()->is('pages/interes_compuesto.html') ? 'active' : '' }}">Interés Compuesto</a>
      <a href="/pages/cambio_de_tasa.html" class="chip {{ request()->is('pages/cambio_de_tasa.html') ? 'active' : '' }}">Cambio de tasas</a>
      <a href="/pages/equivalencia.html" class="chip {{ request()->is('pages/equivalencia.html') ? 'active' : '' }}">Equivalencia de tasas</a>
      <a href="/pages/tasa_anticipada.html" class="chip {{ request()->is('pages/tasa_anticipada.html') ? 'active' : '' }}">Tasa anticipada</a>
    </div>
    <div class="nav-row"><span>ANUALIDADES</span>
      <a href="/pages/anualidad_vencida.html" class="chip {{ request()->is('pages/anualidad_vencida.html') ? 'active' : '' }}">Anualidad vencida</a>
      <a href="/pages/anualidad_anticipada.html" class="chip {{ request()->is('pages/anualidad_anticipada.html') ? 'active' : '' }}">Anualidad anticipada</a>
      <a href="/pages/anualidad_diferida.html" class="chip {{ request()->is('pages/anualidad_diferida.html') ? 'active' : '' }}">Anualidad diferida</a>
      <a href="/pages/anualidad_perpetua.html" class="chip {{ request()->is('pages/anualidad_perpetua.html') ? 'active' : '' }}">Anualidad perpetua</a>
    </div>
    <div class="nav-row"><span>CRÉDITO</span>
      <a href="/pages/amortizacion.html" class="chip {{ request()->is('pages/amortizacion.html') ? 'active' : '' }}">Amortización</a>
      <a href="/pages/capitalizacion.html" class="chip {{ request()->is('pages/capitalizacion.html') ? 'active' : '' }}">Capitalización</a>
      <a href="/pages/ecuacion_valor.html" class="chip {{ request()->is('pages/ecuacion_valor.html') ? 'active' : '' }}">Ecuación de valor</a>
    </div>
  </div>
</header>
