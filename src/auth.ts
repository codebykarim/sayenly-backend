import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { admin, bearer, openAPI, phoneNumber } from "better-auth/plugins";
import { sendSMS } from "./utils/sendSMS";

// Fixed OTP for test users
const TEST_USERS: Record<string, string> = {
  "+201021656119": "324894",
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    openAPI(),
    bearer(),
    phoneNumber({
      sendOTP: async (
        { phoneNumber, code }: { phoneNumber: string; code: string },
        request?: any
      ) => {
        // Check if this is a test user with a fixed OTP
        if (phoneNumber in TEST_USERS) {
          const fixedOTP = TEST_USERS[phoneNumber];
          console.log(
            `Using fixed OTP for test user ${phoneNumber}: ${fixedOTP}`
          );

          // Override the code in the verification table with our fixed OTP
          try {
            // Find the verification entry that was just created
            const verification = await prisma.verification.findFirst({
              where: {
                identifier: phoneNumber,
                AND: {
                  createdAt: {
                    gte: new Date(Date.now() - 5000), // Created in the last 5 seconds
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            });

            if (verification) {
              // Update the verification code to our fixed OTP
              await prisma.verification.update({
                where: { id: verification.id },
                data: { value: fixedOTP },
              });

              console.log(
                `Updated verification entry to use fixed OTP: ${fixedOTP}`
              );
            }
          } catch (error) {
            console.error(
              "Failed to update verification with fixed OTP:",
              error
            );
          }

          return;
        }

        // Regular flow for non-test users
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
    admin(),
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
