import './index.css'
import {
    Color,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    PerspectiveCamera,
    PlaneBufferGeometry,
    Scene,
    WebGLRenderer
} from "three"
import Vehicle from "./Vehicle"
import TrafficLight from "./TrafficLight"
import Build from "./Build"

const main = () => {

    const renderer = new WebGLRenderer()
    document.body.appendChild(renderer.domElement)

    // Камера
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 5000)
    camera.position.set(0, -20, 50)
    camera.lookAt(0, 0, 0)

    // Сцена
    const scene = new Scene()
    scene.background = new Color(0x00ffff)

    const maxWidth = 25
    const maxHeight = 25

    // Пол
    const floorGeometry = new PlaneBufferGeometry(maxWidth * 2, maxHeight * 2, 1, 1)
    const floorMaterial = new MeshBasicMaterial({color: 0x65666A})
    const floorMesh = new Mesh(floorGeometry, floorMaterial)
    scene.add(floorMesh)

    // Дорога
    const road = new Object3D()
    road.position.z = 1
    scene.add(road)

    // Сгенерировать строение
    {
        const build = new Build(0, 0)
        road.add(build.getMesh())
    }

    // разметка начальных координат возможных расположений машин
    const roadsRight = [{x: -maxWidth + 5, y: maxHeight - 8}, {x: -maxWidth + 5, y: -maxHeight + 5}]
    const roadsLeft = [{x: maxWidth - 5, y: maxHeight - 5}, {x: maxWidth - 5, y: -maxHeight + 8}]
    const roadsTop = [{x: -maxWidth + 8, y: -maxHeight + 5}, {x: maxWidth - 5, y: -maxHeight + 5}]
    const roadsBottom = [{x: -maxWidth + 5, y: maxHeight - 5}, {x: maxWidth - 8, y: maxHeight - 5}]
    const roads = [roadsRight, roadsLeft, roadsTop, roadsBottom]
    const directions = ['RIGHT', 'LEFT', 'TOP', 'BOTTOM']


    // Уплавление светофором
    let trafficLightTime = 0 // Таймер
    const trafficLightSwitchYellow = 50 // Время переключение на желтый сигнал
    const trafficLightSwitch = 85 // Время переключения с желтого сигнала
    let trafficLightChange = false // Флаг желтого сигнала
    let trafficLightColor = 'GREEN' // GREEN, YELLOW, RED. Текущий цвет сигнала по горизонтали
    let trafficLightColorLast = 'RED' // Последний цвет до желтого сигнала
    const trafficLightHorizon = [] // Светофоры отвечающие за горизонтальное движение
    const trafficLightVertical = [] // Светофоры отвечающие за вертикальное движение

    // Точки расположение светофоров
    const trafficPointHorizon = [
        {x: maxWidth - 10, y: maxHeight - 10, d: 'RIGHT'},
        {x: maxWidth - 10, y: -maxHeight + 3, d: 'RIGHT'},
        {x: -maxWidth + 10, y: maxHeight - 3, d: 'LEFT'},
        {x: -maxWidth + 10, y: -maxHeight + 10, d: 'LEFT'}
    ]
    const trafficPointVertical = [
        {x: -maxWidth + 10, y: maxHeight - 10, d: 'TOP'},
        {x: maxWidth - 3, y: maxHeight - 10, d: 'TOP'},
        {x: -maxWidth + 3, y: -maxHeight + 10, d: 'BOTTOM'},
        {x: maxWidth - 10, y: -maxHeight + 10, d: 'BOTTOM'},
    ]

    // Точки для просчета светофоров
    const trafficPointRight = maxWidth - 8
    const trafficPointLeft = -maxWidth - 8
    const trafficPointTop = maxHeight - 8
    const trafficPointBottom = -maxHeight + 8
    const trafficLightFor = 8 // за сколько начать тормозить перед светофором

    // Создание светофоров
    trafficPointHorizon.forEach(coords => {
        const trafficLight = new TrafficLight(coords.x, coords.y, 'GREEN', coords.d)

        road.add(trafficLight.getMesh())
        trafficLightHorizon.push(trafficLight)
    })
    trafficPointVertical.forEach(coords => {
        const trafficLight = new TrafficLight(coords.x, coords.y, 'RED', coords.d)

        road.add(trafficLight.getMesh())
        trafficLightVertical.push(trafficLight)
    })

    // Машины
    const vehiclesRight = []
    const vehiclesLeft = []
    const vehiclesTop = []
    const vehiclesBottom = []

    // Функция создания машины
    const createVehicle = (direction, x, y) => {
        const vehicle = new Vehicle(direction, x, y)
        road.add(vehicle.getMesh())
        switch (direction) {
            case 'RIGHT':
                vehiclesRight.push(vehicle)
                break
            case 'LEFT':
                vehiclesLeft.push(vehicle)
                break
            case 'TOP':
                vehiclesTop.push(vehicle)
                break
            case 'BOTTOM':
                vehiclesBottom.push(vehicle)
                break
        }
    }

    // Функция генерации рандомной машины
    const genRandomVehicle = () => {
        const r = Math.floor(Math.random() * 4)
        const choice = roads[r][Math.floor(Math.random() * 2)]
        createVehicle(directions[r], choice.x, choice.y)
    }

    for (let i = 0; i < 8; i++) {
        genRandomVehicle()
    }

    // createVehicle(directions[0], roads[0][1].x, roads[0][1].y)
    // createVehicle(directions[0], roads[0][0].x, roads[0][0].y)
    // createVehicle(directions[1], roads[1][1].x, roads[1][1].y)
    // createVehicle(directions[1], roads[1][0].x, roads[1][0].y)
    //
    // createVehicle(directions[2], roads[2][1].x, roads[2][1].y)
    // createVehicle(directions[2], roads[2][0].x, roads[2][0].y)
    // createVehicle(directions[3], roads[3][1].x, roads[3][1].y)
    // createVehicle(directions[3], roads[3][0].x, roads[3][0].y)

    // функция для обработки всей логики
    const update = (dt) => {
        trafficLightTime += dt * 10
        // Условие переключение на желтый сигнал
        if (!trafficLightChange && trafficLightTime > trafficLightSwitchYellow) {
            trafficLightColorLast = trafficLightColor
            trafficLightChange = true
            trafficLightColor = 'YELLOW'
            trafficLightHorizon.forEach(el => {
                el.changeColor(trafficLightColor)
            })
            trafficLightVertical.forEach(el => {
                el.changeColor(trafficLightColor)
            })
        }
        // Условие переключение с желтого сигнала
        if (trafficLightTime > trafficLightSwitch) {
            trafficLightColor = trafficLightColorLast === 'GREEN' ? 'RED' : 'GREEN'
            trafficLightTime = 0
            trafficLightChange = false
            trafficLightHorizon.forEach(el => {
                el.changeColor(trafficLightColor)
            })
            trafficLightVertical.forEach(el => {
                el.changeColor(trafficLightColor === 'GREEN' ? 'RED' : 'GREEN')
            })
        }

        // Обработка движения
        vehiclesRight.forEach((el, indx) => {
            el.update(dt)
            // Столкновение со светофором
            if (el.x + trafficLightFor >= trafficPointRight && el.x < trafficPointRight) {
                if (trafficLightColor === 'YELLOW' || trafficLightColor === 'RED') {
                    el.stop()
                }
            }
            if (trafficLightColor === 'GREEN') {
                el.start()
            }
            // Выезд за карту
            if (el.x > maxWidth) {
                road.remove(el.getMesh())
                vehiclesRight.splice(indx, 1)
                genRandomVehicle()
            }
        })
        vehiclesLeft.forEach((el, indx) => {
            el.update(dt)
            if (el.x - trafficLightFor <= trafficPointLeft && el.x > trafficPointLeft) {
                if (trafficLightColor === 'YELLOW' || trafficLightColor === 'RED') {
                    el.stop()
                }
            }
            if (trafficLightColor === 'GREEN') {
                el.start()
            }
            if (el.x < -maxWidth) {
                road.remove(el.getMesh())
                vehiclesLeft.splice(indx, 1)
                genRandomVehicle()
            }
        })
        vehiclesTop.forEach((el, indx) => {
            el.update(dt)
            if (el.y + trafficLightFor >= trafficPointTop && el.y < trafficPointTop) {
                if (trafficLightColor === 'YELLOW' || trafficLightColor === 'GREEN') {
                    el.stop()
                }
            }
            if (trafficLightColor === 'RED') {
                el.start()
            }
            if (el.y > maxHeight) {
                road.remove(el.getMesh())
                vehiclesTop.splice(indx, 1)
                genRandomVehicle()
            }
        })
        vehiclesBottom.forEach((el, indx) => {
            el.update(dt)
            if (el.y - trafficLightFor <= trafficPointBottom && el.y > trafficPointBottom) {
                if (trafficLightColor === 'YELLOW' || trafficLightColor === 'GREEN') {
                    el.stop()
                }
            }
            if (trafficLightColor === 'RED') {
                el.start()
            }
            if (el.y < -maxHeight) {
                road.remove(el.getMesh())
                vehiclesBottom.splice(indx, 1)
                genRandomVehicle()
            }
        })
    }

    // адаптировать канвас под экран
    const resizeToWindowSize = (renderer, camera) => {
        const canvas = renderer.domElement
        const width = window.innerWidth
        const height = window.innerHeight
        const needResize = width !== canvas.clientWidth || height !== canvas.clientHeight
        if (needResize) {
            renderer.setSize(width, height)
            camera.aspect = width / height
            camera.updateProjectionMatrix()
        }
    }

    // Функция для отрисовки
    const render = () => {
        resizeToWindowSize(renderer, camera)
        renderer.render(scene, camera)
    }

    let lastTime = 0 // время последнего обновления кадра
    // Цикл анимации
    const animate = (time) => {
        const dt = (time - lastTime) / 1000.0 // Разница между предыдущем и следующим кадром

        update(dt)
        render()

        lastTime = time
        requestAnimationFrame(animate)
    }

    animate(0)
}

main()