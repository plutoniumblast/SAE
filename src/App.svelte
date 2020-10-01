<script>
	import Navbar from "./components/navbar.svelte";
	import Home from "./components/home.svelte";
	import Baja from "./components/baja.svelte";
	import Supra from "./components/supra.svelte";
	import Aero from "./components/aero.svelte";
	import Socials from "./micro/socials.svelte";

	$: tab = "home";
</script>

<style>
</style>

<main>
	<Navbar />
	{#if tab == 'home'}
		<Home />
	{:else if tab == 'baja'}
		<Baja />
	{:else if tab == 'supra'}
		<Supra />
	{:else if tab == 'aero'}
		<Aero />
	{/if}
	<Socials />
</main>
