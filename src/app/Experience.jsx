import { Cone, PerspectiveCamera, Sphere } from "@react-three/drei"
import { Fish12 } from "./components/Fish12"
import { useControls } from "leva"
import { useFrame } from "@react-three/fiber"
import { useRef, forwardRef } from "react"
import { Perf } from 'r3f-perf'
import { DoubleSide } from "three"



export default function Experience() {
  const { speed } = useControls({
    speed: {
      value: 1,
      min: 0,
      max: 10,
      step: 1,
    }
  })
  const coneRef = useRef()
  const sphereBoundsRef = useRef()

  useFrame((state, delta) => {
    if (coneRef.current && sphereBoundsRef.current) {
      // Calculate the position of the cone
      coneRef.current.position.x += delta * speed;
  
      // Calculate the distance between the cone and the center of the bounding sphere
      const distance = coneRef.current.position.distanceTo(sphereBoundsRef.current.position);
  
      // Check if the cone is within the sphere
      
      if (sphereBoundsRef.current.geometry.boundingSphere && (distance <= sphereBoundsRef.current.geometry.boundingSphere.radius)) {
        // The cone is inside the bounding sphere
        console.log("Cone is within the sphere bounds");
      } else {
        // The cone is outside the bounding sphere
        console.log("Cone is outside the sphere bounds");
        coneRef.current.position.x = -coneRef.current.position.x
      }
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} />
      <ambientLight intensity={5} />
      <Fish12 scale={3.5} position={[2, 0, 0]} />
      <Perf position={'top-left'} />
      <Swimmer ref={coneRef} />
      <Sphere ref={sphereBoundsRef} args={[10, 32, 32]}>
        <meshBasicMaterial transparent color={"pink"} opacity={0.3} side={DoubleSide}/>
      </Sphere>
    </>
  )
}

const Swimmer = forwardRef((props, ref) => {

  return (
    <Cone args={[.2, 1, 8, 1]} ref={ref}>
      <meshNormalMaterial />
    </Cone>
  )
})