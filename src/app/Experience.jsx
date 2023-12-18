import { Cone, PerspectiveCamera, Sphere } from "@react-three/drei"
import { Fish12 } from "./components/Fish12"
import { useControls } from "leva"
import { useFrame } from "@react-three/fiber"
import { useRef, forwardRef, useEffect } from "react"
import { Perf } from 'r3f-perf'
import { DoubleSide, Vector3 } from "three"



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
  const directionVectorRef = useRef(new Vector3());

  useEffect(() => {
    if (coneRef.current) {
      // Generate a random Vector3D
      directionVectorRef.current.set(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();

      // Orient the cone to the random vector
      // This method depends on how your 3D object is defined and how you want to orient it
      coneRef.current.geometry.rotateX(Math.PI / 2);
      coneRef.current.lookAt(directionVectorRef.current); // For Three.js, 'lookAt' makes the object face the vector
    }
  }, []);

  useFrame((state, delta) => {
    
    if (coneRef.current && sphereBoundsRef.current) {
      console.log(coneRef.current.position, directionVectorRef.current, delta, speed)
      coneRef.current.position.x += directionVectorRef.current.x * delta * speed;
      coneRef.current.position.y += directionVectorRef.current.y * delta * speed;
      coneRef.current.position.z += directionVectorRef.current.z * delta * speed;
      
      // Calculate the distance between the cone and the center of the bounding sphere
      const distance = coneRef.current.position.distanceTo(sphereBoundsRef.current.position);
      // Check if the cone is within the sphere
      if (coneRef.current && sphereBoundsRef.current.geometry.boundingSphere && (distance <= sphereBoundsRef.current.geometry.boundingSphere.radius)) {
        // The cone is inside the bounding sphere
        console.log("Cone is within the sphere bounds");
      } else if (coneRef.current && sphereBoundsRef.current.geometry.boundingSphere && (distance >= sphereBoundsRef.current.geometry.boundingSphere.radius)) {
        console.log("outside")
        // Calculate the direction vector from the sphere's center to the cone
        let directionVector = new Vector3();
        directionVector.subVectors(coneRef.current.position, sphereBoundsRef.current.position);

        // Normalize the direction vector
        directionVector.normalize();

        // Scale the direction vector to just inside the sphere's radius
        directionVector.multiplyScalar(sphereBoundsRef.current.geometry.boundingSphere.radius * 0.95);

        // Set the cone's position to this new position
        coneRef.current.position.copy(sphereBoundsRef.current.position).sub(directionVector);
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
      <Sphere ref={sphereBoundsRef} args={[10, 8, 8]}>
        <meshBasicMaterial transparent color={"pink"} opacity={0.3} side={DoubleSide} />
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