# 🚀 Aquila Tecnology - Site Institucional

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" />
</p>

## 💻 Sobre o Projeto

Este repositório contém o site institucional oficial da **Aquila Tecnology**, uma empresa focada em soluções de Tecnologia da Informação.

O projeto foi desenvolvido para apresentar os serviços, soluções e identidade digital da empresa, proporcionando uma experiência moderna, responsiva e profissional para clientes e parceiros.

---

## 🏢 Sobre a Aquila Tecnology

A **Aquila Tecnology** oferece soluções em tecnologia para empresas que buscam melhorar sua infraestrutura, segurança e produtividade.

### Principais áreas de atuação:

- 🖥️ Consultoria em TI
- 🌐 Desenvolvimento Web
- 🔒 Segurança da Informação
- ⚙️ Automação de Processos
- ☁️ Soluções em Tecnologia
- 🛠️ Suporte e Infraestrutura

---

## 🚀 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando:

- HTML5
- CSS3
- JavaScript
- Design Responsivo
- Git e GitHub

---

## 📂 Estrutura do Projeto

## Desenvolvimento e publicação

O projeto mantém oito páginas estáticas, CSS e JavaScript nativos. Não exige npm para o build.

```bash
python3 -m http.server 4173 --bind 127.0.0.1
python3 scripts/build.py
python3 tests/build_test.py
python3 tests/seo_test.py
node --test tests/portfolio.test.cjs
```

O build publica em `dist/`, valida referências antes de substituir a saída e não modifica o HTML fonte. Gera CSS compacto e bundles com hash em `assets/runtime/`; `_headers` aplica cache longo apenas a esses arquivos. HTML, catálogo e imagens sem hash mantêm o comportamento de cache padrão da Cloudflare. O script não faz deploy ou push.

Para regenerar miniaturas após editar as imagens do catálogo, execute `python3 scripts/optimize_images.py` (requer Pillow somente para essa manutenção). O build normal usa exclusivamente a biblioteca padrão do Python.

Os testes de navegador requerem Playwright, Chrome e, em alguns casos, axe-core no ambiente de desenvolvimento. Aceitam `SITE_BASE` para testar `dist/` servido localmente. `tests/optimization.browser.cjs` também aceita `SOURCE_BASE` para comparar os estilos da fonte com os do build. `ARTIFACT_DIR` direciona evidências e `SKIP_SCREENSHOTS=1` evita recriar capturas pesadas no teste de identidade.

Consulte [RELATORIO_OTIMIZACAO.md](RELATORIO_OTIMIZACAO.md) para alterações, resultados e pendências. Use o processo de publicação existente somente após revisar as alterações e autorizar o envio; o repositório permanece integrado à hospedagem original.

O slider da home usa HTML/CSS/JS locais, imagens WebP e controles acessíveis. Consulte [implementação e créditos](docs/executive-slider.md); teste com `SITE_BASE=http://127.0.0.1:4181 node tests/executive-slider.browser.cjs` após servir `dist/` nessa porta.
