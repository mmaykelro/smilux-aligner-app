import * as migration_20260313_170237 from './20260313_170237';
import * as migration_20260408_202117 from './20260408_202117';
import * as migration_20260408_203941 from './20260408_203941';
import * as migration_20260408_212146 from './20260408_212146';
import * as migration_20260408_213032 from './20260408_213032';
import * as migration_20260428_115649 from './20260428_115649';
import * as migration_20260428_120023 from './20260428_120023';
import * as migration_20260428_203240 from './20260428_203240';
import * as migration_20260429_233639 from './20260429_233639';
import * as migration_20260710_191649_add_refinements from './20260710_191649_add_refinements';

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
    name: '20260408_213032',
  },
  {
    up: migration_20260428_115649.up,
    down: migration_20260428_115649.down,
    name: '20260428_115649',
  },
  {
    up: migration_20260428_120023.up,
    down: migration_20260428_120023.down,
    name: '20260428_120023',
  },
  {
    up: migration_20260428_203240.up,
    down: migration_20260428_203240.down,
    name: '20260428_203240',
  },
  {
    up: migration_20260429_233639.up,
    down: migration_20260429_233639.down,
    name: '20260429_233639',
  },
  {
    up: migration_20260710_191649_add_refinements.up,
    down: migration_20260710_191649_add_refinements.down,
    name: '20260710_191649_add_refinements'
  },
];
