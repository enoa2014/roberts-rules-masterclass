type SessionEvent = {
  event: string;
  data: unknown;
};

type SessionClient = {
  push: (payload: SessionEvent) => void;
};

const channels = new Map<number, Set<SessionClient>>();
const encoder = new TextEncoder();

function toSseChunk(event: string, data: unknown) {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function addClient(sessionId: number, client: SessionClient) {
  if (!channels.has(sessionId)) {
    channels.set(sessionId, new Set());
  }
  channels.get(sessionId)?.add(client);
}

function removeClient(sessionId: number, client: SessionClient) {
  const bucket = channels.get(sessionId);
  if (!bucket) {
    return;
  }

  bucket.delete(client);
  if (bucket.size === 0) {
    channels.delete(sessionId);
  }
}

export function publishSessionEvent(sessionId: number, event: string, data: unknown) {
  const bucket = channels.get(sessionId);
  if (!bucket || bucket.size === 0) {
    return;
  }

  for (const client of bucket) {
    client.push({ event, data });
  }
}

export function createSseResponse(
  sessionId: number,
  getSnapshot: () => Promise<unknown>,
) {
  let clientRef: SessionClient | null = null;
  let heartbeatRef: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      clientRef = {
        push(payload) {
          controller.enqueue(toSseChunk(payload.event, payload.data));
        },
      };

      addClient(sessionId, clientRef);
      controller.enqueue(toSseChunk("connected", { sessionId }));

      try {
        const snapshot = await getSnapshot();
        controller.enqueue(toSseChunk("snapshot", snapshot));
      } catch (error) {
        controller.enqueue(
          toSseChunk("snapshot_error", {
            message: "初始化快照失败",
          }),
        );
        console.error("SSE snapshot error", error);
      }

      heartbeatRef = setInterval(() => {
        controller.enqueue(toSseChunk("heartbeat", { timestamp: new Date().toISOString() }));
      }, 30_000);
    },
    cancel() {
      if (heartbeatRef) {
        clearInterval(heartbeatRef);
      }
      if (clientRef) {
        removeClient(sessionId, clientRef);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
