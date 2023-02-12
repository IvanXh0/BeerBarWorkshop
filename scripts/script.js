document.addEventListener("DOMContentLoaded", () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  // Add a click event on each of them
  $navbarBurgers.forEach((el) => {
    el.addEventListener("click", () => {
      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle("is-active");
      $target.classList.toggle("is-active");
    });
  });
});

const base_URL = "https://api.punkapi.com/v2/beers";
let pageSize = 4;

fetch(`${base_URL}?per_page=${pageSize}`)
  .then((res) => res.json())
  .then((data) => {
    beers = data;
    renderBeerCards(pageSize, beers);
  })
  .catch((err) => console.error(err));

function createBeerCard(beer) {
  // Create a column for each beer
  const column = document.createElement("div");
  column.classList.add("column", "is-one-quarter");

  // Create a card for each beer
  const card = document.createElement("div");
  card.classList.add("card");

  // Add beer image
  const cardImage = document.createElement("div");
  cardImage.classList.add(
    "card-image",
    "is-flex",
    "is-justify-content-center",
    "is-align-items-center"
  );
  const beerImage = document.createElement("figure");
  beerImage.classList.add("image", "is-4by3");
  beerImage.innerHTML = `<img src="${beer.image_url}" alt="${beer.name}" style="max-width:50%" class="mt-3">`;
  cardImage.appendChild(beerImage);

  // Add beer name and description
  const cardContent = document.createElement("div");
  cardContent.classList.add("card-content");
  const beerName = document.createElement("p");
  beerName.classList.add("title", "is-square");
  beerName.textContent = beer.name;
  const beerStats = document.createElement("p");
  beerStats.classList.add(
    "beer-stats",
    "is-size-7",
    "mb-2",
    "has-text-weight-bold"
  );
  beerStats.textContent = `IBU ${beer.ibu} - BREWED ${beer.first_brewed} - ABV ${beer.abv}%`;
  const beerDescription = document.createElement("p");
  beerDescription.classList.add("beer-description");
  beerDescription.textContent = beer.description;
  cardContent.appendChild(beerName);
  cardContent.appendChild(beerStats);
  cardContent.appendChild(beerDescription);

  // Append all elements to the card
  card.appendChild(cardImage);
  card.appendChild(cardContent);

  // Append the card to the column
  column.appendChild(card);

  //Creating a 3D effect

  column.addEventListener("mouseenter", (e) => {
    beerImage.style.transform = "translateZ(200px) rotateZ(-360deg)";
  });

  column.addEventListener("mouseleave", (e) => {
    beerImage.style.transform = "translateZ(0px) rotateZ(0deg)";
  });

  return column;
}
function renderBeerCards(pageSize, beers) {
  // Clear existing cards
  // beers.sort((a, b) => a.name.localeCompare(b.name));

  const beerContainer = document.querySelector(".columns");
  beerContainer.innerHTML = "";

  // Render the desired amount of cards
  for (let i = 0; i < pageSize; i++) {
    const beerCard = createBeerCard(beers[i]);
    beerContainer.appendChild(beerCard);
  }
}

searchInput.addEventListener("keyup", () => {
  const keyword = searchInput.value;
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.classList.remove("is-danger");
  searchBtn.classList.add("is-primary");
  fetch(`${base_URL}?beer_name=${keyword}`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.length) {
        console.log("No beers matching keyword");
        return;
      }
      currentBeerList = data;
      renderSearchResults(data);
    });

  if (searchInput.value === "") {
    searchBtn.classList.remove("is-primary");
    searchBtn.classList.add("is-danger");
    renderBeerCards(pageSize, beers);
  }
});

searchBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchBtn.classList.add("is-danger");
  renderBeerCards(pageSize, beers);
});

function renderSearchResults(data) {
  const beerContainer = document.querySelector(".columns");
  beerContainer.innerHTML = "";

  data.forEach((beer) => {
    const beerCard = createBeerCard(beer);
    beerContainer.appendChild(beerCard);
  });
}
