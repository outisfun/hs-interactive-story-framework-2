


/* PIXI SNOB */
var ScrollMagic = require('scrollmagic');
var CLASSES = require('classes.js');

/* Helper Functions */
var getMousePos = require("helpers/getmousepos.js");
var mapRange = require("helpers/maprange.js");

// LIBS
var PIXI = require("pixi.js");

//console.log(require('pixi-filters'));
/* THOSE ARE SHADERS GLSL */
// import {vertex} from '@tools/fragments';
// import fragment from './rgb-split.frag';
var vertex = require("shaders/vertex.js");
var fragment = require("shaders/fragment.js");
var fragmentConvolution = require("shaders/fragment-convolution.js");

function ISF_PixiSnob(el, controller) {

    this.controller = controller;
    this.DOM = {el: el};
    this.DOM.img = this.DOM.el.querySelector( "img" );
    this.DOM.imgSrc = this.DOM.img.getAttribute( 'src' );

    var rect = this.DOM.el.getBoundingClientRect();

    this.pixi = {
        renderer: new PIXI.Renderer( rect.width, rect.height, { transparent: true }),
        stage: new PIXI.Container(),
        spriteContainer: new PIXI.Container()
    };

    this.init();
}

ISF_PixiSnob.prototype.init = function(){

    this.DOM.el.appendChild( this.pixi.renderer.view );
    this.pixi.stage.addChild( this.pixi.spriteContainer );

    this.pixi.assets = {
        displacementSprite : new PIXI.Sprite.from( 'assets/maps/ripple.jpg' )
    };
    this.pixi.assets.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

    this.pixi.assets.displacementSprite.scale.x = 0.8;
    this.pixi.assets.displacementSprite.scale.y = 0.8;

    this.pixi.filters = {
        rgbSplitFilter : new RGBSplitFilter(),
        convolutionFilter : new ConvolutionFilter()
    };
    //this.pixi.filters.displacementFilter.autoFit = false;

    this.pixi.stage.filters = [ this.pixi.filters.convolutionFilter ];
    //this.pixi.stage.addChild( this.pixi.assets.displacementSprite );

    this.loadSprites();
};

ISF_PixiSnob.prototype.loadSprites = function(){

    //make a loop
    var texture = new PIXI.Texture.from( this.DOM.imgSrc );
    var image = new PIXI.Sprite.from( 'assets/bowie2.jpg' );

    var newTexture = new PIXI.Texture.from( 'assets/maps/ripple.jpg' );
    var newImage = new PIXI.Sprite.from( 'assets/maps/ripple.jpg' );

    this.pixi.spriteContainer.addChild( image );
    // this.pixi.spriteContainer.addChild( newImage );

    image.position.set(100, 100);
    image.interactive = true;
    image.width = 1300;
    image.height = 850;

    newImage.position.set(0, 0);
    newImage.width = 1200;
    newImage.height = 1200;

    newImage.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.setTicker();

    var self = this;

    this.DOM.el.addEventListener( "mousemove", function(e) {
        //console.log( "it moves!", self.pixi.filters.rgbSplitFilter );
        //self.pixi.renderer.render( self.pixi.stage );
        var mpos = {
            x: e.clientX,
            y: e.clientY
        };

        var mArray = self.pixi.filters.convolutionFilter.uniforms.matrix;
        var vX = mapRange(mpos.x, 0, window.innerWidth, -0.2, 1);
        TweenMax.to( mArray, 1, {
            onUpdate: function() {
                self.pixi.filters.convolutionFilter.uniforms.matrix[7] = vX;
                // self.pixi.filters.convolutionFilter.uniforms.matrix.forEach( function(val, i) {
                //     self.pixi.filters.convolutionFilter.uniforms.matrix[i] = vX;
                //     console.log(vX), self.pixi.filters.convolutionFilter.uniforms.matrix[i];
                // });
            },
            ease: Power3.easeInOut
        });


        // var rValX = mapRange(mpos.x, 0, window.innerWidth, -10, 10);
        // var rValY = mapRange(mpos.y, 0, window.innerHeight, -10, 10);
        // var rValArray = {
        //     x: self.pixi.filters.rgbSplitFilter.red[0],
        //     y: self.pixi.filters.rgbSplitFilter.red[1]
        // };
        // TweenMax.to( rValArray, 1, {
        //     x: rValX,
        //     y: rValY,
        //     onUpdate: function() {
        //         self.pixi.filters.rgbSplitFilter.blue = [rValX, rValY];
        //     },
        //     ease: Power3.easeInOut
        // });
    });
};


ISF_PixiSnob.prototype.setTicker = function(){
    var self = this;

    this.pixi.ticker = PIXI.Ticker.shared;
    this.pixi.ticker.autoStart = true;
    this.pixi.ticker.add(function( delta ) {
        self.pixi.renderer.render( self.pixi.stage );
    });
};

class RGBSplitFilter extends PIXI.Filter {
    constructor(red = [0, 0], green = [0, 0], blue = [0, 0]) {
        super(vertex, fragment);
        this.red = red;
        this.green = green;
        this.blue = blue;
        console.log("unif", this.uniforms.red[0]);
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

class ConvolutionFilter extends PIXI.Filter {

    constructor(matrix = [0,0,0,0,1,0,0,0,0], width = 120, height = 120) {
        super(vertex, fragmentConvolution);
        this.uniforms.texelSize = new Float32Array(2);
        this.uniforms.matrix = new Float32Array(9);
        if (matrix !== undefined) {
            this.matrix = matrix;
        }
        this.width = width;
        this.height = height;
        console.log("convo", this, this.uniforms.matrix);
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

module.exports = ISF_PixiSnob;
