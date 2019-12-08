function main() {
    // Configuration Variables for Onion-ring
    const ringSize = 10;
    const segmentLayer = 4;
    const pieceHeightScale = 3;
    const resourceColorPallete = [ 0xC0C0C0, 0xC0C0C0, 0x008000, 0x008000, 0x008000, 0xFFFF00, 0xFFFF00, 0x0000FF ] // Silver, Silver, Green, Green, Green, Yellow, Yellow, Blue
    const securityColorPallete = [ 0x808080, 0x008000, 0xFFFF00, 0xFFA500, 0xFF0000, 0x800000, 0x000000 ] // Gray, Green, Yellow, Orange, Red, Maroon, Black
    const securityMode = true;
    const radiusMargin = 0.2;
    const angleMargin = 0.1;


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
        //console.log("xCenter:" + xCenter + " x: " + x + " r:" + radius + " radian:" + radian);
        return x;
    }

    function getCircleY(yCenter, radius, radian){
        const y = yCenter + radius * Math.sin(radian);
        //console.log("yCenter:" + yCenter + " y: " + y + " r:" + radius + " radian:" + radian);
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

    function createTextMesh ( txt, posX, posY, posZ ){
        console.log("[createTextMesh]" + " txt: " + txt + " txtPosX: " + posX + " txtPosY: " + posY + " txtPosZ: " + posZ);

        var loader = new THREE.FontLoader();
        var font = loader.parse(fontJSON);
        console.log(font);
        var txtGeometry = new THREE.TextGeometry( txt, {
            font: font,
            size: 1,
            height: 0.5,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 0.1
        } );

        var txtMaterial = new THREE.MeshPhongMaterial({color:0x000000});
        var txtMesh = new THREE.Mesh(txtGeometry, txtMaterial);
        txtMesh.position.x = posX;
        txtMesh.position.y = posY;
        txtMesh.position.z = posZ;

        return txtMesh;
    }

    function createCenterCircle( layerNum, pieceColor, height, pieceName ){
        if (layerNum != 1){
            return null;
        }
        console.log("[createCenterCircle]" + " layerNum: " + layerNum + " pieceColor: " + pieceColor + " height: " + height);

        const radius = ringSize - radiusMargin;
        const centerCircleShape = new THREE.Shape();
        centerCircleShape.moveTo(0, 0);
        centerCircleShape.absarc(0, 0, radius, degreeToRadian(0), degreeToRadian(360), false);

        const extrudeSetting = getExtrudeSetting(height);
        const geometry = new THREE.ExtrudeGeometry( centerCircleShape, extrudeSetting );
        const centerCircleMesh = new THREE.Mesh ( geometry, new THREE.MeshPhongMaterial( { color: pieceColor }) );

        const txtPosX = 0
        const txtPosY = 0
        const txtPosZ = height + 1;
        const txtMesh = createTextMesh(pieceName, txtPosX, txtPosY, txtPosZ);
        centerCircleMesh.add(txtMesh);

        return centerCircleMesh;
    }

    function createRingPiece( layerNum, pieceColor, height, startDegree, endDegree, pieceName ){
        if (layerNum < 2 || startDegree < 0 || endDegree > 360){
            return null;
        }

        const innerRadius = (ringSize * (layerNum - 1)) + radiusMargin;
        const outerRadius = (ringSize * layerNum) - radiusMargin;
        const startRadian = degreeToRadian(startDegree + angleMargin);
        const endRadian = degreeToRadian(endDegree - angleMargin);

        console.log("[createRingPiece]" + " layerNum: " + layerNum + " pieceColor: " + pieceColor + " height: " + height + " startDegree: "+ startDegree + " endDegree: " + endDegree);

        const ringPieceShape = new THREE.Shape();
        ringPieceShape.moveTo(getCircleX(0, innerRadius, startRadian), getCircleY(0, innerRadius, startRadian));
        ringPieceShape.absarc(0, 0, innerRadius, startRadian, endRadian, false);
        ringPieceShape.lineTo(getCircleX(0, outerRadius, endRadian), getCircleY(0, outerRadius, endRadian));
        ringPieceShape.absarc(0, 0, outerRadius, endRadian, startRadian, true);
        ringPieceShape.lineTo(getCircleX(0, innerRadius, startRadian), getCircleY(0, innerRadius, startRadian));

        const extrudeSetting = getExtrudeSetting(height);
        const geometry = new THREE.ExtrudeGeometry( ringPieceShape, extrudeSetting );
        var ringPieceMesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: pieceColor } ) );


        const midRadius = (outerRadius + innerRadius) / 2;
        const midRadian = (endRadian + startRadian) / 2;
        const txtPosX = getCircleX(0, midRadius, midRadian);
        const txtPosY = getCircleY(0, midRadius, midRadian);
        const txtPosZ = height + 1;
        const txtMesh = createTextMesh(pieceName, txtPosX, txtPosY, txtPosZ);
        ringPieceMesh.add(txtMesh);

        return ringPieceMesh;
    }

    function countRingSegments(jsonVar){
        //console.log(jsonVar);

        if (jsonVar.sublayer == null && jsonVar.layer < segmentLayer){
            return 1;
        }
        else if (jsonVar.layer == segmentLayer){
            return 1;
        }

        var temp = 0;
        jsonVar.sublayer.forEach(element => {
            temp += countRingSegments(element);
            jsonVar.segments = temp;
        });
        return temp;
    }

    function drawRingSegments(jsonVar, startDegree, endDegree){
        // Implementing Main Logic
        // Layer, Start Radian, End Radian
        const secLevel = jsonVar.security;
        const layerNum = jsonVar.layer;

        console.log("[drawRingSegments]" + " name: "+ jsonVar.name + " startDegree: " + startDegree + " endDegree: " + endDegree + " secLevel: " + secLevel + " layerNum: " + layerNum + " segments: " + jsonVar.segments);

        var pieceColor, height;
        if (securityMode == true){
            pieceColor = securityColorPallete[secLevel-1];
            height = secLevel * pieceHeightScale;
        } else { //Resource Mode
            pieceColor = resourceColorPallete[layerNum-1];
            height = 1  * pieceHeightScale;
        }

        // Create a visualization piece
        if (layerNum == 1){
            const center = createCenterCircle(layerNum, pieceColor, height, jsonVar.name);
            group.add(center);
        } else {
            const piece = createRingPiece(layerNum, pieceColor, height, startDegree, endDegree, jsonVar.name);
            group.add(piece);
        }
        
        if (jsonVar.sublayer == null){
            return;
        } else {
            var nextStartDegree = startDegree;
            const subSegmentDegree = (endDegree - startDegree) / jsonVar.segments;
            var nextEndDegree;
            jsonVar.sublayer.forEach(element => {
                if (!element.hasOwnProperty('segments')){
                    if (element.layer > segmentLayer){
                        element.segments = jsonVar.segments / jsonVar.sublayer.length;
                    } else{
                        element.segments = 1;
                    }                    
                }
                nextEndDegree = nextStartDegree + subSegmentDegree * element.segments;
                console.log("[call drawRingSegments]" + " element: " + element.name + " layer: " + element.layer + " startDegree: " + startDegree + " endDegree: " + endDegree + " nextStartDegree: " + nextStartDegree + " nextEndDegree: " + nextEndDegree  + " element.segments: " + element.segments + " subSegmentDegree: " + subSegmentDegree);
                drawRingSegments(element, nextStartDegree, nextEndDegree);
                nextStartDegree = nextEndDegree;
            });
        }
        
    }

    const group = new THREE.Group();
    scene.add( group );

    countRingSegments(topologyVar);
    console.log(topologyVar);

    drawRingSegments(topologyVar, 0, 360);

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