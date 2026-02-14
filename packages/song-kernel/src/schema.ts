// ═══════════════════════════════════════════════════════════
// Song Kernel v1 — Zod Validation Schemas
// ═══════════════════════════════════════════════════════════

import { z } from "zod";

export const EmotionalArcSchema = z.object({
  opening: z.string(),
  midpoint: z.string(),
  climax: z.string(),
  resolution: z.string(),
});

export const ArtistSchema = z.object({
  name: z.string().min(1, "Artist name is required"),
  vocal_style: z.string(),
  influences: z.array(z.string()),
});

export const SongSchema = z.object({
  title: z.string(),
  genre: z.string().min(1, "Genre is required"),
  bpm: z.number().int().min(40).max(300),
  key: z.string().min(1, "Musical key is required"),
  mood_tags: z.array(z.string()).min(1, "At least one mood tag is required"),
  thematic_core: z.string(),
  structure: z.string().min(1, "Song structure is required"),
  city_setting: z.string(),
  cultural_references: z.array(z.string()),
  emotional_arc: EmotionalArcSchema,
});

export const SongBriefSchema = z.object({
  schema_version: z.literal("song-kernel-v1"),
  brief_id: z.string().regex(/^SB-\d{8}$/, "Brief ID must be in format SB-YYYYMMDD"),
  artist: ArtistSchema,
  song: SongSchema,
});

export const TrackMetaSchema = z.object({
  name: z.string(),
  type: z.enum(["vocal", "beat", "clone"]),
  volume: z.number().min(0).max(1),
  pan: z.number().min(-1).max(1),
  muted: z.boolean(),
  solo: z.boolean(),
});

export const LightningStudioProjectSchema = z.object({
  schema_version: z.literal("lightning-studio-project-v1"),
  brief: SongBriefSchema,
  lyrics: z.string(),
  tracks: z.array(TrackMetaSchema),
  exported_at: z.string().datetime(),
});
