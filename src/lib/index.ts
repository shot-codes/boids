export class Boid {
	position: [x: number, y: number, z: number];
	rotation: [x: number, y: number, z: number];
	velocity: [x: number, y: number, z: number];

	constructor({
		position = [0, 0, 0],
		rotation = [0, 0, 0],
		velocity = [0, 0, 0]
	}: {
		position?: [number, number, number];
		rotation?: [number, number, number];
		velocity?: [number, number, number];
	} = {}) {
		this.position = position;
		this.rotation = rotation;
		this.velocity = velocity;
	}
}
