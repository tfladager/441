function greetRider() {
    let name = document.getElementById("rider-name").value;

    // Requirement: Use an 'if' statement
    if (name === "") {
        alert("Oooh! Wait a second! This is going to be fun but even more so if we don't have to make a name up for you. There have been some funky names made up out here, trust me!");
    } else {
        // Requirement: Use concatenation (+) and update the DOM
        document.getElementById("story-text").innerText = "Nice to meet you, " + name + "!";
        
        // Show the horse stories and hide the name input
        document.getElementById("horse-stories").style.display = "block";
        document.getElementById("rider-selection").style.display = "none";
    }
}

function pickHorse(horseName) {
    // This is your 3rd story progression!
    document.getElementById("story-text").innerText = "Great choice! Let's get the saddle for " + horseName + ".";
    
    // Hide the selection area to finish the scene
    document.getElementById("horse-stories").style.display = "none";
}

function handleFirstChoice() {
    let choice = document.getElementById("ride-choice").value.toLowerCase();

    if (choice === "arena") {
        document.getElementById("story-text").innerText =
            "You head to the arena. Before the horses can start running the barrels, they have to be warmed up with loops around the arena and varying speeds. We will start at a walk, then move to a lope.";
    } else if (choice === "pasture") {
        document.getElementById("story-text").innerText =
            "You ride out to the pasture. Our ride starts by checking the fence and water tanks. We will enjoy the day as we go.";
    } else if (choice === "mountains") {
        document.getElementById("story-text").innerText =
            "You climb toward the mountains. The air gets cooler and the view opens up. The horses are athletic and sure footed but always keep an eye out for holes that they could step into. That wouldn't be good!";
    } else {
        document.getElementById("story-text").innerText =
            "That’s not a place you can ride. Try arena, pasture, or mountains.";
    }

}
