/**
 * Migration: Add spec sheet URLs to existing materials
 *
 * This runs automatically on store hydration to add manufacturer
 * spec sheet URLs to materials that don't have them yet.
 */

const SPEC_URLS: Record<string, { specSheetUrl: string; productPageUrl: string }> = {
  'dna_001_bituthene_3000': {
    specSheetUrl: 'https://gcpat.com/en/solutions/products/bituthene-post-applied-waterproofing/bituthene-3000',
    productPageUrl: 'https://gcpat.com/en/solutions/products/bituthene-post-applied-waterproofing'
  },
  'dna_002_carlisle_tpo_60': {
    specSheetUrl: 'https://www.carlislesyntec.com/en/products/tpo/sure-weld-tpo',
    productPageUrl: 'https://www.carlislesyntec.com/en/products/tpo'
  },
  'dna_003_firestone_epdm_60': {
    specSheetUrl: 'https://www.firestonebpco.com/roofing/rubbergard-epdm/',
    productPageUrl: 'https://www.firestonebpco.com/roofing/rubbergard-epdm/'
  },
  'dna_004_sika_sarnafil_g476': {
    specSheetUrl: 'https://usa.sika.com/en/construction/roofing/pvc-single-ply/sarnafil-g-410.html',
    productPageUrl: 'https://usa.sika.com/en/construction/roofing/pvc-single-ply.html'
  },
  'dna_005_gaf_everguard_tpo': {
    specSheetUrl: 'https://www.gaf.com/en-us/roofing-products/commercial-roofing-products/single-ply/tpo/everguard-tpo-roofing-membrane',
    productPageUrl: 'https://www.gaf.com/en-us/roofing-products/commercial-roofing-products/single-ply/tpo'
  },
  'dna_006_jm_tpo_60': {
    specSheetUrl: 'https://www.jm.com/en/roofing-systems/commercial-roofing/single-ply/tpo-roofing-systems/',
    productPageUrl: 'https://www.jm.com/en/roofing-systems/commercial-roofing/single-ply/tpo-roofing-systems/'
  },
  'dna_007_gaf_liberty_sbs': {
    specSheetUrl: 'https://www.gaf.com/en-us/roofing-products/commercial-roofing-products/modified-bitumen/liberty',
    productPageUrl: 'https://www.gaf.com/en-us/roofing-products/commercial-roofing-products/modified-bitumen'
  },
  'dna_008_soprema_sopralene': {
    specSheetUrl: 'https://www.soprema.us/en/products/roofing/modified-bitumen/sopralene-flam-180-gr',
    productPageUrl: 'https://www.soprema.us/en/products/roofing/modified-bitumen'
  },
  'dna_009_preprufe_300r': {
    specSheetUrl: 'https://gcpat.com/en/solutions/products/preprufe-pre-applied-waterproofing/preprufe-300r',
    productPageUrl: 'https://gcpat.com/en/solutions/products/preprufe-pre-applied-waterproofing'
  },
  'dna_010_bituthene_4000': {
    specSheetUrl: 'https://gcpat.com/en/solutions/products/bituthene-post-applied-waterproofing/bituthene-4000',
    productPageUrl: 'https://gcpat.com/en/solutions/products/bituthene-post-applied-waterproofing'
  },
  'dna_011_tremco_vulkem_116': {
    specSheetUrl: 'https://www.tremcosealants.com/products/vulkem-116',
    productPageUrl: 'https://www.tremcosealants.com/products/vulkem-116'
  },
  'dna_012_sikalastic_621tc': {
    specSheetUrl: 'https://usa.sika.com/en/construction/waterproofing/traffic-coatings/sikalastic-621-tc.html',
    productPageUrl: 'https://usa.sika.com/en/construction/waterproofing/traffic-coatings.html'
  },
  'dna_013_henry_790': {
    specSheetUrl: 'https://www.henry.com/commercial/air-barriers/air-bloc-790-11',
    productPageUrl: 'https://www.henry.com/commercial/air-barriers'
  },
  'dna_014_prosoco_cat5': {
    specSheetUrl: 'https://prosoco.com/products/cat-5/',
    productPageUrl: 'https://prosoco.com/products/air-water-barriers/'
  },
  'dna_015_perm_a_barrier': {
    specSheetUrl: 'https://gcpat.com/en/solutions/products/perm-a-barrier-air-barrier-system/perm-a-barrier-nps',
    productPageUrl: 'https://gcpat.com/en/solutions/products/perm-a-barrier-air-barrier-system'
  },
  'dna_016_polyiso_2in': {
    specSheetUrl: 'https://www.polyiso.org/',
    productPageUrl: 'https://www.polyiso.org/'
  },
  'dna_017_eps_2in': {
    specSheetUrl: 'https://www.epsindustry.org/building-construction',
    productPageUrl: 'https://www.epsindustry.org/'
  },
  'dna_018_dow_thermax': {
    specSheetUrl: 'https://www.dow.com/en-us/pdp.thermax-sheathing.04033255z.html',
    productPageUrl: 'https://www.dow.com/en-us/market/mkt-building-construction/sub-build-wall-systems.html'
  },
  'dna_019_cetco_voltex': {
    specSheetUrl: 'https://www.cetco.com/products/voltex',
    productPageUrl: 'https://www.cetco.com/products/voltex'
  },
  'dna_020_durolast_pvc': {
    specSheetUrl: 'https://www.duro-last.com/products/membrane',
    productPageUrl: 'https://www.duro-last.com/products'
  },
  'dna_021_versico_pvc': {
    specSheetUrl: 'https://www.versico.com/products/pvc-membranes/versiflex',
    productPageUrl: 'https://www.versico.com/products/pvc-membranes'
  },
  'dna_022_ccw_705': {
    specSheetUrl: 'https://www.carlisleccw.com/products/ccw-705',
    productPageUrl: 'https://www.carlisleccw.com/products/fluid-applied-below-grade'
  },
  'dna_023_hydroduct_660': {
    specSheetUrl: 'https://gcpat.com/en/solutions/products/hydroduct-drainage-composites/hydroduct-660',
    productPageUrl: 'https://gcpat.com/en/solutions/products/hydroduct-drainage-composites'
  },
  'dna_024_tremply_tbs': {
    specSheetUrl: 'https://www.tremcoroofing.com/products/built-up-roofing/tremply-polyester',
    productPageUrl: 'https://www.tremcoroofing.com/products/built-up-roofing'
  },
  'dna_025_iko_torchflex': {
    specSheetUrl: 'https://www.iko.com/comm/products/modified-bitumen/torchflex/',
    productPageUrl: 'https://www.iko.com/comm/products/modified-bitumen/'
  },
  'dna_026_polyguard_650': {
    specSheetUrl: 'https://www.polyguard.com/products/architectural/below-grade-waterproofing/polyguard-650/',
    productPageUrl: 'https://www.polyguard.com/products/architectural/below-grade-waterproofing/'
  },
  'dna_027_sikaflex_1a': {
    specSheetUrl: 'https://usa.sika.com/en/construction/sealing-bonding/sikaflex/sikaflex-1a.html',
    productPageUrl: 'https://usa.sika.com/en/construction/sealing-bonding.html'
  },
  'dna_028_carlisle_tpo_80': {
    specSheetUrl: 'https://www.carlislesyntec.com/en/products/tpo/sure-weld-tpo',
    productPageUrl: 'https://www.carlislesyntec.com/en/products/tpo'
  },
  'dna_029_firestone_epdm_45': {
    specSheetUrl: 'https://www.firestonebpco.com/roofing/rubbergard-epdm/',
    productPageUrl: 'https://www.firestonebpco.com/roofing/rubbergard-epdm/'
  },
  'dna_030_mfm_windowwrap': {
    specSheetUrl: 'https://www.mfmbp.com/product/windowwrap-psx-20/',
    productPageUrl: 'https://www.mfmbp.com/products/window-door-flashing/'
  }
};

/**
 * Get spec URLs for a material ID
 */
export function getSpecUrls(materialId: string): { specSheetUrl: string; productPageUrl: string } | undefined {
  return SPEC_URLS[materialId];
}

/**
 * Migrate materials to add spec sheet URLs
 * Idempotent - safe to run multiple times
 */
export function migrateAddSpecUrls(materials: Record<string, any>): {
  materials: Record<string, any>;
  updatedCount: number;
} {
  let updatedCount = 0;
  const updated = { ...materials };

  Object.entries(updated).forEach(([id, material]) => {
    const urls = SPEC_URLS[id];
    if (!urls) return;

    // Ensure classification.tier6_productVariant exists
    if (!material.classification) {
      material.classification = {};
    }
    if (!material.classification.tier6_productVariant) {
      material.classification.tier6_productVariant = {};
    }

    const tier6 = material.classification.tier6_productVariant;

    // Only update if URLs are missing (idempotent)
    if (!tier6.specSheetUrl || !tier6.productPageUrl) {
      tier6.specSheetUrl = urls.specSheetUrl;
      tier6.productPageUrl = urls.productPageUrl;
      updatedCount++;
    }
  });

  return { materials: updated, updatedCount };
}

/**
 * Check if migration is needed
 */
export function needsMigration(materials: Record<string, any>): boolean {
  for (const [id, material] of Object.entries(materials)) {
    if (SPEC_URLS[id]) {
      const tier6 = material?.classification?.tier6_productVariant;
      if (!tier6?.specSheetUrl || !tier6?.productPageUrl) {
        return true;
      }
    }
  }
  return false;
}

export { SPEC_URLS };
