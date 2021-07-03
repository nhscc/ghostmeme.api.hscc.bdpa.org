import { AppError, makeNamedError } from 'named-app-errors';

export {
  AppError,
  FetchError,
  GuruMeditationError,
  HookError,
  KeyError,
  NotAuthorizedError,
  ValidationError,
  KeyTypeError as InvalidKeyError,
  NotFoundError as ItemNotFoundError,
  makeNamedError
} from 'named-app-errors';

// TODO: update named-app-errors with new naming paradigm:
// TODO:   - rename "XTypeError"s
// TODO:   - add InvalidIdError
// TODO:   - BC: rename "NotFoundError" to "ItemNotFoundError" and
// TODO:     "NotFoundError" now takes any message

export class NotFoundError extends AppError {
  constructor(message?: string) {
    super(message || 'resource not found');
  }
}

makeNamedError(NotFoundError, 'NotFoundError');

export class ActivityGenerationError extends AppError {
  constructor(message?: string) {
    super(message || 'activity generation failed');
  }
}

makeNamedError(ActivityGenerationError, 'ActivityGenerationError');

// * -- * \\

export class ActivitySimulationError extends AppError {
  constructor(message?: string) {
    super(message || 'activity simulation failed');
  }
}

makeNamedError(ActivitySimulationError, 'ActivitySimulationError');

// * -- * \\

export class InvalidIdError<T = string | number> extends AppError {
  constructor(id?: T) {
    super(
      id
        ? `expected valid ObjectId instance, got "${id}" instead`
        : 'invalid ObjectId encountered'
    );
  }
}

makeNamedError(InvalidIdError, 'InvalidIdError');
