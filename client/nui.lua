RegisterNuiCallback("loaded", function(_, cb)
    UiLoaded = true
    cb(Config)
end)

RegisterNuiCallback("close", function()
    SetNuiFocus(false, false)
end)

RegisterNuiCallback("setAlwaysMapOn", function(status)
    MapAlwaysOn = status
end)

RegisterNuiCallback("cinematicMode", function(status)
    CinematicMode = status

    while CinematicMode do
        DisplayRadar(0)
		for i = 0, 1.0, 1.0 do
			DrawRect(0.0, 0.0, 2.0, 0.2, 0, 0, 0, 255)
			DrawRect(0.0, i, 2.0, 0.2, 0, 0, 0, 255)
		end

		Wait(0)
	end
end)

RegisterNuiCallback("setSpeedUnit", function(status)
    SpeedMultiplier = status == "kmh" and 3.6 or 2.236936
end)