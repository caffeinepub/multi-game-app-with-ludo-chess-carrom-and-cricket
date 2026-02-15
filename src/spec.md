# Specification

## Summary
**Goal:** Update the Home screen and Ludo UI styling to match the provided reference designs, and remove all “Create Game” UI.

**Planned changes:**
- Rework HomeScreen layout/styling to match the reference structure: clean top header, prominent hero section with centered phone/device mock image, and large headline + subheadline; keep existing navigation into Ludo/Chess/Carrom/Cricket via onSelectGame(game).
- Apply a glassmorphism visual style to LudoScreen (pre-game setup and in-game HUD panels): blurred/soft gradient background, translucent rounded panels, and a strong primary CTA button; no gameplay logic changes.
- Remove the “Create Game” option/label from all UI locations while preserving existing local “Start/New/Quick Play” flows across all game modes.
- Add and wire new static assets under `frontend/public/assets/generated` for the updated Home hero and Ludo glassmorphism background/panel styling.

**User-visible outcome:** The app opens to a redesigned Home page that matches the reference hero layout, Ludo screens use a modern glassmorphism look, and “Create Game” no longer appears anywhere while users can still start and replay games normally.
