import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import IncidentModel from '@/models/Incident';
import { AttackLogModel } from '@/models/AttackLog';
import { verifyUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await verifyUser(req);

    const body = await req.json();
    const { logIds, attackType, severity, sourceIP, description, remediationSuggestions } = body;

    // Generate unique incident ID
    const incidentID = `INC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Normalize severity
    const normalizedSeverity = severity
      ? severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase()
      : 'Medium';

    // Validate severity enum
    const validSeverities = ['Low', 'Medium', 'High', 'Critical'];
    const finalSeverity = validSeverities.includes(normalizedSeverity)
      ? normalizedSeverity
      : 'Medium';

    // Create incident
    const newIncident = await IncidentModel.create({
      incidentID,
      logIds: logIds || [],
      attackType: attackType || 'Unknown',
      severity: finalSeverity as 'Low' | 'Medium' | 'High' | 'Critical',
      status: 'Open',
      sourceIP: sourceIP || 'Unknown',
      description: description || '',
      remediationSuggestions: remediationSuggestions || [],
      assignedBy: user.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Incident created successfully',
        incident: newIncident,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating incident:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create incident',
        error: error.message,
      },
      { status: 500 }
    );
  }
}


