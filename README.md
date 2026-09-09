# FozGo — Everything you need in Foz do Iguaçu

App mobile (React Native + Expo Router) de turismo, gastronomia e lazer para Foz do Iguaçu.
Inspirado no conceito do Compras Paraguai, mas voltado para **onde comer, o que fazer e o que visitar**.

## Como rodar

```bash
npm install
npx expo start        # QR code para o app Expo Go (Android/iOS)
npx expo start --web  # abre no navegador (http://localhost:8081)
```

- **Celular:** instale o **Expo Go** e escaneie o QR code.
- **Web/desktop:** `npx expo start --web` — o layout é responsivo (grade de 2 ou 3 colunas conforme a largura).

## O que está implementado

### Tela inicial (`app/index.tsx`)
- Cabeçalho da marca com gradiente (teal/navy da logo) + localização.
- **Busca** por nome, categoria, bairro ou tags, com botão de **filtros**.
- **Filtros** (`FilterSheet`): faixa de preço, avaliação mínima e ordenação (relevância / melhor avaliados / mais próximos).
- **Categorias** (régua horizontal + grade): Restaurantes, Cafés, Bares, Pontos turísticos, Passeios, Hotéis, **Ingressos**, **Transporte**, **Guias**, **Previsão do tempo**.
- Seções: **Destaques de Foz** (carrossel), **Explorar por categoria**, **Recomendados** e **Perto de você**.
- **Previsão do tempo**: painel com condição atual, previsão por hora e 7 dias (categoria "Previsão").
- Barra de navegação inferior (Início / Explorar / Favoritos / Perfil).

### Página do local (`app/place/[id].tsx`)
Layout único que se adapta ao tipo:
- **Restaurantes / cafés / bares:** galeria, descrição, horário, endereço + mapa, telefone/WhatsApp, redes sociais, avaliações, faixa de preço, formas de pagamento e **cardápio completo** dividido em categorias (Entradas, Pratos principais, Sobremesas, Bebidas…), cada item com foto, descrição e preço. CTA "Reservar mesa".
- **Pontos turísticos / passeios / serviços:** galeria, descrição, localização, horário, **valor da entrada**, **informações importantes** e **como chegar**. CTA "Como chegar".
- Ações rápidas: rotas (abre o app de mapas), ligar, WhatsApp, compartilhar.

## Estrutura

```
app/
  _layout.tsx        Stack + carregamento de fontes (Poppins/Inter)
  index.tsx          Home
  place/[id].tsx     Página do local (restaurante e ponto turístico)
src/
  theme/             colors.ts, tokens.ts (espaçamento, raio, sombras, tipografia)
  data/              types.ts, categories.ts, places.ts (dados de Foz), images.ts
  components/        SearchBar, CategoryRow, PlaceCards, FilterSheet, WeatherPanel,
                     BottomNav, Brand (logo), Gradient, PlaceDetailParts, ui
  hooks/             useAppFonts.ts
```

## Design system
Gerado pela skill `ui-ux-pro-max` (padrão *Marketplace/Directory*, estilo *Vibrant & Block-based*)
e alinhado às cores da logo FozGo (azul-marinho + teal + pin verde) e às águas das Cataratas.
Tipografia: **Poppins** (títulos) + **Inter** (corpo).

## Dados
Os locais em `src/data/places.ts` são exemplos reais de Foz do Iguaçu (Cataratas, Parque das Aves,
Marco das Três Fronteiras, Búfalo Branco, Vento Haru, etc.) com dados mockados. As imagens usam
Unsplash. Para produção, conecte a uma API/CMS mantendo o mesmo formato de `Place`.

> Observação: os componentes prontos do 21st.dev (MCP Magic) são para **web (React + Tailwind)** e não
> se aplicam a React Native. Por isso os componentes aqui foram construídos de forma nativa, aplicando
> a mesma inteligência de design (paleta, tipografia, hierarquia e regras de UX).
