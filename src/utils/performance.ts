// Performance monitoring utility for debugging slow operations

export class PerformanceTimer {
  private startTime: number;
  private checkpoints: Map<string, number> = new Map();

  constructor(private operationName: string) {
    this.startTime = performance.now();
    console.log(`🚀 Starting ${this.operationName}`);
  }

  checkpoint(name: string): void {
    const now = performance.now();
    const elapsed = now - this.startTime;
    this.checkpoints.set(name, elapsed);
    console.log(`⏱️  ${this.operationName} - ${name}: ${elapsed.toFixed(2)}ms`);
  }

  finish(): number {
    const endTime = performance.now();
    const totalTime = endTime - this.startTime;
    console.log(
      `✅ ${this.operationName} completed in ${totalTime.toFixed(2)}ms`
    );

    // Log all checkpoints
    for (const [name, time] of this.checkpoints) {
      console.log(`   - ${name}: ${time.toFixed(2)}ms`);
    }

    return totalTime;
  }
}

// Quick performance wrapper for functions
export const withPerformanceTracking = async <T>(
  operationName: string,
  operation: (timer: PerformanceTimer) => Promise<T>
): Promise<T> => {
  const timer = new PerformanceTimer(operationName);
  try {
    const result = await operation(timer);
    timer.finish();
    return result;
  } catch (error) {
    timer.finish();
    throw error;
  }
};
