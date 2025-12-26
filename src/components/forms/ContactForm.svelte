<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let name = "";
  let email = "";
  let phone = "";
  let message = "";
  let accept = false;
  let status: "idle" | "sending" | "success" | "error" = "idle";

  const submit = async (e: Event) => {
    e.preventDefault();
    if (!name || !email || !message || !accept) return;
    status = "sending";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });
      if (res.ok) {
        status = "success";
        name = email = phone = message = "";
        accept = false;
        dispatch("submitted");
      } else {
        status = "error";
      }
    } catch (e) {
      status = "error";
    }
  };
</script>

<form class="space-y-4" on:submit|preventDefault={submit} aria-label="Formulario de contacto">
  <div>
    <label class="block text-sm font-medium text-slate-700">Nombre</label>
    <input class="mt-1 block w-full rounded border px-3 py-2" bind:value={name} required />
  </div>
  <div>
    <label class="block text-sm font-medium text-slate-700">Email</label>
    <input type="email" class="mt-1 block w-full rounded border px-3 py-2" bind:value={email} required />
  </div>
  <div>
    <label class="block text-sm font-medium text-slate-700">Teléfono (opcional)</label>
    <input class="mt-1 block w-full rounded border px-3 py-2" bind:value={phone} />
  </div>
  <div>
    <label class="block text-sm font-medium text-slate-700">Mensaje</label>
    <textarea class="mt-1 block w-full rounded border px-3 py-2" rows="5" bind:value={message} required></textarea>
  </div>
  <div class="flex items-start gap-2">
    <input id="privacy" type="checkbox" class="mt-1" bind:checked={accept} />
    <label for="privacy" class="text-sm">He leído y acepto la <a href="/legal/politica-privacidad" class="underline">política de privacidad</a>.</label>
  </div>

  <div>
    <button class="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700" type="submit" disabled={status === 'sending'}>Enviar</button>
  </div>

  {#if status === 'success'}
    <p class="text-sm text-emerald-700">Gracias — hemos recibido tu mensaje y te responderemos a la mayor brevedad.</p>
  {/if}
  {#if status === 'error'}
    <p class="text-sm text-rose-700">Error enviando el mensaje — por favor inténtalo de nuevo.</p>
  {/if}
</form>
