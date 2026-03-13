import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const encoder = new TextEncoder();
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      const admin = createAdminClient();
      let cancelled = false;

      const sendEvent = (data: Record<string, unknown>) => {
        if (cancelled) return;
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          // Controller already closed — clean up
          cancelled = true;
          if (intervalId) clearInterval(intervalId);
        }
      };

      // Send a heartbeat comment every 15s to keep the connection alive
      const heartbeatId = setInterval(() => {
        if (cancelled) {
          clearInterval(heartbeatId);
          return;
        }
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          cancelled = true;
          clearInterval(heartbeatId);
          if (intervalId) clearInterval(intervalId);
        }
      }, 15_000);

      let lastStatus = "";

      const poll = async (): Promise<boolean> => {
        if (cancelled) return true;

        const { data: audit, error } = await admin
          .from("audits")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !audit) {
          sendEvent({ error: "Audit not found" });
          return true;
        }

        if (audit.status !== lastStatus) {
          lastStatus = audit.status;

          if (audit.status === "completed") {
            const { data: findings } = await admin
              .from("findings")
              .select("*")
              .eq("audit_id", id)
              .order("created_at", { ascending: true });

            sendEvent({ audit, findings: findings ?? [] });
          } else {
            sendEvent({ audit });
          }
        }

        return audit.status === "completed" || audit.status === "failed";
      };

      const cleanup = () => {
        cancelled = true;
        clearInterval(heartbeatId);
        if (intervalId) clearInterval(intervalId);
      };

      try {
        const done = await poll();
        if (done) {
          cleanup();
          controller.close();
          return;
        }

        intervalId = setInterval(async () => {
          try {
            const done = await poll();
            if (done) {
              cleanup();
              controller.close();
            }
          } catch {
            cleanup();
            sendEvent({ error: "Polling failed" });
            try { controller.close(); } catch { /* already closed */ }
          }
        }, 2000);
      } catch {
        cleanup();
        sendEvent({ error: "Stream initialization failed" });
        try { controller.close(); } catch { /* already closed */ }
      }
    },
    cancel() {
      // Client disconnected — clean up the interval
      if (intervalId) clearInterval(intervalId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
