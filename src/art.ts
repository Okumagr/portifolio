// Pinturas que preenchem o pergaminho. Cada uma cobre um ou mais painéis, se funde ao papel
// (o branco some e a tinta fica) e tem as bordas esmaecidas para emendar com a vizinha.
//
// Para usar uma imagem: salve em /public/art (ex.: /public/art/home.webp) e preencha `src`.
// Abra o site com ?slots no endereço (ex.: http://localhost:4321/?slots) para ver onde cada
// pintura entra, com o formato ideal. Os prompts de cada uma estão em docs/art-prompts.md.

export type Mural = {
  id: string;
  /** Painel onde a pintura começa e onde termina (ids dos painéis em Emakimono.astro). */
  from: string;
  to: string;
  /** Formato ideal da imagem (largura:altura). */
  ratio: string;
  /** Nome mostrado no modo ?slots. */
  label: string;
  /** Caminho em /public, por exemplo '/art/home.webp'. Sem ele, o espaço fica só com o papel. */
  src?: string;
  /** Qual parte da imagem fica visível se o corte não bater (CSS object-position). */
  position?: string;
  /**
   * Ajuste de cor (CSS filter). Útil para escaneamentos antigos com papel amarelado:
   * 'brightness(1.15) contrast(1.2)' empurra o fundo bege para o branco, que some no nosso papel.
   */
  filter?: string;
  /** 'contain' mostra a pintura inteira (sem cortar); 'cover' preenche a área e corta o que sobra. */
  fit?: 'cover' | 'contain';
};

export const murals: Mural[] = [
  { id: 'home', label: 'Home', from: 'home', to: 'home', ratio: '2:1', src: '/art/home.jpg', position: 'right bottom', fit: 'contain', filter: 'brightness(1.1) contrast(1.18)' },
  { id: 'about', label: 'Sobre', from: 'about', to: 'about', ratio: '16:9' },
  { id: 'work', label: 'Projetos', from: 'projects', to: 'work-last', ratio: '3:1' },
  { id: 'contact', label: 'Contato', from: 'contact', to: 'contact', ratio: '16:9' },
  { id: 'end', label: 'Final', from: 'end', to: 'end', ratio: '3:4' },
];
