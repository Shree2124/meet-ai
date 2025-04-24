// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';

// function MeetAILogo({ onClick }: { onClick?: () => void }) {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//     const animationFrameRef = useRef<number | null>(null);
//     const mousePosition = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
//     const targetRotation = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
//     const [isHovered, setIsHovered] = useState(false);
//     const [isDragging, setIsDragging] = useState(false);
//     const scatterState = useRef<{ active: boolean, startTime: number, duration: number }>({
//         active: false,
//         startTime: 0,
//         duration: 2000 // Time in ms for the scatter animation
//     });
    
//     // Store original positions of all letters for scatter animation
//     const originalPositions = useRef<Map<THREE.Object3D, { pos: THREE.Vector3, rot: THREE.Euler }>>(new Map());
    
//     // Start scatter animation
//     const triggerScatterAnimation = () => {
//         if (!scatterState.current.active) {
//             scatterState.current = {
//                 active: true,
//                 startTime: Date.now(),
//                 duration: 2000
//             };
//         }
//     };

//     useEffect(() => {
//         if (!containerRef.current || !canvasRef.current) return;

//         // Setup
//         const container = containerRef.current;
//         const width = container.clientWidth;
//         const height = 80;

//         // Scene setup
//         const scene = new THREE.Scene();
//         const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
//         camera.position.z = 5;

//         const renderer = new THREE.WebGLRenderer({
//             alpha: true,
//             antialias: true,
//             canvas: canvasRef.current
//         });
//         renderer.setSize(width, height);
//         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//         // Lighting
//         const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
//         scene.add(ambientLight);

//         const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//         directionalLight.position.set(5, 5, 5);
//         scene.add(directionalLight);

//         // Point lights for dynamic effects
//         const blueLight = new THREE.PointLight(0x4285f4, 2, 10);
//         blueLight.position.set(-3, 2, 3);
//         scene.add(blueLight);

//         const purpleLight = new THREE.PointLight(0x9c27b0, 2, 10);
//         purpleLight.position.set(3, -2, 3);
//         scene.add(purpleLight);

//         // Materials with higher shininess for better reflections
//         const blueMaterial = new THREE.MeshPhongMaterial({
//             color: 0x4285f4,
//             specular: 0xffffff,
//             shininess: 150,
//             emissive: 0x2a5caa,
//             emissiveIntensity: 0.3,
//         });

//         const purpleMaterial = new THREE.MeshPhongMaterial({
//             color: 0x9c27b0,
//             specular: 0xffffff,
//             shininess: 150,
//             emissive: 0x6a0080,
//             emissiveIntensity: 0.5,
//         });

//         const whiteMaterial = new THREE.MeshPhongMaterial({
//             color: 0xffffff,
//             specular: 0x4285f4,
//             shininess: 150,
//             emissive: 0x4285f4,
//             emissiveIntensity: 0.2,
//         });

//         // Create 3D logo group
//         const logoGroup = new THREE.Group();

//         // Create "Meet" part (blue)
//         const meetGroup = new THREE.Group();
        
//         // M
//         const mLeftGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
//         const mLeftMesh = new THREE.Mesh(mLeftGeometry, blueMaterial);
//         mLeftMesh.position.x = -2.5;
        
//         const mMiddleGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
//         const mMiddleMesh = new THREE.Mesh(mMiddleGeometry, blueMaterial);
//         mMiddleMesh.position.x = -2.2;
        
//         const mRightGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
//         const mRightMesh = new THREE.Mesh(mRightGeometry, blueMaterial);
//         mRightMesh.position.x = -1.9;
        
//         const mTopGeometry = new THREE.BoxGeometry(0.75, 0.15, 0.3);
//         const mTopMesh = new THREE.Mesh(mTopGeometry, blueMaterial);
//         mTopMesh.position.x = -2.2;
//         mTopMesh.position.y = 0.325;
        
//         meetGroup.add(mLeftMesh, mMiddleMesh, mRightMesh, mTopMesh);
        
//         // E (first)
//         const e1VerticalGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
//         const e1VerticalMesh = new THREE.Mesh(e1VerticalGeometry, blueMaterial);
//         e1VerticalMesh.position.x = -1.5;
        
//         const e1TopGeometry = new THREE.BoxGeometry(0.35, 0.15, 0.3);
//         const e1TopMesh = new THREE.Mesh(e1TopGeometry, blueMaterial);
//         e1TopMesh.position.x = -1.35;
//         e1TopMesh.position.y = 0.325;
        
//         const e1MiddleGeometry = new THREE.BoxGeometry(0.25, 0.15, 0.3);
//         const e1MiddleMesh = new THREE.Mesh(e1MiddleGeometry, blueMaterial);
//         e1MiddleMesh.position.x = -1.4;
        
//         const e1BottomGeometry = new THREE.BoxGeometry(0.35, 0.15, 0.3);
//         const e1BottomMesh = new THREE.Mesh(e1BottomGeometry, blueMaterial);
//         e1BottomMesh.position.x = -1.35;
//         e1BottomMesh.position.y = -0.325;
        
//         meetGroup.add(e1VerticalMesh, e1TopMesh, e1MiddleMesh, e1BottomMesh);
        
//         // E (second)
//         const e2VerticalGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
//         const e2VerticalMesh = new THREE.Mesh(e2VerticalGeometry, blueMaterial);
//         e2VerticalMesh.position.x = -1.0;
        
//         const e2TopGeometry = new THREE.BoxGeometry(0.35, 0.15, 0.3);
//         const e2TopMesh = new THREE.Mesh(e2TopGeometry, blueMaterial);
//         e2TopMesh.position.x = -0.85;
//         e2TopMesh.position.y = 0.325;
        
//         const e2MiddleGeometry = new THREE.BoxGeometry(0.25, 0.15, 0.3);
//         const e2MiddleMesh = new THREE.Mesh(e2MiddleGeometry, blueMaterial);
//         e2MiddleMesh.position.x = -0.9;
        
//         const e2BottomGeometry = new THREE.BoxGeometry(0.35, 0.15, 0.3);
//         const e2BottomMesh = new THREE.Mesh(e2BottomGeometry, blueMaterial);
//         e2BottomMesh.position.x = -0.85;
//         e2BottomMesh.position.y = -0.325;
        
//         meetGroup.add(e2VerticalMesh, e2TopMesh, e2MiddleMesh, e2BottomMesh);
        
//         // T (purple)
//         const tGroup = new THREE.Group();
        
//         const tTopGeometry = new THREE.BoxGeometry(0.6, 0.15, 0.35);
//         const tTopMesh = new THREE.Mesh(tTopGeometry, purpleMaterial);
//         tTopMesh.position.x = -0.4;
//         tTopMesh.position.y = 0.325;
        
//         const tVerticalGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.35);
//         const tVerticalMesh = new THREE.Mesh(tVerticalGeometry, purpleMaterial);
//         tVerticalMesh.position.x = -0.4;
        
//         tGroup.add(tTopMesh, tVerticalMesh);
        
//         // AI (white)
//         const aiGroup = new THREE.Group();
        
//         // A
//         const aLeftGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
//         const aLeftMesh = new THREE.Mesh(aLeftGeometry, whiteMaterial);
//         aLeftMesh.position.x = 0.1;
        
//         const aRightGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
//         const aRightMesh = new THREE.Mesh(aRightGeometry, whiteMaterial);
//         aRightMesh.position.x = 0.5;
        
//         const aTopGeometry = new THREE.BoxGeometry(0.5, 0.15, 0.3);
//         const aTopMesh = new THREE.Mesh(aTopGeometry, whiteMaterial);
//         aTopMesh.position.x = 0.3;
//         aTopMesh.position.y = 0.325;
        
//         const aMiddleGeometry = new THREE.BoxGeometry(0.4, 0.15, 0.3);
//         const aMiddleMesh = new THREE.Mesh(aMiddleGeometry, whiteMaterial);
//         aMiddleMesh.position.x = 0.3;
        
//         aiGroup.add(aLeftMesh, aRightMesh, aTopMesh, aMiddleMesh);
        
//         // I
//         const iGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
//         const iMesh = new THREE.Mesh(iGeometry, whiteMaterial);
//         iMesh.position.x = 0.8;
        
//         aiGroup.add(iMesh);
        
//         // Add main dot
//         const dotGeometry = new THREE.SphereGeometry(0.1, 32, 32);
//         const dotMaterial = new THREE.MeshPhongMaterial({
//             color: 0x4285f4,
//             emissive: 0x4285f4,
//             emissiveIntensity: 0.8,
//         });
        
//         const dotMesh = new THREE.Mesh(dotGeometry, dotMaterial);
//         dotMesh.position.set(1.0, 0.4, 0.3);
        
//         // Add particle effects
//         const particlesGroup = new THREE.Group();
//         const particles: THREE.Mesh[] = [];

//         // Create small particles that will orbit around the dot
//         const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
//         const blueMaterialParticle = new THREE.MeshPhongMaterial({
//             color: 0x4285f4,
//             emissive: 0x4285f4,
//             emissiveIntensity: 0.9,
//             transparent: true,
//             opacity: 0.8
//         });

//         const purpleMaterialParticle = new THREE.MeshPhongMaterial({
//             color: 0x9c27b0,
//             emissive: 0x9c27b0,
//             emissiveIntensity: 0.9,
//             transparent: true,
//             opacity: 0.8
//         });

//         // Create 12 particles to orbit around the dot
//         for (let i = 0; i < 12; i++) {
//             const material = i % 2 === 0 ? blueMaterialParticle : purpleMaterialParticle;
//             const particle = new THREE.Mesh(particleGeometry, material);
            
//             // Set initial random position
//             const angle = (i / 12) * Math.PI * 2;
//             const radius = 0.2 + Math.random() * 0.1;
            
//             particle.userData = {
//                 angle: angle,
//                 radius: radius,
//                 speed: 0.01 + Math.random() * 0.02,
//                 offsetY: Math.random() * 0.2 - 0.1
//             };
            
//             particles.push(particle);
//             particlesGroup.add(particle);
//         }
        
//         // Add all groups to the logo group
//         logoGroup.add(meetGroup, tGroup, aiGroup, dotMesh, particlesGroup);
        
//         // Center the logo group
//         logoGroup.position.x = 0.8;
//         scene.add(logoGroup);
        
//         // Add glow effect with Bloom (simulated)
//         const glowSphere = new THREE.Mesh(
//             new THREE.SphereGeometry(0.15, 32, 32),
//             new THREE.MeshBasicMaterial({
//                 color: 0x4285f4,
//                 transparent: true,
//                 opacity: 0.15
//             })
//         );
//         glowSphere.position.copy(dotMesh.position);
//         logoGroup.add(glowSphere);
        
//         // Get all the elements for scatter animation
//         const allElements: THREE.Object3D[] = [];
//         const getElementsRecursively = (obj: THREE.Object3D) => {
//             if (obj instanceof THREE.Mesh) {
//                 allElements.push(obj);
//             }
//             obj.children.forEach(child => getElementsRecursively(child));
//         };
        
//         // Get all elements and store their original positions
//         getElementsRecursively(logoGroup);
//         allElements.forEach(obj => {
//             originalPositions.current.set(obj, {
//                 pos: obj.position.clone(),
//                 rot: obj.rotation.clone()
//             });
//         });
        
//         // Wave animation for Meet letters
//         let meetLetters = [mLeftMesh, mMiddleMesh, mRightMesh, mTopMesh, 
//                           e1VerticalMesh, e1TopMesh, e1MiddleMesh, e1BottomMesh,
//                           e2VerticalMesh, e2TopMesh, e2MiddleMesh, e2BottomMesh];
        
//         meetLetters.forEach((letter, index) => {
//             letter.userData = {
//                 originalY: letter.position.y,
//                 phaseOffset: index * 0.2
//             };
//         });
        
//         // Mouse interaction
//         const handleMouseMove = (event: MouseEvent) => {
//             if (!isHovered && !isDragging) return;
            
//             // Calculate normalized mouse position (-1 to 1)
//             const rect = container.getBoundingClientRect();
//             mousePosition.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
//             mousePosition.current.y = -((event.clientY - rect.top) / height) * 2 + 1;
            
//             // Set target rotation based on mouse position only when dragging or hovering
//             if (isDragging) {
//                 targetRotation.current.y = mousePosition.current.x * 0.5;
//                 targetRotation.current.x = mousePosition.current.y * 0.3;
//             } else if (isHovered) {
//                 targetRotation.current.y = mousePosition.current.x * 0.2;
//                 targetRotation.current.x = mousePosition.current.y * 0.1;
//             }
//         };
        
//         // Scatter/rebuild animation function
//         const updateScatterAnimation = () => {
//             if (!scatterState.current.active) return;
            
//             const now = Date.now();
//             const elapsed = now - scatterState.current.startTime;
//             const progress = Math.min(elapsed / scatterState.current.duration, 1);
            
//             // Animation is complete
//             if (progress >= 1) {
//                 scatterState.current.active = false;
//                 return;
//             }
            
//             // Create a smooth easing for rebuild (ease-in-out)
//             // For scatter: 0->0.5 progress = 0->1 scatter effect
//             // For rebuild: 0.5->1 progress = 1->0 scatter effect (rebuilding)
//             let scatterFactor;
            
//             if (progress < 0.5) {
//                 // Scatter phase (0 to 0.5 becomes 0 to 1)
//                 scatterFactor = progress * 2;
//             } else {
//                 // Rebuild phase (0.5 to 1 becomes 1 to 0)
//                 scatterFactor = 2 - progress * 2;
//             }
            
//             // Apply easing
//             scatterFactor = scatterFactor * scatterFactor * (3 - 2 * scatterFactor); // Smoothstep easing
            
//             // Apply scatter to all elements except the dot and particles
//             allElements.forEach((obj) => {
//                 if (obj === dotMesh || particles.includes(obj as THREE.Mesh)) return;
                
//                 const original = originalPositions.current.get(obj);
//                 if (original) {
//                     // Generate consistent random offset for each object
//                     const randomOffsetX = (Math.sin(obj.id * 541) * 2 - 1) * 3 * scatterFactor;
//                     const randomOffsetY = (Math.cos(obj.id * 389) * 2 - 1) * 2 * scatterFactor;
//                     const randomOffsetZ = (Math.sin(obj.id * 821) * 2 - 1) * 2 * scatterFactor;
                    
//                     // Interpolate between original and scattered position
//                     obj.position.x = original.pos.x + randomOffsetX;
//                     obj.position.y = original.pos.y + randomOffsetY;
//                     obj.position.z = original.pos.z + randomOffsetZ;
                    
//                     // Also add some rotation
//                     obj.rotation.x = original.rot.x + Math.sin(obj.id) * Math.PI * scatterFactor;
//                     obj.rotation.y = original.rot.y + Math.cos(obj.id) * Math.PI * scatterFactor;
//                     obj.rotation.z = original.rot.z + Math.sin(obj.id * 0.5) * Math.PI * scatterFactor;
//                 }
//             });
//         };
        
//         // Animation loop
//         const clock = new THREE.Clock();
//         const animate = () => {
//             const elapsedTime = clock.getElapsedTime();
            
//             // Handle scatter animation if active
//             updateScatterAnimation();
            
//             // Moving lights
//             blueLight.position.x = Math.sin(elapsedTime * 0.5) * 3;
//             blueLight.position.y = Math.cos(elapsedTime * 0.3) * 2;
            
//             purpleLight.position.x = Math.cos(elapsedTime * 0.4) * 3;
//             purpleLight.position.y = Math.sin(elapsedTime * 0.6) * 2;
            
//             // Pulse the dot
//             const dotScale = 1 + 0.2 * Math.sin(elapsedTime * 5);
//             dotMesh.scale.set(dotScale, dotScale, dotScale);
            
//             // Pulse the glow
//             const glowScale = 1 + 0.5 * Math.sin(elapsedTime * 5);
//             glowSphere.scale.set(glowScale, glowScale, glowScale);
//             glowSphere.material.opacity = 0.15 + 0.1 * Math.sin(elapsedTime * 5);
            
//             // Animate particles
//             particles.forEach(particle => {
//                 const data = particle.userData;
//                 data.angle += data.speed;
                
//                 particle.position.x = dotMesh.position.x + Math.cos(data.angle) * data.radius;
//                 particle.position.y = dotMesh.position.y + Math.sin(data.angle) * data.radius + data.offsetY;
//                 particle.position.z = dotMesh.position.z + Math.sin(data.angle * 2) * 0.1;
                
//                 const particleScale = 0.8 + 0.4 * Math.sin(elapsedTime * 3 + data.angle);
//                 particle.scale.set(particleScale, particleScale, particleScale);
//             });
            
//             // Skip the normal animations if we're in scatter mode
//             if (!scatterState.current.active) {
//                 // Make the 't' float with a more complex motion
//                 tGroup.position.y = 0.05 * Math.sin(elapsedTime * 2);
//                 tGroup.rotation.z = Math.sin(elapsedTime) * 0.03;
                
//                 // Wave animation for "Meet" letters
//                 meetLetters.forEach(letter => {
//                     const data = letter.userData;
//                     letter.position.y = data.originalY + 0.03 * Math.sin(elapsedTime * 3 + data.phaseOffset);
//                 });
                
//                 // AI group subtle floating
//                 aiGroup.position.y = 0.04 * Math.sin(elapsedTime * 1.5);
//             }
            
//             // Smooth rotation based on mouse position when hovered or dragging
//             if (isHovered || isDragging) {
//                 logoGroup.rotation.y += (targetRotation.current.y - logoGroup.rotation.y) * 0.1;
//                 logoGroup.rotation.x += (targetRotation.current.x - logoGroup.rotation.x) * 0.1;
//             } else {
//                 // Auto-rotate very subtly when not interacting
//                 logoGroup.rotation.y = Math.sin(elapsedTime * 0.2) * 0.1;
//                 logoGroup.rotation.x = Math.sin(elapsedTime * 0.15) * 0.05;
//             }
            
//             renderer.render(scene, camera);
//             animationFrameRef.current = requestAnimationFrame(animate);
//         };
        
//         animate();
        
//         // Set up event listeners
//         window.addEventListener('mousemove', handleMouseMove);
        
//         // Handle resize
//         const handleResize = () => {
//             if (!containerRef.current) return;
            
//             const width = containerRef.current.clientWidth;
//             const height = 80;
            
//             camera.aspect = width / height;
//             camera.updateProjectionMatrix();
            
//             renderer.setSize(width, height);
//         };
        
//         window.addEventListener('resize', handleResize);
        
//         // Cleanup
//         return () => {
//             window.removeEventListener('resize', handleResize);
//             window.removeEventListener('mousemove', handleMouseMove);
            
//             if (animationFrameRef.current) {
//                 cancelAnimationFrame(animationFrameRef.current);
//             }
            
//             // Dispose resources
//             scene.traverse((object: THREE.Object3D) => {
//                 if ((object as THREE.Mesh).geometry) {
//                     (object as THREE.Mesh).geometry.dispose();
//                 }
                
//                 if ((object as THREE.Mesh).material) {
//                     const material = (object as THREE.Mesh).material;
//                     if (Array.isArray(material)) {
//                         material.forEach(mat => mat.dispose());
//                     } else {
//                         material.dispose();
//                     }
//                 }
//             });
            
//             renderer.dispose();
//         };
//     }, [isHovered, isDragging]);
    
//     // Mouse event handlers
//     const handleMouseEnter = () => {
//         setIsHovered(true);
//     };
    
//     const handleMouseLeave = () => {
//         setIsHovered(false);
//         setIsDragging(false);
//     };
    
//     const handleMouseDown = () => {
//         setIsDragging(true);
//     };
    
//     const handleMouseUp = () => {
//         setIsDragging(false);
//     };
    
//     const handleDoubleClick = () => {
//         triggerScatterAnimation();
//     };
    
//     return (
//         <div
//             ref={containerRef}
//             className="flex-shrink-0 h-20 cursor-pointer"
//             onClick={onClick}
//             onMouseEnter={handleMouseEnter}
//             onMouseLeave={handleMouseLeave}
//             onMouseDown={handleMouseDown}
//             onMouseUp={handleMouseUp}
//             onDoubleClick={handleDoubleClick}
//             style={{ minWidth: "180px" }}
//         >
//             <canvas
//                 ref={canvasRef}
//                 className="w-full h-full"
//             />
//             <div className="sr-only">MeetAI</div>
//         </div>
//     );
// }

// // Parent component to use in Navbar
// const MeetAILogoContainer = () => {
//     const handleClick = () => {
//         const heroSection = document.getElementById('hero');
//         if (heroSection) {
//             heroSection.scrollIntoView({ behavior: 'smooth' });
//         }
//     };
    
//     return (
//         <div className="flex-shrink-0">
//             <MeetAILogo onClick={handleClick} />
            
//             {/* CSS Fallback when WebGL is not available */}
//             <noscript>
//                 <div className="flex items-center">
//                     <span className="bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 font-bold text-transparent text-2xl md:text-3xl">Meet</span>
//                     <span className="relative ml-1 font-bold text-white text-2xl md:text-3xl">
//                         AI
//                         <span className="-top-1 -right-1 absolute bg-blue-500 rounded-full w-2 h-2 animate-pulse"></span>
//                     </span>
//                 </div>
//             </noscript>
//         </div>
//     );
// };

// export default MeetAILogoContainer;




import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function MeetAILogo({ onClick }: { onClick?: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const mousePosition = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const targetRotation = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    
    // Modified scatter state to include a flag for continuous animation
    const scatterState = useRef<{ 
        active: boolean, 
        startTime: number, 
        duration: number,
        continuous: boolean,
        nextAnimationTime: number
    }>({
        active: false,
        startTime: 0,
        duration: 2000, // Time in ms for the scatter animation
        continuous: true, // Set to true for continuous animation
        nextAnimationTime: 0
    });
    
    // Store original positions of all letters for scatter animation
    const originalPositions = useRef<Map<THREE.Object3D, { pos: THREE.Vector3, rot: THREE.Euler }>>(new Map());
    
    // Start scatter animation
    const triggerScatterAnimation = () => {
        if (!scatterState.current.active) {
            scatterState.current = {
                ...scatterState.current,
                active: true,
                startTime: Date.now(),
            };
        }
    };

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        // Setup
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = 80;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            canvas: canvasRef.current
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Point lights for dynamic effects
        const blueLight = new THREE.PointLight(0x4285f4, 2, 10);
        blueLight.position.set(-3, 2, 3);
        scene.add(blueLight);

        const purpleLight = new THREE.PointLight(0x9c27b0, 2, 10);
        purpleLight.position.set(3, -2, 3);
        scene.add(purpleLight);

        // Materials with higher shininess for better reflections
        const blueMaterial = new THREE.MeshPhongMaterial({
            color: 0x4285f4,
            specular: 0xffffff,
            shininess: 150,
            emissive: 0x2a5caa,
            emissiveIntensity: 0.3,
        });

        const purpleMaterial = new THREE.MeshPhongMaterial({
            color: 0x9c27b0,
            specular: 0xffffff,
            shininess: 150,
            emissive: 0x6a0080,
            emissiveIntensity: 0.5,
        });

        const whiteMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x4285f4,
            shininess: 150,
            emissive: 0x4285f4,
            emissiveIntensity: 0.2,
        });

        // Create 3D logo group
        const logoGroup = new THREE.Group();

        // Create "Meet" part (blue)
        const meetGroup = new THREE.Group();
        
        // M
        const mLeftGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
        const mLeftMesh = new THREE.Mesh(mLeftGeometry, blueMaterial);
        mLeftMesh.position.x = -2.5;
        
        const mMiddleGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
        const mMiddleMesh = new THREE.Mesh(mMiddleGeometry, blueMaterial);
        mMiddleMesh.position.x = -2.2;
        
        const mRightGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
        const mRightMesh = new THREE.Mesh(mRightGeometry, blueMaterial);
        mRightMesh.position.x = -1.9;
        
        const mTopGeometry = new THREE.BoxGeometry(0.75, 0.15, 0.3);
        const mTopMesh = new THREE.Mesh(mTopGeometry, blueMaterial);
        mTopMesh.position.x = -2.2;
        mTopMesh.position.y = 0.325;
        
        meetGroup.add(mLeftMesh, mMiddleMesh, mRightMesh, mTopMesh);
        
        // E (first)
        const e1VerticalGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
        const e1VerticalMesh = new THREE.Mesh(e1VerticalGeometry, blueMaterial);
        e1VerticalMesh.position.x = -1.5;
        
        const e1TopGeometry = new THREE.BoxGeometry(0.35, 0.15, 0.3);
        const e1TopMesh = new THREE.Mesh(e1TopGeometry, blueMaterial);
        e1TopMesh.position.x = -1.35;
        e1TopMesh.position.y = 0.325;
        
        const e1MiddleGeometry = new THREE.BoxGeometry(0.25, 0.15, 0.3);
        const e1MiddleMesh = new THREE.Mesh(e1MiddleGeometry, blueMaterial);
        e1MiddleMesh.position.x = -1.4;
        
        const e1BottomGeometry = new THREE.BoxGeometry(0.35, 0.15, 0.3);
        const e1BottomMesh = new THREE.Mesh(e1BottomGeometry, blueMaterial);
        e1BottomMesh.position.x = -1.35;
        e1BottomMesh.position.y = -0.325;
        
        meetGroup.add(e1VerticalMesh, e1TopMesh, e1MiddleMesh, e1BottomMesh);
        
        // E (second)
        const e2VerticalGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
        const e2VerticalMesh = new THREE.Mesh(e2VerticalGeometry, blueMaterial);
        e2VerticalMesh.position.x = -1.0;
        
        const e2TopGeometry = new THREE.BoxGeometry(0.35, 0.15, 0.3);
        const e2TopMesh = new THREE.Mesh(e2TopGeometry, blueMaterial);
        e2TopMesh.position.x = -0.85;
        e2TopMesh.position.y = 0.325;
        
        const e2MiddleGeometry = new THREE.BoxGeometry(0.25, 0.15, 0.3);
        const e2MiddleMesh = new THREE.Mesh(e2MiddleGeometry, blueMaterial);
        e2MiddleMesh.position.x = -0.9;
        
        const e2BottomGeometry = new THREE.BoxGeometry(0.35, 0.15, 0.3);
        const e2BottomMesh = new THREE.Mesh(e2BottomGeometry, blueMaterial);
        e2BottomMesh.position.x = -0.85;
        e2BottomMesh.position.y = -0.325;
        
        meetGroup.add(e2VerticalMesh, e2TopMesh, e2MiddleMesh, e2BottomMesh);
        
        // T (purple)
        const tGroup = new THREE.Group();
        
        const tTopGeometry = new THREE.BoxGeometry(0.6, 0.15, 0.35);
        const tTopMesh = new THREE.Mesh(tTopGeometry, purpleMaterial);
        tTopMesh.position.x = -0.4;
        tTopMesh.position.y = 0.325;
        
        const tVerticalGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.35);
        const tVerticalMesh = new THREE.Mesh(tVerticalGeometry, purpleMaterial);
        tVerticalMesh.position.x = -0.4;
        
        tGroup.add(tTopMesh, tVerticalMesh);
        
        // AI (white)
        const aiGroup = new THREE.Group();
        
        // A
        const aLeftGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
        const aLeftMesh = new THREE.Mesh(aLeftGeometry, whiteMaterial);
        aLeftMesh.position.x = 0.1;
        
        const aRightGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
        const aRightMesh = new THREE.Mesh(aRightGeometry, whiteMaterial);
        aRightMesh.position.x = 0.5;
        
        const aTopGeometry = new THREE.BoxGeometry(0.5, 0.15, 0.3);
        const aTopMesh = new THREE.Mesh(aTopGeometry, whiteMaterial);
        aTopMesh.position.x = 0.3;
        aTopMesh.position.y = 0.325;
        
        const aMiddleGeometry = new THREE.BoxGeometry(0.4, 0.15, 0.3);
        const aMiddleMesh = new THREE.Mesh(aMiddleGeometry, whiteMaterial);
        aMiddleMesh.position.x = 0.3;
        
        aiGroup.add(aLeftMesh, aRightMesh, aTopMesh, aMiddleMesh);
        
        // I
        const iGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.3);
        const iMesh = new THREE.Mesh(iGeometry, whiteMaterial);
        iMesh.position.x = 0.8;
        
        aiGroup.add(iMesh);
        
        // Add main dot
        const dotGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const dotMaterial = new THREE.MeshPhongMaterial({
            color: 0x4285f4,
            emissive: 0x4285f4,
            emissiveIntensity: 0.8,
        });
        
        const dotMesh = new THREE.Mesh(dotGeometry, dotMaterial);
        dotMesh.position.set(1.0, 0.4, 0.3);
        
        // Add particle effects
        const particlesGroup = new THREE.Group();
        const particles: THREE.Mesh[] = [];

        // Create small particles that will orbit around the dot
        const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const blueMaterialParticle = new THREE.MeshPhongMaterial({
            color: 0x4285f4,
            emissive: 0x4285f4,
            emissiveIntensity: 0.9,
            transparent: true,
            opacity: 0.8
        });

        const purpleMaterialParticle = new THREE.MeshPhongMaterial({
            color: 0x9c27b0,
            emissive: 0x9c27b0,
            emissiveIntensity: 0.9,
            transparent: true,
            opacity: 0.8
        });

        // Create 12 particles to orbit around the dot
        for (let i = 0; i < 12; i++) {
            const material = i % 2 === 0 ? blueMaterialParticle : purpleMaterialParticle;
            const particle = new THREE.Mesh(particleGeometry, material);
            
            // Set initial random position
            const angle = (i / 12) * Math.PI * 2;
            const radius = 0.2 + Math.random() * 0.1;
            
            particle.userData = {
                angle: angle,
                radius: radius,
                speed: 0.01 + Math.random() * 0.02,
                offsetY: Math.random() * 0.2 - 0.1
            };
            
            particles.push(particle);
            particlesGroup.add(particle);
        }
        
        // Add all groups to the logo group
        logoGroup.add(meetGroup, tGroup, aiGroup, dotMesh, particlesGroup);
        
        // Center the logo group
        logoGroup.position.x = 0.8;
        scene.add(logoGroup);
        
        // Add glow effect with Bloom (simulated)
        const glowSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 32, 32),
            new THREE.MeshBasicMaterial({
                color: 0x4285f4,
                transparent: true,
                opacity: 0.15
            })
        );
        glowSphere.position.copy(dotMesh.position);
        logoGroup.add(glowSphere);
        
        // Get all the elements for scatter animation
        const allElements: THREE.Object3D[] = [];
        const getElementsRecursively = (obj: THREE.Object3D) => {
            if (obj instanceof THREE.Mesh) {
                allElements.push(obj);
            }
            obj.children.forEach(child => getElementsRecursively(child));
        };
        
        // Get all elements and store their original positions
        getElementsRecursively(logoGroup);
        allElements.forEach(obj => {
            originalPositions.current.set(obj, {
                pos: obj.position.clone(),
                rot: obj.rotation.clone()
            });
        });
        
        // Wave animation for Meet letters
        let meetLetters = [mLeftMesh, mMiddleMesh, mRightMesh, mTopMesh, 
                          e1VerticalMesh, e1TopMesh, e1MiddleMesh, e1BottomMesh,
                          e2VerticalMesh, e2TopMesh, e2MiddleMesh, e2BottomMesh];
        
        meetLetters.forEach((letter, index) => {
            letter.userData = {
                originalY: letter.position.y,
                phaseOffset: index * 0.2
            };
        });
        
        // Mouse interaction
        const handleMouseMove = (event: MouseEvent) => {
            if (!isHovered && !isDragging) return;
            
            // Calculate normalized mouse position (-1 to 1)
            const rect = container.getBoundingClientRect();
            mousePosition.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
            mousePosition.current.y = -((event.clientY - rect.top) / height) * 2 + 1;
            
            // Set target rotation based on mouse position only when dragging or hovering
            if (isDragging) {
                targetRotation.current.y = mousePosition.current.x * 0.5;
                targetRotation.current.x = mousePosition.current.y * 0.3;
            } else if (isHovered) {
                targetRotation.current.y = mousePosition.current.x * 0.2;
                targetRotation.current.x = mousePosition.current.y * 0.1;
            }
        };
        
        // Scatter/rebuild animation function
        const updateScatterAnimation = () => {
            if (!scatterState.current.active) {
                // Check if it's time to start the next animation
                const now = Date.now();
                if (scatterState.current.continuous && now >= scatterState.current.nextAnimationTime) {
                    triggerScatterAnimation();
                }
                return;
            }
            
            const now = Date.now();
            const elapsed = now - scatterState.current.startTime;
            const progress = Math.min(elapsed / scatterState.current.duration, 1);
            
            // Animation is complete
            if (progress >= 1) {
                scatterState.current.active = false;
                
                // Set the next animation time with a delay (breathing room between animations)
                if (scatterState.current.continuous) {
                    // Add a 2-second pause between animations
                    scatterState.current.nextAnimationTime = now + 2000;
                }
                return;
            }
            
            // Create a smooth easing for rebuild (ease-in-out)
            // For scatter: 0->0.5 progress = 0->1 scatter effect
            // For rebuild: 0.5->1 progress = 1->0 scatter effect (rebuilding)
            let scatterFactor;
            
            if (progress < 0.5) {
                // Scatter phase (0 to 0.5 becomes 0 to 1)
                scatterFactor = progress * 2;
            } else {
                // Rebuild phase (0.5 to 1 becomes 1 to 0)
                scatterFactor = 2 - progress * 2;
            }
            
            // Apply easing
            scatterFactor = scatterFactor * scatterFactor * (3 - 2 * scatterFactor); // Smoothstep easing
            
            // Apply scatter to all elements except the dot and particles
            allElements.forEach((obj) => {
                if (obj === dotMesh || particles.includes(obj as THREE.Mesh)) return;
                
                const original = originalPositions.current.get(obj);
                if (original) {
                    // Generate consistent random offset for each object
                    const randomOffsetX = (Math.sin(obj.id * 541) * 2 - 1) * 3 * scatterFactor;
                    const randomOffsetY = (Math.cos(obj.id * 389) * 2 - 1) * 2 * scatterFactor;
                    const randomOffsetZ = (Math.sin(obj.id * 821) * 2 - 1) * 2 * scatterFactor;
                    
                    // Interpolate between original and scattered position
                    obj.position.x = original.pos.x + randomOffsetX;
                    obj.position.y = original.pos.y + randomOffsetY;
                    obj.position.z = original.pos.z + randomOffsetZ;
                    
                    // Also add some rotation
                    obj.rotation.x = original.rot.x + Math.sin(obj.id) * Math.PI * scatterFactor;
                    obj.rotation.y = original.rot.y + Math.cos(obj.id) * Math.PI * scatterFactor;
                    obj.rotation.z = original.rot.z + Math.sin(obj.id * 0.5) * Math.PI * scatterFactor;
                }
            });
        };
        
        // Animation loop
        const clock = new THREE.Clock();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            
            // Handle scatter animation if active
            updateScatterAnimation();
            
            // Moving lights
            blueLight.position.x = Math.sin(elapsedTime * 0.5) * 3;
            blueLight.position.y = Math.cos(elapsedTime * 0.3) * 2;
            
            purpleLight.position.x = Math.cos(elapsedTime * 0.4) * 3;
            purpleLight.position.y = Math.sin(elapsedTime * 0.6) * 2;
            
            // Pulse the dot
            const dotScale = 1 + 0.2 * Math.sin(elapsedTime * 5);
            dotMesh.scale.set(dotScale, dotScale, dotScale);
            
            // Pulse the glow
            const glowScale = 1 + 0.5 * Math.sin(elapsedTime * 5);
            glowSphere.scale.set(glowScale, glowScale, glowScale);
            glowSphere.material.opacity = 0.15 + 0.1 * Math.sin(elapsedTime * 5);
            
            // Animate particles
            particles.forEach(particle => {
                const data = particle.userData;
                data.angle += data.speed;
                
                particle.position.x = dotMesh.position.x + Math.cos(data.angle) * data.radius;
                particle.position.y = dotMesh.position.y + Math.sin(data.angle) * data.radius + data.offsetY;
                particle.position.z = dotMesh.position.z + Math.sin(data.angle * 2) * 0.1;
                
                const particleScale = 0.8 + 0.4 * Math.sin(elapsedTime * 3 + data.angle);
                particle.scale.set(particleScale, particleScale, particleScale);
            });
            
            // Skip the normal animations if we're in scatter mode
            if (!scatterState.current.active) {
                // Make the 't' float with a more complex motion
                tGroup.position.y = 0.05 * Math.sin(elapsedTime * 2);
                tGroup.rotation.z = Math.sin(elapsedTime) * 0.03;
                
                // Wave animation for "Meet" letters
                meetLetters.forEach(letter => {
                    const data = letter.userData;
                    letter.position.y = data.originalY + 0.03 * Math.sin(elapsedTime * 3 + data.phaseOffset);
                });
                
                // AI group subtle floating
                aiGroup.position.y = 0.04 * Math.sin(elapsedTime * 1.5);
            }
            
            // Smooth rotation based on mouse position when hovered or dragging
            if (isHovered || isDragging) {
                logoGroup.rotation.y += (targetRotation.current.y - logoGroup.rotation.y) * 0.1;
                logoGroup.rotation.x += (targetRotation.current.x - logoGroup.rotation.x) * 0.1;
            } else {
                // Auto-rotate very subtly when not interacting
                logoGroup.rotation.y = Math.sin(elapsedTime * 0.2) * 0.1;
                logoGroup.rotation.x = Math.sin(elapsedTime * 0.15) * 0.05;
            }
            
            renderer.render(scene, camera);
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        
        // Initialize the first scatter animation with a slight delay
        scatterState.current.nextAnimationTime = Date.now() + 1000;
        
        animate();
        
        // Set up event listeners
        window.addEventListener('mousemove', handleMouseMove);
        
        // Handle resize
        const handleResize = () => {
            if (!containerRef.current) return;
            
            const width = containerRef.current.clientWidth;
            const height = 80;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            
            renderer.setSize(width, height);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            
            // Dispose resources
            scene.traverse((object: THREE.Object3D) => {
                if ((object as THREE.Mesh).geometry) {
                    (object as THREE.Mesh).geometry.dispose();
                }
                
                if ((object as THREE.Mesh).material) {
                    const material = (object as THREE.Mesh).material;
                    if (Array.isArray(material)) {
                        material.forEach(mat => mat.dispose());
                    } else {
                        material.dispose();
                    }
                }
            });
            
            renderer.dispose();
        };
    }, [isHovered, isDragging]);
    
    // Mouse event handlers
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    
    const handleMouseLeave = () => {
        setIsHovered(false);
        setIsDragging(false);
    };
    
    const handleMouseDown = () => {
        setIsDragging(true);
    };
    
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    
    const handleDoubleClick = () => {
        triggerScatterAnimation();
    };
    
    return (
        <div
            ref={containerRef}
            className="flex-shrink-0 h-20 cursor-pointer"
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
            style={{ minWidth: "180px" }}
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />
            <div className="sr-only">MeetAI</div>
        </div>
    );
}

// Parent component to use in Navbar
const MeetAILogoContainer = () => {
    const handleClick = () => {
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            heroSection.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    return (
        <div className="flex-shrink-0">
            <MeetAILogo onClick={handleClick} />
            
            {/* CSS Fallback when WebGL is not available */}
            <noscript>
                <div className="flex items-center">
                    <span className="bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 font-bold text-transparent text-2xl md:text-3xl">Meet</span>
                    <span className="relative ml-1 font-bold text-white text-2xl md:text-3xl">
                        AI
                        <span className="-top-1 -right-1 absolute bg-blue-500 rounded-full w-2 h-2 animate-pulse"></span>
                    </span>
                </div>
            </noscript>
        </div>
    );
};

export default MeetAILogoContainer;