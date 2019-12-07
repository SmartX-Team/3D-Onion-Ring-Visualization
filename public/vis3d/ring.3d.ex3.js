//import * as THREE from './three.module.js'

function main() {

    var container, stats;
    var camera, scene, renderer;
    var group;
    
    /*
    var targetRotation = 0;
    var targetRotationOnMouseDown = 0;
    
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    */

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 100, 350, 0 );
    scene.add( camera );

    var light = new THREE.PointLight( 0xffffff, 0.9 );
    camera.add( light );

    group = new THREE.Group();
    group.position.y = 0;
    scene.add( group );

    function addShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {
        var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

        var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color } ) );
        mesh.position.set( x, y, z );
        mesh.rotation.set( rx, ry, rz );
        mesh.scale.set( s, s, s );
        group.add( mesh );

    }

    // Arc circle 1
    var x = 0, y = 0;
    var arcShape1 = new THREE.Shape();
    arcShape1.moveTo( 0, 0 );
    arcShape1.absarc( 10, 10, 11, 0, Math.PI*2, false );

    var holePath1 = new THREE.Path();
    holePath1.moveTo( 20, 10 );
    holePath1.absarc( 10, 10, 10, 0, Math.PI*2, true );
    arcShape1.holes.push( holePath1 );
    //

    // Arc circle 2
    var x = 0, y = 0;
    var arcShape2 = new THREE.Shape();
    arcShape2.moveTo( 0, 0 );
    arcShape2.absarc( 10, 10, 13, 0, Math.PI*2, false );

    var holePath2 = new THREE.Path();
    holePath2.moveTo( 25, 10 );
    holePath2.absarc( 10, 10, 10, 0, Math.PI*2, true );
    arcShape2.holes.push( holePath2 );
    //

    var extrudeSettings = { amount: 1.6, 
        bevelEnabled: true, 
        bevelSegments: 30, 
        steps: 30, 
        bevelSize: 0, 
        bevelThickness: 1.5, 
        curveSegments: 100 };

    addShape( arcShape1, extrudeSettings, 0xffc107,  -35, -30, -20, 0, 0, 0, 4 );
    addShape( arcShape2, extrudeSettings, 0xffc107,  -40, -22, -50, 0, 0.6, 0, 4 );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    group.castShadow = true;
    group.receiveShadow = false;

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