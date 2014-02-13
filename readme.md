Данный скрипт создает canvas c анимированной кривой Безье со стрелкой.

###Принцип работы:

*Создается элемент canvas, на котором рисуется кривая Безье со стрелкой. Canvas абсолютно позиционирован относительно родителя.*


###Создание кривой:

    canvas = new curveBezier(x1, y1, x2, y2, options);
        x1, y1 - координаты начальной точки кривой
        x2, y2 - координаты конечной точки кривой
        options - настройки кривой (+ их значения по умолчанию):
            width: 1,           толщина кривой, [пиксели]
            color: '#000',      цвет кривой
            speed: 800,         скорость отрисовки кривой, [мс]
            dashed: false,      обычная/пунктирная линия
            camber: '-',        '-' выгнутая кривая; '+' вогнутая кривая
            arrow: {
                length: 15,     длина "крыльев" стрелки, [пиксели]
                angle: .8       угол между "крыльями" стрелки, [рад]
            }


###Пример1:
    
    var options = {
        color: 'red',
        width: 2,
        camber: '+',
        speed: 1000,
        dashed: true
    }

    var curveElem = new curveBezier(100, 200, 0, 0, options);

    document.body.appendChild(curveElem.getCanvas());
    curveElem.draw();

##Пример2:

    var options = {
            color: 'red',
            width: 2,
            camber: '+',
            speed: 1000,
            dashed: true,
            canvas: document.getElementById('canvasId');
        }

    var curveElem = new curveBezier(100, 200, 0, 0, options);

    curveElem.draw();


В данном примере создается красная вогнутая пунктирная кривая толщиной 2 пикселя, время анимации которой 1000 мс.

[Демо](http://jsfiddle.net/D4QZA/2/)


Данный скрипт распространяется по лицензии [Creative Commons license](http://creativecommons.org/licenses/by-sa/3.0/).

Автор: Калиниченко Юрий