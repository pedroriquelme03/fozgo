/** Unsplash (restaurantes, cafés, bares, hotéis) e Wikimedia Commons (pontos de Foz). */
const u = (id: string, w = 1080) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const uHd = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=82`;

const wiki = (path: string) => `https://upload.wikimedia.org/wikipedia/commons/${path}`;

export const img = {
  // ── Cataratas do Iguaçu (fotos do próprio parque) ──
  cataratas1: uHd('1648510399328-b8981e9fc1bb'), // passarela + quedas
  cataratas2: wiki(
    'thumb/7/70/Garganta_do_Diabo_-_Cataratas_do_Igua%C3%A7u.JPG/1280px-Garganta_do_Diabo_-_Cataratas_do_Igua%C3%A7u.JPG',
  ),
  cataratas3: wiki(
    'thumb/a/a4/Passarela_de_Observa%C3%A7%C3%A3o_-_Cataratas_do_Igua%C3%A7u.JPG/1280px-Passarela_de_Observa%C3%A7%C3%A3o_-_Cataratas_do_Igua%C3%A7u.JPG',
  ),
  cataratas4: uHd('1541686826972-068336f11d45'), // mirante lado BR
  cataratas5: uHd('1754944870869-b0db94b8338f'), // cortina de quedas
  cataratas6: uHd('1543387788-b63c818fddb7'), // Garganta do Diabo

  // ── Marco das Três Fronteiras ──
  marco1: wiki('7/71/Marco_das_Tr%C3%AAs_Fronteiras_-_Foz_do_Igua%C3%A7u.jpg'),
  marco2: wiki(
    'thumb/a/ac/Marcos_das_Tres_Fronteiras_-_Foz_do_Iguacu.jpg/1280px-Marcos_das_Tres_Fronteiras_-_Foz_do_Iguacu.jpg',
  ),
  marco3: wiki('thumb/4/4a/Marco_das_Tr%C3%AAs_Fronteiras.jpg/1280px-Marco_das_Tr%C3%AAs_Fronteiras.jpg'),

  // ── Parque das Aves ──
  aves1: wiki(
    'd/db/Arara_Vermelha_-_Parque_das_aves_-_Foz_do_Iguacu_-_Brasil_%2823982184550%29.jpg',
  ),
  aves2: wiki('3/30/Arara_Azul-_Parque_das_aves_-_Foz_do_Iguacu_-_Brasil_%2824251638006%29.jpg'),
  aves3: wiki('thumb/b/b4/Tucano_parque_das_aves_foz.jpg/1280px-Tucano_parque_das_aves_foz.jpg'),
  aves4: wiki('thumb/1/13/Parque_das_Aves.jpg/1280px-Parque_das_Aves.jpg'),

  // ── Usina de Itaipu ──
  itaipu1: wiki('thumb/a/a3/Barragem_de_Itaipu_%288155763889%29.jpg/1280px-Barragem_de_Itaipu_%288155763889%29.jpg'),
  itaipu2: wiki(
    '5/5e/Over_the_main_Dam_-_Sobre_a_barragem_principal_-_Itaipu_-_Foz_do_Iguacu_-_Brasil_%2824277757365%29.jpg',
  ),
  itaipu3: wiki(
    '7/7b/Ilumina%C3%A7%C3%A3o_da_barragem_de_Itaipu_%288152312286%29.jpg',
  ),
  itaipuLago: wiki(
    'thumb/a/ad/Usina_Hidroel%C3%A9trica_Itaipu_Binacional_-_Itaipu_Dam_-_Lago_Itaipu_-_Itaipu_Lake_%2817360934545%29.jpg/1280px-Usina_Hidroel%C3%A9trica_Itaipu_Binacional_-_Itaipu_Dam_-_Lago_Itaipu_-_Itaipu_Lake_%2817360934545%29.jpg',
  ),

  // ── Macuco / barco nas quedas ──
  macuco: uHd('1542637297-1318423100cf'),

  // ── Demais (restaurantes, cafés, bares, hotéis — inalterados) ──
  falls: u('1432405972618-c60b0225b8f9'),
  forest: u('1441974231531-c6227db76b6e'),
  river: u('1552465011-b4e21bf6e79a'),
  parrot: u('1552728089-57bdde30beb3'),
  bird: u('1444464666168-49d633b86797'),
  boat: u('1544551763-46a013bb70d5'),
  boat2: u('1502933691298-84fc14542831'),

  restaurant1: u('1517248135467-4c7edcad34c4'),
  restaurant2: u('1552566626-52f8b828add9'),
  steak: u('1546069901-ba9599a7e63c'),
  plate: u('1600891964599-f61ba0e24092'),
  table: u('1414235077428-338989a2e8c0'),
  dish: u('1504674900247-0877df9cc836'),

  cafe1: u('1495474472287-4d71bcdd2085'),
  cafe2: u('1509042239860-f550ce710b93'),
  coffee: u('1445116572660-236099ec97a0'),

  bar1: u('1514933651103-005eec06c04b'),
  drinks: u('1470337458703-46ad1756a187'),
  cocktail: u('1544145945-f90425340c7e'),

  hotel1: u('1566073771259-6a8506099945'),
  hotelRoom: u('1571896349842-33c89424de2d'),
  hotelPool: u('1590490360182-c33d57733427'),
};

export const uImg = u;
