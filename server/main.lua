registerServerCallback('aty_hud:server:getPlayerInfo', function(src, cb)
    local money = _GetPlayerMoney(src)

    if Config.Framework == "esx" then
        local xPlayer = Framework.GetPlayerFromId(src)

        while xPlayer == nil do
            Citizen.Wait(10)
            xPlayer = Framework.GetPlayerFromId(src)
        end

        local bank = xPlayer.getAccount('bank').money
        local ping = GetPlayerPing(src)
        local totalPlayers = #GetPlayers()
        local maxPlayers = GetConvarInt("sv_maxclients", 48)
        local job = xPlayer.getJob()
        local jobName = job.label
        local jobLabel = job.grade_label
        local fullJob = jobName..' - '..jobLabel

        cb({
            money = money,
            bank = bank,
            ping = ping,
            totalPlayers = totalPlayers,
            maxPlayers = maxPlayers,
            job = fullJob,
        })
    else
        local xPlayer = Framework.Functions.GetPlayer(src)

        while xPlayer == nil do
            Citizen.Wait(10)
            xPlayer = Framework.Functions.GetPlayer(src)
        end
        
        local bank = xPlayer.PlayerData.money['bank']
        local ping = GetPlayerPing(src)
        local totalPlayers = #GetPlayers()
        local maxPlayers = GetConvarInt("sv_maxclients", 48)
        local fullJob = ""

        if Config.Framework == "oldqb" then
            local jobName = xPlayer.PlayerData.job.label
            local jobLabel = xPlayer.PlayerData.job.gradelabel
            fullJob = jobName..' - '..jobLabel
        else
            local jobName = xPlayer.PlayerData.job.label
            local jobLabel = xPlayer.PlayerData.job.grade.name
            fullJob = jobName..' - '..jobLabel
        end

        cb({
            money = money,
            bank = bank,
            ping = ping,
            totalPlayers = totalPlayers,
            maxPlayers = maxPlayers,
            job = fullJob,
        })
    end
end)

registerServerCallback("aty_hud:server:getVehicleType", function(src, cb)
    cb(GetVehicleType(GetVehiclePedIsIn(GetPlayerPed(src), false)))
end)