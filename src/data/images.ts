/** URLs de imagem (Unsplash). Helper com parâmetros de otimização. */
const u = (id: string, w = 1080) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const img = {
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
