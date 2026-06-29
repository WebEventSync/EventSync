import { NextRequest, NextResponse } from 'next/server';
import { AppError, AppErrorCode } from '../types';

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function created<T>(data: T): NextResponse {
  return ok(data, 201);
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message: string): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

export function unauthorized(): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Token manquant ou invalide' },
    { status: 401 },
  );
}

export function notFound(message: string): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

export function conflict(message: string): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 409 });
}

export function serverError(): NextResponse {
  return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
}

// ─── Mapping erreurs métier → HTTP ───────────────────────────────────────────

const ERROR_MAP: Record<AppErrorCode, () => NextResponse> = {
  SESSION_NOT_FOUND:        () => notFound('Session introuvable'),
  ROOM_NOT_FOUND:           () => notFound('Salle introuvable'),
  EVENT_NOT_FOUND:          () => notFound('Événement introuvable'),
  SPEAKER_NOT_FOUND:        () => notFound('Intervenant introuvable'),
  ROOM_HAS_SESSIONS:        () => conflict('Impossible de supprimer : des sessions sont liées à cette salle'),
  SESSION_NEEDS_ONE_SPEAKER: () => conflict('Une session doit avoir au moins un intervenant'),
  SESSION_START_AFTER_END:  () => badRequest('L’heure de début doit être antérieure à l’heure de fin.'),
  SESSION_START_EQUALS_END: () => badRequest('La session doit durer au moins un instant.'),
  SESSION_OUTSIDE_EVENT_BOUNDS: () => badRequest('La session doit se dérouler entre le début et la fin de l’événement.'),
  SESSION_ROOM_OVERLAP:     () => conflict('La session chevauche une autre session dans cette salle.'),
  EVENT_START_AFTER_END:    () => badRequest('La date de début doit être antérieure à la date de fin de l’événement.'),
  EVENT_START_EQUALS_END:   () => badRequest('L’événement doit durer au moins un instant.'),
  EVENT_NOT_FOUND_FOR_UPDATE: () => notFound('Événement introuvable pour la mise à jour'),
};

export function handleError(error: unknown): NextResponse {
  if (error instanceof AppError && ERROR_MAP[error.code]) {
    return ERROR_MAP[error.code]();
  }
  console.error('[API Error]', error);
  return serverError();
}

// ─── Auth admin ───────────────────────────────────────────────────────────────

export function requireAdmin(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;

  const token = authHeader.split(' ')[1];
  return token.length > 0;

}

// ─── Validation body ──────────────────────────────────────────────────────────

export function validateCreateSession(body: Record<string, unknown>): string | null {
  const errors: string[] = [];
  const { title, startTime, endTime, roomId } = body;

  if (!title || typeof title !== 'string') errors.push('title est requis');
  if (!startTime) errors.push('startTime est requis (ISO 8601)');
  if (!endTime) errors.push('endTime est requis (ISO 8601)');
  if (!roomId) errors.push('roomId est requis');

  if (startTime && endTime && new Date(startTime as string) >= new Date(endTime as string)) {
    errors.push('startTime doit être antérieur à endTime');
  }

  return errors.length > 0 ? errors.join(', ') : null;
}

export function validateCreateRoom(body: Record<string, unknown>): string | null {
  const { name } = body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return 'name est requis';
  }
  return null;
}