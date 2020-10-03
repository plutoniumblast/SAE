<script>
	import Navbar from "./components/navbar.svelte";
	import Home from "./components/home.svelte";
	import Baja from "./components/baja.svelte";
	import Supra from "./components/supra.svelte";
	import Aero from "./components/aero.svelte";
	import Alum from "./components/alum.svelte";
	import Spons from "./components/spons.svelte";
	import Contact from "./components/contact.svelte";
	import Socials from "./micro/socials.svelte";

	import { fade } from "svelte/transition";
	import data from "./core/data.json";

	$: page = "baja";
	const chPg = (e) => {
		page = e.detail.text;
	};
</script>

<style>
</style>

<main id="docTop">
	<Navbar on:page={chPg} />
	{#if page == 'home'}
		<div transition:fade>
			<Home />
		</div>
	{:else if page == 'baja'}
		<div transition:fade>
			<Baja data={data.baja} />
		</div>
	{:else if page == 'supra'}
		<div transition:fade>
			<Supra />
		</div>
	{:else if page == 'aero'}
		<div transition:fade>
			<Aero />
		</div>
	{:else if page == 'alum'}
		<div transition:fade>
			<Alum />
		</div>
	{:else if page == 'spons'}
		<div transition:fade>
			<Spons />
		</div>
	{:else if page == 'contact'}
		<div transition:fade>
			<Contact data={data.contact} />
		</div>
	{/if}
	<!-- <Socials /> -->
</main>
