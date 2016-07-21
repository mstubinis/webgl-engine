(function (scope, undefined) {
'use strict';
var OBJ = {};

if (typeof module !== 'undefined') { module.exports = OBJ; } 
else { scope.OBJ = OBJ; }

OBJ.is_near = function(v1,v2,threshold){ return Math.abs( v1-v2 ) < threshold; }
OBJ._getSimilarVertexIndex = function(in_pos,in_uv,in_norm,mesh,ret,threshold){
    ret.found = false; ret.index = 0;
	
    for (var i=0; i < mesh.vec3_vertices.length; i++ ){
		
		if(mesh.vec2_uvs.length == 0 && mesh.vec3_normals.length > 0){
			if (OBJ.is_near( in_pos[0] , mesh.vec3_vertices[i][0] ,threshold) &&
				OBJ.is_near( in_pos[1] , mesh.vec3_vertices[i][1] ,threshold) &&
				OBJ.is_near( in_pos[2] , mesh.vec3_vertices[i][2] ,threshold) &&
				OBJ.is_near( in_norm[0] , mesh.vec3_normals[i][0] ,threshold) &&
				OBJ.is_near( in_norm[1] , mesh.vec3_normals[i][1] ,threshold) &&
				OBJ.is_near( in_norm[2] , mesh.vec3_normals[i][2] ,threshold)
			){
				ret.index = i; ret.found = true; return ret;
			}
		}
		else if(mesh.vec2_uvs.length == 0 && mesh.vec3_normals.length == 0){
			if (OBJ.is_near( in_pos[0] , mesh.vec3_vertices[i][0] ,threshold) &&
				OBJ.is_near( in_pos[1] , mesh.vec3_vertices[i][1] ,threshold) &&
				OBJ.is_near( in_pos[2] , mesh.vec3_vertices[i][2] ,threshold)
			){
				ret.index = i; ret.found = true; return ret;
			}
		}
		else if(mesh.vec3_normals.length == 0 && mesh.vec2_uvs.length > 0){
			if (OBJ.is_near( in_pos[0] , mesh.vec3_vertices[i][0] ,threshold) &&
				OBJ.is_near( in_pos[1] , mesh.vec3_vertices[i][1] ,threshold) &&
				OBJ.is_near( in_pos[2] , mesh.vec3_vertices[i][2] ,threshold) &&
				OBJ.is_near( in_uv[0]  , mesh.vec2_uvs[i][0]      ,threshold) &&
				OBJ.is_near( in_uv[1]  , mesh.vec2_uvs[i][1]      ,threshold)
			){
				ret.index = i; ret.found = true; return ret;
			}
		}
		else{
			if (OBJ.is_near( in_pos[0] , mesh.vec3_vertices[i][0] ,threshold) &&
				OBJ.is_near( in_pos[1] , mesh.vec3_vertices[i][1] ,threshold) &&
				OBJ.is_near( in_pos[2] , mesh.vec3_vertices[i][2] ,threshold) &&
				OBJ.is_near( in_uv[0]  , mesh.vec2_uvs[i][0]      ,threshold) &&
				OBJ.is_near( in_uv[1]  , mesh.vec2_uvs[i][1]      ,threshold) &&
				OBJ.is_near( in_norm[0] , mesh.vec3_normals[i][0] ,threshold) &&
				OBJ.is_near( in_norm[1] , mesh.vec3_normals[i][1] ,threshold) &&
				OBJ.is_near( in_norm[2] , mesh.vec3_normals[i][2] ,threshold)
			){
				ret.index = i; ret.found = true; return ret;
			}
		}
    }
    return ret;
}
OBJ.indexVBO = function(mesh,threshold){
    if(threshold == 0.0) return mesh;

    var new_mesh = {};
    new_mesh.vec3_vertices = [];
    new_mesh.vec2_uvs = [];
    new_mesh.vec3_normals = [];
    new_mesh.vec3_binormals = [];
    new_mesh.vec3_tangents = [];
    new_mesh.indices = [];
    for (var i=0; i < mesh.vec3_vertices.length; i++ ){ 
        var ret = {}; ret.index = -1; ret.found = false;    
        ret = OBJ._getSimilarVertexIndex(mesh.vec3_vertices[i], mesh.vec2_uvs[i], mesh.vec3_normals[i],new_mesh,ret,threshold);
        if ( ret.found ){
            new_mesh.indices.push( ret.index );
        }else{
            new_mesh.vec3_vertices.push( mesh.vec3_vertices[i]);
			if(mesh.vec2_uvs.length > 0)
				new_mesh.vec2_uvs.push(mesh.vec2_uvs[i]);
			if(mesh.vec3_normals.length > 0)
				new_mesh.vec3_normals.push(mesh.vec3_normals[i]);
			if(mesh.vec3_tangents.length > 0)
				new_mesh.vec3_tangents.push(mesh.vec3_tangents[i]);
			if(mesh.vec3_binormals.length > 0)
				new_mesh.vec3_binormals.push(mesh.vec3_binormals[i]);
            new_mesh.indices.push(new_mesh.vec3_vertices.length - 1);
        }
    }
    return new_mesh;
}
OBJ.calculateTBN = function(mesh){
	if(mesh.vec3_normals.length == 0) return;
	
    for(var i=0; i < mesh.vec3_vertices.length; i+=3){
        var deltaPos1 = vec3.fill(mesh.vec3_vertices[i + 1][0] - mesh.vec3_vertices[i + 0][0],
                                  mesh.vec3_vertices[i + 1][1] - mesh.vec3_vertices[i + 0][1],
                                  mesh.vec3_vertices[i + 1][2] - mesh.vec3_vertices[i + 0][2]);
                                        
        var deltaPos2 = vec3.fill(mesh.vec3_vertices[i + 2][0] - mesh.vec3_vertices[i + 0][0],
                                  mesh.vec3_vertices[i + 2][1] - mesh.vec3_vertices[i + 0][1],
                                  mesh.vec3_vertices[i + 2][2] - mesh.vec3_vertices[i + 0][2]);
        
        var deltaUV1 = vec2.fill(mesh.vec2_uvs[i + 1][0] - mesh.vec2_uvs[i + 0][0],
                                 mesh.vec2_uvs[i + 1][1] - mesh.vec2_uvs[i + 0][1]);
        var deltaUV2 = vec2.fill(mesh.vec2_uvs[i + 2][0] - mesh.vec2_uvs[i + 0][0],
                                 mesh.vec2_uvs[i + 2][1] - mesh.vec2_uvs[i + 0][1]);
        
        var r = 1.000000 / (deltaUV1[0] * deltaUV2[1] - deltaUV1[1] * deltaUV2[0]);
        
        var tangent = vec3.fill((deltaPos1[0] * deltaUV2[1] - deltaPos2[0] * deltaUV1[1]) * r,
                                (deltaPos1[1] * deltaUV2[1] - deltaPos2[1] * deltaUV1[1]) * r,
                                (deltaPos1[2] * deltaUV2[1] - deltaPos2[2] * deltaUV1[1]) * r);

        var bitangent = vec3.fill((deltaPos2[0] * deltaUV1[0] - deltaPos1[0] * deltaUV2[0]) * r,
                                  (deltaPos2[1] * deltaUV1[0] - deltaPos1[1] * deltaUV2[0]) * r,
                                  (deltaPos2[2] * deltaUV1[0] - deltaPos1[2] * deltaUV2[0]) * r);

        var v1Norm = vec3.fill(mesh.vec3_normals[i + 0][0],mesh.vec3_normals[i + 0][1],mesh.vec3_normals[i + 0][2]);
        var v2Norm = vec3.fill(mesh.vec3_normals[i + 1][0],mesh.vec3_normals[i + 1][1],mesh.vec3_normals[i + 1][2]);
        var v3Norm = vec3.fill(mesh.vec3_normals[i + 2][0],mesh.vec3_normals[i + 2][1],mesh.vec3_normals[i + 2][2]);
                                        
        var t1_sub = vec3.create(); vec3.sub(t1_sub,tangent,v1Norm);
        var t2_sub = vec3.create(); vec3.sub(t2_sub,tangent,v2Norm);
        var t3_sub = vec3.create(); vec3.sub(t3_sub,tangent,v3Norm);
        
        var d1 = vec3.dot(tangent,v1Norm);
        var d2 = vec3.dot(tangent,v2Norm);
        var d3 = vec3.dot(tangent,v3Norm);
        var t1 = vec3.create(); vec3.mul(t1,t1_sub,vec3.fill(d1,d1,d1));
        var t2 = vec3.create(); vec3.mul(t2,t2_sub,vec3.fill(d2,d2,d2));
        var t3 = vec3.create(); vec3.mul(t3,t3_sub,vec3.fill(d3,d3,d3));
        vec3.normalize(t1,t1);
        vec3.normalize(t2,t2);
        vec3.normalize(t3,t3);
        
        var b1_sub = vec3.create(); vec3.sub(b1_sub,bitangent,v1Norm);
        var b2_sub = vec3.create(); vec3.sub(b2_sub,bitangent,v2Norm);
        var b3_sub = vec3.create(); vec3.sub(b3_sub,bitangent,v3Norm);  
        var bd1 = vec3.dot(bitangent,v1Norm);
        var bd2 = vec3.dot(bitangent,v2Norm);
        var bd3 = vec3.dot(bitangent,v3Norm);
        var b1 = vec3.create(); vec3.mul(b1,b1_sub,vec3.fill(bd1,bd1,bd1));
        var b2 = vec3.create(); vec3.mul(b2,b2_sub,vec3.fill(bd2,bd2,bd2));
        var b3 = vec3.create(); vec3.mul(b3,b3_sub,vec3.fill(bd3,bd3,bd3));
        vec3.normalize(b1,b1);
        vec3.normalize(b2,b2);
        vec3.normalize(b3,b3);
        
        mesh.vec3_tangents.push(t1); mesh.vec3_tangents.push(t2); mesh.vec3_tangents.push(t3);
        mesh.vec3_binormals.push(b1); mesh.vec3_binormals.push(b2); mesh.vec3_binormals.push(b3);
    }
    for(var i=0; i < mesh.vec3_vertices.length; i++){
        var n = mesh.vec3_normals[i];
        var b = mesh.vec3_binormals[i];
        var t = mesh.vec3_tangents[i];
        // Gram-Schmidt orthogonalize
        
        var tSubN = vec3.create(); vec3.sub(tSubN,t,n);
        var dotNT = vec3.dot(n,t);
        var d = vec3.fill(dotNT,dotNT,dotNT);
        var mul = vec3.create(); vec3.mul(mul,tSubN,d);
        vec3.normalize(mul,mul);
        t = mul;
        // Calculate handedness
        
        var c = vec3.create(); vec3.cross(c,n,t);
        var dotCrossB = vec3.dot(c,b);
        if (dotCrossB < 0.0){
            t[0] *= -1.0; t[1] *= -1.0; t[2] *= -1.0;
        }
        mesh.vec3_normals[i] = n;
        mesh.vec3_binormals[i] = b;
        mesh.vec3_tangents[i] = t;
    }
}
OBJ.loadDataIntoTriangles = function(mesh,file_verts,file_uvs,file_normals,point_indices,uv_indices,normal_indices){
    for(var i=0; i < point_indices.length; i++ ){
        mesh.vec3_vertices.push(file_verts[ point_indices[i]-1 ]);
		if(uv_indices.length > 0)
			mesh.vec2_uvs.push(file_uvs[ uv_indices[i]-1 ]);
		if(normal_indices.length > 0)
			mesh.vec3_normals.push(file_normals[ normal_indices[i]-1 ]);
    }
}
OBJ.vec3ArrayToFloatArray = function(vec3_array){
    var ret = [];
    for(var i = 0; i < vec3_array.length; i++){
        ret.push(vec3_array[i][0]);
        ret.push(vec3_array[i][1]);
        ret.push(vec3_array[i][2]);
    }
    return ret;
}
OBJ.vec2ArrayToFloatArray = function(vec2_array){
    var ret = [];
    for(var i = 0; i < vec2_array.length; i++){
        ret.push(vec2_array[i][0]);
        ret.push(vec2_array[i][1]);
    }
    return ret;
}
OBJ.finalize = function(mesh){
	
	mesh.radius = 0;
	for(var i = 0; i < mesh.vec3_vertices.length; i++){
		var len = vec3.length(mesh.vec3_vertices[i]);
		if(len > mesh.radius){
			mesh.radius = len;
		}
	}
	
    mesh.vertices = OBJ.vec3ArrayToFloatArray(mesh.vec3_vertices);
	if(mesh.vec2_uvs.length > 0)
		mesh.uvs = OBJ.vec2ArrayToFloatArray(mesh.vec2_uvs);
	if(mesh.vec3_normals.length > 0)
		mesh.normals = OBJ.vec3ArrayToFloatArray(mesh.vec3_normals);
	if(mesh.vec3_binormals.length > 0)
		mesh.binormals = OBJ.vec3ArrayToFloatArray(mesh.vec3_binormals);
	if(mesh.vec3_tangents.length > 0)
		mesh.tangents = OBJ.vec3ArrayToFloatArray(mesh.vec3_tangents);
    
}
OBJ.Mesh = function (meshObject,objectData){
    var file_verts = [], file_uvs = [], file_normals = [];
    var point_indices = [], uv_indices = [], normal_indices = [];
    meshObject.indices = [];
    
    var lines = objectData.split('\n');// array of lines separated by the newline
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        var elements = line.split((/\s+/));
        elements.shift();

        var xF = parseFloat(elements[0]); var yF = parseFloat(elements[1]); var zF = parseFloat(elements[2]);

        if ((/^v\s/).test(line)) {
            file_verts.push(vec3.fill(xF,yF,zF));
        }else if ((/^vn\s/).test(line)) {
            file_normals.push(vec3.fill(xF,yF,zF));
        }else if ((/^vt\s/).test(line)) {
            file_uvs.push(vec2.fill(xF,1.0-yF));
        }else if ((/^f\s/).test(line)) {
            for (var j = 0; j < elements.length; j++){
                var face_vertex = elements[j].split( '/' );
                
                point_indices.push(face_vertex[0]);
				if(face_vertex[1] != undefined)
					uv_indices.push(face_vertex[1]);
				if(face_vertex[2] != undefined)
					normal_indices.push(face_vertex[2]);
            }
        }
    }
    
    var newMesh = {};
    newMesh.vec3_vertices = []; newMesh.vec2_uvs = []; newMesh.vec3_normals = []; newMesh.vec3_binormals = []; newMesh.vec3_tangents = [];
    
    OBJ.loadDataIntoTriangles(newMesh,file_verts,file_uvs,file_normals,point_indices,uv_indices,normal_indices);
    OBJ.calculateTBN(newMesh);
    newMesh = OBJ.indexVBO(newMesh,0.001);
    OBJ.finalize(newMesh);
    
    meshObject.vertices = newMesh.vertices;
	if(newMesh.uvs != undefined)
		meshObject.uvs = newMesh.uvs;
	if(newMesh.normals != undefined)
		meshObject.normals = newMesh.normals;
	if(newMesh.binormals != undefined)
		meshObject.binormals = newMesh.binormals;
	if(newMesh.tangents != undefined)
		meshObject.tangents = newMesh.tangents;
    meshObject.indices = newMesh.indices;
    
    //cleanup
    for (var member in newMesh) delete newMesh[member];
    return meshObject;
}
// this is just a helper class to ease ajax calls
var Ajax = function(){
    var _this = this;
    this.xml = new XMLHttpRequest();
    this.get = function(url, callback){
        _this.xml.onreadystatechange = function(){
            if(_this.xml.readyState === 4){ callback(_this.xml.responseText, _this.xml.status); }
        };
        _this.xml.open('GET', url, true); _this.xml.send();
    }
};
OBJ.downloadMeshes = function (nameAndURLs, completionCallback, meshObject,meshDictionaryName){
    var semaphore = Object.keys(nameAndURLs).length;
    var error = false;
    for(var mesh_name in nameAndURLs){
        if(nameAndURLs.hasOwnProperty(mesh_name)){
            new Ajax().get(nameAndURLs[mesh_name], (function(name) {
                return function (data, status) {
                    if (status === 200) {
                        OBJ.Mesh(meshObject,data);
                    }
                    else {
                        error = true;
                        console.error('An error has occurred and the mesh "' + name + '" could not be downloaded.');
                    }
                    semaphore--;
                    if (semaphore === 0) {
                        if (error) {
                            console.error('An error has occurred and one or meshes has not been ' + 'downloaded. The execution of the script has terminated.');
                            throw '';
                        }
                        completionCallback(meshObject,meshDictionaryName);
                    }
                }
            })(mesh_name));
        }
    }   
};

var _buildBuffer = function( gl, type, data, itemSize ){
    var buffer = gl.createBuffer();
    var arrayView = type === gl.ARRAY_BUFFER ? Float32Array : Uint16Array;
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, new arrayView(data), gl.STATIC_DRAW);
    buffer.itemSize = itemSize;
    buffer.numItems = data.length / itemSize;
    return buffer;
}  
OBJ.initMeshBuffers = function( gl, mesh ){
    mesh.vertexBuffer = _buildBuffer(gl, gl.ARRAY_BUFFER, mesh.vertices, 3);
	if(mesh.uvs != undefined)
		mesh.uvBuffer = _buildBuffer(gl, gl.ARRAY_BUFFER, mesh.uvs, 2);
	if(mesh.normals != undefined)
		mesh.normalBuffer = _buildBuffer(gl, gl.ARRAY_BUFFER, mesh.normals, 3);
	if(mesh.binormals != undefined)
		mesh.binormalBuffer = _buildBuffer(gl, gl.ARRAY_BUFFER, mesh.binormals, 3);
	if(mesh.tangents != undefined)
		mesh.tangentBuffer = _buildBuffer(gl, gl.ARRAY_BUFFER, mesh.tangents, 3);
    mesh.indexBuffer = _buildBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, mesh.indices, 1);
    return mesh;
}
OBJ.deleteMeshBuffers = function( gl, mesh ){
    gl.deleteBuffer(mesh.vertexBuffer);
	if(mesh.uvBuffer != undefined)
		gl.deleteBuffer(mesh.uvBuffer);
	if(mesh.normalBuffer != undefined)
		gl.deleteBuffer(mesh.normalBuffer);
	if(mesh.binormalBuffer != undefined)
		gl.deleteBuffer(mesh.binormalBuffer);
	if(mesh.tangentBuffer != undefined)
		gl.deleteBuffer(mesh.tangentBuffer);
    gl.deleteBuffer(mesh.indexBuffer);
}
})(this);