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

function showAlert() {
  alert("I said don't!");
}

async function getWikipediaSummary(searchTerm) {
  const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data.extract;
  } catch (error) {
    console.error(error);
  }
}




function parseArray() {
  const input = document.getElementById("arrayInput").value;
  const array = input.split(",").map(Number);
  const sortedArray = array.sort((a, b) => a - b);
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `Sorted array: [${sortedArray}]`;
}

function mapLoad() {
  // Define the lat lon coordinate
  var latLng = [41.789649, -87.599702];
  var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
  'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  mbUrl = 'access_token=pk.eyJ1IjoiY29vbHVvYm9tYXAiLCJhIjoiY2xoNTN2NHNqMDFldDN1cWVndThtdDZiaiJ9.hwhhv-xYXb62Oq87ih_Geg';
  var grayscale = L.tileLayer(mbUrl, { id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr }),
      streets = L.tileLayer(mbUrl, { id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr });
  var map = L.map('map', {
    center: latLng,
    zoom: 16,
    layers: [streets]
  });
  var baseLayers = {
    "Grayscale": grayscale,
    "Streets": streets
  };
  L.control.layers(baseLayers).addTo(map);
  L.marker(latLng).addTo(map)
    .bindPopup("<b>UChicago<br>Campus</b>")
    .openPopup();
  // Click event
  var popup = L.popup();
  function onMapClick(e) {
    popup
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString())
      .openOn(map);
  }
  map.on('click', onMapClick);
}

function getWikiPage() {
  const searchTerm = document.getElementById("searchTerm").value;
  const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Check if the properties exist in the API response
      if (!data.hasOwnProperty("title") || !data.hasOwnProperty("description") || !data.hasOwnProperty("thumbnail")) {
        throw new Error("Invalid API response");
      }

      // Extract the relevant information from the API response
      const title = data.title;
      const description = data.description;
      const imageUrl = data.thumbnail.source;

      // Display the information on your webpage
      const resultDiv = document.getElementById("result");
      resultDiv.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <img src="${imageUrl}" alt="${title}">`;
    })
    .catch(error => {
      console.error(error);
      const resultDiv = document.getElementById("result");
      resultDiv.innerHTML = "Error: could not retrieve data from Wikipedia API";
    });
}

//MUSIC API

function handleKeyPress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    search();
  }
}

function search() {
  const searchTerm = document.getElementById("searchInput").value;
  const url = `https://musicbrainz.org/ws/2/artist/?query=${searchTerm}&fmt=json`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const resultList = document.getElementById("resultList");
      resultList.innerHTML = "";
      data.artists.forEach(artist => {
        const resultItem = document.createElement("li");
        resultItem.innerHTML = `<a href="#" onclick="getAlbums('${artist.id}', '${artist.name}')">${artist.name}</a>`;
        resultList.appendChild(resultItem);
      });
      
      const albumTable = document.getElementById("albumTable");
      albumTable.style.display = "none";
      document.getElementById("titleHeader").innerHTML = "";
    });
}


function getAlbums(artistId, artistName) {
  const url = `https://musicbrainz.org/ws/2/release/?query=arid:${artistId}&fmt=json`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const albumTable = document.getElementById("albumTable");
      const albumTableBody = albumTable.getElementsByTagName("tbody")[0];
      const titleHeader = document.getElementById("titleHeader");
      titleHeader.innerHTML = "";
      titleHeader.innerHTML = `${artistName}`;
      albumTableBody.innerHTML = "";
      data.releases.forEach(release => {
        const row = albumTableBody.insertRow();
        const dateCell = row.insertCell();
        const titleCell = row.insertCell();
        const genreCell = row.insertCell()
        dateCell.innerHTML = release.date;
        titleCell.innerHTML = `<a href="https://musicbrainz.org/release/${release.id}" target="_blank">${release.title}</a>`;
        genreCell.innerHTML = `<a href="https://musicbrainz.org/release/${release.id}" target="_blank">${release.country}</a>`;
      });
      albumTable.style.display = "table";
      document.getElementById("resultList").innerHTML = "";
    });
}


function searchByInstrument() {
  const searchTerm = document.getElementById("instrumentInput").value;
  const url = `https://musicbrainz.org/ws/2/instrument/?query=${encodeURIComponent(searchTerm)}&fmt=json`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const resultList = document.getElementById("resultList");
      resultList.innerHTML = "";
      data.instruments.forEach(instrument => {
        const resultItem = document.createElement("li");
        const name = instrument.name;
        const description = instrument.description;
        resultItem.innerHTML = `<strong>${name}</strong><br>${description}`;
        resultList.appendChild(resultItem);
      });
      const albumTable = document.getElementById("albumTable");
      albumTable.style.display = "none";
      document.getElementById("titleHeader").innerHTML = "";
    });
}

