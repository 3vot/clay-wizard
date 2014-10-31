var domify = require("domify");

var Size = require("element-size")

var slider, leftBorder, rightBorder, bottomBorder, container, topBorder, currentController, viewportWidth, viewportHeight;
var currentControllerIndex = 0;
var controllers = {};
var controllersKeys = []
var views = [];
var processManager;

var LayoutManager = function(){}
module.exports = LayoutManager;

LayoutManager.register = function(containerSelector, processManagerController){
	container = document.querySelector(containerSelector);
  processManager = processManagerController;

  //Register Positions and Sized for Animations
	var position = Position(container); 
	rightBorder = position.width;

  slider = domify('<div id="app-container" class="main slide-container"></div>');
  slider.style.height =  "500px" ;
  container.appendChild( slider );
}

LayoutManager.registerView = function(controller){
	controllersKeys.push(controller.name);
  controllers[controller.name] = controller;
  
  views.push( controller );

  var view = domify('<div class="view"></div>')
  view.appendChild(controller.el)
  controller.view = view;
	slider.appendChild(view);

  controller.view.style.left = rightBorder + 10 + "px";

  controller.view.style.display = "none";

  controller.on("STEP", function(options){ 
    if(options.action == "back") options.values = controller.lastValues || null
    processManager.route( controller, options )
  });
}

LayoutManager.bringIntoView = function(key, values, action){
  var controller = controllers[key]
  controller.view.style.display = "block";

  if(ProcessManager.debug && currentController) console.log("LAYOUT_MANAGER", "LEAVING_VIEW::", currentController.name , { "controller": currentController } )

  if(ProcessManager.debug) console.log("LAYOUT_MANAGER","ENTERING_VIEW::", controller.name + "", {"Action:":action, "Values":values, "Controller": controller } )

  if(controller.onView) controller.onView(values, action);

  updateHistory(key)

  setTimeout( function(){

    if(currentController){
      currentController.view.style.opacity = 0;
      currentController.view.style.left = "-100%";
    }

    currentController = controller;
    controller.view.style.left =  "20%";
    controller.view.style.opacity = 1;

    if(ProcessManager.debug) console.log("LAYOUT_MANAGER", "********  STEP COMPLETE *************" )

   
  }, 30 );
}

function Position(element){
  var node = element, box = {left: 0, right: 0, top: 0, bottom: 0},
      win = window, doc = node.ownerDocument,
      docElem = doc.documentElement,
      body = doc.body

  if (typeof node.getBoundingClientRect !== "undefined"){
      box = node.getBoundingClientRect()
  }

  var clientTop  = docElem.clientTop  || body.clientTop  || 0,
      clientLeft = docElem.clientLeft || body.clientLeft || 0,
      scrollTop  = win.pageYOffset || docElem.scrollTop,
      scrollLeft = win.pageXOffset || docElem.scrollLeft,
      dx = scrollLeft - clientLeft,
      dy = scrollTop - clientTop

  return {
      x: box.left + dx, left: box.left + dx,
      y: box.top + dy, top: box.top + dy,
      right: box.right + dx, bottom: box.bottom + dy,
      width: box.right - box.left,
      height: box.bottom - box.top
  }
}

function updateHistory(index){
  var history = window.history;
  if(!history) return false;
   
  return history.replaceState({}, document.title, "#" + index);
}

var hashStrip = /^#*/;
function getPath(){
  var path;
  path = window.location.hash;
  path = path.replace(hashStrip, '');
  if(!parseInt(path)) return 0;
  return path;
};


