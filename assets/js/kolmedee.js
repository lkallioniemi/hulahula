var Angle3D = function(rx,ry,rz) {
    this.rx = rx || 0;
    this.ry = ry || 0;
    this.rz = rz || 0;
    this.inverse = function() {
        return new Angle3D(
            0 - this.rx,
            0 - this.ry,
            0 - this.rz
        );
    };
    return this;
};

var Point3D = function(x,y,z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.inverse = function() {
        return new Point3D(
            0 - this.x,
            0 - this.y,
            0 - this.z
        );
    };
    this.rotate = function(a) {
        var x,y,z;
        y = this.y; z = this.z;
        this.y = y * Math.cos(a.rx) - z * Math.sin(a.rx);
        this.z = y * Math.sin(a.rx) + z * Math.cos(a.rx);
        x = this.x; z = this.z;
        this.x = x * Math.cos(a.ry) - z * Math.sin(a.ry);
        this.z = x * Math.sin(a.ry) + z * Math.cos(a.ry);
        x = this.x; y = this.y;
        this.x = x * Math.cos(a.rz) - y * Math.sin(a.rz);
        this.y = x * Math.sin(a.rz) + y * Math.cos(a.rz);
    };
    this.move = function(p) {
        this.x += p.x;
        this.y += p.y;
        this.z += p.z;
    };
    this.place = function(p,a) {
        var point = new Point3D( this.x, this.y, this.z );
        point.rotate(a);
        point.move(p);
        return point;
    };
    return this;
};

var Object3D = function() {
    this.points = new Array();
    this.origin = new Point3D();
    this.angle = new Angle3D();
    this.getpoints = function() {
        var output = new Array();
        for (i in this.points) {
            output.push( this.points[i].place(this.origin,this.angle) );
        }
        return output;
    };
    return this;
}

var Sphere3D = function(radius,z) {
    for(d=0; d<=2*Math.PI; d+=0.17) {
        this.points.push(new Point3D(
            radius*Math.cos(d),
            radius*Math.sin(d),
            z || 0
        ));
    }
    return this;
}

Sphere3D.prototype = new Object3D();

var Point2D = function(x,y) {
    this.x = x;
    this.y = y;
    return this;
};

var Camera3D = function(d,ratio) {
    this.origin = new Point3D();
    this.angle = new Angle3D();
    this.project = function(point) {
        point.move(this.origin.inverse());
        point.rotate(this.angle.inverse());
        return new Point2D(
            ratio * ( d * point.x / point.z ),
            ratio * ( d * point.y / point.z )
        );
    };
    this.draw = function(object,cb) {
        var points = object.getpoints();
        for (i in points) {
            cb( this.project( points[i] ) );
        }
    };
    this.drawBack = function(object,cb) {
        var points = object.getpoints();
        cb( this.project( points[points.length-1] ) );
        for (i=0; i<=Math.floor(points.length/2)+1; i++) {
            cb( this.project( points[i] ) );
        }
    };
    this.drawFront = function(object,cb) {
        var points = object.getpoints();
        for (i=Math.floor(points.length/2); i<points.length; i++) {
            cb( this.project( points[i] ) );
        }
        cb( this.project( points[0] ) );

    };

    return this;
}
