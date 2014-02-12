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
    document.body.appendChild(canvas);

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
    var dir= -Math.abs(x2-x1)/(x2-x1);
    if (dir == 1) {
        var point_0 = new point(canvas.width,canvas.height);
        var point_2 = new point(offset, offset);
    }
    else if (dir == -1) {
        var point_0 = new point(0,0);
        var point_2 = new point(canvas.width-offset, canvas.height-offset);
    }

    var Bx_prev = point_0.x;
    var By_prev = point_0.y;
    var stepNum = 100;        //iteration number
    var t = 0;                //bezier function parameter
    var stepT = 1 / stepNum;  //bezier function parameter step
    var i=0;                  //iteration counter

    //curve camber
    if (options.camber == '+')
        var point_1 = new point(canvas.width*0.2, canvas.height*0.8);
    else if (options.camber == '-')
        var point_1 = new point(canvas.width*0.8, canvas.height*0.2);


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

            var alpha = Math.atan((By-By_prev)/(Bx-Bx_prev));

            var arrowX_1 = point_2.x + dir*options.arrow['length']*Math.cos(alpha-options.arrow['angle']/2);
            var arrowY_1 = point_2.y + dir*options.arrow['length']*Math.sin(alpha-options.arrow['angle']/2);
            bezier.beginPath();
            bezier.moveTo(Bx, By);
            bezier.lineTo(arrowX_1, arrowY_1);
            bezier.stroke();
            bezier.closePath();

            var arrowX_2 = point_2.x + dir*options.arrow['length']*Math.cos(alpha+options.arrow['angle']/2);
            var arrowY_2 = point_2.y + dir*options.arrow['length']*Math.sin(alpha+options.arrow['angle']/2);
            bezier.beginPath();
            bezier.moveTo(Bx, By);
            bezier.lineTo(arrowX_2, arrowY_2);
            bezier.stroke();
            bezier.closePath();
        }

        Bx_prev = Bx;
        By_prev = By;
    }

    this.delete = function() {
        document.body.removeChild(canvas);
    };

}