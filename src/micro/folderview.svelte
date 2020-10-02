<script>
      import { slide } from "svelte/transition";

      export let pics;

      $: disp = 0;

      console.log(pics.length);
      const decr = () => {
            disp = disp == 0 ? pics.length - 1 : disp - 1;
      };
      const incr = () => {
            disp = disp == pics.length - 1 ? 0 : disp + 1;
            console.log(disp);
      };
</script>

<style type="text/scss">
      .right,
      .left {
            position: absolute;
            top: 45%;
            z-index: 3;
            svg {
                  color: #fff;
                  height: 2em;
                  width: 2em;
            }
      }
      .right {
            right: 0;
      }
      .left {
            left: 0;
      }
      .picture {
            position: absolute;
            background: #00000088;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            img {
                  width: 80%;
                  height: auto;
                  max-height: 80%;
            }
      }
</style>

<div class="slider">
      <div class="left" on:click={decr}>
            <svg
                  id="i-chevron-left"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  width="32"
                  height="32"
                  fill="none"
                  stroke="currentcolor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2">
                  <path d="M20 30 L8 16 20 2" />
            </svg>
      </div>
      {#each pics as pic, i}
            <div class="picture">
                  {#if i == disp}<img transition:slide src={pic} alt="" />{/if}
            </div>
      {/each}
      <div class="right" on:click={incr}>
            <svg
                  id="i-chevron-right"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  width="32"
                  height="32"
                  fill="none"
                  stroke="currentcolor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2">
                  <path d="M12 30 L24 16 12 2" />
            </svg>
      </div>
</div>
