import {BoxBufferGeometry, Mesh, MeshBasicMaterial, Object3D} from "three"

// Здание
class Build {
    mesh
    constructor(x, y) {
        const object = new Object3D()
        object.position.set(x, y, 0)
        this.mesh = object

        this.genBuild()
    }

    // Генерация строения
    genBuild = () => {
        const geometryFooter = new BoxBufferGeometry(10, 10, 10)
        const materialFooter = new MeshBasicMaterial({color: 0xaeaeae})
        this.mesh.add(new Mesh(geometryFooter, materialFooter))

        const geometryHeader = new BoxBufferGeometry(5, 5, 5)
        const materialHeader = new MeshBasicMaterial({color: 0xeeeeee})
        const meshHeader = new Mesh(geometryHeader, materialHeader)
        meshHeader.position.z = 10
        this.mesh.add(meshHeader)
    }

    // Вернуть объект для добавления на сцену
    getMesh = () => {
        return this.mesh
    }

}

export default Build