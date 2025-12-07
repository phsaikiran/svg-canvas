import { type BuildConfig } from "bun";
import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = "public";
const SRC_DIR = "src";

// Ensure clean output directory
await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });
await mkdir(join(OUT_DIR, "js"), { recursive: true });
await mkdir(join(OUT_DIR, "css"), { recursive: true });


// Build TypeScript
const buildResult = await Bun.build({
    entrypoints: [join(SRC_DIR, "ts", "main.ts")],
    outdir: join(OUT_DIR, "js"),
    minify: true,
    naming: "[name].[ext]", // ensure output is js/main.js not js/main.js/main.js or similar weirdness if any
});

if (!buildResult.success) {
    console.error("Build failed");
    for (const message of buildResult.logs) {
        console.error(message);
    }
    process.exit(1);
}

// Copy static assets
await cp(join(SRC_DIR, "index.html"), join(OUT_DIR, "index.html"));
await cp(join(SRC_DIR, "css", "styles.css"), join(OUT_DIR, "css", "styles.css"));
await cp(join(SRC_DIR, "favicon.ico"), join(OUT_DIR, "favicon.ico"));

console.log("Build complete!");
