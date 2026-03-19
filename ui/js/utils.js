const convertValue = (value, oldMin, oldMax, newMin, newMax) => {
    const oldRange = oldMax - oldMin
    const newRange = newMax - newMin
    const newValue = ((value - oldMin) * newRange) / oldRange + newMin
    return newValue
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
        window.requestAnimationFrame(step);
    }
    };
    window.requestAnimationFrame(step);
}

function resetSettings(){
    settings = defaultSettings
    loadSetting()
}

function setPositions() {
	var editablePositions = localStorage.getItem("aty_hud:editablePositions")

	if (editablePositions) {
		editablePositions = JSON.parse(editablePositions)

		for (const className in editablePositions) {
			const { top, left } = editablePositions[className]

			$(`.${className}`).css({
				position: "absolute",
				top: `${top}px`,
				right: "auto",
				bottom: "auto",
				left: `${left}px`,
			})
		}
	}
}

function saveSettings(){
    localStorage.setItem("aty_hud:settings", JSON.stringify(settings))
}

function loadSetting(){
    $.post(`https://${GetParentResourceName()}/setAlwaysMapOn`, JSON.stringify(settings.showMap))
    $.post(`https://${GetParentResourceName()}/cinematicMode`, JSON.stringify(settings.showCinematic))
    $.post(`https://${GetParentResourceName()}/setSpeedUnit`, JSON.stringify(settings.speetUnit))

    $(".speed-type").text((settings.speetUnit).toUpperCase())

    for (const setting in settings){
        if (settings[setting] == true){
            $(`.setting input[name="${setting}"][data-status="${true}"][type="radio"]`).prop("checked", true)
        }else if(settings[setting] == false){
            $(`.setting input[name="${setting}"][data-status="${false}"][type="radio"]`).prop("checked", true)
        }

        if (setting == "hudType"){
            $(`.setting input[name="${setting}"][data-status="${settings[setting]}"][type="radio"]`).prop("checked", true)
        }
        if (setting == "scaleSpeedo"){
            let scale = parseInt(settings[setting])
            $(".speedo-wrapper").css("scale", `${scale/100}`)
            $(`.setting input[name="${setting}"]`).val(settings[setting])
        }
        if (setting == "speetUnit"){
            $(`.setting input[name="${setting}"][data-status="${settings[setting]}"][type="radio"]`).prop("checked", true)
        }
        if (setting == "showCinematic"){
            if (settings[setting] ){
                $("main").hide()
            }else{
                $("main").show()
            }
        }
    }

    for (const stat in settings.hudColors){
        $(`.${stat}-stat .top stop`).attr("stop-color", settings.hudColors[stat])
        $(`.${stat}-stat .top-1 stop`).attr("stop-color", settings.hudColors[stat])
        $(`.${stat}-stat .top-2 stop`).attr("stop-color", settings.hudColors[stat])
        $(`.${stat}-stat .bottom stop`).attr("stop-color", settings.hudColors[stat])
        $(`.${stat}-stat .bottom-1 stop`).attr("stop-color", settings.hudColors[stat])
        $(`.${stat}-stat .bottom-2 stop`).attr("stop-color", settings.hudColors[stat])
        $(`.${stat}-stat .top path`).attr("fill", settings.hudColors[stat])
        $(`.${stat}-stat .top-1 path`).attr("fill", settings.hudColors[stat])
        $(`.${stat}-stat .top-2 path`).attr("fill", settings.hudColors[stat])
        $(`.${stat}-stat .bottom path`).attr("fill", settings.hudColors[stat])
        $(`.${stat}-stat .bottom-1 path`).attr("fill", settings.hudColors[stat])
        $(`.${stat}-stat .bottom-2 path`).attr("fill", settings.hudColors[stat])
        $(`.${stat}-stat .circle-img stop`).attr("stop-color", settings.hudColors[stat])
        $(`.${stat}-stat .top`).css("stroke", settings.hudColors[stat])
        $(`.${stat}-stat .square-stat path`).attr("fill", settings.hudColors[stat])
        $(`.${stat}-stat circle.top`).attr("stroke", settings.hudColors[stat])

        $(`.circle-status .${stat}-stat .icon path`).attr("fill", settings.hudColors[stat])
        $(`.circle-status-settings .${stat}-stat .icon path`).attr("fill", settings.hudColors[stat])
        $(`.corner-stats-type-one .${stat}-stat .icon path`).attr("fill", settings.hudColors[stat])
        $(`.corner-stats-type-two .${stat}-stat .icon path`).attr("fill", settings.hudColors[stat])
    }

    if(settings.hudType == "circle"){
        $(".circle-status").show()
        $(".circle-status").css("display", "flex")
        $(".square-status").hide()
        $(".corner-stats-type-one").hide()
        $(".corner-stats-type-two").hide()
    }else if(settings.hudType == "corner-1"){
        $(".circle-status").hide()
        $(".square-status").hide()
        $(".corner-stats-type-one").show()
        $(".corner-stats-type-one").css("display", "flex")
        $(".corner-stats-type-two").hide()
    }else if(settings.hudType == "corner-2"){
        $(".circle-status").hide()
        $(".square-status").hide()
        $(".corner-stats-type-one").hide()
        $(".corner-stats-type-two").show()
        $(".corner-stats-type-two").css("display", "flex")
    }else{
        $(".circle-status").hide()
        $(".corner-stats-type-one").hide()
        $(".corner-stats-type-two").hide()
        $(".square-status").show()
        $(".square-status").css("display", "flex")
    }

    if(settings.showInfo){
        $(".player-info-wrapper").show()
    }else{
        $(".player-info-wrapper").hide()
    }

    if(settings.showOutline){
        $(".map-outline").css("opacity", 1)
    }else{
        $(".map-outline").css("opacity", 0)
    }

    if(settings.showKeys){
        $(".keys-wrapper").show()
    }else{
        $(".keys-wrapper").hide()
    }

    if(settings.showSpeedo){
        $(".speedo-wrapper").show()
    }else{
        $(".speedo-wrapper").hide()
    }

    if(settings.showMic){
        $(".microphone-wrapper").show()
    }else{
        $(".microphone-wrapper").hide()
    }

    saveSettings()
}

function playBuckleSound() {
    let buckleSound = new Audio()
    buckleSound.src = "sounds/buckle.mp3"
	buckleSound.play()
    buckleSound = null
}

function playUnbuckleSound() {
    let unbuckleSound = new Audio()
    unbuckleSound.src = "sounds/unbuckle.mp3"
	unbuckleSound.play()
    unbuckleSound = null
}