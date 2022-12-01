import gsap from 'gsap'

export function changeObjectOpacity(object: THREE.Object3D, opacity: number, duration: number) {
    const {material} = object as THREE.Mesh
    if (opacity !== 0) object.visible = true

    gsap.to(material, {
        opacity,
        duration,
    }).then(() => {object.visible = opacity !== 0})
}