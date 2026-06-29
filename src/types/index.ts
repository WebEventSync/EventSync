export interface CreateRoomDto {
  name: string;
}

export interface UpdateRoomDto {
  name?: string;
  capacity: number
}

export interface CreateSessionDto {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  roomId: string;
  speakerIds?: string[];
}

export interface UpdateSessionDto {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  roomId?: string;
  eventId?: string,
  speakerIds?: string[]
}

export interface SessionFilters {
  live?: boolean;
  roomId?: string;
}

export type AppErrorCode =
  | 'SESSION_NOT_FOUND'
  | 'ROOM_NOT_FOUND'
  | 'EVENT_NOT_FOUND'
  | 'SPEAKER_NOT_FOUND'
  | 'ROOM_HAS_SESSIONS'
  | 'SESSION_NEEDS_ONE_SPEAKER'
  // Validations logiques – dates de session
  | 'SESSION_START_AFTER_END'
  | 'SESSION_START_EQUALS_END'
  | 'SESSION_OUTSIDE_EVENT_BOUNDS'
  | 'SESSION_ROOM_OVERLAP'
  // Validations logiques – dates d'event
  | 'EVENT_START_AFTER_END'
  | 'EVENT_START_EQUALS_END'
  // Validations logiques – event update
  | 'EVENT_NOT_FOUND_FOR_UPDATE';

export class AppError extends Error {
  constructor(public code: AppErrorCode) {
    super(code);
    this.name = 'AppError';
  }
}