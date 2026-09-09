# FozGo — Descrição das funcionalidades

App mobile (React Native + Expo) de turismo, gastronomia e lazer para Foz do Iguaçu.
Reúne **onde comer, o que fazer e o que visitar** em um só lugar. Funciona em celular
(Android/iOS via Expo Go) e no navegador (layout responsivo).

---

## 1. Tela inicial (Home)

Ponto de entrada do app. Reúne descoberta, busca e navegação.

| Funcionalidade | Descrição |
|---|---|
| **Cabeçalho da marca** | Faixa com gradiente teal/navy (cores da logo), logotipo "FozGo", localização atual ("Foz do Iguaçu, PR") e ícones de favoritos e notificações. |
| **Busca inteligente** | Campo de busca que filtra locais por **nome, categoria, bairro e tags** em tempo real. Botão "X" limpa o texto. |
| **Botão de filtros** | Abre o painel de filtros avançados (preço, avaliação, ordenação). |
| **Régua de categorias** | Lista horizontal com as 10 categorias; tocar seleciona/desmarca e filtra o conteúdo. |
| **Destaques de Foz** | Carrossel horizontal com os locais em destaque (cards grandes com foto, nota, categoria e distância). |
| **Explorar por categoria** | Grade com as 10 categorias; tocar abre a listagem daquela categoria. |
| **Recomendados para você** | Grade (2 ou 3 colunas conforme a tela) com locais mais bem avaliados (nota ≥ 4.7). |
| **Perto de você** | Lista dos locais ordenados por distância. |
| **Barra de navegação inferior** | Início · Explorar · Favoritos · Perfil (aba ativa destacada). |

### Modo de resultados
Quando há busca, categoria ou filtro ativos, a Home troca as seções pela **lista de resultados**:
- Contador ("X locais encontrados") e botão **Limpar**.
- **Estado vazio** amigável quando nada é encontrado ("Nenhum local encontrado").

---

## 2. Sistema de busca e filtros

| Função | O que faz |
|---|---|
| **Busca textual** | Compara o termo digitado com nome, frase de destaque, bairro, categoria e tags do local. |
| **Filtro por categoria** | Restringe a uma das 10 categorias. |
| **Filtro por faixa de preço** | Seleção múltipla de `$` a `$$$$`. |
| **Filtro por avaliação mínima** | Todas · 4.0+ · 4.5+. |
| **Ordenação** | Relevância · Melhor avaliados · Mais próximos. |
| **Painel de filtros** | Abre de baixo para cima; botões **Limpar** e **Mostrar resultados**; mantém o rascunho até aplicar. |

---

## 3. Categorias (10)

Cada categoria tem ícone e cor próprios.

1. **Restaurantes** — churrascarias, japonês, frutos do mar, etc.
2. **Cafés** — cafeterias e brunch.
3. **Bares** — música ao vivo, coquetelaria.
4. **Pontos turísticos** — Cataratas, Parque das Aves, Itaipu, Marco das Três Fronteiras.
5. **Passeios** — Macuco Safari, passeio de barco.
6. **Hotéis** — de resorts a hotéis-ícone.
7. **Ingressos** — combos e ingressos com desconto para atrações.
8. **Transporte** — transfer privativo e vans executivas.
9. **Guias** — guias de turismo credenciados.
10. **Previsão** — previsão do tempo (ver seção 5).

---

## 4. Página do local (detalhe)

Um layout único que **se adapta ao tipo de local**.

### Comum a todos
- **Galeria de fotos** deslizável com indicadores (dots).
- **Barra superior flutuante**: voltar, favoritar (coração), compartilhar.
- Nome, frase de destaque, **categoria**, **nota + nº de avaliações**, bairro/distância e **tags**.
- **Ações rápidas**: Rotas (abre o mapa), Ligar, WhatsApp, Compartilhar.
- **Sobre** — descrição completa.
- **Informações** — horário de funcionamento, endereço, telefone e **redes sociais**.
- **Localização** — card de mapa com botão "Abrir no mapa" e dica de "como chegar".
- **Formas de pagamento** — dinheiro, Pix, cartões, etc.
- **Avaliações** — comentários com autor, data e nota.
- **Barra de ação fixa** na base, com preço e botão principal ("Reservar mesa" ou "Como chegar").

### Para restaurantes / cafés / bares
- **Cardápio completo** dividido em abas (Entradas, Pratos principais, Sobremesas, Bebidas…), cada item com **foto, nome, descrição e preço**.
- CTA principal: **Reservar mesa** (abre o WhatsApp).

### Para pontos turísticos / passeios / serviços
- **Valor da entrada / ingresso**.
- **Informações importantes** (lista com marcadores).
- **Como chegar** (transporte e rota).
- CTA principal: **Como chegar** (abre o mapa).

---

## 5. Previsão do tempo

Ao selecionar a categoria **Previsão**, a Home mostra um painel meteorológico:
- **Condição atual** (card com gradiente): temperatura, sensação térmica, máx/mín, chuva, umidade e vento.
- **Ao longo do dia** — previsão por hora (carrossel).
- **Próximos 7 dias** — mín/máx e probabilidade de chuva por dia.
- **Dica contextual** para o turista.

> Hoje os dados são de exemplo; a estrutura já está pronta para conectar a uma API de clima.

---

## 6. Integrações e ações do sistema

| Função | Descrição |
|---|---|
| **Abrir mapa** (`openMaps`) | Abre Apple Maps (iOS) ou Google Maps (demais) nas coordenadas do local. |
| **WhatsApp** (`openWhatsApp`) | Abre conversa no WhatsApp com mensagem pré-preenchida citando o local. |
| **Ligar** | Abre o discador com o telefone do local. |
| **Compartilhar** | Ponto preparado para compartilhamento nativo. |
| **Favoritar** | Marca/desmarca o local (coração) — estado visual pronto para persistência. |

---

## 7. Componentes reutilizáveis

- **SearchBar** — campo de busca + botão de filtros.
- **CategoryRow / CategoryGrid** — categorias em régua e em grade.
- **FeaturedCard / PlaceCard / CompactCard** — três formatos de card de local (destaque, lista e grade).
- **FilterSheet** — painel de filtros.
- **WeatherPanel** — painel de previsão do tempo.
- **BottomNav** — navegação inferior.
- **Logo** — logotipo textual da marca.
- **MapCard / InfoRow / Menu** — blocos da página de detalhe.
- **Rating / PriceLevel / Tag / Pill / SectionHeader** — elementos de UI (nota, faixa de preço, etiquetas, cabeçalho de seção).

---

## 8. Base técnica

- **Expo SDK 57 + expo-router** — navegação por arquivos, com rotas tipadas e links diretos (deep linking) para cada local (`/place/<id>`).
- **Responsivo** — grade de recomendados alterna entre 2 e 3 colunas conforme a largura; funciona em celular e desktop.
- **Tipografia** — Poppins (títulos) + Inter (corpo).
- **Ícones** — Ionicons (sem emojis).
- **Design system** — paleta e tokens (espaçamento, raio, sombras) centralizados em `src/theme`, alinhados à logo e às cores das Cataratas.
- **Modelo de dados `Place`** — nome, categoria, fotos, descrição, endereço, coordenadas, horário, contatos, redes sociais, nota, avaliações, faixa de preço, formas de pagamento, tags, cardápio, ingresso, informações importantes e como chegar.

---

## Resumo dos requisitos atendidos

- [x] Tela inicial com destaques e locais recomendados
- [x] Lista de estabelecimentos
- [x] Categorias (restaurantes, cafés, bares, pontos turísticos, hotéis, passeios) **+ ingressos, transporte, guias e previsão do tempo**
- [x] Busca por nome ou categoria
- [x] Filtros por tipo, faixa de preço e avaliação (+ ordenação por distância)
- [x] Página individual de cada local
- [x] Página de restaurante: fotos, descrição, endereço + mapa, horário, telefone/WhatsApp, redes sociais, avaliações, faixa de preço, formas de pagamento e **cardápio por categorias**
- [x] Página de ponto turístico: fotos, descrição, localização, horário, valor da entrada, informações importantes e como chegar
- [x] Design moderno, responsivo (celular e desktop)
