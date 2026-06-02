# AUTHORITY — Masters in Betting · Landing

Landing institucional/comercial para **AUTHORITY**, unidad especializada en
**iGaming & Apuestas LATAM**. Objetivo: captar operadores de apuestas y llevarlos
a **solicitar un diagnóstico**.

Sitio estático (HTML + CSS + JS vanilla). Sin build step ni dependencias.

## Cómo verlo

Abre `index.html` en un navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000   # http://localhost:8000
```

## Estructura

```
index.html              Landing completa (una sola página, secciones ancladas)
css/
  fonts.css             @font-face de la marca (NewBlack)
  styles.css            Tokens de diseño + todos los componentes
js/
  main.js               Header sticky, menú móvil, acordeón, reveal, conteo, formulario
assets/
  brand/                Logos (isotipo + lockups), OG image, fuentes vectoriales
  fonts/                Fuentes self-hosted (ver assets/fonts/README.md)
  docs/                 Credencial comercial (insumo, NO versionado)
favicon.png, apple-touch-icon.png
```

## Identidad aplicada (desde los insumos de marca)

- **Logo**: isotipo (la "A" de triángulos) + lockup `AUTHORITY® · MASTERS IN BETTING`,
  extraídos del `.ai/.pdf` oficial a PNG transparente. Versión blanca para fondos oscuros.
- **Color** (muestreado del isotipo): cyan `#00C5E5` · violeta `#7A62FF` · verde `#16E05F`
  sobre negro `#07080B`. Coherente con los Pantone del manual (350/354 C + Warm Gray 1 C).
- **Tipografía**: `NewBlack Typeface Medium` para display/titulares/números (self-hosted) +
  `Inter` para cuerpo/UI. Ver `assets/fonts/README.md` para por qué Nekst (demo) no se usa.
- **Gráfica**: motivo triangular de marca recreado en CSS/SVG (acentos, viñetas, hero) para
  mejor rendimiento y responsive.

## Contenido

Todo el copy y las cifras provienen de la **credencial comercial** entregada — no se inventó
ningún dato. Métricas Q4 2025: `160.000+ FTDs`, `CPA −25% vs benchmark`, `ROAS 243x`,
`37M+ transacciones atribuidas`.

> **Logos de clientes**: la credencial no los incluye (confidenciales). En la sección
> *Resultados* hay placeholders semánticos marcados con comentario en el HTML para
> reemplazarlos cuando estén disponibles.

## Formulario

Validación 100% front-end (sin backend). El punto de integración está marcado en
`js/main.js → handleSubmit` y con un comentario `BACKEND INTEGRATION POINT`. Allí se
construye el objeto `payload` listo para enviar por `fetch` a CRM / email / webhook / API.
Tras enviar se muestra el estado de éxito con el copy aprobado.

## Características técnicas

- Responsive (desktop / laptop / tablet / mobile), una sola columna y timeline vertical en móvil.
- Accesibilidad: skip link, labels, `aria-*` en acordeón/menú, foco visible, navegación por teclado, `alt`.
- SEO: `title`, `meta description`, Open Graph/Twitter, JSON-LD, H1 único, HTML semántico.
- Rendimiento: sin librerías; animaciones con IntersectionObserver/CSS; respeta `prefers-reduced-motion`.
- Mejora progresiva: el contenido es visible sin JavaScript (las animaciones solo ocultan si hay JS).

## Desarrollo

Rama de trabajo: `claude/zen-euler-5Eo4u`.
