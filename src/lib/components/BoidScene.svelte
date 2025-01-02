<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { InstancedMesh, Instance } from '@threlte/extras';
	import { getRandomBoids } from '$lib/utils';
	import { Pane, Button } from 'svelte-tweakpane-ui';

	let boids = getRandomBoids({
		//count: 10000
		count: 100,
		positionRange: { x: [-3, 3], y: [-3, 3], z: [0, 0] }
	});

	useTask((delta) => {
		for (let i = 0; i < boids.length; i++) {
			boids[i].update(delta, boids);
		}
		boids = boids;
	});
</script>

<Pane position="draggable" title="pane" y={5} x={5}>
	<Button
		on:click={() => {
			console.log('clicked');
		}}
		label="test"
		title="test"
	/>
</Pane>

<InstancedMesh>
	<T.ConeGeometry args={[0.1, 0.35, 3]} />
	<T.MeshBasicMaterial />
	{#each boids as boid}
		<Instance position={boid.position} rotation={boid.rotation} />
	{/each}
</InstancedMesh>
