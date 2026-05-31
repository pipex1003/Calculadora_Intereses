<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Calculadora Financiera</title>
    <link rel="stylesheet" href="/styles/styles.css">
    <link rel="icon" href="/img/Icon.ico">
</head>
<body>
    @include('pages.partials.header')

    <main class="container">
        <section style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:16px;">
            <article class="card">
                <h3 style="margin:0 0 8px; font-size:20px;">Interés Compuesto</h3>
                <p style="margin:0 0 12px; color:var(--muted);">Calcula valor presente, valor futuro, tasa o número de periodos a partir de tres datos.</p>
                <p style="margin:0 0 6px; font-weight:700;">Qué hace:</p>
                <ul style="margin:0; padding-left:18px; color:var(--muted);">
                    <li>Resuelve una variable financiera faltante.</li>
                    <li>Trabaja por periodos de tasa.</li>
                </ul>
                <p style="margin:10px 0 0; color:var(--text); font-size:13px;"><strong>Ruta:</strong> Tasas → Interés Compuesto</p>
            </article>

            <article class="card">
                <h3 style="margin:0 0 8px; font-size:20px;">Cambio y Equivalencia de Tasas</h3>
                <p style="margin:0 0 12px; color:var(--muted);">Convierte tasas nominales y efectivas, y encuentra tasas equivalentes entre periodos.</p>
                <p style="margin:0 0 6px; font-weight:700;">Incluye:</p>
                <ul style="margin:0; padding-left:18px; color:var(--muted);">
                    <li>Cambio de tasas.</li>
                    <li>Equivalencia de tasas.</li>
                    <li>Tasa anticipada.</li>
                </ul>
                <p style="margin:10px 0 0; color:var(--text); font-size:13px;"><strong>Ruta:</strong> Tasas</p>
            </article>

            <article class="card">
                <h3 style="margin:0 0 8px; font-size:20px;">Anualidades</h3>
                <p style="margin:0 0 12px; color:var(--muted);">Resuelve anualidades vencida, anticipada, diferida y perpetua para hallar valores financieros.</p>
                <p style="margin:0 0 6px; font-weight:700;">Casos disponibles:</p>
                <ul style="margin:0; padding-left:18px; color:var(--muted);">
                    <li>Vencida y anticipada.</li>
                    <li>Diferida y perpetua.</li>
                </ul>
                <p style="margin:10px 0 0; color:var(--text); font-size:13px;"><strong>Ruta:</strong> Anualidades</p>
            </article>

            <article class="card">
                <h3 style="margin:0 0 8px; font-size:20px;">Crédito y Proyección</h3>
                <p style="margin:0 0 12px; color:var(--muted);">Genera cuota fija de amortización, calcula aportes de capitalización y evalúa flujos con ecuación de valor.</p>
                <p style="margin:0 0 6px; font-weight:700;">Módulos:</p>
                <ul style="margin:0; padding-left:18px; color:var(--muted);">
                    <li>Amortización.</li>
                    <li>Capitalización.</li>
                    <li>Ecuación de valor.</li>
                </ul>
                <p style="margin:10px 0 0; color:var(--text); font-size:13px;"><strong>Ruta:</strong> Crédito</p>
            </article>
        </section>
    </main>

    @include('pages.partials.footer')
</body>
</html>
