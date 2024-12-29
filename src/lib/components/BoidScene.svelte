<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { InstancedMesh, Instance } from '@threlte/extras';
	import { getRandomBoids } from '$lib/utils';
	import { DEG2RAD } from 'three/src/math/MathUtils.js';

	const boids = getRandomBoids({
		count: 10
	});

	useTask((delta) => {
		for (let i = 0; i < boids.length; i++) {
			// set rotation to direction of travel
			const angle = Math.atan2(boids[i].velocity[1], boids[i].velocity[0]) - 90 * DEG2RAD;
			boids[i].rotation[2] = angle;

			// update position
			boids[i].position[0] = boids[i].position[0] += boids[i].velocity[0] * delta;
			boids[i].position[1] = boids[i].position[1] += boids[i].velocity[1] * delta;
		}
	});
</script>

<InstancedMesh>
	<T.ConeGeometry args={[0.2, 0.7, 3]} />
	<T.MeshBasicMaterial />

	{#each boids as boid}
		<Instance position={boid.position} rotation={boid.rotation} />
	{/each}
</InstancedMesh>
