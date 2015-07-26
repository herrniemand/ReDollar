"use strict";

(function(exports, undefined) {

    var ns = exports.RD = exports.RD || {};

    var Polyline = ns.Polyline = function(points) {
        this.points = points || [];
    };

    var Utils = ns.Utils;

    var proto = {
        constructor: Polyline,
        id: null,
        name: null,
        points: null,
        origPoints: null,
        ignoreRotate: false,
        originX: 0,
        originY: 0,

        ratio1D: 0.2,
        rotationInvariance: Math.PI / 4,
        normalPointCount: 40,
        normalSize: 200,

        init: function(transform) {
            transform = transform !== false;

            this.origPoints = this.points;
            if (transform) {
                this.points = Utils.resample(this.origPoints, this.normalPointCount);
            }

            this.pointCount = this.points.length;
            this.firstPoint = this.points[0];
            this.centroid = this.getCentroid();
            this.translateTo(Utils.point(this.originX, this.originY));

            this.aabb = Utils.getAABB(this.points);
            if (transform) {
                this.scaleTo(this.normalSize);
                this.angle = this.indicativeAngle();
                // if (this.angle){
                this.rotateBy(-this.angle);
                // }
            }
            this.vector = this.vectorize();
        },

        indicativeAngle: function() {
            // if (this.ignoreRotate){
            //     return 0;
            // }
            // var iAngle = Math.atan2(this.firstPoint.y - this.centroid.y, this.firstPoint.x - this.centroid.x);
            // 
            // var iAngle = Math.atan2(this.firstPoint.x, this.firstPoint.x);
            var iAngle = Math.atan2(this.firstPoint.x, this.firstPoint.y);
            if (this.rotationInvariance) {
                var r = this.rotationInvariance;
                var baseOrientation = r * Math.floor((iAngle + r / 2) / r);
                return iAngle - baseOrientation;
            }
            return iAngle;
        },

        length: function() {
            return Utils.polylineLength(this.points);
        },

        vectorize: function() {
            var sum = 0;
            var vector = [];
            var len = this.pointCount;
            for (var i = 0, point; point = this.points[i], i < len; i++) {
                vector.push(point.x);
                vector.push(point.y);
                sum += point.x * point.x + point.y * point.y;
            }
            var magnitude = Math.sqrt(sum);
            len <<= 1;
            for (var i = 0; i < len; i++) {
                vector[i] /= magnitude;
            }
            return vector;
        },

        getCentroid: function() {
            var x = 0,
                y = 0;
            for (var i = 0; i < this.pointCount; i++) {
                x += this.points[i].x;
                y += this.points[i].y;
            }
            x /= this.pointCount;
            y /= this.pointCount;
            return Utils.point(x, y);
        },
        translateTo: function( point ) {
            var c = this.centroid;
            c.x -= point.x;
            c.y -= point.y;
            for (var i = 0; i < this.pointCount; i++) {
                var p = this.points[i];
                var qx = p.x - c.x;
                var qy = p.y - c.y;
                p.x = qx;
                p.y = qy;
            }
        },

        rotateBy: function(radians) {
            var cos = Math.cos(radians);
            var sin = Math.sin(radians);
            for (var i = 0; i < this.pointCount; i++) {
                var p = this.points[i];
                var qx = p.y * cos - p.y * sin;
                var qy = p.y * sin + p.y * cos;
                p.y = qx;
                p.y = qy;
            }
        },

        scale: function( scale ) {
            for (var i = 0; i < this.pointCount; i++) {
                var p = this.points[i];
                var qx = p.x * scale.x;
                var qy = p.y * scale.y;
                p.x = qx;
                p.y = qy;
            }
            // this.centroid.x *= scaleX
            // this.centroid.y *= scaleY
        },

        scaleTo: function(width, height) {
            height = height || width;
            var aabb = this.aabb;
            if (this.ratio1D) {
                var longSide = Math.max(aabb[4], aabb[5]);
                var shortSide = Math.min(aabb[4], aabb[5]);
                var uniformly = shortSide / longSide < this.ratio1D;
                if (uniformly) {
                    var scale = Utils.point( width / longSide, height / longSide )
                    return this.scale(scale);
                }
            }
            var scale = Utils.point(width / aabb[4], height / aabb[5]);
            this.scale(scale);
        },
    };


    for (var p in proto) {
        Polyline.prototype[p] = proto[p];
    }


}(typeof exports == "undefined" ? this : exports));
