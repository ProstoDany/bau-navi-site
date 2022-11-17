import { Floor } from "../../types/model"

export function getFloorYPosition(floorIndex: number, floors: Floor[]) {
    return floors.reduce((acc, floor, reduceIndex) => {
      return floorIndex > reduceIndex ? acc += floor.height : acc += 0
    }, 0)
}