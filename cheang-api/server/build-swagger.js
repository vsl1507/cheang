import fs from "fs";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import { options } from "./swagger.js";

try {
  console.log("Compiling Swagger/OpenAPI documentation specifications...");
  const specs = swaggerJsdoc(options);
  const outputPath = path.join(process.cwd(), "swagger.json");

  fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2), "utf8");
  console.log(`Swagger spec successfully generated at: ${outputPath}`);
  process.exit(0);
} catch (error) {
  console.error("Error generating Swagger specifications:", error);
  process.exit(1);
}
