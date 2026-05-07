let listeners = [];

export function notify(type, message) {
  listeners.forEach((cb) => cb({ type, message, id: Date.now() }));
}

export function subscribeNotification(cb) {
  listeners.push(cb);

  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}