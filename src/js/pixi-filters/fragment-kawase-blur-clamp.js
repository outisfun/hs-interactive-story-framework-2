module.exports = " " +
    "varying vec2 vTextureCoord; " +
    "uniform sampler2D uSampler; " +
    "uniform vec2 uOffset; " +
    "uniform vec4 filterClamp; " +
    "void main(void) {" +
    "  vec4 color = vec4(0.0); " +
    "  color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw)); " +
    "  color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw)); " +
    "  color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw)); " +
    "  color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw)); " +
    "  color *= 0.25; " +
    "  gl_FragColor = color; " +
    "}";
