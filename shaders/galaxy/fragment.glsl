
varying vec3 vColor;

void main(){
    // find the distance between the vertex and the center
    float strength = distance(gl_PointCoord, vec2(0.5));
    // invert the shape
    strength = 1.0 - strength;
    // create a pow graph 
    strength = pow(strength, 10.0);

    // final color
    vec3 color = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
}