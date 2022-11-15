import gsap from 'gsap'

// functions works recursively
export function changeGroupOpacity(object: THREE.Object3D, opacity: number) {
    object.children.forEach(objectChild => {
        const {material} = objectChild as THREE.Mesh
        if (opacity !== 0) objectChild.visible = true

        if (objectChild.type !== 'Group') {
            gsap.to(material, {
                opacity,
                duration: 0.5
            }).then(() => {objectChild.visible = opacity !== 0})
        }

        if (objectChild.children.length) {
            changeGroupOpacity(objectChild, opacity)
        }
    })
}