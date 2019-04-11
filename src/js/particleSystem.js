"use strict";

/* Get or create the application global variable */
var App = App || {};

var ParticleSystem = function() {

    // setup the pointer to the scope 'this' variable
    var self = this;

    // data container
    var data = [];

    // scene graph group for the particle system
    var sceneObject = new THREE.Group();
    sceneObject.name = 'shanksGroup';

    // bounds of the data
    var bounds = {};
    var vectors = []

    var m = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
        size: 0.05
    });
    var g = new THREE.Geometry();
    var pointCloud =THREE.Points();



    var gCuboid_XY = new THREE.BoxGeometry( 11, 13, 1 );
    var mCuboid_XY = new THREE.MeshBasicMaterial( {color: "#ffffff", opacity: 0.2, transparent: true, depthWrite: false} );
    var cuboid_XY = new THREE.Mesh( gCuboid_XY, mCuboid_XY );
    sceneObject.add( cuboid_XY );


    var gCuboid_XZ = new THREE.BoxGeometry( 11, 1, 11 );
    var mCuboid_XZ = new THREE.MeshBasicMaterial( {color: "#ffffff", opacity: 0.2, transparent: true, depthWrite: false} );
    var cuboid_XZ = new THREE.Mesh( gCuboid_XZ, mCuboid_XZ );
    sceneObject.add( cuboid_XZ );


    // create the containment box.
    // This cylinder is only to guide development.
    // TODO: Remove after the data has been rendered
    self.drawContainment = function() {

        // get the radius and height based on the data bounds
        var radius = (bounds.maxX - bounds.minX)/2.0 + 1;
        var height = (bounds.maxY - bounds.minY) + 1;

        // create a cylinder to contain the particle system
        var geometry = new THREE.CylinderGeometry( radius, radius, height, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true} );
        var cylinder = new THREE.Mesh( geometry, material );

        // add the containment to the scene
        sceneObject.add(cylinder);
    };

    // creates the particle system
    self.createParticleSystem = function() {
        for(var i=0;i<data.length;i++) {
            vectors.push(new THREE.Vector3(data[i].X, data[i].Y, data[i].Z));
            g.vertices.push(new THREE.Vector3(data[i].X, data[i].Y, data[i].Z));
            // g.colors.push(new THREE.Color("rgb(189,189,189)"))
            g.colors.push(new THREE.Color(colorScale(data[i].concentration)))
        }
        pointCloud = new THREE.Points(g, m);
        // pointCloud.position.y -= 4.5;
        pointCloud.name = 'shanksCloud';
        sceneObject.add(pointCloud);
        document.addEventListener("keydown", onArrowKeyDown, false);
        // use self.data to create the particle system

    };


    function onArrowKeyDown(event) {

        var keyCode = event.which;
        if (keyCode == 68) {
            if(cuboid_XY.position.z < bounds.maxZ) {
                cuboid_XY.position.z += 0.5;
                var indexes = colorChange()
                changeSVG(indexes.xy, indexes.xz)
            }
        }

        if (keyCode == 65) {
            if(cuboid_XY.position.z > bounds.minZ) {
                cuboid_XY.position.z -= 0.5;
                var indexes = colorChange()
                changeSVG(indexes.xy, indexes.xz)
            }
        }

        if (keyCode == 87) {
            if(cuboid_XZ.position.y < bounds.maxY) {
                cuboid_XZ.position.y += 0.5;
                var indexes = colorChange()
                changeSVG(indexes.xy, indexes.xz)
            }
        }

        if (keyCode == 83) {
            if(cuboid_XZ.position.y > bounds.minY) {
                cuboid_XZ.position.y -= 0.5;
                var indexes = colorChange()
                changeSVG(indexes.xy, indexes.xz)
            }
        }
    };

    function changeSVG (indexes_XY, indexes_XZ) {
        d3.select("#myGroup_XY").remove();
        d3.select("#myGroup_XZ").remove();
        var svg_XY = d3.select("#mySVG_XY").append('g')
            .attr("id", "myGroup_XY")
            .selectAll('circle')
            .data(indexes_XY)
            .enter()
            .append('circle')
            .attr("cx", function (d) { return ((data[d].X - bounds.minX) / (bounds.maxX - bounds.minX) * 300); })
            .attr("cy", function (d) { return ((data[d].Y - bounds.minY) / (bounds.maxY - bounds.minY) * 600); })
            .attr("r",  3)
            .style("fill", function(d) { return colorScale(data[d].concentration); });
        var svg_XZ = d3.select("#mySVG_XZ").append('g')
            .attr("id", "myGroup_XZ")
            .selectAll('circle')
            .data(indexes_XZ)
            .enter()
            .append('circle')
            .attr("cx", function (d) { return ((data[d].X - bounds.minX) / (bounds.maxX - bounds.minX) * 300); })
            .attr("cy", function (d) { return ((data[d].Z - bounds.minZ) / (bounds.maxZ - bounds.minZ) * 300); })
            .attr("r",  3)
            .style("fill", function(d) { return colorScale(data[d].concentration); });
    }

    function colorChange(){
        var bbox_XY = new THREE.Box3().setFromObject(cuboid_XY);
        var bbox_XZ = new THREE.Box3().setFromObject(cuboid_XZ);
        // if(bbox.containsPoint(new THREE.Vector3(data[0].X, data[0].Y, data[0].Z))) {
        //     console.log("TRUE")
        // var childPlaneWorldPosition = childPlane.getWorldPosition();
        // var wp = pointCloud.localToWorld(new THREE.Vector3(data[0].X, data[0].Y, data[0].Z))
        var indexes_XY = [], indexes_XZ = [];
        for (var i=0; i<vectors.length;i++) {
            // pointCloud.updateMatrixWorld();
            var newPoint = vectors[i].applyMatrix4(pointCloud.matrixWorld);
            // var wp = pointCloud.localToWorld(new THREE.Vector3(data[i].X, data[i].Y, data[i].Z))
            if(bbox_XY.containsPoint(newPoint) || bbox_XZ.containsPoint(newPoint)) {
                pointCloud.geometry.colors[i] = new THREE.Color(colorScale(data[i].concentration));
                if(bbox_XY.containsPoint(newPoint))
                    indexes_XY.push(i);
                if(bbox_XZ.containsPoint(newPoint))
                    indexes_XZ.push(i);
            }
            else {
                pointCloud.geometry.colors[i] = new THREE.Color("rgb(189,189,189)");
            }

        }
        pointCloud.geometry.colorsNeedUpdate = true;

        return {xy: indexes_XY, xz: indexes_XZ};
    }

    // data loading function
    self.loadData = function(file){

        // read the csv file
        d3.csv(file)
        // iterate over the rows of the csv file
            .row(function(d) {

                // get the min bounds
                bounds.minX = Math.min(bounds.minX || Infinity, d.Points0);
                bounds.minY = Math.min(bounds.minY || Infinity, d.Points2 - 4.5);
                bounds.minZ = Math.min(bounds.minZ || Infinity, d.Points1);

                // get the max bounds
                bounds.maxX = Math.max(bounds.maxX || -Infinity, d.Points0);
                bounds.maxY = Math.max(bounds.maxY || -Infinity, d.Points2 - 4.5);
                bounds.maxZ = Math.max(bounds.maxZ || -Infinity, d.Points1);

                // add the element to the data collection
                data.push({
                    // concentration density
                    concentration: Number(d.concentration),
                    // Position
                    X: Number(d.Points0),
                    Y: Number(d.Points2 - 4.5),
                    Z: Number(d.Points1),
                    // Velocity
                    U: Number(d.velocity0),
                    V: Number(d.velocity2),
                    W: Number(d.velocity1)
                });
            })
            // when done loading
            .get(function() {
                // draw the containment cylinder
                // TODO: Remove after the data has been rendered
                // self.drawContainment();

                // create the particle system
                self.createParticleSystem();
            });
    };


    // publicly available functions
    var publiclyAvailable = {

        // load the data and setup the system
        initialize: function(file){
            self.loadData(file);
        },

        // accessor for the particle system
        getParticleSystems : function() {
            return sceneObject;
        },

        getData : function() {
            return data;
        },

        getBounds : function() {
            return bounds;
        },

        getCube: function() {
            return cuboid_XY;
        },

        getPointCloud: function() {
            return pointCloud;
        }
    };


    return publiclyAvailable;

};