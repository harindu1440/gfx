Framework = Config.Framework == "esx" and exports['es_extended']:getSharedObject() or exports["qb-core"]:GetCoreObject()
local firstLoad = false

function triggerServerCallback(...)
    if Config.Framework == "esx" then
        Framework.TriggerServerCallback(...)
    else
        Framework.Functions.TriggerCallback(...)
    end
end

function loadMap()
    DisplayRadar(false)

    if not firstLoad then
        Config.Notify(Translations[Config.Locale]["LOADING"], Translations[Config.Locale]["MAP_LOADING"], "success", 5000, "fa-solid fa-map", "green")
    end

	local defaultAspectRatio = 1920 / 1080
	local resolutionX, resolutionY = GetActiveScreenResolution()
	local aspectRatio = resolutionX / resolutionY
	local minimapOffset = 0

	if aspectRatio > defaultAspectRatio then
		minimapOffset = ((defaultAspectRatio - aspectRatio) / 3.6) - 0.008
	end

	RequestStreamedTextureDict("mapshape", false)

    if not HasStreamedTextureDictLoaded("mapshape") then
        Wait(150)
    end

    SetMinimapClipType(0)
    AddReplaceTexture("platform:/textures/graphics", "radarmasksm", "mapshape", "radarmasksm")
    AddReplaceTexture("platform:/textures/graphics", "radarmask1g", "mapshape", "radarmasksm")

    SetMinimapComponentPosition("minimap", "L", "B", 0.0 + minimapOffset, -0.007, 0.1638, 0.183)
    SetMinimapComponentPosition("minimap_mask", "L", "B", 0.0 + minimapOffset, 0.0, 0.128, 0.20)
    SetMinimapComponentPosition('minimap_blur', 'L', 'B', -0.01 + minimapOffset, 0.060, 0.262, 0.300)
    SetBlipAlpha(GetNorthRadarBlip(), 255)
    SetMinimapClipType(0)

    DisplayRadar(true)
    SetRadarBigmapEnabled(true, true)
    Wait(50)
    SetRadarBigmapEnabled(false, false)

    if not firstLoad then
        firstLoad = true
        Citizen.SetTimeout(1000, function()
            Config.Notify(Translations[Config.Locale]["LOADED"], Translations[Config.Locale]["MAP_LOADED"], "success", 5000, "fa-solid fa-map", "green")
        end)
    end
end

function ragdollP()
	if not SeatBelt then 
		playerPed = PlayerPedId()
		local position = GetEntityCoords(playerPed)
		SetEntityCoords(playerPed, position.x, position.y, position.z - 0.47, true, true, true)
		SetEntityVelocity(playerPed, prevVelocity.x, prevVelocity.y, prevVelocity.z)
		Wait(1)
		SetPedToRagdoll(playerPed, 1000, 1000, 0, 0, 0, 0)
	end
end

function IsWhitelistedWeaponStress(weapon)
    if weapon then
        for _, v in pairs(Config.WhitelistedWeaponStress) do
            if weapon == v then
                return true
            end
        end
    end
    return false
end

function table_size(tbl)
    local count = 0
    for _ in pairs(tbl) do count = count + 1 end
    return count
end