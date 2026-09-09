export type UserAccount = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  salt: string;
  createdAt: number;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: number;
};

export function toPublicUser(u: UserAccount): PublicUser {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, createdAt: u.createdAt };
}
