import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Vector3 } from 'three'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

/**
 * Fox config
 * */
const parameters = {'speed':1}
gui.add(parameters,'speed').min(1).max(5)
// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()
//Models
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

gltfLoader.load(
    '/models/Fox/glTF/Fox.gltf',
    (gltf) => {
        gltf.scene.scale.set(0.025, 0.025, 0.025)
        gltf.scene.name = 'fox'
        scene.add(gltf.scene)
        // Animation
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[2])
        action.play()
    }
)
/**
 * Axes Helper
 * */
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/**
 * add key listener
 **/
let fox = null
window.addEventListener('keypress', (e) => {
    fox = scene.getObjectByName('fox');
    console.log(fox)
    if (e.code === 'KeyW') {
        fox.position.z += parameters.speed * Math.cos(fox.rotation._y)
        fox.position.x += parameters.speed * Math.sin(fox.rotation._y)
    }
    if (e.code === 'KeyA') {
        fox.rotation.y += Math.PI / 8
    }
    if (e.code === 'KeyD') {
        fox.rotation.y -= Math.PI / 8
    }
    camera.position.x = fox.position.x - 5 * Math.sin(fox.rotation._y)
    camera.position.z = fox.position.z - 5 * Math.cos(fox.rotation._y)
    camera.position.y = 5
    camera.lookAt(fox.position)
})
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(40, 40),
    new THREE.MeshStandardMaterial({ color: '#a9c388' })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
//gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, - 2)
//gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
//gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
//gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
//gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#87CEEB')
/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    //camera.position.x += deltaTime
    //Model animation
    if (mixer) {
        mixer.update(deltaTime)
    }
    if (fox) {
        //controls.update()
    }
    // Update controls
    //controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()