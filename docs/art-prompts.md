# Pinturas do pergaminho: guia e prompts

São 5 pinturas que preenchem a folha inteira e se emendam umas nas outras. O branco da imagem
some no papel (o site usa `mix-blend-mode: multiply`), então só a tinta aparece.

Como usar:
1. Gere as imagens com os prompts abaixo.
2. Salve em `/public/art/` (`home.webp`, `about.webp`, `work.webp`, `contact.webp`, `end.webp`).
3. Em `src/art.ts`, preencha o `src` de cada uma (ex.: `src: '/art/home.webp'`).
4. Abra `http://localhost:4321/?slots` para ver as áreas e o formato ideal de cada pintura.

## Regras que valem para todas

- **Fundo branco puro** (#ffffff), sem moldura, sem vinheta escura, sem bordas. Qualquer cinza ou
  creme no fundo escurece o papel.
- **Espaço vazio onde fica o texto.** Cada prompt diz onde. Peça sempre "lots of empty negative space".
- **Sem texto, caligrafia, assinatura, carimbo ou marca d'água** (a IA inventa caracteres sem sentido).
- Paleta: tinta preta e lavados de cinza, com **um único toque de vermelho vermelhão** e, no máximo,
  flores rosa-pálido. Isso mantém tudo combinando com o papel e o selo vermelho do site.
- Gere com pelo menos **2400 px de largura**; exporte em **WebP**, qualidade 80–85 (alvo: até ~400 KB).
- Os assuntos principais devem ficar no **centro vertical e a ~70% da altura**: em telas mais baixas
  o site corta um pouco em cima e embaixo.

## Bloco de estilo (cole no fim de todo prompt)

```
traditional Japanese sumi-e ink wash painting, soft gray ink washes with dry-brush texture and
bleeding edges, delicate pale pink cherry blossom, a single vermilion red accent, drifting mist,
rice paper feel, serene and elegant, lots of empty negative space, pure white background,
edges fading softly into white, no border, no frame, no text, no calligraphy, no signature,
no seal stamp, no watermark
```

Para Midjourney, acrescente `--ar` com o formato da pintura e `--style raw`. Em outras
ferramentas, escolha o formato equivalente (ou gere maior e corte).

## 1. Home — `home.webp` — formato 2:1 (`--ar 2:1`)

Texto fica à esquerda. A pintura ocupa a metade direita.

```
wide landscape composition, the left 45% of the image is almost empty white with only faint
mist, the right 55% holds the scene: layered misty mountains fading into the distance, a
pagoda on a rocky outcrop, a large pale moon or a vermilion red sun, three small birds in the
sky, a gnarled tree with pale pink blossoms in the foreground, calm lake with soft
reflections at the bottom
```

## 2. Sobre — `about.webp` — formato 16:9 (`--ar 16:9`)

Texto no meio da folha, nas duas colunas. A pintura fica baixa.

```
low horizon composition, all the scenery sits in the bottom third of the image: a calm lake
with long reflections, distant soft mountains, a small wooden boat, a cherry tree with pale
pink blossoms on the left bank; the upper two thirds is almost empty white sky with only a
whisper of mist and a few distant birds
```

## 3. Projetos — `work.webp` — formato 3:1 (`--ar 3:1`)

É a mais larga: passa por trás do título do capítulo e dos três cartões (eles são levemente
translúcidos). Pode ter mais força, mas o miolo deve ficar suave.

```
ultra wide panoramic composition in the spirit of Hokusai's great wave but as an ink wash:
on the far left a calm pale sea and drifting mist, in the middle a powerful rolling wave with
fine spray and curling foam painted in black and gray ink, small fishing boats, on the far
right a distant snow-capped mountain with a thin vermilion red sun above it, the center
and the top stay light and airy
```

## 4. Contato — `contact.webp` — formato 16:9 (`--ar 16:9`)

Informações à esquerda, formulário à direita. A lua vai no canto.

```
evening scene, a large vermilion red moon in the upper right corner, the scenery runs along the
bottom third: a quiet lake with a long moon reflection, silhouettes of pine trees and a distant
pagoda on the left, small paper lanterns floating on the water; the center and the top are
almost empty white with soft mist
```

## 5. Final — `end.webp` — formato 3:4 (`--ar 3:4`)

Painel estreito, com o texto vertical "改善" no meio.

```
vertical composition, a lone traveler with a large umbrella seen from behind, walking along a
wet reflective path toward distant misty mountains, a small vermilion red sun high in the sky,
the figure small and placed in the lower half, the middle of the image stays empty white
```

## Imagens de referência

- As duas primeiras que você enviou parecem geradas por IA: sirvam só de referência de estilo.
  Use as suas próprias gerações, conferindo se a licença da ferramenta permite uso comercial.
- *A Grande Onda de Kanagawa* (Hokusai) é de domínio público e o original está no acervo aberto
  do Metropolitan Museum. Mas é uma xilogravura colorida em azul, bem diferente da tinta preta
  do resto: use como inspiração de composição (como no prompt 3), não a imagem em si.
