You can toggle the hud with this trigger (Client-Side)
TriggerEvent("aty_hud:toggle", true)

You can add stress with this trigger (Client-Side)
TriggerEvent("aty_hud:stress:add", 50)

You can remove stress with this trigger (Client-Side)
TriggerEvent("aty_hud:stress:decrease", 50)

Notify Usage 
TriggerEvent("aty_hud:sendNotify", message, icon, color, length)
(Message = "Message", icon = "fas fa-user", color = "red", length = 5000 (miliseconds))
You can find icons here: https://fontawesome.com/search?o=r&m=free
Colors are "red", "green" and "yellow"

TriggerEvent("aty_hud:client:toggleSeatBelt", true / false)