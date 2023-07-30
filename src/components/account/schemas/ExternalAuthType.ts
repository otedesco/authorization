const base = {
  type: { type: "string" },
  id: { type: "integer", minimum: 1 },
};

export const modelSchema = {
  type: "object",
  additionalProperties: false,
  required: ["type"],
  properties: base,
};
