# Testes
- `tests/unit` (Vitest, sem banco): validações, limites, protocolo único, médias/distribuição/sem avaliações, setores (Raio-X e SAME), fuso horário.
- `tests/e2e` (Playwright, exige banco): registro dos três tipos, campos obrigatórios, avaliação parcial, bloqueio de `/admin` sem login, login/logout.
- **Não cobertos por testes automatizados ainda**: filtros/paginação/histórico/privacidade de observações/rate limiting contra banco real (exigem testes de integração com um banco Neon de teste), responsividade e teclado (verificação manual).
- **Status de execução**: nenhum teste foi executado no ambiente de geração (sem rede para instalar dependências).
