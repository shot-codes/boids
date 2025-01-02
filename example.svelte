<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let lastFrameTime = performance.now();

	let fps = $state(0);
	let cohesion = $state(40);
	let separation = $state(15);
	let alignment = $state(50);
	let turbulence = $state(0.5);
	let maxSpeed = $state(5);
	let mouseX = $state(0);
	let mouseY = $state(0);
	let avoidMouse = $state(true);
	let attractMouse = $state(false);

	onMount(() => {
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		canvas.width = window.innerWidth;
		canvas.height = window.innerWidth;

		const boids = Array.from(
			{ length: 100 },
			() => new Boid(Math.random() * canvas.width, Math.random() * canvas.height)
		);

		function loop(currentTime: number) {
			const deltaTime = currentTime - lastFrameTime;
			lastFrameTime = currentTime;
			fps = Math.round(1000 / deltaTime);

			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.beginPath();
			ctx.arc(mouseX, mouseY, 5, 0, Math.PI * 2);
			ctx.fillStyle = 'red';
			ctx.fill();

			for (const boid of boids) {
				boid.update(boids);
			}

			requestAnimationFrame(loop);
		}

		requestAnimationFrame(loop);
	});

	function onmousemove(event: MouseEvent) {
		const rect = canvas.getBoundingClientRect();
		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;
	}

	class Boid {
		x: number;
		y: number;
		vx: number;
		vy: number;

		constructor(x: number, y: number) {
			this.x = x;
			this.y = y;
			this.vx = Math.random() - 1;
			this.vy = Math.random() - 1;
		}

		update(boids: Boid[]) {
			this.align(boids);
			this.cohesion(boids);
			this.separation(boids);
			this.addTurbulence();
			this.avoidWalls();
			this.limitSpeed();

			if (avoidMouse) this.avoidMouse();
			if (attractMouse) this.attractMouse();

			this.x += this.vx;
			this.y += this.vy;

			this.draw();
		}

		separation(boids: Boid[]) {
			let moveX = 0;
			let moveY = 0;
			let count = 0;

			for (const boid of boids) {
				const distance = Math.hypot(this.x - boid.x, this.y - boid.y);
				if (distance < separation && boid !== this) {
					moveX += this.x - boid.x;
					moveY += this.y - boid.y;
					count++;
				}
			}

			if (count > 0) {
				moveX /= count;
				moveY /= count;

				this.vx += moveX * 0.05;
				this.vy += moveY * 0.05;
			}
		}

		align(boids: Boid[]) {
			let avgVx = 0;
			let avgVy = 0;
			let count = 0;

			for (const boid of boids) {
				const distance = Math.hypot(this.x - boid.x, this.y - boid.y);
				if (distance < alignment && boid !== this) {
					avgVx += boid.vx;
					avgVy += boid.vy;
					count++;
				}
			}

			if (count > 0) {
				avgVx /= count;
				avgVy /= count;

				this.vx += (avgVx - this.vx) * 0.05;
				this.vy += (avgVy - this.vy) * 0.05;
			}
		}

		cohesion(boids: Boid[]) {
			let avgX = 0;
			let avgY = 0;
			let count = 0;

			for (const boid of boids) {
				const distance = Math.hypot(this.x - boid.x, this.y - boid.y);
				if (distance < cohesion && boid !== this) {
					avgX += boid.x;
					avgY += boid.y;
					count++;
				}
			}

			if (count > 0) {
				avgX /= count;
				avgY /= count;

				this.vx += (avgX - this.x) * 0.01;
				this.vy += (avgY - this.y) * 0.01;
			}
		}

		avoidWalls() {
			const avoidDistance = canvas.width / 10;

			if (this.x < avoidDistance) {
				this.vx += (avoidDistance - this.x) / avoidDistance;
			}
			if (this.x > canvas.width - avoidDistance) {
				this.vx -= (this.x - (canvas.width - avoidDistance)) / avoidDistance;
			}
			if (this.y < avoidDistance) {
				this.vy += (avoidDistance - this.y) / avoidDistance;
			}
			if (this.y > canvas.height - avoidDistance) {
				this.vy -= (this.y - (canvas.height - avoidDistance)) / avoidDistance;
			}
		}

		avoidMouse() {
			const avoidDistance = canvas.width / 10;
			const distance = Math.hypot(this.x - mouseX, this.y - mouseY);

			if (distance < avoidDistance) {
				const moveX = this.x - mouseX;
				const moveY = this.y - mouseY;

				this.vx += (avoidDistance - distance) * (moveX / distance) * 0.05;
				this.vy += (avoidDistance - distance) * (moveY / distance) * 0.05;
			}
		}

		attractMouse() {
			const attractDistance = 500;
			const distance = Math.hypot(this.x - mouseX, this.y - mouseY);

			if (distance < attractDistance) {
				const moveX = mouseX - this.x;
				const moveY = mouseY - this.y;

				this.vx += (attractDistance - distance) * (moveX / distance) * 0.0005;
				this.vy += (attractDistance - distance) * (moveY / distance) * 0.0005;
			}
		}

		limitSpeed() {
			const speed = Math.hypot(this.vx, this.vy);
			if (speed > maxSpeed) {
				this.vx = (this.vx / speed) * maxSpeed;
				this.vy = (this.vy / speed) * maxSpeed;
			}
		}

		addTurbulence() {
			this.vx += (Math.random() - 0.5) * turbulence;
			this.vy += (Math.random() - 0.5) * turbulence;
		}

		draw() {
			const angle = Math.atan2(this.vy, this.vx);

			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(angle);

			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(10, 5);
			ctx.lineTo(0, 5);
			ctx.closePath();

			ctx.fillStyle = 'white';
			ctx.fill();
			ctx.restore();
		}
	}
</script>

<h1>Boids</h1>

<p>FPS: {fps}</p>
<div>
	<p>{mouseX}</p>
	<p>{mouseY}</p>
</div>

<canvas bind:this={canvas} {onmousemove}></canvas>

<h2>Settings</h2>

<div>
	<p>Cohesion</p>
	<input type="range" bind:value={cohesion} min={0} max={100} step={0.01} />
	<p>Separation</p>
	<input type="range" bind:value={separation} min={0} max={100} step={0.01} />
	<p>Alignment</p>
	<input type="range" bind:value={alignment} min={0} max={100} step={0.01} />
	<p>Turbulence</p>
	<input type="range" bind:value={turbulence} min={0} max={1} step={0.01} />
	<p>Max Speed</p>
	<input type="range" bind:value={maxSpeed} min={0} max={20} step={0.1} />
	<p>Avoid Mouse</p>
	<input type="checkbox" bind:checked={avoidMouse} />
	<p>Attract Mouse</p>
	<input type="checkbox" bind:checked={attractMouse} />
</div>

<style>
	div {
		display: grid;
		grid-template-columns: 10rem 1fr;
		gap: 1rem;
	}
</style>
