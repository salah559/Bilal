import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Use a more robust way to find the public directory
  const rootPath = process.cwd();
  const possiblePaths = [
    path.resolve(rootPath, "dist", "public"),
    path.resolve(rootPath, "public"),
    path.resolve(__dirname, "..", "dist", "public"),
    path.resolve(__dirname, "public"),
  ];

  let distPath = "";
  for (const p of possiblePaths) {
    if (fs.existsSync(p) && fs.readdirSync(p).includes("index.html")) {
      distPath = p;
      break;
    }
  }

  if (!distPath) {
    throw new Error(
      `Could not find the build directory: Checked paths: ${possiblePaths.join(", ")}`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
