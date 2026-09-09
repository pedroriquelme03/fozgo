let userId: string | null = null;
let userName: string | null = null;
const listeners = new Set<() => void>();

export function getCurrentUserId() {
  return userId;
}

export function isAccountLinked() {
  return userId != null;
}

export function getActorName() {
  return userName ?? 'Você';
}

export function setSession(next: { userId: string | null; name: string | null }) {
  userId = next.userId;
  userName = next.name;
  listeners.forEach((fn) => fn());
}

export function subscribeSession(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}
