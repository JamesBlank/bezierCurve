function curveBezier(x1, y1, x2, y2, optionsUser) {

    //default options
    var options = {
        width: 1,        //[px]
        color: '#000',
        speed: 800,      //time of drawing, [ms]
        dashed: false,
        camber: '-',
        arrow: {
            length: 15,
            angle: .8   //angle between arrow "wings", [rad]
        }
    }

    //offset from canvas corner to fit the arrow
    var offset = 15;

    var width = Math.abs(x2-x1)+offset;
    var height = Math.abs(y2-y1)+offset;
    var top = Math.min(x1, x2)-offset;
    var left = Math.min(y1, y2)-offset;

    //canvas initialization
    var canvas = document.createElement('canvas');
        canvas.id     = 'canvasBezier';
        canvas.width  = width;
        canvas.height = height;
        canvas.style.position = 'absolute';
        canvas.style.top      = top+'px';
        canvas.style.left     = left+'px';
        canvas.style.zIndex   = 2;

    //replacing default options with user settings
    for (var key in optionsUser) {
        if (key in options)
            options[key] = optionsUser[key];
    }

    var bezier = canvas.getContext('2d');
    bezier.lineWidth = options.width;

    //creating point class
    function point(x,y) {
        this.x = x;
        this.y = y;
    }

    //Bezier curve function
    function bezierCurve(x0, x1, x2) {
        var Bx = (1-t)*(1-t)*x0 + 2*t*(1-t)*x1 + t*t*x2;
        return Bx;
    }

    //direction of curve drawing
    var dirY = Math.abs(y2-y1)/(y2-y1) < 0 ? 0 : 1;
    var dirX = Math.abs(x2-x1)/(x2-x1) < 0 ? 0 : 1;
    var point_0 = new point(Math.abs(x1-top-dirX*offset),Math.abs(y1-left-dirY*offset));
    var point_2 = new point(Math.abs(x2-top-dirX*offset),Math.abs(y2-left-dirY*offset));

    var Bx_prev = point_0.x;
    var By_prev = point_0.y;
    var stepNum = 100;        //iteration number
    var t = 0;                //bezier function parameter
    var stepT = 1 / stepNum;  //bezier function parameter step
    var i=0;                  //iteration counter

    //curve camber
    var camberDegree = 0.2;
    if (options.camber == '+')
        var point_1 = new point(canvas.width*Math.abs(dirX-(1-camberDegree)), canvas.height*Math.abs(dirY-camberDegree));
    else if (options.camber == '-')
        var point_1 = new point(canvas.width*Math.abs(dirX-camberDegree), canvas.height*Math.abs(dirY-(1-camberDegree)));


    var interval = setInterval(draw, options.speed/stepNum);

    function draw() {
        bezier.strokeStyle = options.color;

        var Bx = bezierCurve(point_0.x, point_1.x, point_2.x);
        var By = bezierCurve(point_0.y, point_1.y, point_2.y);

        //dashing curve
        if (options.dashed)
            if ( ((i-(i % 2))/2)%2 === 0 ) //(i-(i % 2))/2 is similar to (i div 2)
                bezier.strokeStyle = 'transparent';
            else bezier.strokeStyle = options.color;

        bezier.beginPath();
        bezier.moveTo(Bx_prev, By_prev);
        bezier.lineTo(Bx, By);
        bezier.stroke();
        bezier.closePath();
        t += stepT;
        i++;

        //drawing arrow after curve is over
        if (i > stepNum) {
            bezier.strokeStyle = options.color;
            clearInterval(interval);

            var alpha = Math.atan((By_prev-By)/(Bx_prev-Bx));

            dirX = (dirX == 0) ? -1 : 1;
            dirY = (dirY == 0) ? -1 : 1;

            var arrowX_1 = point_2.x - dirX*options.arrow['length']*Math.cos(alpha-options.arrow['angle']/2);
            var arrowY_1 = point_2.y - dirX*options.arrow['length']*Math.sin(alpha-options.arrow['angle']/2);
            bezier.beginPath();
            bezier.moveTo(Bx, By);
            bezier.lineTo(arrowX_1, arrowY_1);
            bezier.stroke();
            bezier.closePath();

            var arrowX_2 = point_2.x - dirX*options.arrow['length']*Math.cos(alpha+options.arrow['angle']/2);
            var arrowY_2 = point_2.y - dirX*options.arrow['length']*Math.sin(alpha+options.arrow['angle']/2);
            bezier.beginPath();
            bezier.moveTo(Bx, By);
            bezier.lineTo(arrowX_2, arrowY_2);
            bezier.stroke();
            bezier.closePath();
        }

        Bx_prev = Bx;
        By_prev = By;
    }

    return canvas;

}