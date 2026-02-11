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