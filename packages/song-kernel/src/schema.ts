// ═══════════════════════════════════════════════════════════
// Song Kernel v1.1 + Beat Kernel v1 — Zod Validation Schemas
// ═══════════════════════════════════════════════════════════

import { z } from "zod";

// ── Song Kernel Schemas ──

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

export const BeatKernelRefSchema = z.object({
  beat_id: z.string().nullable(),
  beat_kernel_version: z.string(),
  relationship: z.enum(["produced_for", "inspired_by", "remix_of"]),
  notes: z.string(),
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
  beat_kernel_ref: BeatKernelRefSchema.optional(),
});

export const SongBriefSchema = z.object({
  schema_version: z.enum(["song-kernel-v1", "song-kernel-v1.1"]),
  brief_id: z.string(),
  artist: ArtistSchema,
  song: SongSchema,
});

// ── Beat Kernel Schemas ──

export const DrumStepSchema = z.object({
  active: z.boolean(),
  velocity: z.number().min(0).max(1),
});

export const DrumSynthesisSchema = z.object({
  type: z.enum(["sine_pitch_env", "sine_plus_noise", "filtered_noise", "noise_burst", "sine_short"]),
  start_freq: z.number().optional(),
  end_freq: z.number().optional(),
  pitch_decay: z.number().optional(),
  gain_attack: z.number().optional(),
  gain_decay: z.number().optional(),
  noise_mix: z.number().optional(),
  sine_freq: z.number().optional(),
  sine_decay: z.number().optional(),
  noise_filter_type: z.string().optional(),
  noise_filter_freq: z.number().optional(),
  noise_decay: z.number().optional(),
  filter_type: z.string().optional(),
  filter_freq: z.number().optional(),
  filter_q: z.number().optional(),
  freq: z.number().optional(),
  double_hit: z.boolean().optional(),
  double_hit_delay: z.number().optional(),
});

export const ChannelMixerSchema = z.object({
  volume: z.number().min(0).max(1),
  pan: z.number().min(-1).max(1),
  mute: z.boolean(),
  solo: z.boolean(),
  reverb_send: z.number().min(0).max(1),
});

export const DrumChannelSchema = z.object({
  id: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  synthesis: DrumSynthesisSchema,
  mixer: ChannelMixerSchema,
  pattern: z.object({ steps: z.array(DrumStepSchema) }),
});

export const InstrumentNoteSchema = z.object({
  step: z.number().int().min(0),
  midi_note: z.number().int().min(0).max(127),
  note_name: z.string(),
  length_steps: z.number().int().min(1),
  velocity: z.number().min(0).max(1),
});

export const InstrumentSynthesisSchema = z.object({
  waveform: z.enum(["sine", "square", "sawtooth", "triangle"]),
  sub_waveform: z.enum(["sine", "square", "sawtooth", "triangle"]).optional(),
  sub_mix: z.number().optional(),
  voices: z.number().int().optional(),
  voice_detune: z.number().optional(),
  attack: z.number().min(0),
  decay: z.number().min(0),
  sustain: z.number().min(0).max(1),
  release: z.number().min(0),
  filter_type: z.enum(["lowpass", "highpass", "bandpass", "notch", "allpass", "lowshelf", "highshelf", "peaking"]),
  filter_freq: z.number().min(20).max(20000),
  filter_q: z.number().min(0),
  detune: z.number(),
  octave: z.number().int().min(0).max(8),
  vibrato_rate: z.number().optional(),
  vibrato_depth: z.number().optional(),
  harmonics: z.array(z.number()).optional(),
  comb_delay: z.number().optional(),
});

export const InstrumentChannelSchema = z.object({
  id: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  synthesis: InstrumentSynthesisSchema,
  mixer: ChannelMixerSchema,
  notes: z.array(InstrumentNoteSchema),
});

export const BeatTransportSchema = z.object({
  bpm: z.number().int().min(40).max(200),
  swing: z.number().min(0).max(0.5),
  time_signature: z.string(),
  key: z.string(),
  scale: z.enum(["major", "minor", "dorian", "phrygian", "mixolydian", "blues", "pentatonic", "chromatic"]),
  steps_per_pattern: z.number().int(),
});

export const BeatMasterSchema = z.object({
  volume: z.number().min(0).max(1),
  reverb: z.object({
    enabled: z.boolean(),
    room_size: z.number().min(0).max(1),
    decay: z.number().min(0),
    wet: z.number().min(0).max(1),
    dry: z.number().min(0).max(1),
  }),
  delay: z.object({
    enabled: z.boolean(),
    time_ms: z.number().min(0).max(2000),
    feedback: z.number().min(0).max(0.95),
    wet: z.number().min(0).max(1),
  }),
  compressor: z.object({
    enabled: z.boolean(),
    threshold_db: z.number().min(-100).max(0),
    ratio: z.number().min(1).max(20),
    attack_ms: z.number().min(0),
    release_ms: z.number().min(0),
  }),
  eq: z.object({
    enabled: z.boolean(),
    low_gain_db: z.number().min(-24).max(24),
    low_freq: z.number(),
    mid_gain_db: z.number().min(-24).max(24),
    mid_freq: z.number(),
    mid_q: z.number(),
    high_gain_db: z.number().min(-24).max(24),
    high_freq: z.number(),
  }),
});

export const BeatArrangementSchema = z.object({
  pattern_chain: z.array(z.string()),
  patterns: z.record(z.object({
    name: z.string(),
    description: z.string(),
  })),
});

export const BeatKernelMetadataSchema = z.object({
  beat_id: z.string(),
  name: z.string(),
  artist: z.string(),
  created: z.string(),
  modified: z.string(),
  genre_tags: z.array(z.string()),
  description: z.string(),
  song_kernel_ref: z.string().nullable(),
});

export const BeatKernelSchema = z.object({
  schema_version: z.literal("beat-kernel-v1"),
  kernel_type: z.literal("beat"),
  metadata: BeatKernelMetadataSchema,
  transport: BeatTransportSchema,
  drums: z.object({ channels: z.array(DrumChannelSchema) }),
  instruments: z.object({ channels: z.array(InstrumentChannelSchema) }),
  master: BeatMasterSchema,
  arrangement: BeatArrangementSchema,
});

// ── Shared Schemas ──

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
  beat_kernel: BeatKernelSchema.optional(),
  exported_at: z.string().datetime(),
});

export const ProductionGenomeSchema = z.object({
  production_genome_version: z.literal("1.0.0"),
  created: z.string().datetime(),
  artist: z.string(),
  song_kernel: SongBriefSchema,
  beat_kernel: BeatKernelSchema,
  lyrics: z.string(),
  vocal_takes: z.array(z.object({
    name: z.string(),
    format: z.string(),
    duration_sec: z.number(),
  })),
  mix_settings: z.object({ tracks: z.array(TrackMetaSchema) }),
});
