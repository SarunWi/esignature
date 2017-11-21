var painterComponent = function($q, $scope,$on) {
    var ctrl = this;
    var isTouch = !!('ontouchstart' in window);
    var PAINT_START = isTouch ? 'touchstart' 	: 'mousedown';
    var PAINT_MOVE 	= isTouch ? 'touchmove' 	: 'mousemove';
    var PAINT_END 	= isTouch ? 'touchend' 	: 'mouseup';
    var point = { x: 0, y: 0 };

    var ppts = [];

    ctrl.option = {
        scale: 1.5,
        line_width:  1,
        line_color:  '#000'
    }
    ctrl.template = {
        containerId : ctrl.componentId + 'container',
        canvasId 	: ctrl.componentId + 'canvas',
        canvasTmpId : ctrl.componentId + 'canvasTmp'
    }
    ctrl.componentObj = {
        container: undefined,
        canvas: undefined,
        context: undefined,
        canvasTmp: undefined,
        contextTmp: undefined
    }

    ctrl.init_context = function() {
        if (ctrl.pdfObj) {
            ctrl.pdfObj.getPage(ctrl.pageNumb).then(function(page) {
                var viewport = page.getViewport(ctrl.option.scale);
                // prepare container 
                ctrl.componentObj.container = document.getElementById(ctrl.template.containerId);
                angular.element(ctrl.componentObj.container).css({ margin: '0 auto', width: viewport.width, position: 'relative' });
                // Prepare canvas using PDF page dimensions
                ctrl.componentObj.canvasTmp = document.getElementById(ctrl.template.canvasTmpId);
                ctrl.componentObj.contextTmp = ctrl.componentObj.canvasTmp.getContext('2d');

                ctrl.componentObj.canvas 	= document.getElementById(ctrl.template.canvasId);
                ctrl.componentObj.context 	= ctrl.componentObj.canvas.getContext('2d');
                // Set Canvas size.
                ctrl.componentObj.canvas.height = ctrl.componentObj.canvasTmp.height = viewport.height;
                ctrl.componentObj.canvas.width 	= ctrl.componentObj.canvasTmp.width = viewport.width;

                ctrl.componentObj.contextTmp.lineJoin 		= ctrl.componentObj.contextTmp.lineCap = 'round';
                ctrl.componentObj.contextTmp.lineWidth 		= 1;
                ctrl.componentObj.contextTmp.strokeStyle 	= '#000';

                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext 	: ctrl.componentObj.context,
                    viewport 		: viewport
                };
                var renderTask = page.render(renderContext);
                renderTask.then(function() {
                    ctrl.initListeners();
                });
            });
        }
    }
    ctrl.getOffset = function(elem) {
        var bbox = elem.getBoundingClientRect();
        return {
            left: bbox.left,
            top: bbox.top
        };
    };

    ctrl.setPointFromEvent = function(point, e) {
        if (isTouch) {
            point.x = e.changedTouches[0].pageX - ctrl.getOffset(e.target).left;
            point.y = e.changedTouches[0].pageY - ctrl.getOffset(e.target).top;
        } else {
            point.x = e.offsetX !== undefined ? e.offsetX : e.layerX;
            point.y = e.offsetY !== undefined ? e.offsetY : e.layerY;
        }
    };

    ctrl.paint = function(e) {
        if (e) {
            e.preventDefault();
            ctrl.setPointFromEvent(point, e);
        }
        // Saving all the points in an array
        ppts.push({ x: point.x, y: point.y });

        if (ppts.length === 3) {
            var b = ppts[0];
            ctrl.componentObj.contextTmp.beginPath();
            ctrl.componentObj.contextTmp.arc(b.x, b.y, ctrl.componentObj.contextTmp.lineWidth / 2, 0, Math.PI * 2, !0);
            ctrl.componentObj.contextTmp.fill();
            ctrl.componentObj.contextTmp.closePath();
            return;
        }

        // Tmp canvas is always cleared up before drawing.
        ctrl.componentObj.contextTmp.clearRect(0, 0, ctrl.componentObj.contextTmp.width, ctrl.componentObj.contextTmp.height);

        ctrl.componentObj.contextTmp.beginPath();
        ctrl.componentObj.contextTmp.moveTo(ppts[0].x, ppts[0].y);

        for (var i = 1; i < ppts.length - 2; i++) {
            var c = (ppts[i].x + ppts[i + 1].x) / 2;
            var d = (ppts[i].y + ppts[i + 1].y) / 2;
            ctrl.componentObj.contextTmp.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
        }

        // For the last 2 points
        ctrl.componentObj.contextTmp.quadraticCurveTo(
            ppts[i].x,
            ppts[i].y,
            ppts[i + 1].x,
            ppts[i + 1].y
        );
        ctrl.componentObj.contextTmp.stroke();
    };

    ctrl.copyTmpImage = function(e) {
        ctrl.componentObj.canvasTmp.removeEventListener(PAINT_MOVE, ctrl.paint, false);
        ctrl.componentObj.context.drawImage(ctrl.componentObj.canvasTmp, 0, 0);
        ctrl.componentObj.contextTmp.clearRect(0, 0, ctrl.componentObj.canvasTmp.width, ctrl.componentObj.canvasTmp.height);
        ppts = [];
    };

    ctrl.startTmpImage = function(e) {
        e.preventDefault();
        ctrl.componentObj.canvasTmp.addEventListener(PAINT_MOVE, ctrl.paint, false);

        ctrl.setPointFromEvent(point, e);
        ppts.push({
            x: point.x,
            y: point.y
        });
        ppts.push({
            x: point.x,
            y: point.y
        });

        ctrl.paint();
    };

    ctrl.initListeners = function() {
        ctrl.componentObj.canvasTmp.addEventListener(PAINT_START, ctrl.startTmpImage, false);
        ctrl.componentObj.canvasTmp.addEventListener(PAINT_END, ctrl.copyTmpImage, false);

        if (!isTouch) {
            var MOUSE_DOWN;
            document.body.addEventListener('mousedown', mousedown);
            document.body.addEventListener('mouseup', mouseup);
            // $scope.$on('$destroy', removeEventListeners);

            ctrl.componentObj.canvasTmp.addEventListener('mouseenter', mouseenter);
            ctrl.componentObj.canvasTmp.addEventListener('mouseleave', mouseleave);
        }

        function mousedown() {
            MOUSE_DOWN = true;
        }

        function mouseup() {
            MOUSE_DOWN = false;
        }

        function removeEventListeners() {
            document.body.removeEventListener('mousedown', mousedown);
            document.body.removeEventListener('mouseup', mouseup);
        }

        function mouseenter(e) {
            // If the mouse is down when it enters the canvas, start a path
            if (MOUSE_DOWN) {
                ctrl.startTmpImage(e);
            }
        }

        function mouseleave(e) {
            // If the mouse is down when it leaves the canvas, end the path
            if (MOUSE_DOWN) {
                ctrl.copyTmpImage(e);
            }
        }
    }

    ctrl.init_context();
}
angular.module('drawingApp')
    .component('painter', {
        templateUrl: '/template/painterTemplate.html',
        controller: function(){ this.$onInit = painterComponent },
        bindings: {
            callbackFunc: '<',
            componentId : '<',
            option 		: '<',
            pdfObj 		: '<',
            pageNumb 	: '<',
            canvasObj 	: '=',
            editMode    : '='
        }
    });