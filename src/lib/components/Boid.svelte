<script lang="ts">
	import { Instance } from '@threlte/extras';
	import { Boid } from '$lib';

	let { boid }: { boid: Boid } = $props();

	let hovering = false;

	$inspect(boid);
	$inspect(hovering);

	//import { DEG2RAD } from 'three/src/math/MathUtils.js';
	//const initialRotation = 90 * DEG2RAD;
	//boid.rotation = [boid.rotation[0], boid.rotation[1], boid.rotation[2] + initialRotation];
</script>

<Instance
	position={boid.position}
	rotation={boid.rotation}
	onpointerenter={() => (hovering = true)}
	onpointerleave={() => (hovering = false)}
/>
