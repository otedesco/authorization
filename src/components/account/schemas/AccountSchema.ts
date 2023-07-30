import { AccountStatusEnum } from "@enums/AccountStatusEnum";
import { ExternalAuthTypeEnum } from "@enums/ExternalAuthTypeEnum";

const properties = {
  id: { type: "string", minLength: 1 },
  email: { type: "string" },
  password: { type: "string" },
  salt: { type: "string" },
  externalAuthType: {
    type: "string",
    nullable: true,
    enum: [ExternalAuthTypeEnum.GOOGLE, ExternalAuthTypeEnum.FACEBOOK],
  },
  externalId: { type: "string", nullable: true },
  status: { type: "string", enum: [AccountStatusEnum.EMAIL_VERIFICATION_PENDING, AccountStatusEnum.VERIFIED] },
};

export const modelSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ...properties,
    profiles: { type: "array", items: { type: "string" }, nullable: true },
    sessions: { type: "array", items: { type: "string" }, nullable: true },

    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
  required: ["email", "password", "salt", "status"],
};

export const createSchema = {
  type: "object",
  additionalProperties: false,
  required: ["email"],
  properties: {
    ...properties,
    passwordConfirmation: {
      type: "string",
      const: {
        $data: "1/password",
      },
    },
  },
};
