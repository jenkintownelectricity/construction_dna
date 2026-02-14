// ═══════════════════════════════════════════════════════════
// Song Kernel v1 — Default Data & Presets
// ═══════════════════════════════════════════════════════════

import type { GenrePreset, MoodTag } from "./types.js";

export const GENRES: GenrePreset[] = [
  { id: "east_coast", label: "East Coast Hip-Hop", bpmMin: 85, bpmMax: 95, key: "Cm" },
  { id: "boom_bap", label: "Boom Bap", bpmMin: 80, bpmMax: 100, key: "Dm" },
  { id: "conscious", label: "Conscious Rap", bpmMin: 80, bpmMax: 95, key: "Am" },
  { id: "trap", label: "Trap", bpmMin: 130, bpmMax: 160, key: "Fm" },
  { id: "drill", label: "Drill", bpmMin: 140, bpmMax: 150, key: "Gm" },
  { id: "rnb", label: "R&B / Soul", bpmMin: 65, bpmMax: 80, key: "Eb" },
  { id: "lofi", label: "Lo-Fi", bpmMin: 70, bpmMax: 90, key: "Cm" },
  { id: "phonk", label: "Phonk", bpmMin: 130, bpmMax: 145, key: "Dm" },
];

export const MOODS: MoodTag[] = [
  "Angry", "Defiant", "Vulnerable", "Triumphant", "Melancholic",
  "Aggressive", "Caring", "Haunted", "Poetic", "Raw",
];

export const STRUCTURES: string[] = [
  "Intro → V1 → Hook → V2 → Hook → Bridge → V3 → Hook → Outro",
  "Intro → V1 → Hook → V2 → Hook → Outro",
  "V1 → Hook → V2 → Hook → Bridge → Hook",
  "Intro → V1 → Pre-Hook → Hook → V2 → Pre-Hook → Hook → Outro",
];
