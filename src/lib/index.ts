import { DEG2RAD } from 'three/src/math/MathUtils.js';

const alignDistance = 1.0;
const avoidDistance = 0.3;
const cohesionDistance = 0.8;
const alignFactor = 0.05;
const avoidFactor = 0.05;
const cohesionFactor = 0.01;
const maxSpeed = 8;
const minSpeed = 5;

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
	}) {
		this.position = position;
		this.rotation = rotation;
		this.velocity = velocity;
	}

	update(delta: number, boids: Boid[]) {
		this.rotateToDirectionOfTravel();
		this.align(boids);
		this.cohesion(boids);
		this.separation(boids);
		//this.addTurbulence();
		this.avoidWalls();
		this.limitSpeed();
		this.advancePosition(delta);
	}

	private rotateToDirectionOfTravel(): void {
		const angle = Math.atan2(this.velocity[1], this.velocity[0]) - 90 * DEG2RAD;
		this.rotation[2] = angle;
	}

	private advancePosition(delta: number): void {
		this.position = [
			this.position[0] + this.velocity[0] * delta,
			this.position[1] + this.velocity[1] * delta,
			this.position[2] + this.velocity[2] * delta
		];
	}

	private align(boids: Boid[]) {
		let averageVx = 0;
		let averageVy = 0;
		let count = 0;

		for (let i = 0; i < boids.length; i++) {
			const distance = Math.hypot(
				this.position[0] - boids[i].position[0],
				this.position[1] - boids[i].position[1]
			);
			if (distance < alignDistance && boids[i] !== this) {
				averageVx += boids[i].velocity[0];
				averageVy += boids[i].velocity[1];
				count++;
			}
		}
		if (count > 0) {
			averageVx /= count;
			averageVy /= count;

			this.velocity[0] += (averageVx - this.velocity[0]) * alignFactor;
			this.velocity[1] += (averageVy - this.velocity[1]) * alignFactor;
		}
	}

	private separation(boids: Boid[]) {
		let close_dx = 0;
		let close_dy = 0;
		let count = 0;

		for (let i = 0; i < boids.length; i++) {
			const distance = Math.hypot(
				this.position[0] - boids[i].position[0],
				this.position[1] - boids[i].position[1]
			);
			if (distance < avoidDistance && boids[i] !== this) {
				close_dx += this.position[0] - boids[i].position[0];
				close_dy += this.position[1] - boids[i].position[1];
				count++;
			}
		}
		if (count > 0) {
			close_dx /= count;
			close_dy /= count;

			this.velocity[0] += close_dx * avoidFactor;
			this.velocity[1] += close_dy * avoidFactor;
		}
	}

	private cohesion(boids: Boid[]) {
		let averageX = 0;
		let averageY = 0;
		let count = 0;

		for (let i = 0; i < boids.length; i++) {
			const distance = Math.hypot(
				this.position[0] - boids[i].position[0],
				this.position[1] - boids[i].position[1]
			);
			if (distance < cohesionDistance && boids[i] !== this) {
				averageX += boids[i].position[0];
				averageY += boids[i].position[1];
				count++;
			}
		}
		if (count > 0) {
			averageX /= count;
			averageY /= count;

			this.velocity[0] += (averageX - this.position[0]) * cohesionFactor;
			this.velocity[1] += (averageY - this.position[1]) * cohesionFactor;
		}
	}

	private limitSpeed() {
		const speed = Math.hypot(this.velocity[0], this.velocity[1]);

		if (speed < minSpeed) {
			this.velocity[0] = (this.velocity[0] / speed) * minSpeed;
			this.velocity[1] = (this.velocity[1] / speed) * minSpeed;
		}
		if (speed > maxSpeed) {
			this.velocity[0] = (this.velocity[0] / speed) * maxSpeed;
			this.velocity[1] = (this.velocity[1] / speed) * maxSpeed;
		}
	}

	private avoidWalls() {
		const avoidDistance = 1;
		const minX = -10,
			maxX = 10;
		const minY = -10,
			maxY = 10;

		if (this.position[0] < minX + avoidDistance) {
			this.velocity[0] += (minX + avoidDistance - this.position[0]) / avoidDistance;
		}
		if (this.position[0] > maxX - avoidDistance) {
			this.velocity[0] -= (this.position[0] - (maxX - avoidDistance)) / avoidDistance;
		}
		if (this.position[1] < minY + avoidDistance) {
			this.velocity[1] += (minY + avoidDistance - this.position[1]) / avoidDistance;
		}
		if (this.position[1] > maxY - avoidDistance) {
			this.velocity[1] -= (this.position[1] - (maxX - avoidDistance)) / avoidDistance;
		}
	}
}
