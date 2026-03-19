UiLoaded, LoggedIn, PlayerData, LocalPlayer, hunger, thirst, ped, isInVehicle, playerServerId = false, false, {}, PlayerId(), 0, 0, PlayerPedId(), false, nil

CreateThread(function()
    DisplayRadar(false)
    local sleep = 100

    while true do
        ped = PlayerPedId()

        if Config.Framework == "esx" then
			PlayerData = Framework.GetPlayerData()
		else
			PlayerData = Framework.Functions.GetPlayerData()
		end

        if not LoggedIn and UiLoaded and table_size(PlayerData) > 5 then
            sleep = 5000
			LoggedIn = true
            playerServerId = GetPlayerServerId(LocalPlayer)

            loadMap()
            
            SetRadarBigmapEnabled(false, false)
            SendNUIMessage({
                action = "toggle",
                status = true
            })

            loadMap()
		end

        if LoggedIn then
            triggerServerCallback("aty_hud:server:getPlayerInfo", function(cb)
                local money = cb.money
                local bank = cb.bank
                local ping = cb.ping
                local totalPlayers = cb.totalPlayers
                local maxPlayers = cb.maxPlayers
                local job = cb.job
                local mins = GetClockMinutes() < 10 and "0"..GetClockMinutes() or GetClockMinutes()
                local hours = GetClockHours() < 10 and "0"..GetClockHours() or GetClockHours()

                SendNUIMessage({
                    action = "updatePlayerInfo",
                    money = money,
                    bank = bank,
                    ping = ping,
                    totalPlayers = totalPlayers,
                    maxPlayers = maxPlayers,
                    job = job,
                    id = playerServerId,
                    time = hours..":"..mins
                })
            end)
        end

		Wait(sleep)
    end
end)

CreateThread(function()
    while not LoggedIn do
        Wait(100)
    end

    if Config.Framework == "esx" then
        AddEventHandler('esx_status:onTick', function(data)
            for i = 1, #data do
                if data[i].name == 'hunger' then
                    hunger = math.floor(data[i].percent)
                end
    
                if data[i].name == 'thirst' then
                    thirst = math.floor(data[i].percent)
                end
            end
        end)
    else
        CreateThread(function()
            while true do
                hunger = next(PlayerData) and PlayerData.metadata["hunger"] or 0
                thirst = next(PlayerData) and PlayerData.metadata["thirst"] or 0

                Wait(500)
            end
        end)
    end
    
    while true do
        if LoggedIn and UiLoaded and next(PlayerData) then
            local health = GetEntityHealth(ped)
            local maxHealth = GetPedMaxHealth(ped)
            health = (health - 100) * 100 / (maxHealth - 100)
            local armor = GetPedArmour(ped)
            local stamina = 100 - GetPlayerSprintStaminaRemaining(LocalPlayer)
            local isTalking = NetworkIsPlayerTalking(LocalPlayer)
            local oxygen = GetPlayerUnderwaterTimeRemaining(PlayerId()) * 10
            local isInWater = IsPedSwimmingUnderWater(ped)

            SendNUIMessage({
                action = "updateStatus",
                health = health,
                armor = armor,
                stamina = stamina,
                isTalking = isTalking,
                hunger = hunger,
                thirst = thirst,
                oxygen = oxygen,
                isInVehicle = isInVehicle,
                isInWater = isInWater,
            })
        end

        Wait(500)
    end
end)

CreateThread(function()
    while true do
        local playerPed = PlayerPedId()
        local coords = GetEntityCoords(playerPed)

        local streetHash, roadHash = GetStreetNameAtCoord(table.unpack(coords))

        SendNUIMessage({
            action = "updateStreet",
            street = GetStreetNameFromHashKey(streetHash),
            road = GetStreetNameFromHashKey(roadHash)
        })

        Wait(3000)
    end
end)

CreateThread(function()
    local sleep = 1500

    while true do
        local isArmed = IsPedArmed(ped, 4)
        local gunName = ""
        local fullAmmo = 0
        local clipAmmo = 0
        local ammoLeft = 0

        if isArmed then
            local weapon = GetSelectedPedWeapon(ped)

            gunName = Weapons[weapon].name
            fullAmmo = GetAmmoInPedWeapon(ped, weapon)
            _, clipAmmo = GetAmmoInClip(ped, weapon)
            ammoLeft = fullAmmo - clipAmmo

            sleep = 200
        else
            sleep = 1500
        end

        SendNUIMessage({
            action = "updateGun",
            isArmed = isArmed,
            gunName = gunName,
            fullAmmo = ammoLeft,
            clipAmmo = clipAmmo,
        })

        Wait(sleep)
    end
end)

RegisterNetEvent('SaltyChat_VoiceRangeChanged', function(voiceRange, index, availableVoiceRanges)
	index = index + 1
    
	if index >= 4 then
		index = 3
	end

	SendNUIMessage({
		action = "setVoiceMode",
		value = index
	})
end)

RegisterNetEvent('pma-voice:setTalkingMode', function(voiceMode)
	SendNUIMessage({
		action = "setVoiceMode",
		value = voiceMode
	})
end)

RegisterNetEvent('SaltyChat_TalkStateChanged', function(isTalking)
	SendNUIMessage({
		action = "isTalking",
		isTalking = isTalking
	})
end)

RegisterNetEvent("mumble:SetVoiceData", function(player, key, value)
	if GetPlayerServerId(NetworkGetEntityOwner(PlayerPedId())) == player and key == 'mode' then
		SendNUIMessage({
			action = "setVoiceMode",
			value = value
		})
	end
end)

RegisterNetEvent("aty_hud:sendNotify", function(text, icon, color, duration)
    SendNUIMessage({
        action = "notification",
        text = text,
        icon = icon,
        color = color,
        duration = duration,
    })
end)

CreateThread(function()
    local pausemenu = false

    while true do
        Wait(200)

        if IsPauseMenuActive() and not pausemenu then
            pausemenu = true
            SendNUIMessage({
                action = "toggle",
                status = false
            })
        elseif not IsPauseMenuActive() and pausemenu then
            pausemenu = false
            loadMap()
            SendNUIMessage({
                action = "toggle",
                status = true
            })
        end
    end 
end)

CreateThread(function()
    while true do
        HideHudComponentThisFrame(2)
        HideHudComponentThisFrame(21)
        HideHudComponentThisFrame(22)

        Wait(0)
    end 
end)

RegisterCommand(Config.MenuCommand, function()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "toggleSettings",
    })
end)

if Config.UseMenuKey then
    RegisterKeyMapping(Config.MenuCommand, 'Open Hud Settings', 'keyboard', Config.MenuKey)
end

RegisterNetEvent("aty_hud:toggle", function(status)
    SendNUIMessage({
        action = "toggle",
        status = status
    })
end)