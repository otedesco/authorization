import { ajvDefaultOptions } from '@configs/ValidationConfigs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { createSchema } from '../schemas/AccountSchema';

const ajv = new Ajv({ ...ajvDefaultOptions, $data: true });

addFormats(ajv, ['email']);

export const create = ajv.compile(createSchema);
