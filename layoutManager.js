var domify = require("domify");
var Size = require("element-size")
var slider, leftBorder, rightBorder, bottomBorder, container, topBorder, currentController, viewportWidth, viewportHeight;
var currentControllerIndex = 0;
var controllers = {};
var controllersKeys = []
var views = [];
var processManager;
var processIndexLabel;
var Events  = require("events").EventEmitter

var LayoutManager = new Events();

module.exports = LayoutManager;

LayoutManager.register = function(containerSelector, processManagerController, options){
	container = document.querySelector(containerSelector);
  processManager = processManagerController;
  var height = window.y;

  if(options){
    if(options.processIndexLabel) processIndexLabel = options.processIndexLabel
    if(options.heightOffset) height -=  options.heightOffset;
  }


  slider = domify('<div id="app-container" class="main slide-container"></div>');
  slider.style.height =  height + "px" ;
  container.appendChild( slider );


}

LayoutManager.start = function(){
  var key = controllersKeys[0];
  
  processManager.route( controllers[key], { action: "start", values: null } )
}

LayoutManager.goBack = function(){
  var key = controllers[currentController.name];
  var currentIndex = controllersKeys.indexOf(key) -1;
  if(currentIndex == 0) return "This is the first step, can't go back";

  processManager.route( currentController, { action: "back", values: null } )
}

LayoutManager.registerView = function(controller){
	controllersKeys.push(controller.name);
  controllers[controller.name] = controller;
  
  views.push( controller );

  var view = domify('<div class="view"></div>')
  view.appendChild(controller.el)
  controller.view = view;
	slider.appendChild(view);

  controller.view.style.left = window.x + "px"

  controller.view.style.display = "none";

  controller.on("STEP", function(options){ 
    if(options.action == "back") options.values = null
    processManager.route( controller, options )
  });
}

LayoutManager.bringIntoView = function(key, values, action){
  var controller = controllers[key]
  var index = controllersKeys.indexOf(key) || 1;

  if(processIndexLabel) processIndexLabel.innerHTML = index;

  if(!controller) throw "LAYOUT_MANAGER could not find controller with key " + key + " did you remember to create it in index.js? "
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
    LayoutManager.emit("VIEW_CHANGE", key);

    if(ProcessManager.debug) console.log("LAYOUT_MANAGER", "********  STEP COMPLETE *************" )

   
  }, 30 );
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


