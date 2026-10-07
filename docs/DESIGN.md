# Design

Sistema visual do portal CardioIA. Intenção e público em [PRODUCT.md](PRODUCT.md).

## Tema

Claro, calmo e preciso, na linha do app Saúde da Apple: fundo cinza-azulado muito leve,
painéis brancos com linhas finas, números grandes e legíveis. Cena de uso: cardiologista num
consultório bem iluminado, entre atendimentos, conferindo a tela de relance.

## Cor

Estratégia **contida**: neutros com leve matiz do azul-marinho da marca (265°) e cor apenas
onde significa algo. Todos os tokens em OKLCH, em `src/index.css`.

| Papel | Token | Valor | Uso |
|---|---|---|---|
| Fundo | `--tela` | `oklch(0.975 0.004 265)` | fundo das páginas |
| Painel | `--superficie` | `oklch(1 0 0)` | painéis, lista, campos |
| Lateral | `--lateral` | `oklch(0.958 0.006 265)` | barra lateral |
| Linha | `--linha` | `oklch(0.92 0.006 265)` | divisórias e bordas finas |
| Tinta | `--tinta` · `--tinta-2` · `--tinta-3` | L 0.23 · 0.44 · 0.53 | texto principal, secundário, rótulos (todos ≥ 4,5:1 no branco) |
| Ação | `--acao` | `oklch(0.29 0.06 268)` | botão principal, seleção, avatar |
| Marca | `--coracao` | `oklch(0.63 0.21 17)` | logotipo, ícone ativo, doença cardíaca (só ícones e barras, nunca texto pequeno) |
| Alerta | `--alerta` sobre `--alerta-fundo` | L 0.52 sobre 0.965 | "Doença cardíaca", erros, cancelar |
| Atenção | `--atencao` | `oklch(0.53 0.12 62)` | valor fora da referência (sempre com seta ↑/↓) |
| Sucesso | `--ok` sobre `--ok-fundo` | L 0.50 sobre 0.965 | confirmação de agendamento |
| Foco | `--foco` | `oklch(0.6 0.15 255)` | anel de foco de teclado |

**Uma cor por tipo de dado**, como no Saúde, usada só em marcadores de 8 px ao lado do rótulo:
pressão (roxo `--dado-pressao`), colesterol (laranja `--dado-colesterol`), frequência cardíaca
(vermelho `--dado-fc`) e SpO₂ (azul `--dado-spo2`). Estado nunca depende só da cor.

## Tipografia

Uma família só: `system-ui` (Segoe UI Variable no Windows, SF Pro no macOS e iOS). Escala fixa
em rem, razão próxima de 1,2: 12 · 13 · 14 · 15 · 16 · 17 · 28 px, com números de destaque em
36 e 44 px. Pesos 500 a 700. Números sempre com `font-variant-numeric: tabular-nums`.
Títulos com `text-wrap: balance`.

## Forma e elevação

Raios de 8, 12 e 18 px (`--raio-s`, `--raio`, `--raio-l`). Sombra quase imperceptível nos painéis
(`--sombra`); só o cartão de login usa a elevada (`--sombra-elevada`). Separação por linhas finas,
nunca caixas dentro de caixas.

## Componentes

- **Botao**: primário (tinta azul-marinho), secundário (contorno), fantasma, perigo e link; tamanhos
  normal (40 px) e pequeno (32 px); estados hover, foco, ativo, desativado e carregando.
- **Campo**: rótulo, controle e mensagem ligados por `useId`; erro com ícone e `aria-invalid`.
- **Segmentado**: rádios nativos com aparência de controle segmentado (filtros da lista).
- **Chips de horário e de atendimento**: rádios nativos; ocupado/encerrado aparecem riscados,
  tracejados e com o motivo escrito.
- **LinhaPaciente**: linha da lista com identificação, quatro sinais, situação e atalho "Agendar";
  no celular vira um bloco com os sinais em 2 × 2.
- **Estado**: esqueleto de carregamento, erro com "Tentar novamente" e vazio que ensina o próximo passo.

## Layout

Barra lateral fixa de 248 px no desktop; no celular (≤ 960 px), cabeçalho translúcido no topo e
barra de abas embaixo, como em apps iOS. Conteúdo com largura máxima de 76 rem. Responsivo de
360 px em diante, sem rolagem horizontal.

## Movimento

Transições de 120 a 400 ms com curva `cubic-bezier(0.22, 1, 0.36, 1)` (desaceleração suave), só
para estado: hover, seleção, carregamento. Um único momento decorativo: o traço de ECG que se
desenha na tela de login. Tudo respeita `prefers-reduced-motion`.
