/**
 * ENGINEERING ANSWER ENGINE
 *
 * Generates answers to engineering questions using Material DNA
 */

import type { MaterialDNA, FailureMode, CompatibilityEntry } from '@construction-dna/kernel';
import {
  getFailureModesForChemistry,
  checkCompatibility as kernelCheckCompatibility,
} from '@construction-dna/kernel';
import type { StorageAdapter } from '../storage';
import { QuestionParser } from './question-parser';
import type {
  EngineeringAnswer,
  QuestionContext,
  ParsedQuestion,
  ConstraintViolation,
  FailurePrediction,
  CompatibilityResult,
  EnvironmentConditions,
} from './types';

/**
 * Engineering Answer Engine
 */
export class EngineeringAnswerEngine {
  private parser: QuestionParser;

  constructor(private storage: StorageAdapter) {
    this.parser = new QuestionParser();
  }

  /**
   * Answer an engineering question
   */
  async answer(question: string, context?: QuestionContext): Promise<EngineeringAnswer> {
    // Parse the question
    const parsed = this.parser.parse(question);

    // Get relevant materials
    const materials = await this.getRelevantMaterials(parsed, context);

    // Generate answer based on intent
    switch (parsed.intent) {
      case 'failure-prediction':
        return this.answerFailurePrediction(parsed, materials, context);

      case 'compatibility-check':
        return this.answerCompatibilityCheck(parsed, materials, context);

      case 'temperature-check':
        return this.answerTemperatureCheck(parsed, materials, context);

      case 'application-guidance':
        return this.answerApplicationGuidance(parsed, materials, context);

      case 'material-properties':
        return this.answerMaterialProperties(parsed, materials, context);

      case 'code-compliance':
        return this.answerCodeCompliance(parsed, materials, context);

      default:
        return this.answerGeneral(parsed, materials, context);
    }
  }

  /**
   * Answer failure prediction questions
   */
  private async answerFailurePrediction(
    parsed: ParsedQuestion,
    materials: MaterialDNA[],
    _context?: QuestionContext,
  ): Promise<EngineeringAnswer> {
    const failureModes: FailureMode[] = [];
    const explanations: string[] = [];
    const recommendations: string[] = [];
    const warnings: string[] = [];

    for (const material of materials) {
      const chemistry = material.physical.tier7_baseChemistry;
      const modes = material.engineering.tier17_failureModes || [];

      // Find relevant failure modes based on keywords
      const relevantModes = modes.filter((mode) => {
        const keywords = parsed.keywords;
        const conditions = parsed.entities.conditions;

        if (conditions.includes('water') && mode.category === 'moisture') return true;
        if (conditions.includes('moisture') && mode.category === 'moisture') return true;
        if (conditions.includes('cold') && mode.category === 'thermal') return true;
        if (conditions.includes('heat') && mode.category === 'thermal') return true;
        if (conditions.includes('uv') && mode.category === 'uv') return true;
        if (conditions.includes('chemical') && mode.category === 'chemical') return true;
        if (keywords.includes('puncture') && mode.category === 'mechanical') return true;
        if (keywords.includes('adhesion') && mode.category === 'adhesion') return true;
        if (keywords.includes('seam') && mode.category === 'adhesion') return true;
        if (keywords.includes('wind') && mode.category === 'mechanical') return true;

        return false;
      });

      // Also check common failure modes for this chemistry
      if (relevantModes.length === 0 && chemistry?.type) {
        const chemistryModes = getFailureModesForChemistry(chemistry.type);
        relevantModes.push(...chemistryModes.slice(0, 3));
      }

      for (const mode of relevantModes) {
        if (!failureModes.find((fm) => fm.id === mode.id)) {
          failureModes.push(mode);

          const productName = material.classification.tier6_productVariant?.name || 'Material';
          explanations.push(
            `**${mode.name}** (${chemistry?.code || 'Unknown'} - ${productName}):\n` +
              `- Causes: ${mode.causes.slice(0, 2).join('; ')}\n` +
              `- Symptoms: ${mode.symptoms.slice(0, 2).join('; ')}\n` +
              `- Time to failure: ${mode.timeToFailure}\n` +
              `- Severity: ${mode.severity}`,
          );

          recommendations.push(...mode.prevention.slice(0, 2));

          if (mode.severity === 'structural' || mode.severity === 'catastrophic') {
            warnings.push(`${mode.name} is a ${mode.severity} failure - requires immediate attention`);
          }
        }
      }
    }

    return {
      question: parsed.original,
      intent: parsed.intent,
      answer:
        failureModes.length > 0
          ? `Found ${failureModes.length} potential failure mode(s) related to your question.`
          : 'No specific failure modes found for this condition.',
      explanation: explanations.join('\n\n') || 'Unable to determine specific failure modes.',
      materials,
      failureModes,
      compatibilityIssues: [],
      constraintViolations: [],
      recommendations: [...new Set(recommendations)],
      warnings,
      confidence: failureModes.length > 0 ? 0.85 : 0.5,
      sources: materials.map((m) => m.taxonomyCode).filter(Boolean),
    };
  }

  /**
   * Answer compatibility questions
   */
  private async answerCompatibilityCheck(
    parsed: ParsedQuestion,
    materials: MaterialDNA[],
    _context?: QuestionContext,
  ): Promise<EngineeringAnswer> {
    const compatibilityIssues: CompatibilityEntry[] = [];
    const explanations: string[] = [];
    const recommendations: string[] = [];
    const warnings: string[] = [];

    // Get all chemistries mentioned
    const chemistries = [
      ...parsed.entities.chemistries,
      ...materials.map((m) => m.physical.tier7_baseChemistry?.type).filter(Boolean),
    ];

    // Check each material's compatibility
    for (const material of materials) {
      const chemistry = material.physical.tier7_baseChemistry;
      const matrix = material.engineering.tier18_compatibilityMatrix;

      if (!chemistry || !matrix) continue;

      // Check against other chemistries
      for (const otherChem of chemistries) {
        if (otherChem === chemistry.type) continue;

        // Check incompatible
        const incompatible = matrix.incompatible?.find(
          (e) =>
            e.chemistryType?.toLowerCase() === otherChem.toLowerCase() ||
            e.materialType.toLowerCase().includes(otherChem.toLowerCase()),
        );

        if (incompatible) {
          compatibilityIssues.push(incompatible);
          explanations.push(
            `**INCOMPATIBLE**: ${chemistry.code} cannot be used with ${otherChem}.\n` +
              `Reason: ${incompatible.reason}`,
          );
          warnings.push(`Do not use ${chemistry.code} in contact with ${otherChem}`);
        }

        // Check conditional
        const conditional = matrix.conditional?.find(
          (e) =>
            e.chemistryType?.toLowerCase() === otherChem.toLowerCase() ||
            e.materialType.toLowerCase().includes(otherChem.toLowerCase()),
        );

        if (conditional) {
          compatibilityIssues.push(conditional);
          explanations.push(
            `**CONDITIONAL**: ${chemistry.code} can be used with ${otherChem} IF:\n` +
              `Requirement: ${conditional.requirement || conditional.separatorRequired || 'See manufacturer guidelines'}`,
          );
          recommendations.push(conditional.requirement || 'Follow manufacturer requirements');
        }
      }

      // Also check from kernel data
      for (const otherChem of parsed.entities.chemistries) {
        const kernelCheck = kernelCheckCompatibility(chemistry.type, otherChem);
        if (kernelCheck && !compatibilityIssues.find((i) => i.materialType === kernelCheck.materialType)) {
          compatibilityIssues.push(kernelCheck);
          if (kernelCheck.status === 'incompatible') {
            warnings.push(`${chemistry.code} is incompatible with ${otherChem}`);
          }
        }
      }
    }

    const hasIncompatible = compatibilityIssues.some((c) => c.status === 'incompatible');
    const hasConditional = compatibilityIssues.some((c) => c.status === 'conditional');

    return {
      question: parsed.original,
      intent: parsed.intent,
      answer: hasIncompatible
        ? 'These materials are NOT compatible.'
        : hasConditional
          ? 'These materials can be compatible with proper separation/primer.'
          : compatibilityIssues.length > 0
            ? 'Compatibility issues found - see details.'
            : 'No compatibility issues detected.',
      explanation: explanations.join('\n\n') || 'No specific compatibility data found.',
      materials,
      failureModes: [],
      compatibilityIssues,
      constraintViolations: [],
      recommendations: [...new Set(recommendations)],
      warnings,
      confidence: compatibilityIssues.length > 0 ? 0.9 : 0.6,
      sources: materials.map((m) => m.taxonomyCode).filter(Boolean),
    };
  }

  /**
   * Answer temperature questions
   */
  private async answerTemperatureCheck(
    parsed: ParsedQuestion,
    materials: MaterialDNA[],
    context?: QuestionContext,
  ): Promise<EngineeringAnswer> {
    const constraintViolations: ConstraintViolation[] = [];
    const explanations: string[] = [];
    const recommendations: string[] = [];
    const warnings: string[] = [];

    // Get temperature from question or context
    const temps = parsed.entities.temperatures;
    const requestedTemp = temps.length > 0 ? temps[0].value : context?.conditions?.temperature;

    for (const material of materials) {
      const tempRange = material.performance.tier16_temperatureRange;
      const name = material.classification.tier6_productVariant?.name || 'Material';

      if (!tempRange) {
        explanations.push(`**${name}**: Temperature data not available.`);
        continue;
      }

      if (requestedTemp !== undefined) {
        // Check application temperature
        if (requestedTemp < tempRange.minApplicationF) {
          constraintViolations.push({
            constraint: {
              id: 'temp-min',
              type: 'temperature',
              description: 'Minimum application temperature',
              minValue: tempRange.minApplicationF,
              unit: '°F',
              consequence: 'Material may not adhere properly',
              violationSeverity: 'structural',
              source: 'manufacturer',
            },
            actualValue: requestedTemp,
            requiredValue: tempRange.minApplicationF,
            severity: 'error',
            explanation: `Temperature ${requestedTemp}°F is below minimum ${tempRange.minApplicationF}°F`,
          });

          explanations.push(
            `**${name}** cannot be applied at ${requestedTemp}°F.\n` +
              `Minimum application temperature: ${tempRange.minApplicationF}°F\n` +
              `Risk: Material may not adhere properly in cold conditions.`,
          );

          warnings.push(`Temperature ${requestedTemp}°F is below minimum for ${name}`);
          recommendations.push(
            `Wait for temperature above ${tempRange.minApplicationF}°F or use cold-weather alternative`,
          );
        } else if (requestedTemp > tempRange.maxApplicationF) {
          constraintViolations.push({
            constraint: {
              id: 'temp-max',
              type: 'temperature',
              description: 'Maximum application temperature',
              maxValue: tempRange.maxApplicationF,
              unit: '°F',
              consequence: 'Material may be too soft',
              violationSeverity: 'functional',
              source: 'manufacturer',
            },
            actualValue: requestedTemp,
            requiredValue: tempRange.maxApplicationF,
            severity: 'warning',
            explanation: `Temperature ${requestedTemp}°F exceeds maximum ${tempRange.maxApplicationF}°F`,
          });

          explanations.push(
            `**${name}** may be difficult to apply at ${requestedTemp}°F.\n` +
              `Maximum application temperature: ${tempRange.maxApplicationF}°F\n` +
              `Risk: Material may become too soft or pliable.`,
          );

          warnings.push(`Temperature ${requestedTemp}°F is above maximum for ${name}`);
          recommendations.push('Apply in cooler part of day or provide temporary shade');
        } else {
          explanations.push(
            `**${name}** can be applied at ${requestedTemp}°F.\n` +
              `Application range: ${tempRange.minApplicationF}°F to ${tempRange.maxApplicationF}°F`,
          );
        }
      } else {
        // Just provide temperature info
        explanations.push(
          `**${name}** temperature specifications:\n` +
            `Application range: ${tempRange.minApplicationF}°F to ${tempRange.maxApplicationF}°F\n` +
            `Service range: ${tempRange.minServiceF}°F to ${tempRange.maxServiceF}°F`,
        );
      }
    }

    return {
      question: parsed.original,
      intent: parsed.intent,
      answer:
        constraintViolations.length > 0
          ? `Temperature constraint violation(s) found.`
          : `Temperature is within acceptable range.`,
      explanation: explanations.join('\n\n'),
      materials,
      failureModes: [],
      compatibilityIssues: [],
      constraintViolations,
      recommendations: [...new Set(recommendations)],
      warnings,
      confidence: 0.95,
      sources: materials.map((m) => m.taxonomyCode).filter(Boolean),
    };
  }

  /**
   * Answer application guidance questions
   */
  private async answerApplicationGuidance(
    parsed: ParsedQuestion,
    materials: MaterialDNA[],
    _context?: QuestionContext,
  ): Promise<EngineeringAnswer> {
    const explanations: string[] = [];
    const recommendations: string[] = [];

    for (const material of materials) {
      const name = material.classification.tier6_productVariant?.name || 'Material';
      const constraints = material.engineering.tier19_applicationConstraints || [];

      explanations.push(`**${name}** Application Guidelines:`);

      // List key constraints
      for (const constraint of constraints.slice(0, 5)) {
        explanations.push(`- ${constraint.description}`);
        if (constraint.minValue !== undefined || constraint.maxValue !== undefined) {
          const range =
            constraint.minValue !== undefined && constraint.maxValue !== undefined
              ? `${constraint.minValue} - ${constraint.maxValue} ${constraint.unit || ''}`
              : constraint.minValue !== undefined
                ? `Min: ${constraint.minValue} ${constraint.unit || ''}`
                : `Max: ${constraint.maxValue} ${constraint.unit || ''}`;
          explanations.push(`  Range: ${range}`);
        }
      }

      // Add installation reference if available
      if (material.installationRef?.guideUrl) {
        recommendations.push(`See installation guide: ${material.installationRef.guideUrl}`);
      }
    }

    return {
      question: parsed.original,
      intent: parsed.intent,
      answer: `Application guidance for ${materials.length} material(s).`,
      explanation: explanations.join('\n'),
      materials,
      failureModes: [],
      compatibilityIssues: [],
      constraintViolations: [],
      recommendations,
      warnings: [],
      confidence: 0.8,
      sources: materials.map((m) => m.taxonomyCode).filter(Boolean),
    };
  }

  /**
   * Answer material properties questions
   */
  private async answerMaterialProperties(
    parsed: ParsedQuestion,
    materials: MaterialDNA[],
    _context?: QuestionContext,
  ): Promise<EngineeringAnswer> {
    const explanations: string[] = [];

    for (const material of materials) {
      const name = material.classification.tier6_productVariant?.name || 'Material';
      const chemistry = material.physical.tier7_baseChemistry;
      const perm = material.performance.tier13_permRating;
      const tensile = material.performance.tier14_tensileStrength;
      const elongation = material.performance.tier15_elongation;
      const thickness = material.physical.tier10_thicknessClass;
      const fire = material.physical.tier12_fireRating;

      const props: string[] = [`**${name}** Properties:`];

      if (chemistry) {
        props.push(`- Chemistry: ${chemistry.name} (${chemistry.code})`);
        props.push(`  - Thermoplastic: ${chemistry.isThermoplastic}`);
        props.push(`  - Elastomeric: ${chemistry.isElastomeric}`);
        props.push(`  - Joining: ${chemistry.joiningMethod}`);
      }

      if (perm) {
        props.push(`- Vapor Permeance: ${perm.perms} perms (Class ${perm.class})`);
        props.push(`  - Vapor Barrier: ${perm.vaporBarrier}`);
      }

      if (tensile) {
        props.push(`- Tensile Strength: ${tensile.psiMD} PSI (MD)`);
      }

      if (elongation) {
        props.push(`- Elongation: ${elongation.percentMD}% (MD)`);
      }

      if (thickness) {
        props.push(`- Thickness: ${thickness.nominalMils} mils`);
      }

      if (fire) {
        props.push(`- Fire Rating: Class ${fire.class}`);
      }

      explanations.push(props.join('\n'));
    }

    return {
      question: parsed.original,
      intent: parsed.intent,
      answer: `Properties for ${materials.length} material(s).`,
      explanation: explanations.join('\n\n'),
      materials,
      failureModes: [],
      compatibilityIssues: [],
      constraintViolations: [],
      recommendations: [],
      warnings: [],
      confidence: 0.9,
      sources: materials.map((m) => m.taxonomyCode).filter(Boolean),
    };
  }

  /**
   * Answer code compliance questions
   */
  private async answerCodeCompliance(
    parsed: ParsedQuestion,
    materials: MaterialDNA[],
    _context?: QuestionContext,
  ): Promise<EngineeringAnswer> {
    const explanations: string[] = [];
    const warnings: string[] = [];

    for (const material of materials) {
      const name = material.classification.tier6_productVariant?.name || 'Material';
      const codeRefs = material.engineering.tier20_codeReferences || [];
      const fire = material.physical.tier12_fireRating;

      explanations.push(`**${name}** Code Compliance:`);

      if (fire) {
        explanations.push(`- Fire Rating: Class ${fire.class}`);
        if (fire.fmApproval) explanations.push(`  - FM Approval: ${fire.fmApproval}`);
        if (fire.ulListing) explanations.push(`  - UL Listing: ${fire.ulListing}`);
      }

      if (codeRefs.length > 0) {
        explanations.push('- Code References:');
        for (const ref of codeRefs.slice(0, 5)) {
          const status = ref.compliant ? '✓' : '✗';
          explanations.push(`  ${status} ${ref.code} ${ref.section}: ${ref.requirement}`);
          if (!ref.compliant) {
            warnings.push(`Does not comply with ${ref.code} ${ref.section}`);
          }
        }
      } else {
        explanations.push('- No specific code references on file.');
      }
    }

    return {
      question: parsed.original,
      intent: parsed.intent,
      answer: `Code compliance for ${materials.length} material(s).`,
      explanation: explanations.join('\n'),
      materials,
      failureModes: [],
      compatibilityIssues: [],
      constraintViolations: [],
      recommendations: [],
      warnings,
      confidence: 0.85,
      sources: materials.map((m) => m.taxonomyCode).filter(Boolean),
    };
  }

  /**
   * Answer general questions
   */
  private async answerGeneral(
    parsed: ParsedQuestion,
    materials: MaterialDNA[],
    _context?: QuestionContext,
  ): Promise<EngineeringAnswer> {
    const explanations = materials.map((m) => {
      const name = m.classification.tier6_productVariant?.name || 'Unknown';
      const chem = m.physical.tier7_baseChemistry?.code || 'Unknown';
      const mfr = m.classification.tier5_manufacturer?.name || 'Unknown';
      return `**${name}** (${chem}) by ${mfr}`;
    });

    return {
      question: parsed.original,
      intent: parsed.intent,
      answer:
        materials.length > 0
          ? `Found ${materials.length} relevant material(s).`
          : 'No specific materials found matching your question.',
      explanation: explanations.join('\n') || 'Please provide more context or specify a material.',
      materials,
      failureModes: [],
      compatibilityIssues: [],
      constraintViolations: [],
      recommendations: [],
      warnings: [],
      confidence: 0.5,
      sources: materials.map((m) => m.taxonomyCode).filter(Boolean),
    };
  }

  /**
   * Get materials relevant to the parsed question
   */
  private async getRelevantMaterials(
    parsed: ParsedQuestion,
    context?: QuestionContext,
  ): Promise<MaterialDNA[]> {
    const materials: MaterialDNA[] = [];

    // Get from context
    if (context?.materialCode) {
      const material = await this.storage.get(context.materialCode);
      if (material) materials.push(material);
    }

    if (context?.materialCodes) {
      for (const code of context.materialCodes) {
        const material = await this.storage.get(code);
        if (material && !materials.find((m) => m.id === material.id)) {
          materials.push(material);
        }
      }
    }

    // Search by entities
    if (materials.length === 0) {
      const allMaterials = await this.storage.getAll();

      // Score and filter
      const scored = allMaterials.map((m) => ({
        material: m,
        score: this.scoreMaterial(m, parsed),
      }));

      // Sort by score and take top 5
      scored.sort((a, b) => b.score - a.score);
      const top = scored.filter((s) => s.score > 0).slice(0, 5);
      materials.push(...top.map((s) => s.material));
    }

    return materials;
  }

  /**
   * Score how relevant a material is to a parsed question
   */
  private scoreMaterial(material: MaterialDNA, parsed: ParsedQuestion): number {
    let score = 0;

    const searchable = [
      material.classification.tier6_productVariant?.name,
      material.classification.tier6_productVariant?.fullName,
      material.classification.tier5_manufacturer?.name,
      material.physical.tier7_baseChemistry?.name,
      material.physical.tier7_baseChemistry?.code,
      material.taxonomyCode,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    // Check keywords
    for (const keyword of parsed.keywords) {
      if (searchable.includes(keyword.toLowerCase())) {
        score += 2;
      }
    }

    // Check chemistries
    for (const chem of parsed.entities.chemistries) {
      if (material.physical.tier7_baseChemistry?.type?.toLowerCase() === chem.toLowerCase()) {
        score += 5;
      }
      if (material.physical.tier7_baseChemistry?.code?.toLowerCase() === chem.toLowerCase()) {
        score += 5;
      }
    }

    // Check materials
    for (const mat of parsed.entities.materials) {
      if (searchable.includes(mat.toLowerCase())) {
        score += 3;
      }
    }

    return score;
  }

  /**
   * Predict failure modes for a material
   */
  async predictFailures(
    materialCode: string,
    conditions?: EnvironmentConditions,
  ): Promise<FailurePrediction[]> {
    const material = await this.storage.get(materialCode);
    if (!material) return [];

    const predictions: FailurePrediction[] = [];
    const modes = material.engineering.tier17_failureModes || [];

    for (const mode of modes) {
      let probability = 0.3; // Base probability
      const riskFactors: string[] = [];

      // Adjust based on conditions
      if (conditions?.temperature !== undefined) {
        const tempRange = material.performance.tier16_temperatureRange;
        if (tempRange) {
          if (conditions.temperature < tempRange.minServiceF) {
            probability += 0.2;
            riskFactors.push('Temperature below service range');
          }
          if (conditions.temperature > tempRange.maxServiceF) {
            probability += 0.2;
            riskFactors.push('Temperature above service range');
          }
        }
      }

      if (conditions?.moisture === 'wet' || conditions?.moisture === 'submerged') {
        if (mode.category === 'moisture') {
          probability += 0.3;
          riskFactors.push('Wet conditions present');
        }
      }

      if (conditions?.exposure === 'full') {
        if (mode.category === 'uv') {
          probability += 0.2;
          riskFactors.push('Full UV exposure');
        }
      }

      predictions.push({
        failureMode: mode,
        probability: Math.min(probability, 0.95),
        riskFactors,
        prevention: mode.prevention.slice(0, 3),
      });
    }

    // Sort by probability
    predictions.sort((a, b) => b.probability - a.probability);

    return predictions;
  }

  /**
   * Check compatibility between two materials
   */
  async checkCompatibility(material1Code: string, material2Code: string): Promise<CompatibilityResult> {
    const mat1 = await this.storage.get(material1Code);
    const mat2 = await this.storage.get(material2Code);

    if (!mat1 || !mat2) {
      return {
        compatible: false,
        status: 'incompatible',
        materials: [material1Code, material2Code],
        issues: [],
        requirements: [],
        explanation: 'One or both materials not found.',
      };
    }

    const chem1 = mat1.physical.tier7_baseChemistry?.type;
    const chem2 = mat2.physical.tier7_baseChemistry?.type;

    const issues: CompatibilityEntry[] = [];
    const requirements: string[] = [];

    // Check mat1's matrix for mat2
    const matrix1 = mat1.engineering.tier18_compatibilityMatrix;
    if (matrix1) {
      const incompat = matrix1.incompatible?.find(
        (e) => e.chemistryType === chem2 || e.materialType.toLowerCase().includes(chem2?.toLowerCase() || ''),
      );
      if (incompat) issues.push(incompat);

      const conditional = matrix1.conditional?.find(
        (e) => e.chemistryType === chem2 || e.materialType.toLowerCase().includes(chem2?.toLowerCase() || ''),
      );
      if (conditional) {
        issues.push(conditional);
        if (conditional.requirement) requirements.push(conditional.requirement);
      }
    }

    // Also check kernel compatibility
    if (chem1 && chem2) {
      const kernelCheck = kernelCheckCompatibility(chem1, chem2);
      if (kernelCheck && !issues.find((i) => i.materialType === kernelCheck.materialType)) {
        issues.push(kernelCheck);
        if (kernelCheck.requirement) requirements.push(kernelCheck.requirement);
      }
    }

    const hasIncompatible = issues.some((i) => i.status === 'incompatible');
    const hasConditional = issues.some((i) => i.status === 'conditional');

    return {
      compatible: !hasIncompatible,
      status: hasIncompatible ? 'incompatible' : hasConditional ? 'conditional' : 'compatible',
      materials: [material1Code, material2Code],
      issues,
      requirements,
      explanation: hasIncompatible
        ? `${chem1} and ${chem2} are incompatible: ${issues[0]?.reason || 'See manufacturer data'}`
        : hasConditional
          ? `${chem1} and ${chem2} require precautions: ${requirements.join('; ')}`
          : `${chem1} and ${chem2} appear to be compatible.`,
    };
  }
}
