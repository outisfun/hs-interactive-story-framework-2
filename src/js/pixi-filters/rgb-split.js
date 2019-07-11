// LIBS
var PIXI = require("pixi.js");

// SHADERS
var vertex = require("shaders/vertex.js");
var fragment = require("shaders/fragment.js");

class RGBSplitFilter extends PIXI.Filter {
    constructor(red, green, blue) {
        super(vertex, fragment);
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    /**
     * Red channel offset.
     *
     * @member {PIXI.Point}
     */
    get red() {
        return this.uniforms.red;
    }
    set red(value) {
        this.uniforms.red = value;
    }

    /**
     * Green channel offset.
     *
     * @member {PIXI.Point}
     */
    get green() {
        return this.uniforms.green;
    }
    set green(value) {
        this.uniforms.green = value;
    }

    /**
     * Blue offset.
     *
     * @member {PIXI.Point}
     */
    get blue() {
        return this.uniforms.blue;
    }
    set blue(value) {
        this.uniforms.blue = value;
    }
}

module.exports = RGBSplitFilter;
