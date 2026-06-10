import { useState, useEffect, useRef } from "react";

// ─── CONFIGURACIÓN ───────────────────────────────────────────────────────────
const VERSION = "B";
const PASSWORD = "HANGARISTA";
const PASSWORD_DISPLAY = ["H","A","N","G","A","R","I","S","T","A"];
const EQUIPOS = ["BETA", "DELTA"];
const TOTAL_TIME = 90 * 60;

const RETOS = [
  // ── BLOQUE 1: CALENTAMIENTO (10 min c/u) ──────────────────────────────────
  {
    id: 1,
    bloque: "CALENTAMIENTO",
    bloqueColor: "#F59E0B",
    tiempo: 10 * 60,
    letra: "H",
    titulo: "RETO 1 — Minimización de Residuos en MRO",
    icono: "🔧",
    tipo: "seleccion",
    enunciado: "Un taller MRO genera solventes clorados usados durante la limpieza de componentes estructurales de aeronaves. ¿Cuál de las siguientes acciones aplica mejor el principio de minimización de residuos peligrosos en la fuente?",
    opciones: [
      { id: "a", texto: "Desechar los solventes tras cada uso y registrarlos como residuo peligroso mensualmente." },
      { id: "b", texto: "Implementar un sistema de recuperación y reciclaje de solventes en circuito cerrado.", correcta: true },
      { id: "c", texto: "Diluirlos con agua en proporción 1:10 antes del vertido al alcantarillado." },
      { id: "d", texto: "Almacenarlos indefinidamente en el hangar hasta alcanzar el volumen mínimo de retiro." },
    ],
    feedback: "✅ Correcto. La minimización en la fuente es el primer nivel de la jerarquía de residuos: reducir la generación. Un sistema de circuito cerrado recupera hasta el 80% del solvente, reduce costos y cumple con ISO 14001 y Protocolo de Montreal.",
    pista: "La jerarquía de gestión de residuos es: Reducir → Reutilizar → Reciclar → Disponer. ¿Cuál opción actúa en el primer nivel?"
  },
  {
    id: 2,
    bloque: "CALENTAMIENTO",
    bloqueColor: "#F59E0B",
    tiempo: 10 * 60,
    letra: "A",
    titulo: "RETO 2 — Huella de Carbono del Hangar",
    icono: "⚡",
    tipo: "calculo",
    enunciado: "El hangar de mantenimiento del aeropuerto utiliza 1,200 kWh de electricidad al mes para iluminación, herramientas y climatización. Usando el factor de emisión de ETESA de 0.264 kg CO₂eq/kWh, calcula la huella de carbono mensual del hangar. ¿Cuál es la respuesta correcta?",
    opciones: [
      { id: "a", texto: "158.4 kg CO₂eq al mes" },
      { id: "b", texto: "316.8 kg CO₂eq al mes", correcta: true },
      { id: "c", texto: "4,545.5 kg CO₂eq al mes" },
      { id: "d", texto: "632.4 kg CO₂eq al mes" },
    ],
    feedback: "✅ Correcto. 1,200 kWh × 0.264 kg CO₂eq/kWh = 316.8 kg CO₂eq mensuales. Anualmente serían 3,801.6 kg CO₂eq. Este dato es el punto de partida para un inventario de emisiones Scope 2.",
    pista: "Fórmula: consumo (kWh) × factor de emisión (kg CO₂eq/kWh) = huella de carbono."
  },
  {
    id: 3,
    bloque: "CALENTAMIENTO",
    bloqueColor: "#F59E0B",
    tiempo: 10 * 60,
    letra: "N",
    titulo: "RETO 3 — ODS y Problemas Ambientales Reales",
    icono: "🌐",
    tipo: "emparejamiento",
    enunciado: "Empareja cada problema ambiental real del sector aeronáutico con el ODS que lo aborda directamente. Coloca el número del ODS correcto frente a cada problema:",
    pares: [
      { problema: "Emisiones de NOₓ y CO₂ por pruebas de motor en banco", ods: "ODS 13", label: "Acción por el clima" },
      { problema: "Residuos metálicos sin clasificar (aluminio, titanio, acero)", ods: "ODS 12", label: "Producción y consumo responsables" },
      { problema: "Derrames de combustible Jet-A en pista de rodaje", ods: "ODS 6", label: "Agua limpia y saneamiento" },
      { problema: "Ruido excesivo en comunidades aledañas al aeropuerto", ods: "ODS 11", label: "Ciudades y comunidades sostenibles" },
      { problema: "Falta de protocolos de seguridad para técnicos expuestos a HAZMAT", ods: "ODS 8", label: "Trabajo decente y crecimiento económico" },
    ],
    feedback: "✅ Correcto. ODS 13 (clima/emisiones) · ODS 12 (residuos metálicos) · ODS 6 (contaminación hídrica) · ODS 11 (ruido urbano) · ODS 8 (seguridad laboral). Cada impacto del sector MRO tiene un ODS vinculado.",
    pista: "Asocia cada problema con el recurso o dimensión que afecta: aire → clima, agua → saneamiento, ruido → comunidades."
  },

  // ── BLOQUE 2: NÚCLEO TÉCNICO (8 min c/u) ─────────────────────────────────
  {
    id: 4,
    bloque: "NÚCLEO TÉCNICO",
    bloqueColor: "#EF4444",
    tiempo: 8 * 60,
    letra: "G",
    titulo: "RETO 4 — Clasificación de Acciones ante Fuga de Aceite",
    icono: "🚨",
    tipo: "clasificacion",
    enunciado: "Durante una inspección de rutina, se detecta una fuga activa de aceite de motor en una aeronave en hangar. Clasifica cada acción como 'ACCIÓN INMEDIATA' (primeras 2 horas) o 'ACCIÓN DIFERIDA' (siguiente turno / 24–48h):",
    clasificaciones: [
      { accion: "Aislar la aeronave del resto de la línea de mantenimiento", tipo: "inmediata" },
      { accion: "Actualizar el registro de mantenimiento en el sistema de gestión", tipo: "diferida" },
      { accion: "Colocar bandeja recolectora bajo el punto de fuga", tipo: "inmediata" },
      { accion: "Notificar al oficial de gestión ambiental del aeropuerto", tipo: "diferida" },
      { accion: "Detener la operación del sistema hidráulico o de lubricación afectado", tipo: "inmediata" },
    ],
    feedback: "✅ Inmediatas: aislar aeronave, colocar bandeja, detener sistema. Diferidas: actualizar registro, notificar al gestor ambiental. La prioridad es contener el daño; la documentación viene después pero es obligatoria.",
    pista: "Las acciones inmediatas son las que evitan que el problema se extienda. Las diferidas son las que documentan y gestionan el incidente a largo plazo."
  },
  {
    id: 5,
    bloque: "NÚCLEO TÉCNICO",
    bloqueColor: "#EF4444",
    tiempo: 8 * 60,
    letra: "A",
    titulo: "RETO 5 — Marco Normativo en Aviación",
    icono: "⚖️",
    tipo: "emparejamiento",
    enunciado: "Empareja cada normativa o estándar con su ámbito de aplicación específico en operaciones de mantenimiento aeronáutico:",
    pares: [
      { problema: "ICAO Anexo 16 (Volumen I y II)", ods: "Norma ICAO", label: "Regula el ruido y las emisiones contaminantes de aeronaves civiles" },
      { problema: "ISO 14001:2015", ods: "Estándar ISO", label: "Sistema de Gestión Ambiental certificable en centros MRO" },
      { problema: "Protocolo de Montreal (1987)", ods: "Tratado ONU", label: "Regula sustancias que agotan la capa de ozono (halones, CFC en aviación)" },
      { problema: "IATA AHM (Airport Handling Manual)", ods: "Manual IATA", label: "Manejo seguro de materiales peligrosos en aeropuertos" },
      { problema: "Ley 41 de 1998 — Ley General de Ambiente (Panamá)", ods: "Ley nacional", label: "Marco legal ambiental nacional aplicable a todas las actividades en territorio panameño" },
    ],
    feedback: "✅ ICAO Anexo 16 (ruido/emisiones) · ISO 14001 (SGA certificable) · Protocolo de Montreal (halones/CFC) · IATA AHM (HAZMAT) · Ley 41/1998 (marco panameño). Conocer la jerarquía normativa es fundamental para auditorías.",
    pista: "Distingue entre normativa internacional técnica (ICAO, IATA), estándares de gestión (ISO) y ley nacional (Ley 41)."
  },
  {
    id: 6,
    bloque: "NÚCLEO TÉCNICO",
    bloqueColor: "#EF4444",
    tiempo: 8 * 60,
    letra: "R",
    titulo: "RETO 6 — Aspectos e Impactos en Engine Swap",
    icono: "🔩",
    tipo: "matriz",
    enunciado: "Se realiza un cambio de motor completo (engine swap): remoción del motor, transporte en stand, inspección visual, reemplazo de sellos y juntas, prueba de banco y reinstalación. Identifica 4 aspectos ambientales del proceso, su impacto y una medida de control para cada uno:",
    tabla: {
      columnas: ["Aspecto Ambiental", "Impacto Identificado", "Magnitud", "Medida de Control"],
      respuestasEjemplo: [
        ["Derrame de aceite residual en desmontaje", "Contaminación de suelo y riesgo de infiltración", "Alta", "Bandejas recolectoras + suelo impermeable en zona de trabajo"],
        ["Emisión de gases en prueba de banco", "Contaminación atmosférica (NOₓ, CO, HC)", "Alta", "Catalizadores en sistema de escape + prueba fuera de hangar cerrado"],
        ["Residuos metálicos (sellos, juntas, pernos)", "Generación de residuos sólidos industriales", "Media", "Segregación en contenedores metálicos + reciclaje certificado"],
        ["Ruido en prueba de banco (>85 dB)", "Impacto en comunidad y riesgo ocupacional", "Media", "Barreras acústicas + EPP auditivo obligatorio + horarios restringidos"],
      ]
    },
    feedback: "✅ Los 4 aspectos clave son: derrames (Alta), emisiones de prueba (Alta), residuos metálicos (Media) y ruido (Media). Toda medida de control debe ser técnicamente implementable y asignable a un responsable específico.",
    pista: "Piensa en cada etapa del proceso: ¿qué sale al ambiente en cada paso? Desmontaje → transporte → prueba → reinstalación."
  },
  {
    id: 7,
    bloque: "NÚCLEO TÉCNICO",
    bloqueColor: "#EF4444",
    tiempo: 8 * 60,
    letra: "I",
    titulo: "RETO 7 — Huella de Residuos Peligrosos Líquidos",
    icono: "🛢️",
    tipo: "calculo",
    enunciado: "Un taller de mantenimiento consume 4 tambores de 200 litros de aceite hidráulico al mes. El 30% del volumen total se contamina con partículas metálicas y humedad, debiendo tratarse como residuo peligroso. Calcula: (a) litros de residuo peligroso mensuales, (b) litros anuales, (c) tipo de gestor autorizado que debe recibirlo.",
    opciones: [
      { id: "a", texto: "240 L/mes · 2,880 L/año · Empresa certificada para aceites usados y residuos peligrosos", correcta: true },
      { id: "b", texto: "160 L/mes · 1,920 L/año · Relleno sanitario municipal" },
      { id: "c", texto: "300 L/mes · 3,600 L/año · Planta de tratamiento de aguas residuales" },
      { id: "d", texto: "80 L/mes · 960 L/año · Empresa de reciclaje de plásticos" },
    ],
    feedback: "✅ 4 tambores × 200 L = 800 L/mes. 800 × 0.30 = 240 L/mes de residuo peligroso. 240 × 12 = 2,880 L/año. El gestor debe estar certificado específicamente para aceites usados con manifiesto de residuos peligrosos.",
    pista: "Paso 1: total de aceite mensual (tambores × litros). Paso 2: aplica el 30%. Paso 3: multiplica por 12 meses."
  },

  // ── BLOQUE 3: SPRINT FINAL (8 min c/u) ────────────────────────────────────
  {
    id: 8,
    bloque: "SPRINT FINAL",
    bloqueColor: "#8B5CF6",
    tiempo: 8 * 60,
    letra: "S",
    titulo: "RETO 8 — Plan de Minimización de Residuos en Tren de Aterrizaje",
    icono: "📋",
    tipo: "planaccion",
    enunciado: "Diseñen en 8 minutos un Plan de Minimización de Residuos para un taller de mantenimiento de tren de aterrizaje. El plan debe incluir: 3 tipos de residuo identificados, acción de reducción específica para cada uno y un responsable del proceso.",
    noConformidades: [
      { id: 1, descripcion: "Residuo tipo 1: Fluidos hidráulicos contaminados (aceite con partículas metálicas)" },
      { id: 2, descripcion: "Residuo tipo 2: Piezas metálicas desgastadas (aluminio, acero, titanio)" },
      { id: 3, descripcion: "Residuo tipo 3: Trapos y absorbentes impregnados con HAZMAT" },
    ],
    columnasPlan: ["Tipo de Residuo", "Acción de Minimización", "Responsable"],
    respuestaEjemplo: [
      ["Fluidos hidráulicos", "Instalar filtros de partículas en el sistema para extender vida útil del fluido y reducir frecuencia de cambio", "Jefe de taller / Técnico hidráulico"],
      ["Piezas metálicas", "Segregar por material (Al/Ti/Fe) en contenedores etiquetados para reciclaje certificado", "Técnico de turno / Supervisor de área"],
      ["Trapos HAZMAT", "Sustituir trapos por sistema de limpieza a vapor que elimina el uso de absorbentes impregnados", "Jefe de taller / Responsable ambiental"],
    ],
    feedback: "✅ El plan es válido si cada residuo tiene una acción técnica específica (no solo 'reciclar') y un responsable nominal. La sustitución de materiales (trapos → vapor) es la acción de mayor impacto.",
    pista: "Para cada residuo, pregúntense: ¿podemos generar MENOS de esto? ¿podemos sustituir el material que lo genera?"
  },
  {
    id: 9,
    bloque: "SPRINT FINAL",
    bloqueColor: "#8B5CF6",
    tiempo: 8 * 60,
    letra: "T",
    titulo: "RETO 9 — Dilema: Aceites Sintéticos Biodegradables",
    icono: "🧪",
    tipo: "debate",
    enunciado: "DILEMA TÉCNICO-AMBIENTAL: Una aerolínea propone sustituir los aceites minerales convencionales por aceites sintéticos biodegradables en toda su flota de 12 aeronaves. El costo operativo del lubricante sube un 18%, pero reduce la generación de residuos peligrosos en un 60% y elimina el riesgo de contaminación de suelos por derrames.",
    pregunta: "¿Vale la pena la inversión? Presenten argumentos técnicos, económicos y ambientales para justificar la decisión ante la dirección técnica de la aerolínea.",
    criteriosEvaluacion: [
      "Análisis comparativo de costos directos vs. costos evitados (gestión de residuos, multas, remediación)",
      "Argumento ambiental con dato cuantitativo (% reducción de residuos peligrosos)",
      "Referencia a algún estándar, regulación o tendencia del sector aeronáutico",
      "Posición clara: recomiendan o no recomiendan la sustitución",
    ],
    ejemploRespuesta: "Posición: Recomendamos la sustitución. El 18% de incremento en costo del lubricante se compensa con: (1) 60% menos residuos peligrosos = menor costo de gestión certificada, (2) eliminación de riesgo de multas por derrames (Ley 41/1998), (3) eliminación de costos de remediación de suelos, (4) cumplimiento anticipado de tendencias IATA de sostenibilidad 2030, (5) mejora de imagen corporativa ante clientes y reguladores.",
    feedback: "✅ Toda respuesta válida debe ir más allá del costo directo y considerar los costos evitados: gestión de residuos, riesgo legal, remediación ambiental y posicionamiento estratégico.",
    pista: "El costo real no es solo el precio del aceite. ¿Cuánto cuesta gestionar los residuos peligrosos actuales? ¿Cuánto costaría una multa por derrame?"
  },
  {
    id: 10,
    bloque: "SPRINT FINAL",
    bloqueColor: "#8B5CF6",
    tiempo: 8 * 60,
    letra: "A",
    titulo: "RETO 10 — Respuesta a Orden de Suspensión por Vertido Ilegal",
    icono: "🚫",
    tipo: "planaccion",
    enunciado: "MISIÓN FINAL: Un inspector de la Autoridad Aeronáutica Civil (AAC) detecta que un taller de mantenimiento general vierte aguas de lavado de componentes directamente al alcantarillado sin tratamiento previo. El taller tampoco cuenta con Plan de Manejo de Residuos documentado. Se emite una orden de suspensión parcial de operaciones.",
    noConformidades: [
      { id: 1, descripcion: "Infracción 1: Vertido de aguas contaminadas sin tratamiento al alcantarillado." },
      { id: 2, descripcion: "Infracción 2: Ausencia de Plan de Manejo de Residuos (PMR) documentado." },
      { id: 3, descripcion: "Infracción 3: Incumplimiento de normativa AAC y MIDA/MiAmbiente sobre efluentes industriales." },
    ],
    columnasPlan: ["Infracción", "Acción de Cumplimiento", "Documentos a Generar", "Plazo"],
    respuestaEjemplo: [
      ["Vertido ilegal", "Instalar trampa de grasas + sistema de sedimentación antes del punto de descarga. Suspender vertido inmediatamente.", "Registro de intervención técnica + certificado de instalación", "72 horas (instalación provisional)"],
      ["Sin PMR", "Elaborar y aprobar Plan de Manejo de Residuos con categorías, volúmenes, gestores y frecuencias.", "PMR firmado + contrato con gestor autorizado de residuos peligrosos", "30 días"],
      ["Incumplimiento AAC/MiAmbiente", "Presentar cronograma de cumplimiento ante AAC + solicitar inspección de levantamiento de suspensión.", "Acta de compromiso + cronograma de adecuación + evidencias fotográficas", "15 días para presentar + 30 días para adecuación"],
    ],
    feedback: "✅ El plan es válido si las 3 infracciones tienen acciones técnicas específicas, documentos concretos (no solo 'informar') y plazos diferenciados: inmediato (72h), corto (15 días) y mediano plazo (30 días).",
    pista: "Para levantar una suspensión, la autoridad necesita evidencia física (instalaciones) y documental (planes, actas). Ambas son indispensables."
  }
];

// ─── UTILIDADES ───────────────────────────────────────────────────────────────
function fmtTime(s) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
}

// ─── COMPONENTES ─────────────────────────────────────────────────────────────
function BarraProgreso({ completados, total }) {
  return (
    <div style={{ background: "#0f172a", borderRadius: 12, padding: "12px 16px", marginBottom: 16, border: "1px solid #2d1b69" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: "#94a3b8", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Fragmentos obtenidos</span>
        <span style={{ color: "#a78bfa", fontSize: 12, fontWeight: 700 }}>{completados}/{total}</span>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
        {PASSWORD_DISPLAY.map((letra, i) => (
          <div key={i} style={{
            width: 32, height: 38, borderRadius: 6,
            background: i < completados ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "#1e293b",
            border: i < completados ? "1px solid #a78bfa" : "1px solid #334155",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: i < completados ? "#fff" : "#334155",
            fontWeight: 900, fontSize: 15, fontFamily: "'Courier New', monospace",
            transition: "all 0.4s ease",
            boxShadow: i < completados ? "0 0 10px rgba(167,139,250,0.4)" : "none"
          }}>
            {i < completados ? letra : "?"}
          </div>
        ))}
      </div>
    </div>
  );
}

function Cronometro({ segundos, total, corriendo }) {
  const pct = (segundos / total) * 100;
  const color = pct > 50 ? "#22c55e" : pct > 25 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ textAlign: "center", marginBottom: 12 }}>
      <div style={{ fontSize: 42, fontFamily: "'Courier New', monospace", fontWeight: 900,
        color: corriendo ? color : "#64748b",
        textShadow: corriendo ? `0 0 20px ${color}60` : "none",
        transition: "color 0.5s" }}>
        {fmtTime(segundos)}
      </div>
      <div style={{ height: 4, background: "#1e293b", borderRadius: 2, margin: "6px 0", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.5s, background 0.5s" }} />
      </div>
    </div>
  );
}

function PantallaIntro({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#09001a 0%,#1a0a2e 60%,#0d0520 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'Segoe UI', sans-serif" }}>

      <div style={{ fontSize: 64, marginBottom: 8, filter: "drop-shadow(0 0 20px #a78bfa)" }}>🛩️</div>

      <div style={{ background: "linear-gradient(90deg,#7c3aed,#a78bfa,#7c3aed)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        fontSize: 28, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase",
        textAlign: "center", marginBottom: 4 }}>
        OPERACIÓN
      </div>
      <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: 6,
        textTransform: "uppercase", textAlign: "center", marginBottom: 8 }}>
        CÓDIGO VERDE
      </div>

      <div style={{ background: "#2d1b69", border: "1px solid #7c3aed", borderRadius: 8,
        padding: "6px 20px", marginBottom: 24 }}>
        <span style={{ color: "#a78bfa", fontWeight: 700, fontSize: 13, letterSpacing: 2 }}>VERSIÓN B — {EQUIPOS.join(" · ")}</span>
      </div>

      <div style={{ maxWidth: 400, textAlign: "center", color: "#94a3b8", fontSize: 14,
        lineHeight: 1.7, marginBottom: 32 }}>
        Misión de alto impacto ambiental. Tu equipo tiene <strong style={{ color: "#f59e0b" }}>90 minutos</strong> para superar
        10 retos de gestión ambiental aeronáutica y descifrar el código de acceso al sistema.
        Cada reto superado revela un fragmento del código.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 380, marginBottom: 28 }}>
        {[
          { color: "#F59E0B", label: "BLOQUE 1 — CALENTAMIENTO", sub: "3 retos · 10 min cada uno" },
          { color: "#EF4444", label: "BLOQUE 2 — NÚCLEO TÉCNICO", sub: "4 retos · 8 min cada uno" },
          { color: "#8B5CF6", label: "BLOQUE 3 — SPRINT FINAL", sub: "3 retos · 8 min cada uno" },
        ].map((b, i) => (
          <div key={i} style={{ background: "#0f172a", border: `1px solid ${b.color}40`,
            borderLeft: `3px solid ${b.color}`, borderRadius: 8, padding: "10px 14px",
            display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>{b.label}</span>
            <span style={{ color: "#64748b", fontSize: 11 }}>{b.sub}</span>
          </div>
        ))}
      </div>

      <button onClick={onStart} style={{
        background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
        border: "none", borderRadius: 12, padding: "16px 40px",
        color: "#fff", fontSize: 16, fontWeight: 900, letterSpacing: 3,
        textTransform: "uppercase", cursor: "pointer",
        boxShadow: "0 4px 24px rgba(124,58,237,0.5)",
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        🚀 INICIAR MISIÓN
      </button>
    </div>
  );
}

function PantallaVictoria({ tiempoRestante }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#09001a,#1a0a2e)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'Segoe UI', sans-serif", textAlign: "center" }}>

      <div style={{ fontSize: 72, marginBottom: 16 }}>🏆</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: "#22c55e", letterSpacing: 4,
        textTransform: "uppercase", marginBottom: 8 }}>¡MISIÓN CUMPLIDA!</div>
      <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 28 }}>
        Código descifrado con {fmtTime(tiempoRestante)} de tiempo restante
      </div>

      <div style={{ background: "#0f172a", border: "2px solid #22c55e", borderRadius: 16,
        padding: "20px 32px", marginBottom: 28 }}>
        <div style={{ color: "#64748b", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
          Código de acceso desbloqueado
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {PASSWORD_DISPLAY.map((l, i) => (
            <div key={i} style={{
              width: 36, height: 44, borderRadius: 8,
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 900, fontSize: 18,
              fontFamily: "'Courier New', monospace",
              boxShadow: "0 0 12px rgba(34,197,94,0.5)"
            }}>{l}</div>
          ))}
        </div>
        <div style={{ color: "#22c55e", fontWeight: 900, fontSize: 22, marginTop: 12,
          letterSpacing: 4, fontFamily: "'Courier New', monospace" }}>
          {PASSWORD}
        </div>
      </div>

      <div style={{ color: "#64748b", fontSize: 13, maxWidth: 360 }}>
        Entreguen este código a su Directora Operativa para registrar la victoria del equipo.
      </div>
    </div>
  );
}

function PantallaReto({ reto, onComplete, retoIndex, totalRetos }) {
  const [seleccion, setSeleccion] = useState(null);
  const [respondido, setRespondido] = useState(false);
  const [correcto, setCorrecto] = useState(false);
  const [segundos, setSegundos] = useState(reto.tiempo);
  const [corriendo, setCorriendo] = useState(false);
  const [mostrarPista, setMostrarPista] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setSeleccion(null); setRespondido(false); setCorrecto(false);
    setSegundos(reto.tiempo); setCorriendo(false); setMostrarPista(false);
    clearInterval(timerRef.current);
  }, [reto.id]);

  useEffect(() => {
    if (corriendo && segundos > 0) {
      timerRef.current = setInterval(() => setSegundos(s => s - 1), 1000);
    }
    if (segundos === 0 && corriendo) { clearInterval(timerRef.current); setCorriendo(false); }
    return () => clearInterval(timerRef.current);
  }, [corriendo, segundos]);

  const iniciarCronometro = () => { if (!respondido) setCorriendo(true); };

  const handleSeleccion = (id) => {
    if (respondido || !corriendo) return;
    setSeleccion(id);
    const op = reto.opciones?.find(o => o.id === id);
    if (op?.correcta) {
      setRespondido(true); setCorrecto(true); setCorriendo(false);
      clearInterval(timerRef.current);
    } else {
      setRespondido(true); setCorrecto(false); setCorriendo(false);
      clearInterval(timerRef.current);
    }
  };

  const esTipoAbierto = ["emparejamiento","clasificacion","matriz","planaccion","debate","verdaderofalso"].includes(reto.tipo);
  const completarManual = () => { setRespondido(true); setCorrecto(true); setCorriendo(false); clearInterval(timerRef.current); };

  return (
    <div style={{ minHeight: "100vh", background: "#020617", fontFamily: "'Segoe UI', sans-serif", paddingBottom: 40 }}>

      <div style={{ background: `linear-gradient(135deg,${reto.bloqueColor}20,${reto.bloqueColor}10)`,
        borderBottom: `2px solid ${reto.bloqueColor}40`, padding: "12px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: reto.bloqueColor, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>{reto.bloque}</div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{reto.titulo}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#64748b", fontSize: 10 }}>RETO</div>
            <div style={{ color: reto.bloqueColor, fontSize: 20, fontWeight: 900 }}>
              {retoIndex + 1}<span style={{ color: "#334155" }}>/{totalRetos}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 8px" }}>
          <div style={{ background: "#0f172a", border: `2px solid ${reto.bloqueColor}60`,
            borderRadius: 12, padding: "8px 20px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#64748b", fontSize: 11, letterSpacing: 2 }}>FRAGMENTO</span>
            <div style={{
              width: 36, height: 42,
              background: respondido && correcto ? `linear-gradient(135deg,${reto.bloqueColor},${reto.bloqueColor}aa)` : "#1e293b",
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              color: respondido && correcto ? "#fff" : "#334155",
              fontWeight: 900, fontSize: 18, fontFamily: "'Courier New', monospace",
              border: `1px solid ${respondido && correcto ? reto.bloqueColor : "#334155"}`,
              boxShadow: respondido && correcto ? `0 0 12px ${reto.bloqueColor}60` : "none",
              transition: "all 0.5s"
            }}>
              {respondido && correcto ? reto.letra : "?"}
            </div>
          </div>
        </div>

        <div style={{ background: "#0f172a", borderRadius: 12, padding: "12px 16px", border: "1px solid #1e293b", marginBottom: 12 }}>
          <Cronometro segundos={segundos} total={reto.tiempo} corriendo={corriendo} />
          {!corriendo && !respondido && (
            <button onClick={iniciarCronometro} style={{
              width: "100%", background: `linear-gradient(135deg,${reto.bloqueColor},${reto.bloqueColor}aa)`,
              border: "none", borderRadius: 8, padding: "10px 0", color: "#fff",
              fontWeight: 700, fontSize: 13, cursor: "pointer", letterSpacing: 1
            }}>▶ INICIAR CRONÓMETRO</button>
          )}
        </div>

        <div style={{ background: "#0f172a", borderRadius: 12, padding: 16, border: "1px solid #1e293b", marginBottom: 12 }}>
          <div style={{ color: "#64748b", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Enunciado</div>
          <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{reto.enunciado}</p>
          {reto.pregunta && (
            <p style={{ color: "#f59e0b", fontSize: 14, lineHeight: 1.6, margin: "10px 0 0", fontWeight: 600, fontStyle: "italic" }}>{reto.pregunta}</p>
          )}
          {reto.pares && (
            <div style={{ marginTop: 10 }}>
              {reto.pares.map((par, i) => (
                <div key={i} style={{ background: "#1e293b", borderRadius: 8, padding: "8px 12px", marginBottom: 6, borderLeft: "3px solid #7c3aed" }}>
                  <div style={{ color: "#cbd5e1", fontSize: 13, marginBottom: 4 }}>{par.problema}</div>
                  <div style={{ color: "#a78bfa", fontSize: 12, fontWeight: 700 }}>→ {par.ods}: {par.label}</div>
                </div>
              ))}
            </div>
          )}
          {reto.clasificaciones && (
            <div style={{ marginTop: 10 }}>
              {reto.clasificaciones.map((cl, i) => (
                <div key={i} style={{ background: "#1e293b", borderRadius: 8, padding: "8px 12px", marginBottom: 6,
                  borderLeft: `3px solid ${cl.tipo === "inmediata" ? "#ef4444" : "#f59e0b"}` }}>
                  <div style={{ color: "#cbd5e1", fontSize: 13, marginBottom: 4 }}>{cl.accion}</div>
                  <div style={{ color: cl.tipo === "inmediata" ? "#ef4444" : "#f59e0b", fontSize: 12, fontWeight: 700 }}>
                    → {cl.tipo === "inmediata" ? "⚡ ACCIÓN INMEDIATA" : "📅 ACCIÓN DIFERIDA"}
                  </div>
                </div>
              ))}
            </div>
          )}
          {reto.noConformidades && (
            <div style={{ marginTop: 10 }}>
              {reto.noConformidades.map(nc => (
                <div key={nc.id} style={{ background: "#1e293b", borderRadius: 8, padding: "8px 12px", marginBottom: 6, borderLeft: "3px solid #ef4444" }}>
                  <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 12 }}>• </span>
                  <span style={{ color: "#cbd5e1", fontSize: 13 }}>{nc.descripcion}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {reto.opciones && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {reto.opciones.map(op => {
              const esSeleccionada = seleccion === op.id;
              const esCorrecta = op.correcta;
              let bg = "#0f172a", border = "#1e293b", color = "#e2e8f0";
              if (respondido) {
                if (esCorrecta) { bg = "#14532d"; border = "#22c55e"; color = "#fff"; }
                else if (esSeleccionada) { bg = "#450a0a"; border = "#ef4444"; color = "#fff"; }
              } else if (esSeleccionada) { bg = "#2d1b69"; border = "#7c3aed"; }
              return (
                <button key={op.id} onClick={() => handleSeleccion(op.id)} style={{
                  background: bg, border: `1px solid ${border}`, borderRadius: 10,
                  padding: "12px 14px", textAlign: "left", cursor: respondido ? "default" : "pointer",
                  display: "flex", gap: 10, alignItems: "flex-start"
                }}>
                  <span style={{ background: "#1e293b", borderRadius: 6, width: 24, height: 24,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#64748b", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {op.id.toUpperCase()}
                  </span>
                  <span style={{ color, fontSize: 14, lineHeight: 1.5 }}>{op.texto}</span>
                </button>
              );
            })}
          </div>
        )}

        {(reto.criteriosEvaluacion) && (
          <div style={{ background: "#0f172a", borderRadius: 12, padding: 14, border: "1px solid #1e293b", marginBottom: 12 }}>
            <div style={{ color: "#64748b", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Criterios de evaluación</div>
            {reto.criteriosEvaluacion.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ color: reto.bloqueColor, fontSize: 12, flexShrink: 0 }}>✦</span>
                <span style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <button onClick={() => setMostrarPista(!mostrarPista)} style={{
            background: "transparent", border: "1px solid #334155", borderRadius: 8,
            padding: "8px 14px", color: "#64748b", fontSize: 12, cursor: "pointer", width: "100%", textAlign: "left"
          }}>
            {mostrarPista ? "🔒 Ocultar pista" : "💡 Mostrar pista (-10s del tiempo)"}
          </button>
          {mostrarPista && (
            <div style={{ background: "#1c1a08", border: "1px solid #854d0e", borderRadius: 8, padding: 12, marginTop: 6 }}>
              <span style={{ color: "#fbbf24", fontSize: 13 }}>💡 {reto.pista}</span>
            </div>
          )}
        </div>

        {respondido && (
          <div style={{ background: correcto ? "#14532d" : "#450a0a",
            border: `1px solid ${correcto ? "#22c55e" : "#ef4444"}`,
            borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <p style={{ color: correcto ? "#86efac" : "#fca5a5", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{reto.feedback}</p>
          </div>
        )}

        {esTipoAbierto && !respondido && corriendo && (
          <button onClick={completarManual} style={{
            width: "100%", background: `linear-gradient(135deg,${reto.bloqueColor},${reto.bloqueColor}90)`,
            border: "none", borderRadius: 10, padding: "14px 0", color: "#fff",
            fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 8, letterSpacing: 1
          }}>
            ✅ RETO COMPLETADO — OBTENER FRAGMENTO
          </button>
        )}

        {respondido && (
          <button onClick={onComplete} style={{
            width: "100%",
            background: correcto ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#64748b,#475569)",
            border: "none", borderRadius: 10, padding: "14px 0", color: "#fff",
            fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: 1
          }}>
            {correcto ? "→ SIGUIENTE RETO" : "→ CONTINUAR (sin fragmento)"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [pantalla, setPantalla] = useState("intro");
  const [retoActual, setRetoActual] = useState(0);
  const [completados, setCompletados] = useState(0);
  const [tiempoGlobal, setTiempoGlobal] = useState(TOTAL_TIME);
  const [tiempoFinal, setTiempoFinal] = useState(0);
  const timerGlobalRef = useRef(null);

  useEffect(() => {
    if (pantalla === "reto") {
      timerGlobalRef.current = setInterval(() => {
        setTiempoGlobal(t => {
          if (t <= 1) { clearInterval(timerGlobalRef.current); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerGlobalRef.current);
  }, [pantalla]);

  const iniciarMision = () => { setPantalla("reto"); setRetoActual(0); };

  const completarReto = () => {
    const nuevosCompletados = completados + 1;
    setCompletados(nuevosCompletados);
    if (retoActual + 1 >= RETOS.length) {
      setTiempoFinal(tiempoGlobal);
      clearInterval(timerGlobalRef.current);
      setPantalla("victoria");
    } else {
      setRetoActual(r => r + 1);
    }
  };

  if (pantalla === "intro") return <PantallaIntro onStart={iniciarMision} />;
  if (pantalla === "victoria") return <PantallaVictoria tiempoRestante={tiempoFinal} />;

  const reto = RETOS[retoActual];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{ background: "#0a0f1e", borderBottom: "1px solid #1e293b",
        padding: "8px 16px", display: "flex", justifyContent: "space-between",
        alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <span style={{ color: "#a78bfa", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
          🛩️ CÓDIGO VERDE — V.B
        </span>
        <span style={{
          fontFamily: "'Courier New', monospace", fontSize: 14, fontWeight: 900,
          color: tiempoGlobal < 600 ? "#ef4444" : tiempoGlobal < 1800 ? "#f59e0b" : "#22c55e"
        }}>
          ⏱ {fmtTime(tiempoGlobal)}
        </span>
      </div>

      <div style={{ padding: "12px 16px 0" }}>
        <BarraProgreso completados={completados} total={RETOS.length} />
      </div>

      <PantallaReto
        reto={reto}
        retoIndex={retoActual}
        totalRetos={RETOS.length}
        onComplete={completarReto}
      />
    </div>
  );
}
