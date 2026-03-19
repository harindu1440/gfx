let defaultSettings = {
    "hudType": "circle",
    "showMap": true,
    "showHealth": true,
    "showArmor": true,
    "showHunger": true,
    "showThirst": true,
    "showStamina": true,
    "showOxygen": true,
    "showStress": true,
    "speetUnit": "kmh",
    "showInfo": true,
    "showOutline": true,
    "showKeys": true,
    "showSpeedo": true,
    "showMic": true,
    "showCinematic": false,
    "scaleSpeedo": 100,
    "hudColors" : {
        "health": "#FF2B5A",
        "armor": "#4589EE",
        "hunger": "#FFB44B",
        "thirst": "#6EFFF6",
        "stamina": "#6E7DFF",
        "oxygen": "#924FFF",
        "stress": "#FF1686",
    }
}

let editMode = false
var colorInput = null
let vehicleType = null
let currentVehicle = null
let useInGameTimer = false
let bikes = ["bmx", "cruiser", "fixter", "scorcher", "tribike", "tribike2", "tribike3"]
let settings = localStorage.getItem("aty_hud:settings") != null ? JSON.parse(localStorage.getItem("aty_hud:settings")) : defaultSettings

$(function(){
    loadSetting()
    setPositions()
    
    $.post(`https://${GetParentResourceName()}/loaded`, function(data){
        if(!data.UseSeatBelt){
            $(".seatbelt-indicator").remove()
        }
        if(!data.UseCruiseControl){
            $(".cruise-indicator").remove()
        }
        if(!data.UseNitro){
            $(".nitro-wrapper").remove()
        }
        if(!data.UseStress){
            $(".stress-stat").remove()
        }
        if(data.UseInGameTimer){
            useInGameTimer = true
        }else{
            setInterval(function(){
                let date = new Date()
                let hours = date.getHours()
                let minutes = date.getMinutes()
                let seconds = date.getSeconds()

                if(hours < 10){
                    hours = "0"+hours
                }

                if(minutes < 10){
                    minutes = "0"+minutes
                }

                if(seconds < 10){
                    seconds = "0"+seconds
                }

                $(".time-wrapper .text").html(hours+":"+minutes)
            }, 1000)
        }

        data.Keys.forEach(key => {
            $(".keys-wrapper").append(`
            <div class="key">
                <div class="key-box">
                    <div class="key-name">${key.key}</div>
                    <img src="assets/images/key-bg.png">
                </div>

                <div class="title">${key.title}</div>
            </div>
            `)
        });
    })

    window.addEventListener("message", function(event){
        let data = event.data

        if(data.action == "toggle"){
            if (data.status){
                $("body").fadeIn(150)
            }else{
                $("body").fadeOut(150)
            }
        }
        
        if(data.action == "notification"){
            let text = data.text
            let icon = data.icon
            let color = data.color
            let duration = data.duration

            let randomId = Math.floor(Math.random() * 1000000000)

            $(".notification-wrapper").append(`
            <div class="notification ${color ? color : "yellow"} ${randomId}">
                <div class="icon"><i class="${icon}"></i></div>
                <div class="text">${text}</div>
                <div class="bar-wrapper">
                    <div class="bar"></div>
                </div>
            </div>`)

            $(`.notification.${randomId}`).fadeIn(200)
            $(`.notification.${randomId}`).css("display", "flex")
            
            $( "."+randomId+" .bar" ).animate({
                width: "0%",
            }, duration, function() {
                $(`.notification.${randomId}`).fadeOut(200)
                setTimeout(function(){
                    $(`.notification.${randomId}`).remove()
                }, 200)
            });
        }

        if(data.action == "updateGun"){
            let gunName = data.gunName
            let isArmed = data.isArmed
            let fullAmmo = data.fullAmmo
            let clipAmmo = data.clipAmmo

            gunName = gunName.replace("weapon_", "")

            if (isArmed) {
                $("#player-weapon").fadeIn(100)
                $(".gun-img img").attr("src", `assets/weapons/${gunName}.png`)
                $(".full-ammo").text(fullAmmo)
                $(".clip-ammo").text(clipAmmo)
            }else{
                $("#player-weapon").fadeOut(100)
            }
        }

        if(data.action == "setVoiceMode"){
            if(data.value == 1){
                $(".microphone-wrapper .top").css("stroke-dashoffset", 96)
            }else if(data.value == 2){
                $(".microphone-wrapper .top").css("stroke-dashoffset", 48)
            }else{
                $(".microphone-wrapper .top").css("stroke-dashoffset", 0)
            }
        }

        if(data.action == "isTalking"){
            let isTalking = data.isTalking
            if (isTalking){
                $(".microphone-wrapper").css("opacity", 1)
            }else{
                $(".microphone-wrapper").css("opacity", 0.3)
            }
        }

        if(data.action == "toggleCruise"){
            let cruise = data.cruise
            if (cruise){
                $(".cruise-indicator path").attr("fill", "#ff0039")
            }else{
                $(".cruise-indicator path").attr("fill", "#3E3D3D")
            }
        }
        
        if(data.action == "toggleBelt"){
            let seatBelt = data.seatBelt
            if (seatBelt){
                playBuckleSound()
                $(".seatbelt-indicator path").attr("fill", "#ff0039")
            }else{
                playUnbuckleSound()
                $(".seatbelt-indicator path").attr("fill", "#3E3D3D")
            }
        }
        
        if(data.action == "nitro"){
            if (data.nitro < 1){
                $(".nitro-wrapper").hide()
            }else{
                $(".nitro-wrapper").show()
            }

            $(".speedo-type-one .nitro-wrapper .top").css("stroke-dashoffset", convertValue(data.nitro, 0, 100, 830, 600))
            $(".speedo-type-two .nitro-wrapper .top").css("stroke-dashoffset", convertValue(data.nitro, 0, 100, 960, 775))
        }
        
        if(data.action == "toggleSettings"){
            $(".settings").fadeIn(150)
            $(".settings").css("display", "flex")
        }

        if(data.action == "updateVehicle"){
            let speed = data.speed
            let fuel = data.fuel
            let rpm = data.rpm
            let lightOn = data.lightsOn
            let isDoorOpen = data.isDoorOpen
            let highlightsOn = data.highlightsOn
            currentVehicle = data.vehicleHash
            rpm < 0.2 ? rpm = 0.2 : rpm = rpm
            vehicleType = data.vehicleType

            if (vehicleType == "automobile"){
                $(".fuel-wrapper").show()
                $(".gear-wrapper").show()
                $(".seatbelt-indicator").show()
                $(".cruise-indicator").show()
                $(".lights-indicator").show()
                $(".door-indicator").show()
            }else if(vehicleType == "bike" && !bikes.includes((currentVehicle).toLowerCase())){
                $(".fuel-wrapper").show()
                $(".gear-wrapper").show()
                $(".seatbelt-indicator").hide()
                $(".cruise-indicator").show()
                $(".lights-indicator").show()
                $(".door-indicator").hide()
            }else if(vehicleType == "boat"){
                $(".fuel-wrapper").show()
                $(".gear-wrapper").hide()
                $(".seatbelt-indicator").hide()
                $(".cruise-indicator").hide()
                $(".lights-indicator").show()
                $(".door-indicator").hide()
            }else if(vehicleType == "plane" || vehicleType == "heli"){
                $(".fuel-wrapper").show()
                $(".gear-wrapper").hide()
                $(".seatbelt-indicator").show()
                $(".cruise-indicator").hide()
                $(".lights-indicator").show()
                $(".door-indicator").show()
            }

            if (bikes.includes((data.vehicleHash).toLowerCase())){
                $(".fuel-wrapper").hide()
                $(".gear-wrapper").hide()
                $(".indicators").hide()
                $(".rpm-wrapper .top").css("stroke-dashoffset", 0)
            }else{
                $(".indicators").show()
                $(".rpm-wrapper .top").css("stroke-dashoffset", convertValue(rpm, 0.0, 1.0, 830, 0))
            }

            if (!vehicleType == "automobile" && !vehicleType == "bike" && bikes.includes((data.vehicleHash).toLowerCase()) || vehicleType == "boat" || vehicleType == "plane" || vehicleType == "heli"){
                $(".rpm-wrapper .top").css("stroke-dashoffset", 0)
            }

            if (lightOn || highlightsOn){
                $(".lights-indicator path").attr("fill", "#ff0039")
            }else{
                $(".lights-indicator path").attr("fill", "#3E3D3D")
            }

            if (data.braking){
                $(".brake-indicator path").attr("fill", "#ff0039")
            }else{
                $(".brake-indicator path").attr("fill", "#3E3D3D")
            }

            if (isDoorOpen){
                $(".door-indicator path").attr("fill", "#ff0039")
            }else{
                $(".door-indicator path").attr("fill", "#3E3D3D")
            }

            if (data.engineHealth < 600){
                $(".engine-indicator path").attr("fill", "#ff0039")
            }else{
                $(".engine-indicator path").attr("fill", "#3E3D3D")
            }

            $(".vehicle-speed").text(String(speed).padStart(3, "0"))
            $(".speedo-type-one .fuel-wrapper .top").css("stroke-dashoffset", convertValue(fuel, 0, 100, 830, 600))
            $(".speedo-type-two .fuel-wrapper .top").css("stroke-dashoffset", convertValue(fuel, 0, 100, 960, 775))
            $(".needle").css("rotate", convertValue(rpm, 0.2, 1.0, -122, 84)+"deg")

            if (data.vehReversing){
                $(".gear-wrapper .prev").css("opacity", 0)  
                $(".gear-wrapper .active").text("R")  
                $(".gear-wrapper .next").text("N")  
            }else{
                $(".gear-wrapper .prev").css("opacity", 1)  

                if(data.gear == 0){
                    $(".gear-wrapper .prev").text("R")  
                    $(".gear-wrapper .active").text("N")  
                    $(".gear-wrapper .next").text("1")
                }else if(data.gear == 1){
                    $(".gear-wrapper .prev").text("N")  
                    $(".gear-wrapper .active").text("1")  
                    $(".gear-wrapper .next").text("2")
                }else{
                    $(".gear-wrapper .prev").text(data.gear-1)  
                    $(".gear-wrapper .active").text(data.gear)  
                    $(".gear-wrapper .next").text(data.gear+1)
                }

                if(data.gear == data.lastGear){
                    $(".gear-wrapper .next").css("opacity", 0)
                }else{
                    $(".gear-wrapper .next").css("opacity", 1)
                }
            }
        }

        if(data.action == "updateStatus"){
            let isTalking = data.isTalking
            if (isTalking){
                $(".microphone-wrapper").css("opacity", 1)
            }else{
                $(".microphone-wrapper").css("opacity", 0.5)
            }

            if (data.isInVehicle){
                $(".map-outline").css("height", "20vh") 

                if (settings.showSpeedo){
                    if (vehicleType == "automobile" || vehicleType == "bike" && !bikes.includes((currentVehicle).toLowerCase())){
                        $(".speedo-type-two").fadeIn(200)
                        $(".speedo-type-one").hide()
                    }else{
                        $(".speedo-type-one").fadeIn(200)
                        $(".speedo-type-two").hide()
                    }
                }
            }else{
                $(".speedo-wrapper").fadeOut(150)

                $(".cruise-indicator path").attr("fill", "#3E3D3D")
                $(".seatbelt-indicator path").attr("fill", "#3E3D3D")
                $(".door-indicator path").attr("fill", "#3E3D3D")
                $(".light-indicator path").attr("fill", "#3E3D3D")
                $(".brake-indicator path").attr("fill", "#3E3D3D")
                $(".engine-indicator path").attr("fill", "#3E3D3D")

                if (!settings.showMap){
                    $(".map-outline").css("height", "0vh")
                }else{
                    $(".map-outline").css("height", "20vh")
                }
            }

            if (!settings.showHealth && data.health == 100){
                $(".health-stat").fadeOut(150)
            }else if(!settings.showHealth && data.health < 100){
                $(".health-stat").fadeIn(150)
            }else{
                $(".health-stat").fadeIn(150)
            }

            if (!settings.showArmor && data.armor == 0){
                $(".armor-stat").fadeOut(150)
            }else if(!settings.showArmor && data.armor > 0){
                $(".armor-stat").fadeIn(150)
            }else{
                $(".armor-stat").fadeIn(150)
            }

            if (!settings.showHunger && data.hunger == 100){
                $(".hunger-stat").fadeOut(150)
            }else if(!settings.showHunger && data.hunger < 100){
                $(".hunger-stat").fadeIn(150)
            }else{
                $(".hunger-stat").fadeIn(150)
            }

            if (!settings.showThirst && data.thirst == 100){
                $(".thirst-stat").fadeOut(150)
            }else if(!settings.showThirst && data.thirst < 100){
                $(".thirst-stat").fadeIn(150)
            }else{
                $(".thirst-stat").fadeIn(150)
            }

            if (!settings.showStamina && data.stamina == 100){
                $(".stamina-stat").fadeOut(150)
            }else if(!settings.showStamina && data.stamina < 100){
                $(".stamina-stat").fadeIn(150)
            }else{
                $(".stamina-stat").fadeIn(150)
            }

            if (!settings.showOxygen && !data.isInWater){
                $(".oxygen-stat").fadeOut(150)
            }else if(!settings.showOxygen && data.isInWater){
                $(".oxygen-stat").fadeIn(150)
            }else{
                $(".oxygen-stat").fadeIn(150)
            }

            let health = (data.health).toFixed(0) + "%"
            let armor = (data.armor).toFixed(0) + "%"
            let hunger = (data.hunger).toFixed(0) + "%"
            let thirst = (data.thirst).toFixed(0) + "%"
            let stamina = (data.stamina).toFixed(0) + "%"
            let oxygen = (data.oxygen).toFixed(0) + "%"

            data.oxygen <= 0 ? oxygen = "0%" : oxygen = (data.oxygen).toFixed(0) + "%"
            data.health <= 0 ? health = "0%" : health = (data.health).toFixed(0) + "%"

            $(".health-percent").text(health)
            $(".armor-percent").text(armor)
            $(".hunger-percent").text(hunger)
            $(".thirst-percent").text(thirst)
            $(".stamina-percent").text(stamina)
            $(".oxygen-percent").text(oxygen)

            $(".health-stat .top").css("stroke-dashoffset", convertValue(data.health <= 0 ? 0 : data.health, 0, 100, 145, 0))
            $(".armor-stat .top").css("stroke-dashoffset", convertValue(data.armor, 0, 100, 145, 0))
            $(".hunger-stat .top").css("stroke-dashoffset", convertValue(data.hunger, 0, 100, 145, 0))
            $(".thirst-stat .top").css("stroke-dashoffset", convertValue(data.thirst, 0, 100, 145, 0))
            $(".stamina-stat .top").css("stroke-dashoffset", convertValue(data.stamina, 0, 100, 145, 0))
            $(".oxygen-stat .top").css("stroke-dashoffset", convertValue(data.oxygen, 0, 100, 145, 0))

            $(".health-stat .square-stat svg").attr("height", convertValue(data.health <= 0 ? 0 : data.health, 0, 100, 0, 52))
            $(".health-stat .square-stat svg").attr("viewBox", "0 0 52 "+convertValue(data.health <= 0 ? 0 : data.health, 0, 100, 0, 52))
            $(".armor-stat .square-stat svg").attr("height", convertValue(data.armor, 0, 100, 0, 52))
            $(".armor-stat .square-stat svg").attr("viewBox", "0 0 52 "+convertValue(data.armor, 0, 100, 0, 52))
            $(".hunger-stat .square-stat svg").attr("height", convertValue(data.hunger, 0, 100, 0, 52))
            $(".hunger-stat .square-stat svg").attr("viewBox", "0 0 52 "+convertValue(data.hunger, 0, 100, 0, 52))
            $(".thirst-stat .square-stat svg").attr("height", convertValue(data.thirst, 0, 100, 0, 52))
            $(".thirst-stat .square-stat svg").attr("viewBox", "0 0 52 "+convertValue(data.thirst, 0, 100, 0, 52))
            $(".stamina-stat .square-stat svg").attr("height", convertValue(data.stamina, 0, 100, 0, 52))
            $(".stamina-stat .square-stat svg").attr("viewBox", "0 0 52 "+convertValue(data.stamina, 0, 100, 0, 52))
            $(".oxygen-stat .square-stat svg").attr("height", convertValue(data.oxygen, 0, 100, 0, 52))
            $(".oxygen-stat .square-stat svg").attr("viewBox", "0 0 52 "+convertValue(data.oxygen, 0, 100, 0, 52))

            if (data.health >= 50) {
                $(".health-stat .top-2").css("opacity", convertValue(data.health, 50, 100, 0, 1))
                $(".health-stat .bottom-2").css("opacity", convertValue(data.health, 50, 100, 0, 1))
                $(".health-stat .top-1").css("opacity", 1)
                $(".health-stat .bottom-1").css("opacity", 1)
            }else{
                $(".health-stat .top-2").css("opacity", 0)
                $(".health-stat .bottom-2").css("opacity", 0)
                $(".health-stat .top-1").css("opacity", convertValue(data.health, 0, 50, 0, 1))
                $(".health-stat .bottom-1").css("opacity", convertValue(data.health, 0, 50, 0, 1))
            }
            if (data.armor >= 50) {
                $(".armor-stat .top-2").css("opacity", convertValue(data.armor, 50, 100, 0, 1))
                $(".armor-stat .bottom-2").css("opacity", convertValue(data.armor, 50, 100, 0, 1))
                $(".armor-stat .top-1").css("opacity", 1)
                $(".armor-stat .bottom-1").css("opacity", 1)
            }else{
                $(".armor-stat .top-2").css("opacity", 0)
                $(".armor-stat .bottom-2").css("opacity", 0)
                $(".armor-stat .top-1").css("opacity", convertValue(data.armor, 0, 50, 0, 1))
                $(".armor-stat .bottom-1").css("opacity", convertValue(data.armor, 0, 50, 0, 1))
            }
            if (data.hunger >= 50) {
                $(".hunger-stat .top-2").css("opacity", convertValue(data.hunger, 50, 100, 0, 1))
                $(".hunger-stat .bottom-2").css("opacity", convertValue(data.hunger, 50, 100, 0, 1))
                $(".hunger-stat .top-1").css("opacity", 1)
                $(".hunger-stat .bottom-1").css("opacity", 1)
            }else{  
                $(".hunger-stat .top-2").css("opacity", 0)
                $(".hunger-stat .bottom-2").css("opacity", 0)
                $(".hunger-stat .top-1").css("opacity", convertValue(data.hunger, 0, 50, 0, 1))
                $(".hunger-stat .bottom-1").css("opacity", convertValue(data.hunger, 0, 50, 0, 1))
            }
            if (data.thirst >= 50) {
                $(".thirst-stat .top-2").css("opacity", convertValue(data.thirst, 50, 100, 0, 1))
                $(".thirst-stat .bottom-2").css("opacity", convertValue(data.thirst, 50, 100, 0, 1))
                $(".thirst-stat .top-1").css("opacity", 1)
                $(".thirst-stat .bottom-1").css("opacity", 1)
            }else{
                $(".thirst-stat .top-2").css("opacity", 0)
                $(".thirst-stat .bottom-2").css("opacity", 0)
                $(".thirst-stat .top-1").css("opacity", convertValue(data.thirst, 0, 50, 0, 1))
                $(".thirst-stat .bottom-1").css("opacity", convertValue(data.thirst, 0, 50, 0, 1))
            }
            if (data.stamina >= 50) {
                $(".stamina-stat .top-2").css("opacity", convertValue(data.stamina, 50, 100, 0, 1))
                $(".stamina-stat .bottom-2").css("opacity", convertValue(data.stamina, 50, 100, 0, 1))
                $(".stamina-stat .top-1").css("opacity", 1)
                $(".stamina-stat .bottom-1").css("opacity", 1)
            }else{
                $(".stamina-stat .top-2").css("opacity", 0)
                $(".stamina-stat .bottom-2").css("opacity", 0)
                $(".stamina-stat .top-1").css("opacity", convertValue(data.stamina, 0, 50, 0, 1))
                $(".stamina-stat .bottom-1").css("opacity", convertValue(data.stamina, 0, 50, 0, 1))
            }
            if (data.oxygen >= 50) {
                $(".oxygen-stat .top-2").css("opacity", convertValue(data.oxygen, 50, 100, 0, 1))
                $(".oxygen-stat .bottom-2").css("opacity", convertValue(data.oxygen, 50, 100, 0, 1))
                $(".oxygen-stat .top-1").css("opacity", 1)
                $(".oxygen-stat .bottom-1").css("opacity", 1)
            }else{
                $(".oxygen-stat .top-2").css("opacity", 0)
                $(".oxygen-stat .bottom-2").css("opacity", 0)
                $(".oxygen-stat .top-1").css("opacity", convertValue(data.oxygen, 0, 50, 0, 1))
                $(".oxygen-stat .bottom-1").css("opacity", convertValue(data.oxygen, 0, 50, 0, 1))
            }
        }

        if (data.action == "stress"){
            let stress = (data.stress).toFixed(0) + "%"
            
            $(".stress-percent").text(stress)

            $(".stress-stat .top").css("stroke-dashoffset", convertValue(data.stress, 0, 100, 145, 0))

            $(".stress-stat .square-stat svg").attr("height", convertValue(data.stress, 0, 100, 0, 52))
            $(".stress-stat .square-stat svg").attr("viewBox", "0 0 52 "+convertValue(data.stress, 0, 100, 0, 52))

            if (data.stress >= 50) {
                $(".stress-stat .top-2").css("opacity", convertValue(data.stress, 50, 100, 0, 1))
                $(".stress-stat .bottom-2").css("opacity", convertValue(data.stress, 50, 100, 0, 1))
                $(".stress-stat .top-1").css("opacity", 1)
                $(".stress-stat .bottom-1").css("opacity", 1)
            }else{
                $(".stress-stat .top-2").css("opacity", 0)
                $(".stress-stat .bottom-2").css("opacity", 0)
                $(".stress-stat .top-1").css("opacity", convertValue(data.stress, 0, 50, 0, 1))
                $(".stress-stat .bottom-1").css("opacity", convertValue(data.stress, 0, 50, 0, 1))
            }

            $(".stress-stat .square-stat svg").attr("height", convertValue(data.stress, 0, 100, 0, 52))
            $(".stress-stat .square-stat svg").attr("viewBox", "0 0 52 "+convertValue(data.stress, 0, 100, 0, 52))

            if (!settings.showStress && data.stress == 0){
                $(".stress-stat").fadeOut(150)
            }else if(!settings.showStress && data.stress > 0){
                $(".stress-stat").fadeIn(150)
            }else{
                $(".stress-stat").fadeIn(150)
            }
        }

        if(data.action == "updatePlayerInfo"){
            $("#player-job").text(data.job)
            $("#player-id").text(data.id)
            $("#max-players").text(data.maxPlayers)

            if (useInGameTimer){
                $(".time-wrapper .text").html(data.time)
            }

            animateValue(document.getElementById("player-bank"), parseInt($("#player-bank").text()), data.bank, 1500)
            animateValue(document.getElementById("player-money"), parseInt($("#player-money").text()), data.money, 1500)
            animateValue(document.getElementById("player-ping"), parseInt($("#player-ping").text()), data.ping, 1500)
            animateValue(document.getElementById("current-players"), parseInt($("#current-players").text()), data.totalPlayers, 1500)
        }

        if(data.action == "updateStreet"){
            $(".address-wrapper .subtitle").text(data.road)
            $(".address-wrapper .title").text(data.street)
        }
    })

	$(".settings .stat-wrapper").click(function (e) {
		if (colorInput) colorInput.remove()
        let itemClass = $(this).attr("id")

		colorInput = $(`<div class="color-input-wrapper"> 
			<div class="color-input-background"> </div>
			<input type="color" class="color-input" style="--x: ${e.clientX}px; --y: ${e.clientY}px;" />
		</div>`)

		$("body").append(colorInput)

		$(".color-input-background").click(() => {
			if (colorInput) {
				colorInput.remove()
				colorInput = null
			}
		})

		colorInput.on("change input", (e) => {
            let hex = e.target.value
            settings.hudColors[itemClass] = hex
            loadSetting()
		})
	})

    $(".editable").draggable({
		cursor: "move",
		start: function (e) {
			const $target = $(e.target)

			$target.css({
				right: "auto",
				bottom: "auto",
				position: "absolute",
			})
		},
		stop: function (e, ui) {
			const target = e.target
			const className = target.classList[0]

			const positions = JSON.parse(localStorage.getItem("aty_hud:editablePositions"))

			localStorage.setItem(
				"aty_hud:editablePositions",
				JSON.stringify({
					...positions,
					[className]: ui.position,
				})
			)
		},
	})

	$(".edit-btn").on("click", function () {
		$(".settings").fadeOut()
		$(".editable").css({
			border: "1px dashed #a4a4a4",
		})

		editMode = true
	})
    
    $(document).keyup(function(e) {
        if (e.key === "Escape") {
            editMode = false
            $.post(`https://${GetParentResourceName()}/close`)
            $(".settings").fadeOut(150)
            $(".editable").css({
                border: "none",
            })
        }
    });
    
    $(document).on("click", ".reset-btn", function(){
        resetSettings()
        localStorage.removeItem("aty_hud:editablePositions")
    
        $(".editable").css({
            top: "",
            left: "",
            bottom: "",
            right: "",
        })
    })
    
    $(document).on("click", ".setting input[type='radio']", function(){
        let setting = $(this).attr("name")
        let value = $(this).data("status")
        settings[setting] = value
        loadSetting()
    })
    
    $(document).on("change", ".setting input[type='range']", function(){
        let setting = $(this).attr("name")
        let value = $(this).val()
        settings[setting] = value
        loadSetting()
    })
})
