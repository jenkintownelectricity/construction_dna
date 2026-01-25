/**
 * TAXONOMY TREE BUILDER
 *
 * Builds and manages the 20-tier taxonomy tree from stored materials
 */

import type { MaterialDNA } from '@construction-dna/kernel';
import { DIVISIONS, CATEGORIES, MANUFACTURERS } from '@construction-dna/kernel';
import type { StorageAdapter } from '../storage';
import type { TaxonomyNode, TaxonomyTree } from './types';

/**
 * Builds taxonomy tree from materials
 */
export class TaxonomyTreeBuilder {
  private storage?: StorageAdapter;

  constructor(storage?: StorageAdapter) {
    this.storage = storage;
  }

  /**
   * Build taxonomy tree from an array of materials (synchronous)
   */
  buildFromMaterials(materials: MaterialDNA[], maxTier: number = 6): TaxonomyTree {
    const root: TaxonomyNode = {
      tier: 0,
      code: 'ROOT',
      name: 'Construction Materials',
      path: [],
      children: [],
      materialCount: materials.length,
      isLeaf: false,
      description: 'All materials in the DNA library',
    };

    // Build Tier 1: Divisions
    const divisionGroups = this.groupBy(
      materials,
      (m) => m.classification.tier1_division?.code,
    );

    for (const [divCode, divMaterials] of Object.entries(divisionGroups)) {
      if (!divCode) continue;

      const division = DIVISIONS[divCode];
      const divisionNode: TaxonomyNode = {
        tier: 1,
        code: divCode,
        name: division?.name || divCode,
        path: [divCode],
        children: [],
        materialCount: divMaterials.length,
        isLeaf: maxTier === 1,
        description: division?.description,
      };

      if (maxTier >= 2) {
        this.buildCategoryTier(divisionNode, divMaterials, maxTier);
      }

      root.children.push(divisionNode);
    }

    this.sortChildren(root);

    return {
      root,
      totalNodes: this.countNodes(root),
      totalMaterials: materials.length,
      maxDepth: maxTier,
      builtAt: new Date().toISOString(),
    };
  }

  /**
   * Build the complete taxonomy tree (async, uses storage)
   */
  async buildTree(maxTier: number = 6): Promise<TaxonomyTree> {
    if (!this.storage) {
      throw new Error('Storage adapter required for async buildTree');
    }
    const materials = await this.storage.getAll();
    return this.buildFromMaterials(materials, maxTier);
  }

  /**
   * Build Tier 2: Categories
   */
  private buildCategoryTier(
    parent: TaxonomyNode,
    materials: MaterialDNA[],
    maxTier: number,
  ): void {
    const groups = this.groupBy(
      materials,
      (m) => m.classification.tier2_category?.code,
    );

    for (const [code, groupMaterials] of Object.entries(groups)) {
      if (!code) continue;

      const category = CATEGORIES[code];
      const node: TaxonomyNode = {
        tier: 2,
        code,
        name: category?.name || code,
        path: [...parent.path, code],
        children: [],
        materialCount: groupMaterials.length,
        isLeaf: maxTier === 2,
        description: category?.description,
      };

      if (maxTier >= 3) {
        this.buildAssemblyTypeTier(node, groupMaterials, maxTier);
      }

      parent.children.push(node);
    }

    this.sortChildren(parent);
  }

  /**
   * Build Tier 3: Assembly Types
   */
  private buildAssemblyTypeTier(
    parent: TaxonomyNode,
    materials: MaterialDNA[],
    maxTier: number,
  ): void {
    const groups = this.groupBy(
      materials,
      (m) => m.classification.tier3_assemblyType?.code,
    );

    for (const [code, groupMaterials] of Object.entries(groups)) {
      if (!code) continue;

      const node: TaxonomyNode = {
        tier: 3,
        code,
        name: this.getMaterialValue(groupMaterials[0], 'classification.tier3_assemblyType.name') || code,
        path: [...parent.path, code],
        children: [],
        materialCount: groupMaterials.length,
        isLeaf: maxTier === 3,
      };

      if (maxTier >= 4) {
        this.buildConditionTier(node, groupMaterials, maxTier);
      }

      parent.children.push(node);
    }

    this.sortChildren(parent);
  }

  /**
   * Build Tier 4: Conditions
   */
  private buildConditionTier(
    parent: TaxonomyNode,
    materials: MaterialDNA[],
    maxTier: number,
  ): void {
    const groups = this.groupBy(
      materials,
      (m) => m.classification.tier4_condition?.code,
    );

    for (const [code, groupMaterials] of Object.entries(groups)) {
      if (!code) continue;

      const node: TaxonomyNode = {
        tier: 4,
        code,
        name: this.getMaterialValue(groupMaterials[0], 'classification.tier4_condition.name') || code,
        path: [...parent.path, code],
        children: [],
        materialCount: groupMaterials.length,
        isLeaf: maxTier === 4,
      };

      if (maxTier >= 5) {
        this.buildManufacturerTier(node, groupMaterials, maxTier);
      }

      parent.children.push(node);
    }

    this.sortChildren(parent);
  }

  /**
   * Build Tier 5: Manufacturers
   */
  private buildManufacturerTier(
    parent: TaxonomyNode,
    materials: MaterialDNA[],
    maxTier: number,
  ): void {
    const groups = this.groupBy(
      materials,
      (m) => m.classification.tier5_manufacturer?.code,
    );

    for (const [code, groupMaterials] of Object.entries(groups)) {
      if (!code) continue;

      const manufacturer = MANUFACTURERS[code];
      const node: TaxonomyNode = {
        tier: 5,
        code,
        name: manufacturer?.name || code,
        path: [...parent.path, code],
        children: [],
        materialCount: groupMaterials.length,
        isLeaf: maxTier === 5,
      };

      if (maxTier >= 6) {
        this.buildProductTier(node, groupMaterials);
      }

      parent.children.push(node);
    }

    this.sortChildren(parent);
  }

  /**
   * Build Tier 6: Products (leaf nodes for classification)
   */
  private buildProductTier(parent: TaxonomyNode, materials: MaterialDNA[]): void {
    for (const material of materials) {
      const code = material.classification.tier6_productVariant?.code;
      if (!code) continue;

      const node: TaxonomyNode = {
        tier: 6,
        code,
        name: material.classification.tier6_productVariant?.name || code,
        path: [...parent.path, code],
        children: [],
        materialCount: 1,
        isLeaf: true,
        description: material.classification.tier6_productVariant?.fullName,
      };

      parent.children.push(node);
    }

    this.sortChildren(parent);
  }

  /**
   * Group materials by a key function
   */
  private groupBy(
    materials: MaterialDNA[],
    keyFn: (m: MaterialDNA) => string | undefined,
  ): Record<string, MaterialDNA[]> {
    const groups: Record<string, MaterialDNA[]> = {};

    for (const m of materials) {
      const key = keyFn(m);
      if (!key) continue;
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    }

    return groups;
  }

  /**
   * Get nested value from material
   */
  private getMaterialValue(material: MaterialDNA, path: string): string | undefined {
    return path.split('.').reduce((obj: unknown, key) => {
      if (obj && typeof obj === 'object') {
        return (obj as Record<string, unknown>)[key];
      }
      return undefined;
    }, material) as string | undefined;
  }

  /**
   * Sort children alphabetically by code
   */
  private sortChildren(node: TaxonomyNode): void {
    node.children.sort((a, b) => a.code.localeCompare(b.code));
  }

  /**
   * Count total nodes in tree
   */
  private countNodes(node: TaxonomyNode): number {
    return 1 + node.children.reduce((sum, child) => sum + this.countNodes(child), 0);
  }
}
