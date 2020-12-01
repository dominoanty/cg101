document.onload = () => {
    console.log('Loaded!');
    putPixel(0, 0, "asd")
};


const canvas = document.getElementById('myCanvas');
let Cx = canvas.offsetWidth;
let Cy = canvas.offsetHeight;

document.getElementById("button").addEventListener('click', (event) => {

    drawScene();
})
// Viewport defaults
let Scene = {

    BackgroundColor : {
        r : 255,
        g : 255,
        b : 255
    },

    Viewport : {
        height : 1,
        width : 1,
        distance : 1
    },

    Origin : {
        x : 0,
        y : 0,
        z : 0
    },

    Spheres : [
        {
            center : {
                x : 0,
                y : -1, 
                z : 3
            },
            radius : 1,
            color : {
                r : 255,
                g : 0,
                b : 0,
            }
        },
        {
            center : {
                x : 2,
                y : 0, 
                z : 4
            },
            radius : 1,
            color : {
                r : 0,
                g : 0,
                b : 255,
            }
        },
        {
            center : {
                x : -2,
                y : 0, 
                z : 4
            },
            radius : 1,
            color : {
                r : 0,
                g : 255,
                b : 0,
            }
        }
    ],
    INFINITY : 100000
}



const ctx = canvas.getContext('2d');

function drawScene() {


    for(let i = -Cx / 2; i <= Cx / 2; i++) {
        for(let j = -Cy / 2; j <= Cy; j++) {
            let scaledPoint = canvasToViewport({
                x: i,
                y: j, 
            })
            let color = TraceRay(Scene.Origin, scaledPoint, 1, Scene.INFINITY);
            putPixel(i, j, color);
        }
    }
}

function TraceRay(origin, point, t_min, t_max) {
    let closest_t = Scene.INFINITY;
    let closest_sphere = null;

    for(let sphere of Scene.Spheres) {
        const {t1, t2} = IntersectRaySphere(origin, point, sphere)
        if ( (t1 >= t_min && t1 <= t_max) && t1 < closest_t) {
            closest_t = t1;
            closest_sphere = sphere
        }
        if ( (t2 >= t_min && t2 <= t_max) && t2 < closest_t) {
            closest_t = t2;
            closest_sphere = sphere
        }
    }
    if(closest_sphere === null) 
        return Scene.BackgroundColor
    return closest_sphere.color
}

function dot(point1, point2) {
    return point1.x * point2.x + 
        point1.y * point2.y + 
        point1.z * point2.z; 
}

function IntersectRaySphere(origin, point, sphere) {

    let OC = {
        x : (origin.x - sphere.center.x),
        y : (origin.y - sphere.center.y),
        z : (origin.z - sphere.center.z)
    }


    let k1 = dot(point, point)
    let k2 = 2 * dot(point, OC)
    let k3 = dot(OC, OC) - sphere.radius * sphere.radius

    let discriminant = k2 * k2 - 4 * k1 * k3

    if(discriminant < 0) 
        return { t1 : Scene.INFINITY, t2: Scene.INFINITY};
    
    let t1 = (-k2 + Math.sqrt(discriminant)) / ( 2 * k1)
    let t2 = (-k2 - Math.sqrt(discriminant)) / ( 2 * k1)

    return {t1 : t1, t2 : t2}
}

function putPixelRaw(x, y, color) {
    ctx.fillStyle = "rgba(" + color.r + "," + color.g +"," + color.b + ",1)";
    ctx.fillRect(x, y, 1, 1);
}

/**
 * This function puts the pixel according to the human coordinate system.
 * (Internally uses the raw putpixel function)
 * 
 * @param {The human coordinate x input} x 
 * @param {The human coordinate y input} y 
 * @param {The color } color 
 */
function putPixel (x, y, color) {
    putPixelRaw(transformX(x), transformY(y), color);
}


// Transform to 0->Cx, 0->Cy coordinate system
function transformX (x)  {
    return (Cx / 2.0) + x;
}
function transformY (y)  {
    return (Cy / 2.0) - y;
}

function canvasToViewport(point) {
    return {
        x : point.x / Cx * Scene.Viewport.width,
        y : point.y / Cy * Scene.Viewport.height,
        z : Scene.Viewport.distance
    }
};