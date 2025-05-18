import fs from "fs";
import path from "path";
import swaggerSpec from "../utils/swagger";

const outputFile = path.join(__dirname, "../../openapi.json");

// Create the output directory if it doesn't exist
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the specification to a file
fs.writeFileSync(outputFile, JSON.stringify(swaggerSpec, null, 2));

console.log(`OpenAPI specification written to ${outputFile}`);
