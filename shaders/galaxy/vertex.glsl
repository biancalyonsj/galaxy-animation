
uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main(){
    // position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // get the angle of the x and z of the fragment
    float angle = atan(modelPosition.x, modelPosition.z);
    // get the distance from the origin
    float distanceToCenter = length(modelPosition.xz);
    // the speed will depend on the distance to the center, 
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
    // update the angle
    angle += angleOffset;
    // update the positions on a circle
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    // randomize the positions
    modelPosition.xyz += aRandomness;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    /*
    * Size
    */
    gl_PointSize = uSize * aScale;
    /*
    * Size Attinuation
    */
    gl_PointSize *= (1.0 / -viewPosition.z);

    vColor = color;
}