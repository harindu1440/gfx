fx_version 'cerulean'
game 'gta5'
author 'atiysu'
lua54 'yes'

shared_scripts {
    'config.lua',
    'locales/locale.lua',
}

client_scripts{
    'client/utils.lua',
    'client/nitro.lua',
    'client/nui.lua',
    'client/main.lua',
    'client/vehicle.lua',
    'client/stress.lua',
    'weapons.lua',
}

server_scripts{
    'server/utils.lua',
    'server/main.lua',
    'server/nitro.lua',
}

ui_page 'ui/index.html'

files {
    'ui/**/*.*',
    'ui/*.*',
}

escrow_ignore{
    'locales/*.lua',
    'config.lua',
    'client/*.lua',
    'server/*.lua',
    'stream/*.*',
    'weapons.lua',
}
dependency '/assetpacks'