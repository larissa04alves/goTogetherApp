import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const services = [
  { name: "backend", args: ["run", "dev:backend"] },
  { name: "frontend", args: ["run", "dev:frontend"] },
];

let isShuttingDown = false;

const children = services.map((service) => {
  return spawn(npmCommand, service.args, {
    stdio: "inherit",
    env: process.env,
    shell: true,
  });
});

const shutdown = (exitCode = 0) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  process.exitCode = exitCode;
};

for (const child of children) {
  child.on("exit", (code, signal) => {
    if (isShuttingDown) {
      return;
    }

    if (code === 0 || signal === "SIGTERM" || signal === "SIGINT") {
      shutdown(0);
      return;
    }

    shutdown(code ?? 1);
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
