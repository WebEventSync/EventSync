export interface CreateRoomDto {
  name: string;
  capacity?: number;
}

export interface UpdateRoomDto {
  name?: string;
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
  | 'SESSION_NEEDS_ONE_SPEAKER';

export class AppError extends Error {
  constructor(public code: AppErrorCode) {
    super(code);
    this.name = 'AppError';
  }
}