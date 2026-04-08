import * as migration_20260313_170237 from './20260313_170237';
import * as migration_20260408_202117 from './20260408_202117';
import * as migration_20260408_203941 from './20260408_203941';
import * as migration_20260408_212146 from './20260408_212146';
import * as migration_20260408_213032 from './20260408_213032';

export const migrations = [
  {
    up: migration_20260313_170237.up,
    down: migration_20260313_170237.down,
    name: '20260313_170237',
  },
  {
    up: migration_20260408_202117.up,
    down: migration_20260408_202117.down,
    name: '20260408_202117',
  },
  {
    up: migration_20260408_203941.up,
    down: migration_20260408_203941.down,
    name: '20260408_203941',
  },
  {
    up: migration_20260408_212146.up,
    down: migration_20260408_212146.down,
    name: '20260408_212146',
  },
  {
    up: migration_20260408_213032.up,
    down: migration_20260408_213032.down,
    name: '20260408_213032'
  },
];
