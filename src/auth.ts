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
      sendOTP: async ({ phoneNumber, code }, request) => {
        console.log(code);
        // await sendSMS(phoneNumber, code);
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
  user: {
    additionalFields: {
      nationality: {
        type: "string",
        options: ["EMIRATI", "OTHER"],
      },
    },
  },
});
