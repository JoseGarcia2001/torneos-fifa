# ⚽ Copa Familiar FIFA

Web para organizar el torneo de FIFA en familia. Sorteo aleatorio de grupos,
captura de resultados, tablas de posiciones en vivo y fase final automática.
Todo se guarda en el navegador (`localStorage`) — funciona offline.

## Formato

- 8 jugadores · 2 grupos de 4 · todos contra todos
- Clasifican los 2 primeros de cada grupo
- Semifinales cruzadas (1°A vs 2°B / 1°B vs 2°A) → tercer puesto + final
- Partidos de grupo cortos; finales de 10 min (configurable en la pestaña Inicio)

## Cómo correrla

```bash
npm install     # solo la primera vez
npm run dev     # desarrollo en http://localhost:3000
```

Para usarla el día del torneo (más estable que dev):

```bash
npm run build && npm run start
```

El estado vive en `localStorage`: úsala siempre en el **mismo navegador y
dispositivo** para no perder resultados.

## Flujo el día del evento

1. **Inicio** — revisa reglas, comida y ajusta minutos/fecha si quieres.
2. **Sorteo** — corrige nombres si hace falta y dale a *Sortear grupos*.
3. **Grupos** — ve metiendo los marcadores; las tablas se actualizan solas.
4. **Final** — se habilita al terminar los grupos; mete semis, 3er puesto y final.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4. Toda la lógica
del torneo está en `src/lib/tournament.ts` (pura, sin efectos).
