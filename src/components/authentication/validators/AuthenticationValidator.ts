import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

import { ajvDefaultOptions } from '../../../configs/ValidationConfigs';
import { SignIn } from '../interfaces/SignIn';
import { SignUp } from '../interfaces/SignUp';
import { signInSchema, signUpSchema } from '../schemas/AuthenticationSchema';

const ajv = new Ajv({ ...ajvDefaultOptions, $data: true });
addFormats(ajv, { mode: 'fast', formats: ['email', 'password'], keywords: true });

export const signUp: ValidateFunction<SignUp> = ajv.compile(signUpSchema);

export const signIn: ValidateFunction<SignIn> = ajv.compile(signInSchema);
