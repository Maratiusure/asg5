import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

function main() {
	const canvas = document.querySelector('#c');
	const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true });

	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.01;
	const far = 1000;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 10, 20);

    const controls = new PointerLockControls(camera, canvas);

    const scene = new THREE.Scene();

    
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
            './resources/images/Aurora/px.png',
            './resources/images/Aurora/nx.png',
            './resources/images/Aurora/py.png',
            './resources/images/Aurora/ny.png',
            './resources/images/Aurora/pz.png',
            './resources/images/Aurora/nz.png',
	] );
    scene.background = texture;
    
    let rocket = null;
    const mtlLoader = new MTLLoader();
    mtlLoader.load('./resources/obj_files/Rocket_Ship/Rocket_Ship.mtl', function (materials) {
        materials.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('./resources/obj_files/Rocket_Ship/Rocket_Ship.obj', 
            function (object) {
                object.scale.set(0.05, 0.05, 0.05);
                object.rotation.x = Math.PI * -0.5;
                object.position.set(-25, 0, 0);
                scene.add(object);
                rocket = object;
            },
            // loading is in progress
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // loading has errors
            function (error) {
                console.log('An error happened');
            }
        );
    });

	const mtlLoader2 = new MTLLoader();
	mtlLoader2.setPath('./resources/obj_files/Ground/Grass/');

	mtlLoader2.load('Grass.mtl', (materials) => {
		materials.preload();

		const objLoader2 = new OBJLoader();
		objLoader2.setMaterials(materials);
		objLoader2.setPath('./resources/obj_files/Ground/Grass/');

		objLoader2.load('Grass.obj', (object) => {
			// object.scale.set(0.05, 0.05, 0.05);
			object.position.set(0, -6, 0);
            object.rotation.x = Math.PI * -0.5;
			scene.add(object);
		});
	});

    const mtlLoader3 = new MTLLoader();
    mtlLoader3.setPath('./resources/obj_files/Trees/trees/');
    mtlLoader3.load('trees9.mtl', (materials) => {
        materials.preload();
        const objLoader3 = new OBJLoader();
        objLoader3.setMaterials(materials);
        objLoader3.setPath('./resources/obj_files/Trees/trees/');

        objLoader3.load('trees9.obj', (object) => {
            object.position.set(-60, 2, 10);
            object.rotation.y = Math.PI * 0.5;
            scene.add(object);

            // Second tree object
            const tree2 = object.clone();
            tree2.position.set(-60, 2, -40);
            tree2.rotation.set(0, 2* Math.PI, 0);
            scene.add(tree2);

            // Third tree object
            const tree3 = object.clone();
            tree3.position.set(0, 2, 50);
            tree3.rotation.set(0, Math.PI, 0);
            scene.add(tree3);

            // Fourth tree object
            const tree4 = object.clone();
            tree4.position.set(80, 2, 0);
            tree4.rotation.set(0, Math.PI * 0.5, 0);
            scene.add(tree4);
        });
    })

	// Load Rock with texture
	const rockTextureLoader = new THREE.TextureLoader();
	const rockTexture = rockTextureLoader.load('./resources/obj_files/Mountain/rock_texture.jpg');

	const rockLoader = new OBJLoader();
	rockLoader.load('./resources/obj_files/Mountain/rock.obj', 
		function (object) {
			
			object.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.material.map = rockTexture;
					child.material.needsUpdate = true;
				}
			});
			
			object.scale.set(0.5, 0.5, 0.5);
			object.position.set(10, -5, -70);
			scene.add(object);
		},
		
		function (xhr) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		
		function (error) {
			console.log('An error happened loading rock');
		}
	);

    // Building
	const building = new THREE.Group();

	// Load building texture
	const buildingTextureLoader = new THREE.TextureLoader();
	const buildingTexture = buildingTextureLoader.load('./resources/images/Build_Texture.png');

	// Left Wall
	const leftWallGeometry = new THREE.BoxGeometry(20, 1, 20);
	const leftWallMaterial = new THREE.MeshPhongMaterial({ 
		map: buildingTexture,
		color: 0xffffff
	});
	const leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
	leftWall.position.set(40, 13, 0);
	leftWall.rotation.x = Math.PI * -0.5;
    leftWall.rotation.z = Math.PI;
	building.add(leftWall);

	// Right Wall
	const rightWallGeometry = new THREE.BoxGeometry(20, 1, 20);
	const rightWallMaterial = new THREE.MeshPhongMaterial({ 
		map: buildingTexture,
		color: 0xffffff
	});
	const rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
	rightWall.position.set(40, 13, 20);
	rightWall.rotation.x = Math.PI * -0.5;
	building.add(rightWall);

	// Back Wall
	const backWallGeometry = new THREE.BoxGeometry(20, 1, 20);
	const backWallMaterial = new THREE.MeshPhongMaterial({ 
		map: buildingTexture,
		color: 0xffffff
	});
	const backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
	backWall.position.set(50, 13, 10);
	backWall.rotation.z = Math.PI * 0.5;
    backWall.rotation.x = Math.PI * -0.5;
	building.add(backWall);

    // Front Wall
    const frontWallTextureLoader = new THREE.TextureLoader();
    const frontWallTexture = frontWallTextureLoader.load('./resources/images/door.png');

    const frontWallMaterial = new THREE.MeshPhongMaterial({ 
        map: frontWallTexture,
        color: 0xffffff
    });
    const frontWallGeometry = new THREE.BoxGeometry(20, 1, 20);
    const frontWall = new THREE.Mesh(frontWallGeometry, frontWallMaterial);
    frontWall.position.set(30, 13, 10);
    frontWall.rotation.z = Math.PI * 0.5;
    frontWall.rotation.x = Math.PI * 0.5;
    building.add(frontWall);

	// Floor
	const floorGeometry = new THREE.BoxGeometry(20, 1, 20);
	const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x008888 });
	const floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.set(-25, 0.35, 0);
	building.add(floor);

	// Roof
	const roofGeometry = new THREE.ConeGeometry(15, 3, 15);
	const roofMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
	const roof = new THREE.Mesh(roofGeometry, roofMaterial);
	roof.position.set(40, 24.5, 10.25);
	roof.rotation.y = Math.PI / 4;
	building.add(roof);

	scene.add(building);

    // Load Satellite
	const mtlLoaderSatellite = new MTLLoader();
	mtlLoaderSatellite.setPath('./resources/obj_files/Antenna/93-satellite_dish_dummy/');
	mtlLoaderSatellite.load('satellite.mtl', (materials) => {
		materials.preload();
		const objLoaderSatellite = new OBJLoader();
		objLoaderSatellite.setMaterials(materials);
		objLoaderSatellite.setPath('./resources/obj_files/Antenna/93-satellite_dish_dummy/');
		objLoaderSatellite.load('satellite.obj', (object) => {
			object.scale.set(4, 4, 4); 
			object.position.set(33, 25, 5); 
			scene.add(object);
		});
	});

	// Movement speed
	const moveSpeed = 0.4;
	const lookSpeed = 0.005;
    let launchRocket = false;
	const keys = {
		ArrowUp: false,
		ArrowDown: false,
		KeyW: false,
		KeyS: false,
		KeyA: false,
		KeyD: false,
		Space: false,
		ShiftLeft: false,
        KeyP: false,
	};

	// Click handler
	canvas.addEventListener('click', function() {
		controls.lock();
	});

	// Keyboard event listener
	document.addEventListener('keydown', (event) => {
		if (keys.hasOwnProperty(event.code)) {
			keys[event.code] = true;
		}
        if (event.code === 'KeyP') {
            launchRocket = true;
        }
	});

	document.addEventListener('keyup', (event) => {
		if (keys.hasOwnProperty(event.code)) {
			keys[event.code] = false;
		}
	});

	// Visual feedback for locked state
	const instructions = document.createElement('div');
	instructions.style.position = 'absolute';
	instructions.style.top = '50%';
	instructions.style.width = '100%';
	instructions.style.textAlign = 'center';
	instructions.style.color = 'white';
	instructions.style.fontFamily = 'Arial';
	instructions.style.fontSize = '20px';
	instructions.style.pointerEvents = 'none';
	instructions.innerHTML = 'Click to play<br>WASD = Move<br>SPACE = Up<br>SHIFT = Down<br>P = Launch Rocket';
	document.body.appendChild(instructions);

	controls.addEventListener('lock', function() {
		instructions.style.display = 'none';
	});

	controls.addEventListener('unlock', function() {
		instructions.style.display = 'block';
	});

	// Rainbow Rocket Engine Effect
	const particleCount = 1000;
	const geometry = new THREE.BufferGeometry();
	const positions = [];
	const colors = [];
	const velocities = [];

	for (let i = 0; i < particleCount; i++) {
		positions.push(-25, 2, 0); 
		velocities.push(
			(Math.random() - 0.5) * 0.2, // x
			(Math.random() - 0.5) * 0.5, // y 
			(Math.random() - 0.5) * 0.2  // z
		);
		// A rainbow color using HSL
		const hue = i / particleCount; // 0 to 1
		const color = new THREE.Color();
		color.setHSL(hue, 1.0, 0.5);
		colors.push(color.r, color.g, color.b);
	}
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

	const material = new THREE.PointsMaterial({
		size: 0.4,    // Particle size
		vertexColors: true,
		transparent: true,
		opacity: 0.8,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});

	const rainbowParticles = new THREE.Points(geometry, material);
	scene.add(rainbowParticles);

	// Animate the rainbow particles
	function animateRainbowParticles() {
		if (!launchRocket || !rocket) return; 
		
		const positions = geometry.attributes.position.array;
		for (let i = 0; i < particleCount; i++) {
			positions[i * 3 + 0] += velocities[i * 3 + 0];
			positions[i * 3 + 1] += velocities[i * 3 + 1];
			positions[i * 3 + 2] += velocities[i * 3 + 2];

			if (positions[i * 3 + 1] < 1) {
				positions[i * 3 + 0] = rocket.position.x;
				positions[i * 3 + 1] = rocket.position.y + 2;
				positions[i * 3 + 2] = rocket.position.z;
			}
		}
		geometry.attributes.position.needsUpdate = true;
	}

	class ColorGUIHelper {
		constructor(object, prop) {
			this.object = object;
			this.prop = prop;
		}
		get value() {
			return `#${this.object[this.prop].getHexString()}`;
		}
		set value(hexString) {
			this.object[this.prop].set(hexString);
		}
	}

	{
		const color = 0xFFFFFF;
		const intensity = 5;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-10, 10, 0);
		light.target.position.set(-5, 0, -5);
		scene.add(light);
		scene.add(light.target);

		const helper = new THREE.DirectionalLightHelper(light);
		// scene.add(helper);

		function updateLight() {
			light.target.updateMatrixWorld();
			helper.update();
		}
		updateLight();

		const gui = new GUI();
		gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
		gui.add(light, 'intensity', 0, 5, 0.01);

		makeXYZGUI(gui, light.position, 'position', updateLight);
		makeXYZGUI(gui, light.target.position, 'target', updateLight);
	}

	function makeXYZGUI(gui, vector3, name, onChangeFn) {
		const folder = gui.addFolder(name);
		folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
		folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
		folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
		folder.open();
	}

	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
			renderer.setSize(width, height, false);
		}
		return needResize;
	}

	function render() {
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

		const time = performance.now();
		const delta = (time - prevTime) / 1000;
		
		// Limit frame rate to 60 FPS
		if (delta < 1/60) {
			requestAnimationFrame(render);
			return;
		}

		// Handle movement when locked
		if (controls.isLocked) {
			// Calculate movement direction
			const moveX = (keys.KeyD) - (keys.KeyA);
			const moveZ = (keys.KeyW) - (keys.KeyS);
			const moveY = (keys.Space) - (keys.ShiftLeft);

			if (moveX !== 0) controls.moveRight(moveX * moveSpeed);
			if (moveZ !== 0) controls.moveForward(moveZ * moveSpeed);
			if (moveY !== 0) controls.getObject().position.y += moveY * moveSpeed;
			
			if (keys.ArrowUp) {
				controls.getObject().rotation.x += lookSpeed;
			}
			if (keys.ArrowDown) {
				controls.getObject().rotation.x -= lookSpeed;
			}
		}

		if (launchRocket && rocket) {
			rocket.position.y += 0.05;
			animateRainbowParticles(); 
		}

		renderer.render(scene, camera);
		prevTime = time;
		requestAnimationFrame(render);
	}

	let prevTime = performance.now();
	requestAnimationFrame(render);
}

main();
