// ═══════════════════════════════════════════════════════════
// Song Kernel v1.1 + Beat Kernel v1 — Public API
// ═══════════════════════════════════════════════════════════

export type {
  Artist,
  EmotionalArc,
  BeatKernelRef,
  Song,
  SongBrief,
  BeatKernelMetadata,
  BeatTransport,
  DrumStep,
  DrumSynthesis,
  ChannelMixer,
  DrumChannel,
  InstrumentNote,
  InstrumentSynthesis,
  InstrumentChannel,
  MasterReverb,
  MasterDelay,
  MasterCompressor,
  MasterEQ,
  BeatMaster,
  ArrangementPattern,
  BeatArrangement,
  BeatKernel,
  ProductionGenome,
  LightningStudioProject,
  TrackMeta,
  GenrePreset,
  MoodTag,
  ScaleType,
} from "./types.js";

export {
  ArtistSchema,
  EmotionalArcSchema,
  BeatKernelRefSchema,
  SongSchema,
  SongBriefSchema,
  DrumStepSchema,
  DrumSynthesisSchema,
  ChannelMixerSchema,
  DrumChannelSchema,
  InstrumentNoteSchema,
  InstrumentSynthesisSchema,
  InstrumentChannelSchema,
  BeatTransportSchema,
  BeatMasterSchema,
  BeatArrangementSchema,
  BeatKernelMetadataSchema,
  BeatKernelSchema,
  TrackMetaSchema,
  LightningStudioProjectSchema,
  ProductionGenomeSchema,
} from "./schema.js";

export {
  GENRES,
  MOODS,
  STRUCTURES,
} from "./defaults.js";
