Data: 23/10/2026 (America/Sao_Paulo). Base: commit `de7b7b1`. Branch: `audit/aquila-diagnostico-2026-10-23`. Etapa A/B: diagnóstico e proposta; nenhuma correção de aplicação autorizada nesta etapa.

# Segurança defensiva

Inspeção estática, testes locais e requisições HTTP HEAD públicas pontuais. Sem exploração, força bruta ou varredura. Não foi identificada vulnerabilidade crítica/alta confirmada no escopo; isso não certifica segurança. Não foram encontrados candidatos evidentes a credenciais nos arquivos de aplicação inspecionados; histórico completo e contas não auditados.

| ID | Evidência / arquivo e linha | Impacto | Probabilidade | Severidade / prioridade | Solução recomendada | Status | Validação |
|---|---|---|---|---|---|---|---|
| SEG-01 | index.html:266 vs src/js/main.js:76 | Dados pessoais podem seguir a um contato diferente do exibido | Indeterminada até confirmar titularidade | MÉDIO / P1 | Confirmar número oficial antes de alterar qualquer contato | Pendente comercial | Comparação estática; sem transmissão |
| SEG-02 | CSP apenas em meta, index.html:4 e equivalentes; headers-home.txt e headers-portfolio.txt sem frame-ancestors/X-Frame-Options | Ausência de proteção explícita contra enquadramento nas respostas observadas | Baixa, site público sem autenticação | BAIXO / P2 | Propor frame-ancestors por header após avaliar uso legítimo de embeds | Pendente aprovação de infraestrutura | HEAD de duas rotas; enquadramento não explorado |
| SEG-03 | privacidade.html, seção Compartilhamento; main.js:65–76 e index.html:285–306 | Transparência insuficiente junto ao formulário sobre transferência a WhatsApp e dados na URL | Média | MÉDIO / P1 | Aviso contextual e política fiel aos fluxos, retenção e responsáveis reais | Pendente validação operacional | Inspeção; não é parecer jurídico |
| SEG-04 | main.js:58–76; campos sem maxlength em index.html:289–302 | Mensagem ilimitada e falha de abertura sem feedback específico | Média | BAIXO / P2 | Limites razoáveis, feedback de falha e alternativa de contato | Proposto | Não existe backend próprio a validar |
| SEG-05 | HEAD público sem HSTS e Permissions-Policy nas duas rotas | Hardening não explicitado nessas respostas | Indeterminada | INFORMATIVO / P3 | Avaliar HSTS somente com cobertura HTTPS/subdomínios conhecida; restringir recursos não usados | Pendente acesso à configuração | Ausência de header não comprova vulnerabilidade explorável |
| SEG-06 | Fontes/ícones via Google/jsDelivr nas oito páginas | Dependência de disponibilidade e processamento por terceiros | Média | BAIXO / P2 | Avaliar auto-hospedagem com licenças e pesos necessários | Proposto | Nenhum pacote npm de produção a auditar |

## Controles existentes e limites

Sem innerHTML, eval ou document.write nos JS inspecionados. DOM usa textContent e validação de URLs/imagens. Links externos HTML observados usam noopener noreferrer; script usa mesmas proteções. CSP limita scripts a self e hash do JSON-LD; não usa unsafe-inline ou unsafe-eval. style-src/font-src autorizam domínios realmente usados. form-action none impede submissão nativa e não impede window.open de WhatsApp; connect-src self permite catálogo local. CSP meta não aceita frame-ancestors como substituto de header.

Testes existentes executados: oito páginas sem violações CSP, injeção local inline bloqueada e formulário sem JS sem transmissão; [log](evidencias/security-browser.txt). Nenhuma mensagem enviada ao WhatsApp. Validação do navegador é apenas usabilidade: não há processamento próprio no servidor a inspecionar, nem endpoint próprio para rate limiting; não se justifica adicionar CAPTCHA sem novo fluxo aprovado.

HTTPS respondeu com validação de certificado pelo curl; HTTP retornou redirecionamento registrado. Não foi feito inventário completo de versões TLS/cifras nem verificação de todos os subdomínios. Sem source maps referenciados ou .map versionados identificados. DNS público resolve para IPs Cloudflare; registrador GoDaddy e segurança de contas não confirmados por essa resolução.

Referências de compatibilidade: [Cloudflare Pages headers](https://developers.cloudflare.com/pages/configuration/headers/) e [CSP meta e headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP). Nenhum _headers criado nesta etapa.
