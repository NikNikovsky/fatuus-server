type Handler = (msg: any, meta: { userId?: string; ws?: any }) => void | Promise<void>;

const handlers: Record<string, Handler[]> = {};

export function registerHandler(type: string, h: Handler) {
  handlers[type] = handlers[type] || [];
  handlers[type].push(h);
}

export async function handleIncoming(msg: any, meta: { userId?: string; ws?: any }) {
  if (!msg || typeof msg.type !== 'string') return;
  const list = handlers[msg.type] || [];
  for (const h of list) {
    try {
      // don't await to avoid blocking other handlers, but catch errors
      // await h(msg, meta);
      void h(msg, meta);
    } catch (err) {
      // ignore handler errors
    }
  }
}
