import { NextResponse } from 'next/server';
import { checkCompatibility as kernelCheckCompatibility } from '@construction-dna/kernel';

export async function POST(request: Request) {
  try {
    const { material1, material2 } = await request.json();

    if (!material1 || !material2) {
      return NextResponse.json(
        { error: 'Both materials are required' },
        { status: 400 }
      );
    }

    // Use kernel's compatibility check
    const entry = kernelCheckCompatibility(material1, material2);

    if (entry) {
      return NextResponse.json({
        compatible: entry.status !== 'incompatible',
        status: entry.status,
        materials: [material1, material2],
        issues: [entry],
        requirements: entry.requirement ? [entry.requirement] : [],
        explanation: entry.reason,
      });
    }

    // No specific rule found - assume compatible
    return NextResponse.json({
      compatible: true,
      status: 'compatible',
      materials: [material1, material2],
      issues: [],
      requirements: [],
      explanation: `No known compatibility issues between ${material1} and ${material2}. Always verify with manufacturer specifications.`,
    });
  } catch (error) {
    console.error('Error checking compatibility:', error);
    return NextResponse.json(
      { error: 'Failed to check compatibility' },
      { status: 500 }
    );
  }
}
