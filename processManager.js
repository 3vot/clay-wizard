var LayoutManager = require("./layoutManager")

ProcessManager = function(){}

// Routes define each step forward and backward.
// Back steps can be controlled from LayoutManager.back function or via this.emit("step") in each wizard step
// Default names for steps are next and back, but you can have custom ones and several ones for complex flows
ProcessManager.routes = {}

ProcessManager.route = function( controller, options ){
	LayoutManager.emit("CHANGE_START");
	if(ProcessManager.debug) console.log("PROCESS_MANAGER: ROUTE CALLED FROM ::", controller.name, {"Action":options.action, "Values": options.values, "Controller":controller})

	var controllerRoute = ProcessManager.routes[controller.name]
	if(!controllerRoute)  throw "PROCESS MANAGER ERROR: No route found for " + controller.name 
	var controllerAction = controllerRoute[options.action];
	if(!controllerAction)  throw "PROCESS MANAGER ERROR: No action "+options.action+" found for " + controller.name 
	//else if(!controllerAction && options.action == "back" && !options.values.lastKey) return LayoutManager.goBack();
	//else if(!controllerAction && options.action == "back" &&  options.values.lastKey) return ProcessManager.bringIntoView( options.values.lastKey, {}, "back" )


	controllerAction(options.action, options.values, controller);
  controller.lastValues = options.values;
}

// Function to trigger LayoutManager Events
// Only LayoutManager communicates eventfully with other components
ProcessManager.fireDelayed = function(event, delay){
	if(!delay) delay = 800;
	setTimeout(function(){
		LayoutManager.emit(event);
	},delay);
}

//Internal function for debugging and connection with LayoutManager, LayoutManager is not exposed
ProcessManager.bringIntoView = function(name, values, action){
	if(ProcessManager.debug) console.log("PROCESS_MANAGER: STATE ::", values);
	LayoutManager.bringIntoView( name, values, action )
	LayoutManager.emit("CHANGE_END");
}

//Recommended function used to load a new process into the manager, it is pre-defined so that it's easy to bind
ProcessManager.loadProcess=function(){}

module.exports = ProcessManager;