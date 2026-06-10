export function normalizeCpf(value: string) {
  return value.replace(/\D/g, "");
}

export function isValidCpf(value: string) {
  const cpf = normalizeCpf(value);

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const calculateCheckDigit = (baseDigits: string) => {
    const sum = baseDigits
      .split("")
      .reduce(
        (accumulator, digit, index) =>
          accumulator + Number(digit) * (baseDigits.length + 1 - index),
        0,
      );

    const remainder = 11 - (sum % 11);

    return remainder > 9 ? "0" : String(remainder);
  };

  const firstCheckDigit = calculateCheckDigit(cpf.slice(0, 9));
  const secondCheckDigit = calculateCheckDigit(cpf.slice(0, 9) + firstCheckDigit);

  return cpf.endsWith(firstCheckDigit + secondCheckDigit);
}
