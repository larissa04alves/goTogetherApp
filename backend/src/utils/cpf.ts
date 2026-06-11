export function limparCpf(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

export function cpfValido(cpf: string): boolean {
  const cpfLimpo = limparCpf(cpf);

  if (cpfLimpo.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    return false;
  }

  const calcularDigito = (base: string, fatorInicial: number): number => {
    let soma = 0;

    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * (fatorInicial - i);
    }

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const primeiroDigito = calcularDigito(cpfLimpo.substring(0, 9), 10);
  const segundoDigito = calcularDigito(cpfLimpo.substring(0, 10), 11);

  return (
    primeiroDigito === Number(cpfLimpo[9]) &&
    segundoDigito === Number(cpfLimpo[10])
  );
}