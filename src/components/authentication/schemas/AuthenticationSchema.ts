import { ExternalAuthTypeEnum } from "@enums/ExternalAuthTypeEnum";

// TODO: fix password and email formats, they are too simple
export const signUpSchema = {
  type: "object",
  additionalProperties: false,
  required: ["email"],
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", format: "password" },
    externalAuthType: { type: "string", enum: Object.values(ExternalAuthTypeEnum) },
    externalId: { type: "string" },
    passwordConfirmation: {
      type: "string",
      const: {
        $data: "1/password",
      },
    },
    name: { type: "string" },
    lastname: { type: "string" },
  },
};

export const signInSchema = {
  type: "object",
  additionalProperties: false,
  required: ["email", "password"],
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", format: "password" },
  },
};
