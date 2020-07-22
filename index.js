const postcode = document.querySelector(".postcode");
const date = document.querySelector("[name=date]");
const loader = document.querySelector(".loader");
const svg = document.querySelector("svg");
const svgtitle = document.querySelector("#svgTitle");

let lat = 51.510357;
let long = -0.116773;
let zoom = 8;

let crimes = {};
let postcodeValue = "";

n = new Date();
y = n.getFullYear();
m = n.getMonth() - 1;
let formDate = document.getElementById("date");

formDate.setAttribute("max", `${y}-0${m}`);

postcode.addEventListener("submit", (event) => {
  loader.style.display = "block";
  crimes = {};
  event.preventDefault();
  postcodeValue = event.target.elements.postcode.value;
  fetch(`https://api.postcodes.io/postcodes/${postcodeValue}`)
    .then(dealWithResponse)
    .then((data) => {
      lat = data.result.latitude;
      long = data.result.longitude;
      zoom = 15;

      return fetch(
        `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${long}&date=${date.value}`
      );
    })
    .then(dealWithResponse)
    .then((data) => {
      data.forEach((item) => {
        if (!crimes[item.category]) crimes[item.category] = 0;
        crimes[item.category] += 1;
      });
      console.log(data);
    })
    .then(initMap)
    .then(toggleToNone)
    .catch((error) => {
      console.log(error);
    });
});
function toggleToNone() {
  loader.style.display = "none";
}
function dealWithResponse(response) {
  if (!response.ok) {
    loader.textContent = "Error, postcode not found!";
    throw new Error(response.status);
  }
  return response.json();
}

function render(data) {
  let objectKeys = Object.keys(crimes);
  let objectValues = Object.values(crimes);
  let maxWidth = Math.max(...objectValues);
  svg.setAttribute(
    "viewBox",
    `0 0 ${maxWidth + 200} ${21.5 * objectValues.length}`
  );

  var svgNS = "http://www.w3.org/2000/svg";
  svgtitle.textContent = `Crime Statistics in ${postcodeValue.toUpperCase()}`;
  const title = document.createElement("title");
  title.textContent = `Crime Statistics in ${postcodeValue}`;
  title.setAttribute("id", "title");
  svg.appendChild(title);
  let y = 0;
  objectValues.forEach((value, index) => {
    let g = document.createElementNS(svgNS, "g");
    g.classList.add("bar");
    let rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", y);
    rect.setAttribute("width", value);
    rect.setAttribute("height", "20px");
    let text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", value + 10);
    text.setAttribute("y", 10 + y);
    text.setAttribute("dy", "0.35em");
    text.setAttribute("class", "svgText");
    text.textContent = `${objectKeys[index]} ${objectValues[index]}`;
    y += 21;

    g.appendChild(rect);
    g.appendChild(text);

    svg.appendChild(g);
    textColor = document.querySelector("figcaption");
    textColor.style.color = "white";
  });
}

function initMap() {
  var yourArea = { lat: lat, lng: long };
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: zoom,
    center: yourArea,
    streetViewControl: false,
    mapTypeControl: false,
    styles: [
      {
        featureType: "all",
        elementType: "all",
        stylers: [
          {
            visibility: "on",
          },
        ],
      },
      {
        featureType: "all",
        elementType: "labels",
        stylers: [
          {
            visibility: "off",
          },
          {
            saturation: "-100",
          },
        ],
      },
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [
          {
            saturation: 36,
          },
          {
            color: "#000000",
          },
          {
            lightness: 40,
          },
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [
          {
            visibility: "on",
          },
          {
            color: "white",
          },
          {
            lightness: 16,
          },
        ],
      },
      {
        featureType: "all",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 20,
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 17,
          },
          {
            weight: 1.2,
          },
        ],
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 20,
          },
        ],
      },
      {
        featureType: "landscape",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#4d6059",
          },
        ],
      },
      {
        featureType: "landscape",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#4d6059",
          },
        ],
      },
      {
        featureType: "landscape.natural",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#4d6059",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
          {
            lightness: 21,
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#4d6059",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#4d6059",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            visibility: "on",
          },
          {
            color: "#7f8d89",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#7f8d89",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#7f8d89",
          },
          {
            lightness: 17,
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#7f8d89",
          },
          {
            lightness: 29,
          },
          {
            weight: 0.2,
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 18,
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#7f8d89",
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#7f8d89",
          },
        ],
      },
      {
        featureType: "road.local",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 16,
          },
        ],
      },
      {
        featureType: "road.local",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#7f8d89",
          },
        ],
      },
      {
        featureType: "road.local",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#7f8d89",
          },
        ],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 19,
          },
        ],
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [
          {
            color: "#2b3638",
          },
          {
            visibility: "on",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [
          {
            color: "#2b3638",
          },
          {
            lightness: 17,
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#24282b",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#24282b",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
    ],
  });

  var marker = new google.maps.Marker({ position: yourArea, map: map });
}
