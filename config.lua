Config = {
    Framework = "qb", -- esx or qb
    Locale = "en",

    UseCruiseControl = true,
    UseSeatBelt = true,
    UseNitro = true,
    UseStress = true,
    UseMenuKey = true,
    MoneyAsItem = false,
    UseInGameTimer = true, -- if you set this to true then the hour and minutes will be shown as in game time
    
    MoneyItem = "cash", -- If you set MoneyAsItem to true, you need to set the item name here
    NitroItem = "nitrous", -- If you set UseNitro to true, you need to set the item name here
    
    -- ## These keys will be saved into the game files. ## --
    CruiseKey = "N",
    SeatBeltKey = "K",
    NitroKey = "X",
    MenuKey = "O",
    -- ## ## --
    MenuCommand = "hud",

    MinSpeedToThrowFromVehicle = 100, -- In KM/H
    NitroForce = 50.0,
    RemoveNitroOnMilliseconds = 0.2,

    UseCustomFuel = true, -- If you want to use custom fuel script, set this to true and set the export name below
    CustomFuel = function(vehicle)
        return exports['LegacyFuel']:GetFuel(vehicle)
    end,

    Keys = {
        {
            title = "Cruise Control",
            key = "N",
        },
        {
            title = "Seat Belt",
            key = "K",
        },
        {
            title = "Nitro",
            key = "X",
        },
    },

    StressNotify = true, -- If you want to notify the player when they get stressed, set this to true
    MinStressToBlur = 50, -- If the player's stress level is higher than this, the screen will blur
    WhitelistedWeaponStress = { -- Weapons that won't stress
        `weapon_petrolcan`,
        `weapon_hazardcan`,
        `weapon_fireextinguisher`,
        `weapon_candycane`,
        `weapon_flashlight`,
        `weapon_ball`,
        `weapon_acidpackage`,
        `weapon_snowball`,
        `weapon_fertilizercan`,
        `gadget_parachute`,
        `weapon_flare`,
    },

    AddStress = { -- These are the values that will add stress to the player.
        ["on_shoot"] = {
            min = 1,
            max = 2,
            enable = true,
            chance = 20, -- Change to get stressed
        },
        ["on_fastdrive"] = {
            min = 1,
            max = 3,
            enable = true,
            minSpeed = 110, -- Minimum speed to get stressed
            chance = 50, -- Change to get stressed
        },
    },

    RemoveStress = { -- These are the values that will be removed from the stress level
        ["on_eat"] = {
            min = 5,
            max = 10,
            enable = true,
        },
        ["on_drink"] = {
            min = 5,
            max = 10,
            enable = true,

        },
        ["on_swim"] = {
            min = 5,
            max = 10,
            enable = true,

        },
        ["on_run"] = {
            min = 5,
            max = 10,
            enable = true,
        }
    },

    Notify = function(title, message, type, length, icon, color) -- Icons are selected from https://fontawesome.com/icons?d=gallery&m=free
        TriggerEvent("aty_hud:sendNotify", message, icon, color, length)
    end,
}