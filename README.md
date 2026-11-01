# Hexmídia

Site institucional estático em HTML, CSS e JavaScript. O conteúdo segue `CONTEXTO_HEXMIDIA.md`.

## Desenvolvimento

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

Não há build, backend ou dependências em produção. Os caminhos relativos preservam a compatibilidade com a hospedagem estática existente. Fontes e imagens são servidas pelo próprio site.

## Verificação em navegador

Com o servidor iniciado, instale as ferramentas fora do checkout e execute:

```sh
npm install --prefix /tmp/hexmidia-tests --no-save playwright axe-core
NODE_PATH=/tmp/hexmidia-tests/node_modules CHROMIUM_PATH=/usr/bin/chromium node tests/smoke.cjs
```

Se não houver Chromium no sistema, instale o navegador do Playwright e omita `CHROMIUM_PATH`. `BASE_URL` permite apontar o teste para outra instância. O teste usa dados fictícios locais e não envia mensagens.

As verificações cobrem cinco larguras (320–1440 px), overflow horizontal, carregamento da imagem principal, links internos, menu e Escape, FAQ, preparação e cópia da mensagem, preferência por movimento reduzido, erros de navegador e respostas HTTP de recursos. Também executam axe-core para regras automatizáveis WCAG A/AA em desktop e celular. Auditoria automática não substitui avaliação manual completa de acessibilidade.

## Conteúdo e recursos

- As duas imagens de cafeteria e recepção foram geradas para ilustrar aplicações de mídia indoor; não são fotografias de clientes, instalações ou pontos reais da rede.
- A logomarca original citada no briefing não está no checkout. A assinatura tipográfica usada na interface é provisória e deve ser validada pela empresa.
- Fontes DM Sans e Manrope: Google Fonts, distribuídas sob SIL Open Font License; licenças em `assets/fonts/`.
- O formulário prepara e copia um texto no navegador, sem transmissão ou armazenamento em servidor. A demonstração permanece identificada até validação do conteúdo e configuração de um canal oficial.

## Publicação

Manter o serviço Render existente conectado à branch `main`, com a raiz do repositório como diretório público e sem etapa de build. Nenhuma mudança de domínio é necessária. O endereço e as configurações do serviço não estão registrados neste repositório.
