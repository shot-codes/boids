<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/components/Scene.svelte';
</script>

<Canvas>
	<Scene />
</Canvas>

<style>
	:global(body) {
		width: 100vw;
		height: 100vh;
		background: rgb(0, 0, 0);
		margin: 0;
	}
</style>
