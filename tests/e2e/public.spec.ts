// Requer banco real (DATABASE_URL), migrations e seed aplicados.
import { expect, test } from "@playwright/test";

test("página pública exibe o título e as duas seções", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("OUVIDORIA — HOSPITAL MUNICIPAL DE SANTALUZ");
  await expect(page.getByText("AVALIE NOSSO ATENDIMENTO")).toBeVisible();
});

test("valida campos obrigatórios no navegador", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Enviar manifestação" }).click();
  await expect(page.getByText("Selecione o tipo de manifestação.")).toBeVisible();
});

for (const [value, label] of [["COMPLAINT", "Reclamação"], ["SUGGESTION", "Sugestão"], ["PRAISE", "Elogio"]] as const) {
  test(`registra ${label} e exibe protocolo`, async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Tipo de manifestação *").selectOption(value);
    await page.getByLabel("Setor relacionado *").selectOption("RAIO_X");
    await page.getByLabel("Descrição *").fill(`Teste automatizado de ${label} com texto suficiente.`);
    await page.getByRole("button", { name: "Enviar manifestação" }).click();
    await expect(page.getByText(/OUV-\d{4}-/)).toBeVisible();
  });
}

test("avaliação parcial de um único setor", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radiogroup", { name: /SAME/ }).getByRole("radio").nth(3).click();
  await page.getByRole("button", { name: "Enviar avaliação" }).click();
  await expect(page.getByText("Sua avaliação foi registrada")).toBeVisible();
});

test("área administrativa exige autenticação", async ({ page }) => {
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("login administrativo e logout (requer E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD)", async ({ page }) => {
  test.skip(!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD, "credenciais de teste não configuradas");
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(process.env.E2E_ADMIN_EMAIL!);
  await page.getByLabel("Senha").fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/);
  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
});
