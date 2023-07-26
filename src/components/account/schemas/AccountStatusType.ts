const base = {
  status: { type: 'string' },
  id: { type: 'integer', minimum: 1 },
};

export const modelSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['status'],
  properties: base,
};
