<script lang="ts">
	import { T } from '@threlte/core';
	import { Grid, OrbitControls, interactivity, PerfMonitor } from '@threlte/extras';
	import BoidScene from './BoidScene.svelte';
	import { dev } from '$app/environment';
	import { DEG2RAD } from 'three/src/math/MathUtils.js';

	interactivity();
</script>

{#if dev}
	<PerfMonitor anchorX={'right'} logsPerSecond={30} />
	<T.AxesHelper scale={2} position={[-10.5, -10.5, 0]} />
{/if}

<T.PerspectiveCamera makeDefault position={[0, 0, 30]} fov={45}>
	<OrbitControls />
</T.PerspectiveCamera>

<T.DirectionalLight intensity={0.8} position.x={5} position.y={10} />
<T.AmbientLight intensity={0.2} />

<Grid
	position.z={-0.5}
	cellColor="#404040"
	sectionColor="#505050"
	sectionThickness={1.0}
	sectionSize={5}
	fadeDistance={1000}
	cellSize={1}
	rotation.x={90 * DEG2RAD}
/>

<BoidScene />
