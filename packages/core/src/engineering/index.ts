/**
 * ENGINEERING Q&A MODULE
 *
 * Natural language question parsing and engineering answer generation
 *
 * @packageDocumentation
 */

// Types
export type {
  QuestionIntent,
  ParsedQuestion,
  QuestionEntities,
  QuestionContext,
  EnvironmentConditions,
  EngineeringAnswer,
  ConstraintViolation,
  FailurePrediction,
  CompatibilityResult,
} from './types';

// Question Parser
export { QuestionParser } from './question-parser';

// Answer Engine
export { EngineeringAnswerEngine } from './answer-engine';
