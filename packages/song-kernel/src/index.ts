// ═══════════════════════════════════════════════════════════
// Song Kernel v1 — Public API
// ═══════════════════════════════════════════════════════════

export type {
  Artist,
  EmotionalArc,
  Song,
  SongBrief,
  LightningStudioProject,
  TrackMeta,
  GenrePreset,
  MoodTag,
} from "./types.js";

export {
  ArtistSchema,
  EmotionalArcSchema,
  SongSchema,
  SongBriefSchema,
  TrackMetaSchema,
  LightningStudioProjectSchema,
} from "./schema.js";

export {
  GENRES,
  MOODS,
  STRUCTURES,
} from "./defaults.js";
