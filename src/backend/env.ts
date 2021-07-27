import { parse as parseAsBytes } from 'bytes';
import { isServer } from 'is-server-side';
import { AppError } from 'universe/backend/error';

const HTTP2_METHODS = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  'CONNECT',
  'OPTIONS',
  'TRACE',
  'PATCH'
];

// TODO: unit test env.ts and all other backend abstraction layers, perhaps in
// TODO: own files in new subfolder

const envToArray = (envVal: string) => {
  return envVal
    .replace(/[^A-Za-z0-9=.<>,-^~_*]+/g, '')
    .split(',')
    .filter(Boolean);
};

export function getEnv(loud = false) {
  const env = {
    NODE_ENV:
      process.env.APP_ENV || process.env.NODE_ENV || process.env.BABEL_ENV || 'unknown',
    MONGODB_URI: (process.env.MONGODB_URI || '').toString(),
    MONGODB_MS_PORT: !!process.env.MONGODB_MS_PORT
      ? Number(process.env.MONGODB_MS_PORT)
      : null,
    DISABLED_API_VERSIONS: !!process.env.DISABLED_API_VERSIONS
      ? envToArray(process.env.DISABLED_API_VERSIONS.toLowerCase())
      : [],
    RESULTS_PER_PAGE: Number(process.env.RESULTS_PER_PAGE),
    IGNORE_RATE_LIMITS:
      !!process.env.IGNORE_RATE_LIMITS && process.env.IGNORE_RATE_LIMITS !== 'false',
    LOCKOUT_ALL_KEYS:
      !!process.env.LOCKOUT_ALL_KEYS && process.env.LOCKOUT_ALL_KEYS !== 'false',
    DISALLOWED_METHODS: !!process.env.DISALLOWED_METHODS
      ? envToArray(process.env.DISALLOWED_METHODS.toUpperCase())
      : [],
    REQUESTS_PER_CONTRIVED_ERROR: Number(process.env.REQUESTS_PER_CONTRIVED_ERROR),
    MAX_CONTENT_LENGTH_BYTES: parseAsBytes(
      process.env.MAX_CONTENT_LENGTH_BYTES ?? '-Infinity'
    ),
    EXTERNAL_SCRIPTS_MONGODB_URI: (
      process.env.EXTERNAL_SCRIPTS_MONGODB_URI ||
      process.env.MONGODB_URI ||
      ''
    ).toString(),
    EXTERNAL_SCRIPTS_BE_VERBOSE:
      !!process.env.EXTERNAL_SCRIPTS_BE_VERBOSE &&
      process.env.EXTERNAL_SCRIPTS_BE_VERBOSE !== 'false',
    BAN_HAMMER_WILL_BE_CALLED_EVERY_SECONDS: !!process.env
      .BAN_HAMMER_WILL_BE_CALLED_EVERY_SECONDS
      ? Number(process.env.BAN_HAMMER_WILL_BE_CALLED_EVERY_SECONDS)
      : null,
    BAN_HAMMER_MAX_REQUESTS_PER_WINDOW: !!process.env.BAN_HAMMER_MAX_REQUESTS_PER_WINDOW
      ? Number(process.env.BAN_HAMMER_MAX_REQUESTS_PER_WINDOW)
      : null,
    BAN_HAMMER_RESOLUTION_WINDOW_SECONDS: !!process.env
      .BAN_HAMMER_RESOLUTION_WINDOW_SECONDS
      ? Number(process.env.BAN_HAMMER_RESOLUTION_WINDOW_SECONDS)
      : null,
    BAN_HAMMER_DEFAULT_BAN_TIME_MINUTES: !!process.env.BAN_HAMMER_DEFAULT_BAN_TIME_MINUTES
      ? Number(process.env.BAN_HAMMER_DEFAULT_BAN_TIME_MINUTES)
      : null,
    BAN_HAMMER_RECIDIVISM_PUNISH_MULTIPLIER: !!process.env
      .BAN_HAMMER_RECIDIVISM_PUNISH_MULTIPLIER
      ? Number(process.env.BAN_HAMMER_RECIDIVISM_PUNISH_MULTIPLIER)
      : null,
    PRUNE_DATA_MAX_LOGS: !!process.env.PRUNE_DATA_MAX_LOGS
      ? Number(process.env.PRUNE_DATA_MAX_LOGS)
      : null,
    HYDRATE_DB_ON_STARTUP:
      !!process.env.HYDRATE_DB_ON_STARTUP &&
      process.env.HYDRATE_DB_ON_STARTUP !== 'false',
    API_ROOT_URI: (process.env.API_ROOT_URI || '').toString(),
    DEBUG_INSPECTING: !!process.env.VSCODE_INSPECTOR_OPTIONS,
    VERCEL_REGION: (process.env.VERCEL_REGION || 'unknown').toString(),
    TZ: (process.env.TZ || 'unknown').toString(),
    VERCEL_GIT_COMMIT_MESSAGE: (
      process.env.VERCEL_GIT_COMMIT_MESSAGE || 'unknown'
    ).toString()
  };

  if (loud && env.NODE_ENV == 'development') {
    /* eslint-disable-next-line no-console */
    console.info(`debug - ${env}`);
  }

  const mustBeGtZero = [
    env.RESULTS_PER_PAGE,
    env.REQUESTS_PER_CONTRIVED_ERROR,
    env.MAX_CONTENT_LENGTH_BYTES
  ];

  // ? Typescript troubles
  const NODE_X: string = env.NODE_ENV;
  const errors = [];

  if (NODE_X == 'unknown') errors.push(`bad NODE_ENV, saw "${NODE_X}"`);

  if (isServer()) {
    if (env.MONGODB_URI === '') errors.push(`bad MONGODB_URI, saw "${env.MONGODB_URI}"`);

    mustBeGtZero.forEach(
      (v) =>
        (typeof v != 'number' || isNaN(v) || v < 0) &&
        errors.push(`bad value "${v}", expected a non-negative number`)
    );

    env.DISALLOWED_METHODS.forEach(
      (method) =>
        !HTTP2_METHODS.includes(method) &&
        errors.push(
          `unknown method "${method}", must be one of: ${HTTP2_METHODS.join(',')}`
        )
    );

    if (env.MONGODB_MS_PORT && env.MONGODB_MS_PORT <= 1024) {
      errors.push(`optional environment variable MONGODB_MS_PORT must be > 1024`);
    }
  }

  if (errors.length) {
    throw new AppError(`illegal environment detected:\n - ${errors.join('\n - ')}`);
  } else return env;
}
