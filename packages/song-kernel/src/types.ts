// ═══════════════════════════════════════════════════════════
// Song Kernel v1 — Type Definitions
// Structured song brief schema for music production pipelines
// ═══════════════════════════════════════════════════════════

export interface Artist {
  name: string;
  vocal_style: string;
  influences: string[];
}

export interface EmotionalArc {
  opening: string;
  midpoint: string;
  climax: string;
  resolution: string;
}

export interface Song {
  title: string;
  genre: string;
  bpm: number;
  key: string;
  mood_tags: string[];
  thematic_core: string;
  structure: string;
  city_setting: string;
  cultural_references: string[];
  emotional_arc: EmotionalArc;
}

export interface SongBrief {
  schema_version: "song-kernel-v1";
  brief_id: string;
  artist: Artist;
  song: Song;
}

export interface LightningStudioProject {
  schema_version: "lightning-studio-project-v1";
  brief: SongBrief;
  lyrics: string;
  tracks: TrackMeta[];
  exported_at: string;
}

export interface TrackMeta {
  name: string;
  type: "vocal" | "beat" | "clone";
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
}

export type GenrePreset = {
  id: string;
  label: string;
  bpmMin: number;
  bpmMax: number;
  key: string;
};

export type MoodTag =
  | "Angry" | "Defiant" | "Vulnerable" | "Triumphant" | "Melancholic"
  | "Aggressive" | "Caring" | "Haunted" | "Poetic" | "Raw";
