import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import IncidentModel from '@/models/Incident';
import { verifyUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await verifyUser(req);

    const body = await req.json();
    const { incidentId, status, note } = body;

    if (!incidentId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Incident ID is required',
        },
        { status: 400 }
      );
    }

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

    // Update status if provided
    if (status) {
      const validStatuses = ['Open', 'In Progress', 'Resolved'];
      if (validStatuses.includes(status)) {
        incident.status = status as 'Open' | 'In Progress' | 'Resolved';
        if (status === 'Resolved' && !incident.resolvedAt) {
          incident.resolvedAt = new Date();
        }
      }
    }

    // Add note if provided
    if (note) {
      incident.notes.push({
        analyst: user.id,
        note: note,
        timestamp: new Date(),
      });
    }

    await incident.save();

    const updatedIncident = await IncidentModel.findById(incidentId)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: 'Incident updated successfully',
        incident: updatedIncident,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating incident:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update incident',
        error: error.message,
      },
      { status: 500 }
    );
  }
}


