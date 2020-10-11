<script>
	import Navbar from "./components/navbar.svelte";
	import Home from "./components/home.svelte";
	import Baja from "./components/baja.svelte";
	import Supra from "./components/supra.svelte";
	import Aero from "./components/aero.svelte";
	import Alumini from "./components/alum.svelte";
	import Sponsor from "./components/spons.svelte";
	import Contact from "./components/contact.svelte";
	import Socials from "./micro/socials.svelte";

	import { fade } from "svelte/transition";
	import data from "./core/data.json";

	$: page = "Baja";

	const options = [
		{ name: "Baja", component: Baja },
		{ name: "Alumini", component: Alumini },
		{ name: "Contact", component: Contact },
	];
</script>

<style>
</style>

<main id="docTop">
	<Navbar bind:page {options} />
	{#each options as pg}
		{#if page == pg.name}
			<section transition:fade>
				<svelte:component
					this={pg.component}
					data={data[pg.name.toLowerCase()]} />
			</section>
		{/if}
	{/each}
	<!-- <Socials /> -->
</main>
