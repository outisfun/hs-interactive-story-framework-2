// LIBS
var PIXI = require("pixi.js");

// SHADERS
var vertex = require("pixi-filters/vertex.js");
var fragmentConvolution = require("pixi-filters/fragment-convolution.js");

class ConvolutionFilter extends PIXI.Filter {

    constructor(matrix = [1,0,0,0,1,0,0,0,1], width = 900, height = 900) {
        super(vertex, fragmentConvolution);
        this.uniforms.texelSize = new Float32Array(2);
        this.uniforms.matrix = new Float32Array(9);
        // if (matrix !== undefined) {
        //     this.matrix = matrix;
        // }
        this.width = width;
        this.height = height;

        this.matrices = {
            // they add up to 1!!!
            normal : [0,0,0,0,1,0,0,0,0],
            blur: [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625],
            outline: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
            sharpen: [0, -1, 0, -1, 5, -1, 0, -1, 0]
        };

        this.matrix = this.matrices.blur;
    }

    /**
     * An array of values used for matrix transformation. Specified as a 9 point Array.
     *
     * @member {Array<number>}
     */
    get matrix() {
        return this.uniforms.matrix;
    }
    set matrix(matrix) {
        matrix.forEach((v, i) => this.uniforms.matrix[i] = v);
    }

    /**
     * Width of the object you are transforming
     *
     * @member {number}
     */
    get width() {
        return 1/this.uniforms.texelSize[0];
    }
    set width(value) {
        this.uniforms.texelSize[0] = 1/value;
    }

    /**
     * Height of the object you are transforming
     *
     * @member {number}
     */
    get height() {
        return 1/this.uniforms.texelSize[1];
    }
    set height(value) {
        this.uniforms.texelSize[1] = 1/value;
    }
}

module.exports = ConvolutionFilter;

