import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const setupSteps = [
  { name: "docker", cmd: "docker", args: ["compose", "up", "-d", "--wait"] },
  {
    name: "db:push",
    cmd: npmCommand,
    args: ["run", "db:push", "--workspace", "backend"],
  },
  {
    name: "db:seed",
    cmd: npmCommand,
    args: ["run", "db:seed", "--workspace", "backend"],
    optional: true,
  },
];

const services = [
  { name: "backend", args: ["run", "dev:backend"] },
  { name: "frontend", args: ["run", "dev:frontend"] },
];

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      env: process.env,
      shell: true,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`"${cmd} ${args.join(" ")}" saiu com código ${code}`));
      }
    });
  });
}

for (const step of setupSteps) {
  console.log(`\n[setup] ${step.name}...`);
  try {
    await run(step.cmd, step.args);
  } catch (err) {
    if (step.optional) {
      console.warn(`[setup] Aviso: "${step.name}" falhou (não obrigatório):`, err.message);
    } else {
      console.error(`[setup] Falha em "${step.name}":`, err.message);
      process.exit(1);
    }
  }
}

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
