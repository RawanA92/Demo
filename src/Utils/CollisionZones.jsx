import * as THREE from "three";

export const collisionZones = [
  {
    type: "box",
    position: [-38, -1.3, 46.5],
    size: [33, 35, 52], // modern_building
  },
  {
    type: "box",
    position: [-26, -1.3, 105],
    size: [4, 35, 38], // saudi__tower
  },
  {
    type: "box",
    position: [50.5,-11.5, -35.5],
    size: [40.400000000000034, 25.79999999999994, 17.39999999999997],
  },
  {
    type: "box",
    position: [42.5, -11, -89.5],
    size: [24.599999999999945, 20.39999999999996, 73.80000000000051],
  },
  {
    type: "box",
    position: [72.5, -6, 36.5],
    size: [22.79999999999995, 15.199999999999976, 17.59999999999997],
  },
  {
    type: "box",
    position: [106.5, -4, -60.5],
    size: [46.60000000000012, 19.199999999999964, 43.80000000000008],
  },
    {
    type: "box",
    position: [-96, -0.5, -40.5],
    size: [62.200000000000344, 26.999999999999936, 32.799999999999926],
  },
  {
    type: "box",
    position: [-87.5, 4.5, 116],
    size: [70.80000000000047, 41.40000000000005, 19.399999999999963],
  },
  {
    type: "box",
    position: [118.5, -5, 116],
    size: [24.999999999999943, 17.39999999999997, 17.39999999999997],
  },
];

export function checkCollision(newPosition, characterRadius = 2) {
  for (const zone of collisionZones) {
    if (zone.type === "box") {
      const halfWidth = zone.size[0] / 2;
      const halfDepth = zone.size[2] / 2;
      
      if (
        newPosition.x + characterRadius > zone.position[0] - halfWidth &&
        newPosition.x - characterRadius < zone.position[0] + halfWidth &&
        newPosition.z + characterRadius > zone.position[2] - halfDepth &&
        newPosition.z - characterRadius < zone.position[2] + halfDepth
      ) {
        return true;
      }
    } else if (zone.type === "circle") {
      const distance = Math.sqrt(
        Math.pow(newPosition.x - zone.position[0], 2) +
        Math.pow(newPosition.z - zone.position[2], 2)
      );
      
      if (distance < zone.radius + characterRadius) {
        return true;
      }
    } else if (zone.type === "boundary") {
      if (
        newPosition.x < zone.minX ||
        newPosition.x > zone.maxX ||
        newPosition.z < zone.minZ ||
        newPosition.z > zone.maxZ
      ) {
        return true;
      }
    }
  }
  
  return false;
}

export function CollisionDebugView() {
  return (
    <>
      {collisionZones.map((zone, index) => {
        if (zone.type === "box") {
          return (
            <mesh key={index} position={zone.position} visible={false}>
              <boxGeometry args={zone.size} />
              <meshBasicMaterial color="red" transparent opacity={0.0} />
            </mesh>
          );
        } else if (zone.type === "circle") {
          return (
            <mesh key={index} position={zone.position} visible={false}>
              <cylinderGeometry args={[zone.radius, zone.radius, 10, 32]} />
              <meshBasicMaterial color="red" transparent opacity={0.0} />
            </mesh>
          );
        }
        return null;
      })}
    </>
  );
}