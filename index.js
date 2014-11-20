var domify = require("domify");
var Events  = require("events").EventEmitter
var path = require("path")

function Wizard(dirname, Layout){
	var name = path.basename(dirname);
	else name = dirname

	var _this = this;
	this.name = name;
	this.Layout = Layout;
	this.el = domify( Layout(name) );

	this.reservedWords = ["name","Layout","el","lblError","elements","actions","listeners"];

	this.lblError = this.el.querySelector(".lbl-error");
	this.lblError.style.display = "none";

	this.elements = this.el.querySelectorAll(".wizard_element")
	this.registerElements();

	this.actions = this.el.querySelectorAll(".wizard_action");
	this.listeners = [];
}

Wizard.prototype = Object.create(Events.prototype);


Wizard.prototype.registerElements = function(){
	for (var i = this.elements.length - 1; i >= 0; i--) {
		var element = this.elements[i];
		if(this.reservedWords.indexOf(element.dataset.name) > -1) throw element.dataset.name + " is part of reserved names " + this.reservedWords.join(" ") + " in " + this.name + " controller"
		this[element.dataset.name] = element; 
	};
}

Wizard.prototype.registerActions = function(){
	for (var i = this.listeners.length - 1; i >= 0; i--) {
		this.listeners[i].onclick = function(){}
	};
	this.listeners =[];
	var _this = this;
	for (var i = this.actions.length - 1; i >= 0; i--) {
		var element = this.actions[i];
		var values = element.dataset.values;
		if(values) values = values.split(",")
		else values = []
		onclick(_this, element, values);
		this.listeners.push(element);
	};

	function onclick(_this, element, values){
		element.onclick = function(e){
			var target = e.target
			while(!target.classList.contains("wizard_action") && !target.classList.contains("view") ){ target = target.parentNode; }
			e.actionTarget = target;
			
			if(target.dataset.wait){
				var original = e.target.innerHTML;
				target.innerHTML = "...";
				setTimeout(function(){ target.innerHTML = original },2500)
			}
			_this[element.dataset.onclick].call(_this, e, values);
		}
	}
}

Wizard.prototype.onView = function(){
	this.lblError.style.display = "none";
	if(this.listeners.length ==0) this.registerActions();
	this.onViewReady.apply(this,arguments);
}

Wizard.prototype.showError = function(err){
	if(Object.prototype.toString.call(err) === '[object Array]' ) err = err[0]
	if(err.message) err = err.message
	this.lblError.innerHTML = err;
	this.lblError.style.display = "block";
}


//To OVERRIDE
Wizard.prototype.onViewReady = function(){
}


module.exports = Wizard;