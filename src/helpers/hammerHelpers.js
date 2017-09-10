// @flow
export function getDirection(direction: number): ?string {
  // event.direction
  switch (direction) {
    case 2:
      return "left";
    case 4:
      return "right"
    case 8:
      return "up";
    case 16:
      return "down";
    default:
      return null;
  }
}