import { Boid } from '$lib';
import { DEG2RAD } from 'three/src/math/MathUtils.js';

export const getRandomBoids = ({
	count = 10,
	positionRange = { x: [-1, 1], y: [-1, 1], z: [0, 0] },
	rotationRange = { x: [0, 0], y: [0, 0], z: [0, 360 * DEG2RAD] },
	velocityRange = { z: [-0 * DEG2RAD, 360 * DEG2RAD] }
}: {
	count: number;
	positionRange?: {
		x: [number, number];
		y: [number, number];
		z: [number, number];
	};
	rotationRange?: {
		x: [number, number];
		y: [number, number];
		z: [number, number];
	};
	velocityRange?: {
		z: [number, number];
	};
}): Boid[] => {
	const boids: Boid[] = [];

	for (let i = 0; i < count; i++) {
		const position: [number, number, number] = [
			Math.random() * (positionRange.x[1] - positionRange.x[0]) + positionRange.x[0],
			Math.random() * (positionRange.y[1] - positionRange.y[0]) + positionRange.y[0],
			Math.random() * (positionRange.z[1] - positionRange.z[0]) + positionRange.z[0]
		];

		const rotation: [number, number, number] = [
			Math.random() * (rotationRange.x[1] - rotationRange.x[0]) + rotationRange.x[0],
			Math.random() * (rotationRange.y[1] - rotationRange.y[0]) + rotationRange.y[0],
			Math.random() * (rotationRange.z[1] - rotationRange.z[0]) + rotationRange.z[0]
		];

		const angle = Math.random() * (velocityRange.z[1] - velocityRange.z[0]) + velocityRange.z[0];
		const velocityMagnitude = 1;
		const v_x = velocityMagnitude * Math.cos(angle);
		const v_y = velocityMagnitude * Math.sin(angle);
		const velocity: [number, number, number] = [v_x, v_y, 0];

		boids.push(new Boid({ position, rotation, velocity }));
	}

	return boids;
};
