var LayoutManager = require("./layoutManager")

ProcessManager = function(){}

// When back is used, the values sent to the view being activated when it was first activated, are resent automatically

// You can choose to use the old one, or keep everything as is in the current ones.

// Ultimately you can make a decisin

ProcessManager.routes = {}

ProcessManager.route = function( controller, options ){

	if(ProcessManager.debug) console.log("PROCESS_MANAGER: ROUTE CALLED FROM ::", controller.name, {"Action":options.action, "Values": options.values, "Controller":controller})

	var controllerRoute = ProcessManager.routes[controller.name]
	if(!controllerRoute)  throw "PROCESS MANAGER ERROR: No route found for " + controller.name 
	var controllerAction = controllerRoute[options.action];
	if(!controllerAction)  throw "PROCESS MANAGER ERROR: No action "+options.action+" found for " + controller.name 

	controllerAction(options.action, options.values, controller);
  controller.lastValues = options.values;
}

ProcessManager.bringIntoView = function(name, values, action){
	LayoutManager.bringIntoView( name, values, action )
}

module.exports = ProcessManager;