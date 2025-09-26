<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import * as bootstrap from "bootstrap";

  export let showModal: boolean = false;
  export let title: string = "";

  let modalElement: HTMLElement;
  let modal: bootstrap.Modal;
  const dispatch = createEventDispatcher();

  onMount(() => {
    if (modalElement) {
      modal = new bootstrap.Modal(modalElement);
      modalElement.addEventListener("hidden.bs.modal", () => {
        showModal = false;
        dispatch("close");
      });
    }
  });

  $: if (modal) {
    if (showModal) {
      modal.show();
    } else {
      modal.hide();
    }
  }
</script>

<div
  class="modal fade"
  bind:this={modalElement}
  tabindex="-1"
  aria-labelledby="modalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalLabel">{title}</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal">Close</button
          >
        </slot>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
</style>
