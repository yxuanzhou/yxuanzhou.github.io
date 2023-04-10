function displayCurrentMinute() {
  const now = new Date();
  const minute = now.getMinutes();
  const minuteDisplay = document.getElementById("minute-display");
  minuteDisplay.innerText = `The current minute is: ${minute}`;
}

function generateRandomNumber() {
  var randomNumber = Math.floor(Math.random() * 100) + 1;
  var output = document.getElementById("random-number-output");
  output.innerHTML = "Random number: " + randomNumber;
}

async function displayRandomLine() {
  const csvFilePath = 'speech_line.csv';
  const output = document.getElementById('line-display');

  try {
    // Convert CSV to JSON
    const jsonArray = await csv().fromFile(csvFilePath);

    // Get a random index from the JSON array
    const randomIndex = Math.floor(Math.random() * jsonArray.length);

    // Get the speech line from the JSON array
    const speechLine = jsonArray[randomIndex]['speech_line'];

    // Display the speech line in the output element
    output.textContent = speechLine;
  } catch (error) {
    console.error(error);
  }
}

function hideElement() {
  // Get the element by Id
  const element = document.getElementById('my-element');

  // Set the display property to "none"
  element.style.display = "none";
}
