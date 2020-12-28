<script>
      import Company from "../micro/company.svelte";
      export let data;
</script>

<style>
      section {
            padding-top: 4em;
      }
</style>

<section>
      <div style="display:flex;flex-wrap:wrap;  ">
            {#each data.companies as cpy}
                  <Company {cpy} />
            {/each}
      </div>
</section>
