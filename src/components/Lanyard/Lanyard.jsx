/* eslint-disable react/no-unknown-property */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, useGLTF, useTexture } from '@react-three/drei'
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import * as THREE from 'three'
import cardGLB from './card.glb'
import defaultLanyard from './lanyard.png'
import './Lanyard.css'

extend({ MeshLineGeometry, MeshLineMaterial })

const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 }
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 }

function smoothJoint(body, delta, minSpeed, maxSpeed) {
  const translation = body.translation()

  if (!body.lerped) {
    body.lerped = new THREE.Vector3().copy(translation)
  }

  const clampedDistance = Math.max(
    0.1,
    Math.min(1, body.lerped.distanceTo(translation)),
  )
  body.lerped.lerp(
    translation,
    Math.min(1, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))),
  )

  return body.lerped
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  lanyardRepeat = 1,
  anchorX = 0,
  anchorY = 4,
  cardScale = 2.25,
  ropeLength = 1,
}) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
  )
  const [isPhone, setIsPhone] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 640,
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsPhone(window.innerWidth <= 640)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isPhone) return null

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.25 : 1.5]}
        gl={{
          alpha: transparent,
          antialias: !isMobile,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 45 : 1 / 60}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
            lanyardRepeat={lanyardRepeat}
            anchorX={anchorX}
            anchorY={anchorY}
            cardScale={cardScale}
            ropeLength={ropeLength}
          />
        </Physics>
        <Environment blur={0.75} frames={1} resolution={64}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  )
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  lanyardRepeat = 1,
  anchorX = 0,
  anchorY = 4,
  cardScale = 2.25,
  ropeLength = 1,
}) {
  const band = useRef()
  const fixed = useRef()
  const j1 = useRef()
  const j2 = useRef()
  const j3 = useRef()
  const card = useRef()
  const activePointerId = useRef(null)
  const dragPointer = useRef(new THREE.Vector2())
  const nextTranslation = useRef({ x: 0, y: 0, z: 0 })
  const nextAngularVelocity = useRef({ x: 0, y: 0, z: 0 })
  const vec = useMemo(() => new THREE.Vector3(), [])
  const ang = useMemo(() => new THREE.Vector3(), [])
  const rot = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])
  const gl = useThree((state) => state.gl)
  const curvePointCount = isMobile ? 13 : 21
  const curvePoints = useMemo(
    () => Array.from({ length: curvePointCount }, () => new THREE.Vector3()),
    [curvePointCount],
  )
  const segmentProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  }
  const { nodes, materials } = useGLTF(cardGLB)
  const texture = useTexture(lanyardImage || defaultLanyard)
  const frontTex = useTexture(frontImage || BLANK_PIXEL)
  const backTex = useTexture(backImage || BLANK_PIXEL)

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map
    if (!frontImage && !backImage) return baseMap

    const baseImg = baseMap.image
    const width = baseImg.width
    const height = baseImg.height
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) return baseMap

    context.drawImage(baseImg, 0, 0, width, height)

    const drawFitted = (image, rect) => {
      const rectX = rect.x * width
      const rectY = rect.y * height
      const rectWidth = rect.w * width
      const rectHeight = rect.h * height
      const pickScale = imageFit === 'contain' ? Math.min : Math.max
      const scale = pickScale(rectWidth / image.width, rectHeight / image.height)
      const drawWidth = image.width * scale
      const drawHeight = image.height * scale
      const drawX = rectX + (rectWidth - drawWidth) / 2
      const drawY = rectY + (rectHeight - drawHeight) / 2

      context.save()
      context.beginPath()
      context.rect(rectX, rectY, rectWidth, rectHeight)
      context.clip()
      context.drawImage(image, drawX, drawY, drawWidth, drawHeight)
      context.restore()
    }

    if (frontImage && frontTex.image) drawFitted(frontTex.image, FRONT_UV_RECT)
    if (backImage && backTex.image) drawFitted(backTex.image, BACK_UV_RECT)

    const composite = new THREE.CanvasTexture(canvas)
    composite.colorSpace = THREE.SRGBColorSpace
    composite.flipY = baseMap.flipY
    composite.anisotropy = isMobile ? 2 : 4
    composite.needsUpdate = true
    return composite
  }, [frontImage, backImage, imageFit, frontTex, backTex, isMobile, materials.base.map])

  useEffect(
    () => () => {
      if (cardMap !== materials.base.map) cardMap.dispose()
    },
    [cardMap, materials.base.map],
  )

  const [curve] = useState(() => {
    const nextCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
    ])
    nextCurve.curveType = 'chordal'
    return nextCurve
  })
  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)

  const updateDragPointer = useCallback(
    (event) => {
      const bounds = gl.domElement.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return

      dragPointer.current.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      )
    },
    [gl],
  )

  const finishDrag = useCallback(() => {
    const pointerId = activePointerId.current
    activePointerId.current = null

    if (pointerId !== null && gl.domElement.hasPointerCapture?.(pointerId)) {
      gl.domElement.releasePointerCapture(pointerId)
    }

    drag(false)
  }, [gl])

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ropeLength])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ropeLength])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ropeLength])
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ])

  useEffect(() => {
    if (!hovered) return undefined

    document.body.style.cursor = dragged ? 'grabbing' : 'grab'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered, dragged])

  useEffect(() => {
    if (!dragged) return undefined

    const cancelDrag = () => {
      finishDrag()
      hover(false)
    }
    const handleVisibilityChange = () => {
      if (document.hidden) cancelDrag()
    }

    window.addEventListener('pointermove', updateDragPointer, {
      capture: true,
      passive: true,
    })
    window.addEventListener('pointerup', finishDrag, true)
    window.addEventListener('pointercancel', cancelDrag, true)
    window.addEventListener('blur', cancelDrag)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    gl.domElement.addEventListener('lostpointercapture', cancelDrag)

    return () => {
      window.removeEventListener('pointermove', updateDragPointer, true)
      window.removeEventListener('pointerup', finishDrag, true)
      window.removeEventListener('pointercancel', cancelDrag, true)
      window.removeEventListener('blur', cancelDrag)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      gl.domElement.removeEventListener('lostpointercapture', cancelDrag)
    }
  }, [dragged, finishDrag, gl, updateDragPointer])

  useFrame((state, delta) => {
    const fixedBody = fixed.current
    const firstJoint = j1.current
    const secondJoint = j2.current
    const thirdJoint = j3.current
    const cardBody = card.current
    const bandMesh = band.current

    if (dragged) {
      vec.set(dragPointer.current.x, dragPointer.current.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      cardBody?.wakeUp()
      firstJoint?.wakeUp()
      secondJoint?.wakeUp()
      thirdJoint?.wakeUp()

      if (cardBody) {
        nextTranslation.current.x = vec.x - dragged.x
        nextTranslation.current.y = vec.y - dragged.y
        nextTranslation.current.z = vec.z - dragged.z
        cardBody.setNextKinematicTranslation(nextTranslation.current)
      }
    }

    if (!fixedBody || !firstJoint || !secondJoint || !thirdJoint || !cardBody || !bandMesh) {
      return
    }

    if (
      !dragged &&
      cardBody.isSleeping() &&
      firstJoint.isSleeping() &&
      secondJoint.isSleeping() &&
      thirdJoint.isSleeping()
    ) {
      return
    }

    curve.points[0].copy(thirdJoint.translation())
    curve.points[1].copy(smoothJoint(secondJoint, delta, minSpeed, maxSpeed))
    curve.points[2].copy(smoothJoint(firstJoint, delta, minSpeed, maxSpeed))
    curve.points[3].copy(fixedBody.translation())

    for (let index = 0; index < curvePointCount; index += 1) {
      curve.getPoint(index / (curvePointCount - 1), curvePoints[index])
    }

    bandMesh.geometry.setPoints(curvePoints)
    ang.copy(cardBody.angvel())
    rot.copy(cardBody.rotation())
    nextAngularVelocity.current.x = ang.x
    nextAngularVelocity.current.y = ang.y - rot.y * 0.25
    nextAngularVelocity.current.z = ang.z
    cardBody.setAngvel(nextAngularVelocity.current)
  })

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.anisotropy = isMobile ? 2 : 4

  return (
    <>
      <group position={[anchorX, anchorY, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={cardScale}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            onPointerDown={(event) => {
              event.stopPropagation()
              activePointerId.current = event.pointerId
              updateDragPointer(event)
              gl.domElement.setPointerCapture?.(event.pointerId)
              drag(
                new THREE.Vector3()
                  .copy(event.point)
                  .sub(vec.copy(card.current.translation())),
              )
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshStandardMaterial
                map={cardMap}
                roughness={0.72}
                metalness={0.45}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-lanyardRepeat, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  )
}

useGLTF.preload(cardGLB)
