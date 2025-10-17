<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'

  export let keyword: string = ''
  export let mode: 'popup' | 'inline' = 'popup'

  // 부모가 넘겨줄 옵션 타입 정의
  interface CaptureOption {
    keyword?: string
    mode?: 'popup' | 'inline'
  }

  const dispatch = createEventDispatcher<{
    upload: { dataUrl: string; keyword: string } // 업로드 시 base64 이미지 반환
    close: void // 닫기
    clear: void // 이미지 제거
  }>()

  let captureEl: HTMLDivElement | null = null

  /** 이미지 제거 */
  function clearCapture() {
    if (captureEl) {
      captureEl.querySelectorAll('img').forEach((img) => img.remove())
    }
    dispatch('clear')
  }

  /** 닫기 */
  function closeForm() {
    dispatch('close')
  }

  /** 업로드 */
  function uploadForm() {
    if (!captureEl) return
    const img = captureEl.querySelector('img')
    if (!img?.src) {
      alert('첨부된 상징이 없습니다.') // aac_web.toast.error 대체
      return
    }
    dispatch('upload', { dataUrl: img.src, keyword })
  }

  onDestroy(() => {
    // cleanup 필요 시
  })
</script>

<div class="img-capture {mode}">
  <div><span class="word">{keyword}</span></div>

  <div
    class="canvas"
    contenteditable="true"
    style="min-width: 400px; min-height: 300px"
    bind:this={captureEl}
  ></div>

  <div class="ctrl">
    <p class="label">캡쳐한 이미지를 복사(Ctrl+C)하여 붙여넣기(Ctrl+V)</p>
    <p class="label">상징 500px X 500px, 또는 300px X 300px 권장</p>
    <button class="btn btn-primary" on:click={uploadForm}>바로 등록</button>
    <button class="btn btn-danger" on:click={closeForm}>취소</button>
  </div>
</div>

<style lang="scss">
  .img-capture {
    padding: 1rem;
    background: #fff;
  }
  .canvas {
    border: 1px dashed #aaa;
    margin: 0.5rem 0;
    min-height: 300px;
  }
  .ctrl {
    margin-top: 0.5rem;
  }
</style>
