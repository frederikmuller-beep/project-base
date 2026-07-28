import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the BASE training dashboard", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="da">/i);
  assert.match(html, /<title>BASE · Training prototype<\/title>/i);
  assert.match(html, /God træning, Mikkel\./);
  assert.match(html, /Competition focus/);
  assert.match(html, /3\.100 kg/);
  assert.match(html, /samlet volumen/);
  assert.match(html, /13 øvelser · 7 kategorier/);
  assert.match(html, /DATA GEMMES IKKE/);
});
