"use strict";

/* Get or create the application global variable */
var App = App || {};

/* IIFE to initialize the main entry of the application*/
(function() {

    // setup the pointer to the scope 'this' variable
    var self = this;

    /* Entry point of the application */
    App.start = function()
    {
        // create a new scene
        App.scene = new Scene({container:"scene"});

        // initialize the particle system
        var particleSystem = new ParticleSystem();
        particleSystem.initialize('data/058.csv');

        //add the particle system to the scene
        App.scene.addObject( particleSystem.getParticleSystems());
        App.ps = particleSystem;

        var myOptions = new THREE.OrbitControls(App.scene.getCamera(), App.scene.getRenderer().domElement);
        myOptions.enablePan = false;
        myOptions.update();
        // new THREE.ObjectControls(App.scene.getCamera(), App.scene.getRenderer().domElement, App.scene.getScene("shanksGroup"));

        // render the scene
        App.scene.render();



    };

}) ();
var colorScale = d3.scaleLinear()
    .domain([0,50])
    .range(["#ffffff", "#756bb1"]);

// function getColorByConcentration(concentration) {
//     if(concentration < 10)
//         return colorScale(0);
//     if(concentration > 10)
//         return colorScale(5);
//   else if(concentration < 120)
//       return colorScale(1);
//   else if(concentration < 180)
//       return colorScale(2);
//   else if(concentration < 240)
//       return colorScale(3);
//   else if(concentration < 300)
//       return colorScale(4);
//   else if(concentration < 360)
//       return colorScale(5);
// }
//
// THREE.ObjectControls = function (camera, domElement, cylinder) {
//     this.camera = camera;
//     this.cylinder = cylinder;
//     this.domElement = (domElement !== undefined) ? domElement : document;
//
//     var maxDistance = 30,
//         minDistance = -1,
//         zoomSpeed = 0.5,
//         rotationSpeed = 0.01;
//
//     var mouseFlags = {
//         MOUSEDOWN: 0,
//         MOUSEMOVE: 1
//     };
//
//     var flag;
//     var isDragging = false;
//     var previousMousePosition = {
//         x: 0,
//         y: 0
//     };
//
//     /**currentTouches
//      * length 0 : no zoom
//      * length 2 : is zoomming
//      */
//     var currentTouches = [];
//
//     var prevZoomDiff = {
//         X: null,
//         Y: null
//     };
//
//
//     /******************* Interaction Controls (rotate & zoom, desktop & mobile) - Start ************/
//     // MOUSE - move
//     this.domElement.addEventListener('mousedown', mouseDown, false);
//     this.domElement.addEventListener('mousemove', mouseMove, false);
//     this.domElement.addEventListener('mouseup', mouseUp, false);
//     // MOUSE - zoom
//     this.domElement.addEventListener('wheel', wheel, false);
//     function mouseDown(e) {
//         isDragging = true;
//         flag = mouseFlags.MOUSEDOWN;
//     }
//
//     function mouseMove(e) {
//         var deltaMove = {
//             x: e.offsetX - previousMousePosition.x,
//             y: e.offsetY - previousMousePosition.y
//         };
//
//         // if (isDragging) {
//         // 	if (deltaMove.x != 0) {
//         // 		// console.log(deltaMove.x);
//         // 		cylinder.rotation.y += deltaMove.x / 200;
//         // 		flag = mouseFlags.MOUSEMOVE;
//         // 	}
//         // }
//
//         if(isDragging) {
//
//             var deltaRotationQuaternion = new THREE.Quaternion()
//                 .setFromEuler(new THREE.Euler(deltaMove.y * 0.005, deltaMove.x * 0.005 ,
//                     0,
//                     'XYZ'
//                 ));
//
//             cylinder.quaternion.multiplyQuaternions(deltaRotationQuaternion, cylinder.quaternion);
//         }
//
//         previousMousePosition = {
//             x: e.offsetX,
//             y: e.offsetY
//         };
//     }
//
//     function mouseUp(e) {
//         isDragging = false;
//     }
//
//     function wheel(e) {
//         // var bbox = new THREE.Box3().setFromObject(cuboid);
//         // if(bbox.containsPoint(new THREE.Vector3(data[0].X, data[0].Y, data[0].Z)))
//         // 	console.log("TRUE");
//         // else
//         // 	console.log("FALSE");
//         if (e.wheelDelta > 0 && camera.position.z > minDistance) {
//             zoomIn();
//             // if(cuboid.position.z < bounds.maxZ)
//             // 	cuboid.position.z += 1;
//         } else if (e.wheelDelta < 0 && camera.position.z < maxDistance) {
//             zoomOut();
//             // if(cuboid.position.z > bounds.minZ)
//             //     cuboid.position.z -= 1;
//         }
//     }
//
//     // TOUCH - move
//     this.domElement.addEventListener('touchstart', onTouchStart, false);
//     this.domElement.addEventListener('touchmove', onTouchMove, false);
//     this.domElement.addEventListener('touchend', onTouchEnd, false);
//
//     function onTouchStart(e) {
//         e.preventDefault();
//         flag = mouseFlags.MOUSEDOWN;
//         if (e.touches.length === 2) {
//             prevZoomDiff.X = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
//             prevZoomDiff.Y = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
//             currentTouches = new Array(2);
//         } else {
//             previousMousePosition = {
//                 x: e.touches[0].pageX,
//                 y: e.touches[0].pageY
//             };
//         }
//         // console.log("onTouchStart");
//     }
//
//     function onTouchEnd(e) {
//         prevZoomDiff.X = null;
//         prevZoomDiff.Y = null;
//
//         // if you were zooming out, currentTouches is updated for each finger you leave up the screen
//         // so each time a finger leaves up the screen, currentTouches length is decreased of a unit.
//         // When you leave up both 2 fingers, currentTouches.length is 0, this means the zoomming phase is ended
//         if (currentTouches.length > 0) {
//             currentTouches.pop();
//         } else {
//             currentTouches = [];
//         }
//         e.preventDefault();
//         if (flag === mouseFlags.MOUSEDOWN) {
//             // console.log("touchClick");
//             // you can invoke more other functions for animations and so on...
//         }
//         else if (flag === mouseFlags.MOUSEMOVE) {
//             // console.log("touch drag");
//             // you can invoke more other functions for animations and so on...
//         }
//         // console.log("onTouchEnd");
//     }
//
//     //TOUCH - Zoom
//     function onTouchMove(e) {
//         e.preventDefault();
//         flag = mouseFlags.MOUSEMOVE;
//         // If two pointers are down, check for pinch gestures
//         if (e.touches.length === 2) {
//             currentTouches = new Array(2);
//             // console.log("onTouchZoom");
//             // Calculate the distance between the two pointers
//             var curDiffX = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
//             var curDiffY = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
//
//             if (prevZoomDiff && prevZoomDiff.X > 0 && prevZoomDiff.Y > 0) {
//                 if ((curDiffX > prevZoomDiff.X) &&
//                     (curDiffY > prevZoomDiff.Y) && (camera.position.z > minDistance)) {
//                     // console.log("Pinch moving IN -> Zoom in", e);
//                     zoomIn();
//                 } else if (curDiffX < prevZoomDiff.X && camera.position.z < maxDistance && curDiffY < prevZoomDiff.Y) {
//                     // console.log("Pinch moving OUT -> Zoom out", e);
//                     zoomOut();
//                 }
//             }
//             // Cache the distance for the next move event
//             prevZoomDiff.X = curDiffX;
//             prevZoomDiff.Y = curDiffY;
//
//         } else if (currentTouches.length === 0) {
//             prevZoomDiff.X = null;
//             prevZoomDiff.Y = null;
//             // console.log("onTouchMove");
//             var deltaMove = {
//                 x: e.touches[0].pageX - previousMousePosition.x,
//                 y: e.touches[0].pageY - previousMousePosition.y
//             };
//
//             if (deltaMove.x != 0) {
//                 // console.log(deltaMove.x);
//                 cylinder.rotation.y += deltaMove.x / 150;
//             }
//
//             previousMousePosition = {
//                 x: e.touches[0].pageX,
//                 y: e.touches[0].pageY
//             };
//         }
//     }
//
//     function zoomIn() {
//         camera.position.z -= zoomSpeed;
//     }
//
//     function zoomOut() {
//         camera.position.z += zoomSpeed;
//     }
//
// };