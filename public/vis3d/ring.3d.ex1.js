function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas})

    // Camera
    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = 10;

    // Scene
    const scene = new THREE.Scene();

    /*
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1,2,4);
        scene.add(light)
    }*/

    // Mesh
    function Ring3D (innerRadius, outerRadius, heigth, Segments) {

        var extrudeSettings = {
            amount: heigth,
            bevelEnabled: false,
            curveSegments: Segments
        };

        var arcShape = new THREE.Shape();
        arcShape.moveTo(outerRadius, 0);
        arcShape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

        var holePath = new THREE.Path();
        holePath.moveTo(innerRadius, 0);
        holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
        arcShape.holes.push(holePath);

        var geometry = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);

        var material = new THREE.MeshBasicMaterial({
            color: 0x44aa88
        });

        var mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.y = Math.PI / 2;
        mesh.position.x = heigth / 2;

        var object = new THREE.Object3D;
        object.add(mesh);

        return object;

    }

    const ring3d = Ring3D(3, 5, 2, 50);
    scene.add(ring3d)

    renderer.render(scene, camera);
}

main();
