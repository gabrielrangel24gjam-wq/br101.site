# BR101 — Instruções de Instalação

## Arquivos entregues

| Arquivo | Descrição |
|---|---|
| `index.html` | Landing page principal (melhorada) |
| `grandes-projetos.html` | Nova página — Grandes Projetos |
| `styles.css` | CSS completo melhorado |
| `script.js` | JavaScript melhorado |

## Como instalar

### 1. Substituir arquivos na hospedagem

Copie os arquivos para a pasta do site na Hostgator:

```
br101-landing-page-final-hospedagem/
  ├── index.html                ← substituir
  ├── grandes-projetos.html     ← NOVO — copiar aqui
  ├── assets/
  │   ├── styles.css            ← substituir
  │   ├── script.js             ← substituir
  │   └── img-webp/ (manter)
  │   └── videos/ (manter)
  ├── api/ (manter)
  ├── config/ (manter)
  └── ...
```

### 2. Ajustar o link do CSS no index.html

O `index.html` já referencia `assets/styles.css` — basta colocar o `styles.css`
dentro da pasta `assets/` no servidor.

O mesmo vale para o `script.js` → colocar em `assets/script.js`.

### 3. Testar

- Abrir o site no navegador
- Verificar menu mobile em celular
- Testar o formulário de contato
- Verificar o link "Grandes Projetos" no menu

## O que foi melhorado

### index.html
- Tipografia nova: Barlow Condensed + DM Sans (identidade industrial)
- Hero com overlay blueprint grid e kicker animado
- Trust strip com ícones e dividers
- Seção "Sobre" com badge e números animados
- Capacidade Industrial com cards melhorados
- **Nova seção destaque "Grandes Projetos"** com link para a página
- Carousel de Soluções com pause no hover
- Processo/Showcase com descrições expandidas em cada etapa
- Galeria com overlay animado e botão CTA
- Contato com badges informativos e form melhorado
- Footer com social links e coluna de grandes projetos

### styles.css
- Design system industrial completo (variáveis CSS)
- Menu mobile como overlay fullscreen
- Responsividade reforçada (480px–1300px)
- Novas seções: trust-strip, feature-project, gallery-item-overlay
- Animações de reveal, tilt e magnetic preservadas e otimizadas

### script.js
- Menu mobile como overlay fullscreen com tecla Escape
- Carousel com pause no hover e swipe aprimorado
- Formulário com fallback direto para WhatsApp em caso de erro no servidor
- Indicador de seção ativa no menu ao scrollar
- Contador de números animado
- Header com sombra dinâmica no scroll

### grandes-projetos.html (NOVA)
- Página completa e autocontida
- Hero com badge animado e specs técnicas
- 6 pilares do projeto (resistência, segurança, durabilidade...)
- Escopo de fornecimento com 7 equipamentos detalhados
- Processo em 4 etapas
- Galeria com imagens existentes do portfólio
- Diferenciais técnicos com tabela de especificações
- Seção de impacto urbano com números
- Outros projetos (com "Em breve")
- CTA laranja de alto impacto
- 100% responsivo para celular
