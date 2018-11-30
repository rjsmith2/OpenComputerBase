local color = require("color")
local GUI = require("GUI")
local MineOSInterface = require("MineOSInterface")

-------------------------------------------------------------------------------

-- Create a tabbed window and register it in MineOS environment
local mainContainer, window = MineOSInterface.addWindow(GUI.tabbedWindow(1, 1, 88, 25))

-- Add some stuff into it's tab bar
window.tabBar:addItem("Tab 1")
window.tabBar:addItem("Tab 2")
window.tabBar:addItem("Tab 3")
window.tabBar:addItem("Yay another tab")

-- Add a single cell layout to window
local layout = window:addChild(GUI.layout(1, 4, window.width, window.height - window.tabBar.height, 1, 1))

-- Add a horizontal slider to layout
local slider = layout:addChild(GUI.slider(1, 1, 26, 0x66DB80, 0x0, 0x009200, 0xAAAAAA, 0, 100, 100, false, "Brightness: ", "%"))
-- Attach callback-function .onValueChanged to it
slider.onValueChanged = function()
	-- Draw changes on screen
	mainContainer:drawOnScreen()
end

-- Call slider callback function once to calculate brightess and draw data on screen


local counter=0;
repeat	
	counter =  counter + 0.15
	slider.value = counter;

slider.onValueChanged()
os.sleep(0.15)
until false