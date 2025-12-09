import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import IncidentModel from '@/models/Incident';
import { verifyAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    await verifyAdmin(req); // Only admins can assign incidents

    const body = await req.json();
    const { incidentId, analystId } = body;

    if (!incidentId || !analystId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Incident ID and Analyst ID are required',
        },
        { status: 400 }
      );
    }

    const user = await verifyAdmin(req);
    const incident = await IncidentModel.findById(incidentId);

    if (!incident) {
      return NextResponse.json(
        {
          success: false,
          message: 'Incident not found',
        },
        { status: 404 }
      );
    }

    incident.assignedTo = analystId;
    incident.assignedBy = user.id;
    if (incident.status === 'Open') {
      incident.status = 'In Progress';
    }
    await incident.save();

    const populatedIncident = await IncidentModel.findById(incidentId)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: 'Incident assigned successfully',
        incident: populatedIncident,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error assigning incident:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to assign incident',
        error: error.message,
      },
      { status: 500 }
    );
  }
}


