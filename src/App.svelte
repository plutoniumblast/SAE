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

	import { slide } from "svelte/transition";

	import data from "./core/data.json";

	$: tab = "baja";
</script>

<style>
</style>

<main>
	<Navbar />
	{#if tab == 'home'}
		<div transition:slide>
			<Home />
		</div>
	{:else if tab == 'baja'}
		<div transition:slide>
			<Baja />
		</div>
	{:else if tab == 'supra'}
		<div transition:slide>
			<Supra />
		</div>
	{:else if tab == 'aero'}
		<div transition:slide>
			<Aero />
		</div>
	{:else if tab == 'alum'}
		<div transition:slide>
			<Alum />
		</div>
	{:else if tab == 'spons'}
		<div transition:slide>
			<Spons />
		</div>
	{:else if tab == 'contact'}
		<div transition:slide>
			<Contact />
		</div>
	{/if}
	<Socials />
</main>
