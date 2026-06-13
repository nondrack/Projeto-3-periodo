import { expect, test } from '@playwright/test';

const senhaAdmin = 'Abc@1234';

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

async function criarSessaoAdmin(page: any, request: any) {
  const identificador = `${Date.now()}${Math.floor(Math.random() * 10000)}`;

  const admin = {
    nome: 'Admin E2E',
    cpf: gerarCpfValido(),
    email: `admin.e2e.${identificador}@teste.com`,
    senha: senhaAdmin,
  };

  const cadastro = await request.post('/api/users', {
    data: {
      nome: admin.nome,
      cpf: admin.cpf,
      email: admin.email,
      senha: admin.senha,
      tipo_usuario: 'admin',
    },
  });

  expect(cadastro.ok()).toBeTruthy();

  await page.goto('/login');

  await page.locator('#email').fill(admin.email);
  await page.locator('#senha').fill(admin.senha);
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByText('Login realizado com sucesso. Redirecionando...')).toBeVisible();
  await expect(page).toHaveURL('https://cinema.local/', { timeout: 5000 });
}

test.describe('E2E - CRUD administrativo', () => {
  test('CRUD completo de filmes com sucesso e falha', async ({ page, request }) => {
    await criarSessaoAdmin(page, request);

    const id = `${Date.now()}`;
    const tituloCriado = `Filme E2E ${id}`;
    const tituloEditado = `Filme E2E Editado ${id}`;

    await page.goto('/admin/filmes');

    await expect(page.getByRole('heading', { name: 'Filmes', exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Cadastrar novo filme' }).click();

    await expect(page.getByRole('heading', { name: 'Novo Filme' })).toBeVisible();

    // Caso de falha: tenta salvar sem preencher os campos obrigatórios
    await page.getByRole('button', { name: 'Salvar' }).click();
    await expect(page.getByText('Preencha titulo, genero e duracao validos.')).toBeVisible();

    // Cadastrar
    await page.locator('input[name="titulo"]').fill(tituloCriado);
    await page.locator('input[name="genero"]').fill('Aventura');
    await page.locator('input[name="classificacao_etaria"]').fill('12');
    await page.locator('input[name="duracao"]').fill('120');
    await page.locator('input[name="data_lancamento"]').fill('2026-06-13');
    await page.locator('input[name="poster_url"]').fill('https://i.imgur.com/8w1NikM.jpg');
    await page.locator('textarea[name="sinopse"]').fill('Filme criado durante teste E2E.');

    await page.getByRole('button', { name: 'Salvar' }).click();

    // Listar
    await expect(page).toHaveURL('https://cinema.local/admin/filmes');
    await expect(page.getByText(tituloCriado)).toBeVisible();

    // Editar
    const filmeCard = page.locator('article').filter({ hasText: tituloCriado });
    await filmeCard.getByRole('button', { name: 'Editar' }).click();

    await expect(page.getByRole('heading', { name: 'Editar Filme' })).toBeVisible();

    await page.locator('input[name="titulo"]').fill(tituloEditado);
    await page.locator('input[name="duracao"]').fill('130');

    await page.getByRole('button', { name: 'Salvar' }).click();

    await page.waitForURL('**/admin/filmes', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(tituloEditado)).toBeVisible({ timeout: 15000 });

    // Excluir
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    const filmeEditadoCard = page.locator('article').filter({ hasText: tituloEditado });
    await filmeEditadoCard.getByRole('button', { name: 'Remover' }).click();

    await expect(page.getByText('Filme removido com sucesso.')).toBeVisible();
    await expect(page.getByText(tituloEditado)).not.toBeVisible();
  });

  test('CRUD completo de salas com sucesso e falha', async ({ page, request }) => {
    await criarSessaoAdmin(page, request);

    const id = `${Date.now()}`;
    const nomeCriado = `Sala E2E ${id}`;
    const nomeEditado = `Sala E2E Editada ${id}`;

    await page.goto('/admin/salas');

    await expect(page.getByRole('heading', { name: 'Salas', exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Cadastrar nova sala' }).click();

    await expect(page.getByRole('heading', { name: 'Nova Sala' })).toBeVisible();

    // Caso de falha: tenta salvar sem preencher nome válido
    await page.locator('input[name="nome"]').fill('');
    await page.locator('input[name="capacidade"]').fill('1');
    await page.getByRole('button', { name: 'Salvar' }).click();

    await expect(page.getByText('Preencha nome e capacidade validos.')).toBeVisible();

    // Cadastrar
    await page.locator('input[name="nome"]').fill(nomeCriado);
    await page.locator('input[name="capacidade"]').fill('20');

    // Desmarcamos para não gerar assentos, porque sala com assentos pode não permitir exclusão
    await page.locator('input[name="gerarAssentos"]').uncheck();

    await page.getByRole('button', { name: 'Salvar' }).click();

    // Listar
    await expect(page).toHaveURL('https://cinema.local/admin/salas');
    await expect(page.getByText(nomeCriado)).toBeVisible();

    // Editar
    const salaCard = page.locator('article').filter({ hasText: nomeCriado });
    await salaCard.getByRole('button', { name: 'Editar' }).click();

    await expect(page.getByRole('heading', { name: 'Editar Sala' })).toBeVisible();

    await page.locator('input[name="nome"]').fill(nomeEditado);
    await page.locator('input[name="capacidade"]').fill('30');

    await page.getByRole('button', { name: 'Salvar' }).click();

    await page.waitForURL('**/admin/salas', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    await page.reload();
    await page.waitForLoadState('networkidle');

    const salaEditadaCard = page.locator('article').filter({ hasText: nomeEditado });

    await expect(salaEditadaCard).toBeVisible({ timeout: 15000 });
    await expect(salaEditadaCard.getByText('30 lugares')).toBeVisible({ timeout: 15000 });

    // Excluir
    page.once('dialog', async (dialog) => {
      await dialog.accept();
  });

await salaEditadaCard.getByRole('button', { name: 'Remover' }).click();

    await expect(page.getByText('Sala removida com sucesso.')).toBeVisible();
    await expect(page.getByText(nomeEditado)).not.toBeVisible();
  });
});