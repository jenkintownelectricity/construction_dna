// ═══════════════════════════════════════════════════════════
// Song Kernel v1.1 + Beat Kernel v1 — Type Definitions
// Structured production schemas for music pipelines
// ═══════════════════════════════════════════════════════════

// ── Song Kernel Types ──

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

export interface BeatKernelRef {
  beat_id: string | null;
  beat_kernel_version: string;
  relationship: "produced_for" | "inspired_by" | "remix_of";
  notes: string;
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
  beat_kernel_ref?: BeatKernelRef;
}

export interface SongBrief {
  schema_version: "song-kernel-v1" | "song-kernel-v1.1";
  brief_id: string;
  artist: Artist;
  song: Song;
}

// ── Beat Kernel Types ──

export interface BeatKernelMetadata {
  beat_id: string;
  name: string;
  artist: string;
  created: string;
  modified: string;
  genre_tags: string[];
  description: string;
  song_kernel_ref: string | null;
}

export interface BeatTransport {
  bpm: number;
  swing: number;
  time_signature: string;
  key: string;
  scale: string;
  steps_per_pattern: number;
}

export interface DrumStep {
  active: boolean;
  velocity: number;
}

export interface DrumSynthesis {
  type: "sine_pitch_env" | "sine_plus_noise" | "filtered_noise" | "noise_burst" | "sine_short";
  start_freq?: number;
  end_freq?: number;
  pitch_decay?: number;
  gain_attack?: number;
  gain_decay?: number;
  noise_mix?: number;
  sine_freq?: number;
  sine_decay?: number;
  noise_filter_type?: string;
  noise_filter_freq?: number;
  noise_decay?: number;
  filter_type?: string;
  filter_freq?: number;
  filter_q?: number;
  freq?: number;
  double_hit?: boolean;
  double_hit_delay?: number;
}

export interface ChannelMixer {
  volume: number;
  pan: number;
  mute: boolean;
  solo: boolean;
  reverb_send: number;
}

export interface DrumChannel {
  id: string;
  name: string;
  enabled: boolean;
  synthesis: DrumSynthesis;
  mixer: ChannelMixer;
  pattern: { steps: DrumStep[] };
}

export interface InstrumentNote {
  step: number;
  midi_note: number;
  note_name: string;
  length_steps: number;
  velocity: number;
}

export interface InstrumentSynthesis {
  waveform: OscillatorType;
  sub_waveform?: OscillatorType;
  sub_mix?: number;
  voices?: number;
  voice_detune?: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  filter_type: BiquadFilterType;
  filter_freq: number;
  filter_q: number;
  detune: number;
  octave: number;
  vibrato_rate?: number;
  vibrato_depth?: number;
  harmonics?: number[];
  comb_delay?: number;
}

export interface InstrumentChannel {
  id: string;
  name: string;
  enabled: boolean;
  synthesis: InstrumentSynthesis;
  mixer: ChannelMixer;
  notes: InstrumentNote[];
}

export interface MasterReverb {
  enabled: boolean;
  room_size: number;
  decay: number;
  wet: number;
  dry: number;
}

export interface MasterDelay {
  enabled: boolean;
  time_ms: number;
  feedback: number;
  wet: number;
}

export interface MasterCompressor {
  enabled: boolean;
  threshold_db: number;
  ratio: number;
  attack_ms: number;
  release_ms: number;
}

export interface MasterEQ {
  enabled: boolean;
  low_gain_db: number;
  low_freq: number;
  mid_gain_db: number;
  mid_freq: number;
  mid_q: number;
  high_gain_db: number;
  high_freq: number;
}

export interface BeatMaster {
  volume: number;
  reverb: MasterReverb;
  delay: MasterDelay;
  compressor: MasterCompressor;
  eq: MasterEQ;
}

export interface ArrangementPattern {
  name: string;
  description: string;
}

export interface BeatArrangement {
  pattern_chain: string[];
  patterns: Record<string, ArrangementPattern>;
}

export interface BeatKernel {
  schema_version: "beat-kernel-v1";
  kernel_type: "beat";
  metadata: BeatKernelMetadata;
  transport: BeatTransport;
  drums: { channels: DrumChannel[] };
  instruments: { channels: InstrumentChannel[] };
  master: BeatMaster;
  arrangement: BeatArrangement;
}

// ── Production Genome ──

export interface ProductionGenome {
  production_genome_version: "1.0.0";
  created: string;
  artist: string;
  song_kernel: SongBrief;
  beat_kernel: BeatKernel;
  lyrics: string;
  vocal_takes: { name: string; format: string; duration_sec: number }[];
  mix_settings: { tracks: TrackMeta[] };
}

// ── Shared Types ──

export interface LightningStudioProject {
  schema_version: "lightning-studio-project-v1";
  brief: SongBrief;
  lyrics: string;
  tracks: TrackMeta[];
  beat_kernel?: BeatKernel;
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

export type ScaleType =
  | "major" | "minor" | "dorian" | "phrygian" | "mixolydian"
  | "blues" | "pentatonic" | "chromatic";
