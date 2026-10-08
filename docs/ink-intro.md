# Estrutura do site

## Abertura

Ao carregar a página, duas coisas acontecem ao mesmo tempo:

- O nome é escrito a pincel no canto superior esquerdo (`SiteHeader.astro` + `InkSignature.astro`).
  A escrita e os escorridos ficam em `src/lib/ink-strokes.ts` (`INK_SPEED` controla o ritmo)
  e `src/lib/ink-fluid.ts`.
- O pergaminho se abre: começa fechado no centro, com os dois rolos de madeira juntos, e eles se
  afastam para as bordas enquanto o papel se desenrola entre eles (`Emakimono.astro`).

Não há tela de abertura separada. "Repetir animação" (canto superior direito) reinicia as duas.
Com "reduzir movimento" ativado no sistema, a página abre direto, sem animação.

## O rolo (Emakimono)

- Rolar a página para baixo faz o papel correr para o lado, na mesma velocidade. A altura da
  página é calculada para acompanhar o comprimento do rolo (`data-run` em `index.astro`).
- Os rolos engrossam e afinam conforme a leitura (`--roll-min`, `--roll-max`, `--roll-swing`).
- Os textos já estão "escritos" no papel: a tinta se mistura com a textura (`mix-blend-mode`),
  sem animação de aparecer.
- Cores e textura do papel: variáveis `--fibre`, `--blotch` e a cor base em `.track`.

## Idiomas (PT, EN, 日本語)

- Todos os textos ficam em `src/i18n.ts`. O português é o padrão e é o que o servidor gera.
- O seletor (`LangSwitch.astro`) troca os textos no navegador e lembra a escolha (`localStorage`).
- Para um texto novo: crie a chave nos três idiomas e use `data-i18n="chave"` no elemento.
  Textos com HTML usam `data-i18n-html`.
- Os projetos usam `project.<posição>.title` e `project.<posição>.desc`; os dados fixos
  (tecnologias, links, capa) ficam em `src/data.ts`.

## Imagens

- Pintura da Home: defina `heroImage` em `src/data.ts` (arquivo em `/public`). Sem ela, usa a
  paisagem desenhada por código (`InkLandscape.astro`).
- Capa de projeto: campo `image` do projeto em `src/data.ts`.
