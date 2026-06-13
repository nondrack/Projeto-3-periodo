import { expect, test } from '@playwright/test';

const senhaValida = 'Abc@1234';

function gerarCpfValido(): string {
  const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 9));

  function calcularDigito(numeros: number[]): number {
    const soma = numeros.reduce((total, numero, index) => {
      return total + numero * (numeros.length + 1 - index);
    }, 0);

    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  }

  const primeiroDigito = calcularDigito(base);
  const segundoDigito = calcularDigito([...base, primeiroDigito]);

  return [...base, primeiroDigito, segundoDigito].join('');
}

function gerarUsuarioUnico(prefixo: string) {
  const identificador = `${Date.now()}${Math.floor(Math.random() * 10000)}`;

  return {
    nome: `${prefixo} E2E`,
    email: `${prefixo.toLowerCase()}${identificador}@teste.com`,
    cpf: gerarCpfValido(),
    telefone: '44999999999',
    senha: senhaValida,
  };
}

async function criarUsuarioPelaApi(request: any) {
  const usuario = gerarUsuarioUnico('Usuario');

  const resposta = await request.post('/api/users', {
    data: {
      nome: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email,
      senha: usuario.senha,
      tipo_usuario: 'cliente',
    },
  });

  expect(resposta.ok()).toBeTruthy();

  return usuario;
}

test.describe('E2E - Login e cadastro de usuário', () => {
  test('login com falha', async ({ page }) => {
    await page.goto('/login');

    await page.locator('#email').fill('usuario.inexistente@teste.com');
    await page.locator('#senha').fill('SenhaErrada@123');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Email ou senha invalidos.')).toBeVisible();
  });

  test('login com sucesso', async ({ page, request }) => {
    const usuario = await criarUsuarioPelaApi(request);

    await page.goto('/login');

    await page.locator('#email').fill(usuario.email);
    await page.locator('#senha').fill(usuario.senha);
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Login realizado com sucesso. Redirecionando...')).toBeVisible();
    await expect(page).toHaveURL('https://cinema.local/', { timeout: 5000 });
  });

  test('criação de usuário com falha', async ({ page }) => {
    await page.goto('/cadastro');

    await page.getByRole('button', { name: 'Criar conta' }).click();

    await expect(page.getByText('Informe seu nome completo.')).toBeVisible();
    await expect(page.getByText('Informe seu CPF.')).toBeVisible();
    await expect(page.getByText('Informe um e-mail valido.')).toBeVisible();
  });

  test('criação de usuário com sucesso', async ({ page }) => {
    const usuario = gerarUsuarioUnico('Cadastro');

    await page.goto('/cadastro');

    await page.locator('#nome').fill(usuario.nome);
    await page.locator('#email').fill(usuario.email);
    await page.locator('#cpf').fill(usuario.cpf);
    await page.locator('#telefone').fill(usuario.telefone);
    await page.locator('#senha').fill(usuario.senha);
    await page.locator('#confirmarSenha').fill(usuario.senha);

    await page.getByRole('button', { name: 'Criar conta' }).click();

    await expect(
      page.getByText('Cadastro concluido com sucesso. Redirecionando para o login...')
    ).toBeVisible();

    await expect(page).toHaveURL('https://cinema.local/login', { timeout: 5000 });
  });
});