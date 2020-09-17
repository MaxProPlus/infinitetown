import {BoxBufferGeometry, Mesh, MeshBasicMaterial, Object3D} from "three"

// Возможные цвета
const COLORS = new Map([
    ['GREEN', 0x00ff00],
    ['YELLOW', 0xffff00],
    ['RED', 0xff0000],
])

// Светофор
class TrafficLight {
    mesh // объект 3д
    materialHeader // материал верхушки для переключения цвета

    constructor(x, y, color, direction) {
        const trafficLight = new Object3D()
        this.mesh = trafficLight
        trafficLight.position.x = x
        trafficLight.position.y = y
        const materialPost = new MeshBasicMaterial({color: 0x55565A})
        const geometryPost = new BoxBufferGeometry(1, 1, 3)
        trafficLight.add(new Mesh(geometryPost, materialPost))

        this.materialHeader = new MeshBasicMaterial({color: COLORS.get(color)})

        let geometryHeader = new BoxBufferGeometry(4, .5, .5)
        let meshHeader = new Mesh(geometryHeader, this.materialHeader)
        switch (direction) {
            case 'RIGHT':
                geometryHeader = new BoxBufferGeometry(.5, 4, .5)
                meshHeader = new Mesh(geometryHeader, this.materialHeader)
                meshHeader.position.y = 1.5
                break
            case 'LEFT':
                geometryHeader = new BoxBufferGeometry(.5, 4, .5)
                meshHeader = new Mesh(geometryHeader, this.materialHeader)
                meshHeader.position.y = -1.5
                break
            case 'TOP':
                geometryHeader = new BoxBufferGeometry(4, .5, .5)
                meshHeader = new Mesh(geometryHeader, this.materialHeader)
                meshHeader.position.x = -1.5
                break
            case 'BOTTOM':
                geometryHeader = new BoxBufferGeometry(4, .5, .5)
                meshHeader = new Mesh(geometryHeader, this.materialHeader)
                meshHeader.position.x = 1.5
                break
        }
        meshHeader.position.z = 2
        trafficLight.add(meshHeader)
    }

    // Получить объект3д
    getMesh = () => {
        return this.mesh
    }

    // Изменить цвет
    changeColor = (color) => {
        this.materialHeader.setValues({color: COLORS.get(color)})
    }
}

export default TrafficLight