// Get HTML elements
const countDisplay = document.getElementById("count"); // showscore
const colorParts = document.querySelectorAll(".color-part"); // Color parts of this game
const mainContainer = document.querySelector(".container"); // Main container
const startButton = document.querySelector("#start"); // Start button
const resultMessage = document.querySelector("#result"); // Result message
const gameWrapper = document.querySelector(".wrapper"); // Game wrapper

// Object to store colors for ease of access
const colors = {
    color1: { current: "#068e06", new: "#11e711" }, // Green
    color2: { current: "#950303", new: "#fd2a2a" }, // Red
    color3: { current: "#01018a", new: "#2062fc" }, // Blue
    color4: { current: "#919102", new: "#fafa18" }  // Yellow
};

let sequence = []; // To keep track
let isGeneratingPath = false; // Flag to check if the path is being generated
let currentCount, userClickCount = 0; // Current score and user clicks

// Start the game when the button is clicked
startButton.addEventListener("click", () => {
    currentCount = 0; // Reset score
    userClickCount = 0; // Reset user click counter
    sequence = []; // Reset the game sequence
    isGeneratingPath = false; // Reset path generation flag
    gameWrapper.classList.remove("hide"); // Show game area
    mainContainer.classList.add("hide"); // Hide start container
    generatePath(); // Start generating the path
});

// Generate a new path
const generatePath = () => {
    sequence.push(getRandomColor()); // Add a random color to the sequence
    currentCount = sequence.length; // Update score
    isGeneratingPath = true; // Set the flag to true
    displayPath(currentCount); // Show the current count
};

// Get a random color from the colors object
const getRandomColor = () => {
    let keys = Object.keys(colors); // Get all color keys
    return keys[Math.floor(Math.random() * keys.length)]; // Return a random key
};

// Display the sequence of colors
const displayPath = async (count) => {
    countDisplay.innerText = count; // Update the score display

    // Iterate over the sequence to show colors
    for (let color of sequence) {
        let colorElement = document.querySelector(`.${color}`); // Get corresponding color element
        await wait(500); // Wait for some time
        colorElement.style.backgroundColor = colors[color].new; // Change to new color
        await wait(600); // Wait for some time
        colorElement.style.backgroundColor = colors[color].current; // Change back to original color
        await wait(600); // Wait for some time
    }

    isGeneratingPath = false; // Reset the flag
};

// Helper function to create delays
async function wait(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time); // Create a delay
    });
}

// Click event for color parts
colorParts.forEach((part) => {
    part.addEventListener("click", async (event) => {
        // If the path is being generated, ignore clicks
        if (isGeneratingPath) {
            return;
        }

        // Check if the clicked color is the correct one
        if (event.target.classList[0] === sequence[userClickCount]) {
            // Change the color briefly to indicate it's correct
            event.target.style.backgroundColor = colors[sequence[userClickCount]].new;
            await wait(500); // Wait for a moment
            event.target.style.backgroundColor = colors[sequence[userClickCount]].current; // Change back

            userClickCount++; // Increment user click count

            // Check if user has completed the current sequence
            if (userClickCount === currentCount) {
                userClickCount = 0; // Reset user click count
                generatePath(); // Generate the next path
            }
        } else {
            // If user's click was incorrect, show the loss message
            handleLoss();
        }
    });
});

// Handle losing the game
const handleLoss = () => {
    resultMessage.innerHTML = `<span>Your Score:</span> ${currentCount}`; // Show user's score
    resultMessage.classList.remove("hide"); // Show the result message
    mainContainer.classList.remove("hide"); // Show the start container
    gameWrapper.classList.add("hide"); // Hide the game area
    startButton.innerText = "Play Again"; // Change button text to play again
    startButton.classList.remove("hide"); // Show the button
};
