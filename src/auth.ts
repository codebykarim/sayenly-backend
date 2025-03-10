import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { bearer, openAPI, phoneNumber } from "better-auth/plugins";
import { sendSMS } from "./utils/sendSMS";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    openAPI(),
    bearer(),
    phoneNumber({
      sendOTP: ({ phoneNumber, code }, request) => {
        sendSMS(phoneNumber, code);
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          return `${phoneNumber}@sayenly.com`;
        },
        getTempName: (phoneNumber) => {
          return phoneNumber;
        },
      },
    }),
  ],
});
