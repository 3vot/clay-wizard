# Clay-Wizard
A Framework to build Javascript Wizards for Salesforce.com using Clayforsalesforce.com

The Wizard Framework has 3 important components.

## Wizard Step
Each wizard step automates the boilerplate code, like registering elements, click handlers and such. You'll use the Wizard Module to create each step, then you'll have complete freedom to control each step.

## Process Manager
The brains of the operation, but you don't have to be a surgeon to drive it. That's the idea.

Process Manager has three components as well ( This is build by 3VOT :) )

### ProcessManager.routes
This is the command center, that tells the framework what to do when. It's important to keep all logic in one place, this is it.

``` ProcessManager.routes = {

// CURRENT STATE     ACTION                                    BACK STATE

		start:    {      next: startToSelect                 },

		select: { next: selectToItems , back: backToStart }

		items: { next: itemsToAddons , back: backToItems }

} ```

Don't worry about this too much, you'll get it when the rest of puzzle is revealed.


### ProcessManager.process

This is a suggestion, the process should have an object where all the information about that process is stored. This is a regular model ( Clay-Model ) where each piece of information is stored.

It could be local only, or it could even have AJAX so each step is stored in the Database and theoretically you can come back to it.


### ProcessManager > functions
Order is of the essence , so each step defined in ProcessManager.routes has a calls a function, this is where the logic that must take place, be it validation or simple variable assignment to ProcessManager.process occurs. 


## Layout Manager
The LayoutManager takes care of animation, showing and hiding each step


### Getting Started
The easiest way , in the way I learn , is to power up a sample app, this has debugging mode turned on and step the wizard back and forth. Understanding what's going on by looking at the console.

Go ahead make some changes to the code, to the process.

## Building you own process
There are a few steps, and this we want to make even simpler.

### Create a Step
1. Clone any Step , the folder, from the current project. 

2. Rename the step folder, and go inside the index.js and change the line new Wizard("OLD_NAME", ... with the name of the step.

### Include in Wizard
Go to the root ./index.js and require the step, register it with LayoutManager so it's added to the screen.

### Modify the Elements and Actions
Re-write the Layout, Items and Logic inside the Step. But don't worry this you can do later.

### Write the Process
In ./code/processManager write the new route , starting with the name of the your step and creating funcions for next and back. Remember to bring into view the next step in the end of each function.







