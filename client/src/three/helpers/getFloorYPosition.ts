export function getFloorYPosition(floorIndex: number, floorHeights: number[]) {
  return floorHeights.reduce((acc, height, reduceIndex) => {
    return floorIndex > reduceIndex ? acc += height : acc += 0
  }, 0)
}