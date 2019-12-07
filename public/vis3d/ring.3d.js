function main() {

    // Configuration Variables for Onion-ring
    const ringSize = 10;


    //Document Management
    var container;
    container = document.createElement( 'div' );
    document.body.appendChild( container );


    // Basic ThreeJS Configuration (Scene, Camera, Light)
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 0, 100 );
    scene.add( camera );

    const light = new THREE.PointLight( 0xffffff, 0.9 );
    camera.add( light );


    // Creating a piece of onion-ring
    function degreeToRadian(degree){
        const radian = Math.PI * degree / 180;
        return radian;
    }

    function getCircleX(xCenter, radius, radian){
        const x = xCenter + radius * Math.cos(radian);
        console.log("xCenter:" + xCenter + " x: " + x + " r:" + radius + " radian:" + radian);
        return x;
    }

    function getCircleY(yCenter, radius, radian){
        const y = yCenter + radius * Math.sin(radian);
        console.log("yCenter:" + yCenter + " y: " + y + " r:" + radius + " radian:" + radian);
        return y;
    }

    function getExtrudeSetting( ringHeight ){
        const extrudeSetting = { 
            amount: ringHeight, 
            bevelEnabled: true, 
            steps: 1, 
            bevelSize: 0, 
            bevelThickness: 1, 
            curveSegments: 100 };
        return extrudeSetting;
    }

    function createRingPiece( layerNum, startDegree, endDegree ){
        if (layerNum < 2 || startDegree < 0 || endDegree > 360){
            return null;
        }

        const innerRadius = ringSize * (layerNum - 1);
        const outerRadius = ringSize * layerNum;
        const startRadian = degreeToRadian(startDegree);
        const endRadian = degreeToRadian(endDegree);
        const pieceColor = 0xffffff;


        const ringPieceShape = new THREE.Shape();
        ringPieceShape.moveTo(getCircleX(0, innerRadius, startRadian), getCircleY(0, innerRadius, startRadian));
        ringPieceShape.absarc(0, 0, innerRadius, startRadian, endRadian, false);
        ringPieceShape.lineTo(getCircleX(0, outerRadius, endRadian), getCircleY(0, outerRadius, endRadian));
        ringPieceShape.absarc(0, 0, outerRadius, endRadian, startRadian, true);
        ringPieceShape.lineTo(getCircleX(0, innerRadius, startRadian), getCircleY(0, innerRadius, startRadian));

        const extrudeSetting = getExtrudeSetting(layerNum);
        const geometry = new THREE.ExtrudeGeometry( ringPieceShape, extrudeSetting );
        const ringPieceMesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: pieceColor } ) );

        return ringPieceMesh;
    }


    // ToDo: Implementing Main Logic
    const group = new THREE.Group();
    scene.add( group );

    // Opening a JSON file descring a playground topology
    // 

    group.add(createRingPiece(2, 90, 180));


    // Rendering Configuration
    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    
    //group.castShadow = true;
    //group.receiveShadow = false;

    container.appendChild( renderer.domElement );
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    renderer.setSize( window.innerWidth, window.innerHeight );

    function animate() {

        requestAnimationFrame( animate );
    
        render();
    
    }
    
    function render() {
    
        renderer.render( scene, camera );
    
    }

    animate();
}

main();