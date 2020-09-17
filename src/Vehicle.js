import {BoxBufferGeometry, Mesh, MeshBasicMaterial, MeshPhongMaterial} from "three"

// Класс для машины
class Vehicle {
    speed = 0 // текущая скорость
    acceleration = .05 // ускорение
    maxSpeed = .08 // максимальная скорость
    toForward = true // флаг движения
    direction = '' // направление
    x = 0
    y = 0
    w = 0
    h = 0
    mesh

    constructor(direction, x, y) {
        let geometry
        this.direction = direction
        switch (direction) {
            case 'RIGHT':
            case 'LEFT':
                geometry = new BoxBufferGeometry(2, 1, 1)
                this.w = 2
                this.h = 1
                break
            default:
                geometry = new BoxBufferGeometry(1, 2, 1)
                this.w = 1
                this.h = 2
        }
        const material = new MeshBasicMaterial({color: 0xff0000})
        this.mesh = new Mesh(geometry, material)
        this.mesh.position.set(x, y, 0)
    }

    // Получить объект 3д
    getMesh() {
        return this.mesh
    }

    // Остановить машину
    stop = () => {
        this.toForward = false
    }

    // Начать движение
    start = () => {
        this.toForward = true
    }

    // Логика
    update = (dt) => {
        if (this.toForward) {
            this.speed = (this.speed + this.acceleration * dt > this.maxSpeed)
                ? this.maxSpeed : this.speed + this.acceleration * dt
        } else {
            this.speed = (this.speed - this.acceleration * dt < 0)? 0 : this.speed - this.acceleration * dt
        }
        switch (this.direction) {
            case 'RIGHT':
                this.mesh.position.x += this.speed
                this.x = this.mesh.position.x + this.w /2
                break
            case 'LEFT':
                this.mesh.position.x -= this.speed
                this.x = this.mesh.position.x - this.w /2
                break
            case 'TOP':
                this.mesh.position.y += this.speed
                this.y = this.mesh.position.y + this.h /2
                break
            case 'BOTTOM':
                this.mesh.position.y -= this.speed
                this.y = this.mesh.position.y - this.h /2
                break

        }
    }
}

export default Vehicle