function greetRider() {
    let name = document.getElementById("rider-name").value;

    if (name === "") {
        alert("Oooh! Wait a second! This is going to be fun but even more so if we don't have to make a name up for you. There have been some funky names made up out here, trust me!");
    } else {
        document.getElementById("story-text").innerText = "Nice to meet you, " + name + "!";
        document.getElementById("horse-stories").style.display = "block";
        document.getElementById("rider-selection").style.display = "none";
    }
}

function pickHorse(horseName) {
    document.getElementById("story-text").innerText =
        "Great choice! Let's get the saddle for " + horseName + ".";
    
    document.getElementById("horse-stories").style.display = "none";
    document.getElementById("first-choice").style.display = "block";
}

function handleFirstChoice() {
    let choice = document.getElementById("ride-choice").value.toLowerCase();

    if (choice === "arena") {
        document.getElementById("story-text").innerText =
            "You head to the arena. Before the horses can start running the barrels, they have to be warmed up with loops around the arena and varying speeds. We will start at a walk, then move to a lope.";

        document.getElementById("first-choice").style.display = "none";
        document.getElementById("arena-choice").style.display = "block";

    } else if (choice === "pasture") {
        document.getElementById("story-text").innerText =
            "You ride out to the pasture. Our ride starts by checking the fence and water tanks. We will enjoy the day as we go.";

        document.getElementById("first-choice").style.display = "none";
        document.getElementById("pasture-choice").style.display = "block";

    } else if (choice === "mountains") {
        document.getElementById("story-text").innerText =
            "You climb toward the mountains. The air gets cooler and the view opens up. The horses are athletic and sure footed but always keep an eye out for holes that they could step into. That wouldn't be good!";

        document.getElementById("first-choice").style.display = "none";
        document.getElementById("mountains-choice").style.display = "block";

    } else {
        document.getElementById("story-text").innerText =
            "That’s not a place you can ride. Try arena, pasture, or mountains.";
    }
}

function handleArenaChoice() {
    let direction = document.getElementById("arena-direction").value.toLowerCase();

    if (direction === "clockwise") {

        let laps = "";
        for (let i = 1; i <= 3; i++) {
            laps += "Lap " + i + " completed. ";
        }

        let mood = getHorseMood(direction);

        document.getElementById("story-text").innerText =
            "You start warming up clockwise. Big circles, loose reins, letting your horse stretch out. " +
            laps +
            " Your horse seems " + mood + " today.";

    } else if (direction === "counter-clockwise") {

        let laps = "";
        for (let i = 1; i <= 3; i++) {
            laps += "Lap " + i + " completed. ";
            console.log("Lap " + i);
        }

        let mood = getHorseMood(direction);

        document.getElementById("story-text").innerText =
            "You warm up counter‑clockwise, keeping your horse balanced and limber. " +
            laps +
            " Your horse seems " + mood + " today.";

    } else {
        document.getElementById("story-text").innerText =
            "That’s not a direction we can go in the arena. Try clockwise or counter-clockwise.";
    }
}

function handlePastureChoice() {
    let action = document.getElementById("pasture-action").value.toLowerCase();

    if (action === "fences") {
        document.getElementById("story-text").innerText =
            "You ride the fence line, checking for breaks or loose wire. Everything looks secure today.";

    } else if (action === "strays") {
        document.getElementById("story-text").innerText =
            "You scan the pasture for strays. A few calves are wandering, but they stay close to the herd.";

    } else {
        document.getElementById("story-text").innerText =
            "That’s not something we do in the pasture. Try fences or strays.";
    }
}

function handleMountainsChoice() {
    let path = document.getElementById("mountains-path").value.toLowerCase();

    if (path === "trail") {
        document.getElementById("story-text").innerText =
            "You follow the trail along the ridge. The view stretches for miles, and your horse steps carefully along the narrow path.";

    } else if (path === "explore") {
        document.getElementById("story-text").innerText =
            "You turn off the trail and explore the open timber. Birds scatter as you ride through the trees, and the air smells like pine.";

    } else {
        document.getElementById("story-text").innerText =
            "That’s not a choice up here. Try trail or explore.";
    }
}

function getHorseMood(direction) {
    if (direction === "clockwise") {
        return "relaxed";
    } else {
        return "spunky";
    }
}
