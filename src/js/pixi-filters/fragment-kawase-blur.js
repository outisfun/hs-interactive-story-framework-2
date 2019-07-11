module.exports = " " +
    "varying vec2 vTextureCoord; " +
    "uniform sampler2D uSampler; " +
    "uniform vec2 uOffset; " +
    "void main(void) {" +
    "  vec4 color = vec4(0.0); " +
    "  color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y)); " +
    "  color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y)); " +
    "  color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y)); " +
    "  color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y)); " +
    "  color *= 0.25; " +
    "  gl_FragColor = color; " +
    "}";
