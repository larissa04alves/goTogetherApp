type JsonObject = Record<string, unknown>;

type TestCase = {
  name: string;
  body: JsonObject;
  expectedStatus: number;
  expectedMessageIncludes?: string;
  validateCreatedUser?: boolean;
};

type ApiResult = {
  status: number;
  data: unknown;
  raw: string;
};

const API_URL = process.env.API_URL ?? "http://localhost:3000";
const REGISTER_URL = `${API_URL.replace(/\/$/, "")}/auth/register`;

const RUN_ID = `${Date.now()}${Math.floor(Math.random() * 10000)}`;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateCpfDigit(digits: number[], factorStart: number) {
  const sum = digits.reduce((acc, digit, index) => {
    return acc + digit * (factorStart - index);
  }, 0);

  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

function generateValidCpf() {
  let base: number[];

  do {
    base = Array.from({ length: 9 }, () => randomInt(0, 9));
  } while (new Set(base).size === 1);

  const firstDigit = calculateCpfDigit(base, 10);
  const secondDigit = calculateCpfDigit([...base, firstDigit], 11);

  return [...base, firstDigit, secondDigit].join("");
}

function createEmail(prefix: string, domain: string) {
  return `${prefix}.${RUN_ID}.${randomInt(1000, 9999)}@${domain}`;
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getUsuario(data: unknown): JsonObject | null {
  if (!isObject(data)) {
    return null;
  }

  const usuario = data.usuario;

  if (!isObject(usuario)) {
    return null;
  }

  return usuario;
}

function findForbiddenKeys(value: unknown, forbiddenKeys: string[], found = new Set<string>()) {
  if (Array.isArray(value)) {
    for (const item of value) {
      findForbiddenKeys(item, forbiddenKeys, found);
    }

    return found;
  }

  if (!isObject(value)) {
    return found;
  }

  for (const [key, childValue] of Object.entries(value)) {
    if (forbiddenKeys.includes(key)) {
      found.add(key);
    }

    findForbiddenKeys(childValue, forbiddenKeys, found);
  }

  return found;
}

async function postRegister(body: JsonObject): Promise<ApiResult> {
  const response = await fetch(REGISTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const raw = await response.text();

  let data: unknown;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  return {
    status: response.status,
    data,
    raw,
  };
}

function assertCreatedUser(result: ApiResult, body: JsonObject) {
  const errors: string[] = [];

  const usuario = getUsuario(result.data);

  if (!usuario) {
    errors.push("Resposta não possui objeto usuario.");
    return errors;
  }

  const forbiddenKeys = ["senha", "senha_hash", "password", "passwordHash", "password_hash"];
  const leakedKeys = Array.from(findForbiddenKeys(result.data, forbiddenKeys));

  if (leakedKeys.length > 0) {
    errors.push(`Resposta vazou campos proibidos: ${leakedKeys.join(", ")}`);
  }

  if (usuario.email !== body.email) {
    errors.push(`Email retornado diferente. Esperado: ${body.email}. Recebido: ${String(usuario.email)}`);
  }

  if (usuario.cpf !== body.cpf) {
    errors.push(`CPF retornado diferente. Esperado: ${body.cpf}. Recebido: ${String(usuario.cpf)}`);
  }

  if (usuario.role !== "student") {
    errors.push(`Role incorreta. Esperado: student. Recebido: ${String(usuario.role)}`);
  }

  const emailVerified = usuario.emailVerified ?? usuario.email_verificado;
  const identityVerified = usuario.identityVerified ?? usuario.identidade_verificada;

  if (emailVerified !== false) {
    errors.push(`emailVerified/email_verificado deveria ser false. Recebido: ${String(emailVerified)}`);
  }

  if (identityVerified !== false) {
    errors.push(`identityVerified/identidade_verificada deveria ser false. Recebido: ${String(identityVerified)}`);
  }

  return errors;
}

async function runTest(testCase: TestCase) {
  const result = await postRegister(testCase.body);

  const errors: string[] = [];

  if (result.status !== testCase.expectedStatus) {
    errors.push(`Status esperado: ${testCase.expectedStatus}. Status recebido: ${result.status}.`);
  }

  if (testCase.expectedMessageIncludes) {
    const responseAsText = JSON.stringify(result.data);

    if (!responseAsText.includes(testCase.expectedMessageIncludes)) {
      errors.push(`Resposta deveria conter: "${testCase.expectedMessageIncludes}".`);
    }
  }

  if (testCase.validateCreatedUser) {
    errors.push(...assertCreatedUser(result, testCase.body));
  }

  if (errors.length === 0) {
    console.log(`PASS | ${testCase.name}`);
    return true;
  }

  console.error(`FAIL | ${testCase.name}`);
  console.error(errors.map((error) => `  - ${error}`).join("\n"));
  console.error("Resposta recebida:");
  console.error(JSON.stringify(result.data, null, 2));
  console.error("");

  return false;
}

async function main() {
  console.log(`Testando endpoint: ${REGISTER_URL}`);
  console.log("");

  const gmailEmail = createEmail("joao.teste", "gmail.com");
  const gmailCpf = generateValidCpf();

  const outlookEmail = createEmail("maria.souza", "outlook.com");
  const outlookCpf = generateValidCpf();

  const hotmailEmail = createEmail("carlos.teste", "hotmail.com");
  const hotmailCpf = generateValidCpf();

  const customDomainEmail = createEmail("pedro", "minhaempresa.com.br");
  const customDomainCpf = generateValidCpf();

  const tests: TestCase[] = [
    {
      name: "Cadastro válido com Gmail",
      expectedStatus: 201,
      validateCreatedUser: true,
      body: {
        nome_completo: "João da Silva",
        email: gmailEmail,
        senha: "abc12345",
        cpf: gmailCpf,
        telefone: "41999999999",
        genero: "masculino",
        instituicao: "UFPR",
        curso: "Ciência da Computação",
        periodo: "6",
      },
    },
    {
      name: "Cadastro válido com Outlook",
      expectedStatus: 201,
      validateCreatedUser: true,
      body: {
        nome_completo: "Maria Souza",
        email: outlookEmail,
        senha: "senha1234",
        cpf: outlookCpf,
        telefone: "41988888888",
        genero: "feminino",
        instituicao: "PUCPR",
        curso: "Engenharia de Software",
        periodo: "4",
      },
    },
    {
      name: "Cadastro válido com Hotmail",
      expectedStatus: 201,
      validateCreatedUser: true,
      body: {
        nome_completo: "Carlos Mendes",
        email: hotmailEmail,
        senha: "teste1234",
        cpf: hotmailCpf,
      },
    },
    {
      name: "Cadastro válido com domínio próprio",
      expectedStatus: 201,
      validateCreatedUser: true,
      body: {
        nome_completo: "Pedro Almeida",
        email: customDomainEmail,
        senha: "teste1234",
        cpf: customDomainCpf,
        instituicao: "Empresa Própria",
        curso: "Administração",
        periodo: "2",
      },
    },
    {
      name: "Rejeita e-mail em formato inválido",
      expectedStatus: 400,
      expectedMessageIncludes: "email",
      body: {
        nome_completo: "Ana Lima",
        email: "email-invalido",
        senha: "abc12345",
        cpf: generateValidCpf(),
      },
    },
    {
      name: "Rejeita e-mail duplicado",
      expectedStatus: 409,
      expectedMessageIncludes: "E-mail já cadastrado",
      body: {
        nome_completo: "João da Silva",
        email: gmailEmail,
        senha: "abc12345",
        cpf: generateValidCpf(),
      },
    },
    {
      name: "Rejeita CPF duplicado",
      expectedStatus: 409,
      expectedMessageIncludes: "CPF já cadastrado",
      body: {
        nome_completo: "Lucas Pereira",
        email: createEmail("lucas.pereira", "gmail.com"),
        senha: "abc12345",
        cpf: gmailCpf,
      },
    },
    {
      name: "Rejeita senha sem número",
      expectedStatus: 400,
      expectedMessageIncludes: "Senha",
      body: {
        nome_completo: "Bruno Santos",
        email: createEmail("bruno.santos", "gmail.com"),
        senha: "abcdefgh",
        cpf: generateValidCpf(),
      },
    },
    {
      name: "Rejeita senha curta",
      expectedStatus: 400,
      expectedMessageIncludes: "Senha",
      body: {
        nome_completo: "Rafael Costa",
        email: createEmail("rafael.costa", "gmail.com"),
        senha: "abc12",
        cpf: generateValidCpf(),
      },
    },
    {
      name: "Rejeita nome com apenas uma palavra",
      expectedStatus: 400,
      expectedMessageIncludes: "Nome completo",
      body: {
        nome_completo: "Ana",
        email: createEmail("ana", "gmail.com"),
        senha: "abc12345",
        cpf: generateValidCpf(),
      },
    },
    {
      name: "Rejeita CPF inválido",
      expectedStatus: 400,
      expectedMessageIncludes: "CPF",
      body: {
        nome_completo: "Felipe Costa",
        email: createEmail("felipe.costa", "gmail.com"),
        senha: "abc12345",
        cpf: "11111111111",
      },
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of tests) {
    const ok = await runTest(testCase);

    if (ok) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log("");
  console.log("Resultado final:");
  console.log(`PASS: ${passed}`);
  console.log(`FAIL: ${failed}`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Erro ao executar testes:");
  console.error(error);
  process.exitCode = 1;
});