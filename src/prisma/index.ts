import { PrismaClient } from "@prisma/client";

// Singleton pattern to prevent multiple instances
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create a single Prisma client instance optimized for speed
const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    // Minimal logging for production performance
    log: process.env.NODE_ENV === "development" ? ["error"] : [],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Optimize for speed
    errorFormat: "minimal",
  });

// In development, store the client on global to prevent multiple instances
if (process.env.NODE_ENV === "development") {
  globalThis.__prisma = prisma;
}

// Aggressive connection pre-warming for immediate availability
let isConnected = false;

const initializeConnection = async () => {
  if (isConnected) return;

  try {
    console.log("🚀 Initializing database connection...");
    const start = performance.now();

    // Connect and test with a simple query
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1 as health_check`;

    const connectionTime = performance.now() - start;
    console.log(`✅ Database connected in ${connectionTime.toFixed(2)}ms`);

    isConnected = true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    isConnected = false;
    throw error;
  }
};

// Immediate connection for serverless environments
if (process.env.VERCEL || process.env.NODE_ENV === "production") {
  initializeConnection().catch((error) => {
    console.error("Initial connection setup failed:", error);
  });
}

// Fast connection verification (no retries, immediate response)
export const ensureConnection = async () => {
  if (isConnected) return;

  try {
    await prisma.$queryRaw`SELECT 1`;
    isConnected = true;
  } catch (error) {
    console.error("Connection verification failed:", error);
    isConnected = false;

    // Quick reconnect attempt
    try {
      await prisma.$disconnect();
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      isConnected = true;
      console.log("✅ Reconnected successfully");
    } catch (reconnectError) {
      console.error("❌ Reconnection failed:", reconnectError);
      throw reconnectError;
    }
  }
};

// Graceful cleanup
process.on("beforeExit", async () => {
  if (isConnected) {
    try {
      await prisma.$disconnect();
      console.log("Database disconnected");
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  }
});

export default prisma;
