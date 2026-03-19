Framework = Config.Framework == "esx" and exports['es_extended']:getSharedObject() or exports["qb-core"]:GetCoreObject()

function registerServerCallback(...)
    if Config.Framework == "esx" then
        Framework.RegisterServerCallback(...)
    else
        Framework.Functions.CreateCallback(...)
    end
end

function _GetPlayerMoney(src)
    xPlayer = Config.Framework == "esx" and Framework.GetPlayerFromId(src) or Framework.Functions.GetPlayer(src)

    if not xPlayer then
        return 0
    end

    if not Config.MoneyAsItem then
        if Config.Framework == "esx" then
            return xPlayer.getAccount('money').money
        else
            return xPlayer.PlayerData.money['cash']
        end
    else
        if Config.Framework == "esx" then
            return xPlayer.getInventoryItem(Config.MoneyItem) and xPlayer.getInventoryItem(Config.MoneyItem).count or 0
        else
            return xPlayer.Functions.GetItemByName(Config.MoneyItem) and xPlayer.Functions.GetItemByName(Config.MoneyItem).amount or 0
        end
    end
end