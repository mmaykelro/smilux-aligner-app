import * as migration_20260313_120828_baseline from './20260313_120828_baseline';

export const migrations = [
  {
    up: migration_20260313_120828_baseline.up,
    down: migration_20260313_120828_baseline.down,
    name: '20260313_120828_baseline'
  },
];
