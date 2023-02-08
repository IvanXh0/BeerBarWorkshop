const base_URL = "https://api.punkapi.com/v2/beers";
let pageSize = 20;

fetch(`${base_URL}?per_page=${pageSize}`)
  .then((res) => res.json())
  .then((data) => {
    beers = data;
    renderBeerCards(pageSize, beers);
  })
  .catch((err) => console.error(err));

// Show drop down functionality

document.addEventListener("DOMContentLoaded", function () {
  const showButtons = document.querySelectorAll(".dropdown-item[id='show']");
  showButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const pageSize = parseInt(this.textContent.split(" ")[2]);
      console.log(`Show ${pageSize}`);
      sortByName();
      // Sorting by ABV - TODO - Finished
      sortByABV();
      sortByBitterness();
      sortFirstBrewed();
      // Perform the action to show `pageSize` items
      renderBeerCards(pageSize, beers);
      document.querySelector(
        "#pageSize"
      ).innerHTML = `Page Size (showing ${pageSize}) `;
    });
  });
});

let btnShow = document.getElementById("btnShow");
let btnSort = document.getElementById("btnSort");

btnShow.addEventListener("click", (event) => {
  event.stopPropagation();
  btnShow.classList.toggle("is-active");
});

btnSort.addEventListener("click", (event) => {
  event.stopPropagation();
  btnSort.classList.toggle("is-active");
});

// Dynamic creating of the beer card

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

  // Add button to view more details
  const cardFooter = document.createElement("footer");
  cardFooter.classList.add("card-footer");
  const viewDetailsButton = document.createElement("button");
  viewDetailsButton.classList.add("card-footer-item", "button", "is-danger");
  viewDetailsButton.textContent = "View Details";
  cardFooter.appendChild(viewDetailsButton);

  // Append all elements to the card
  card.appendChild(cardImage);
  card.appendChild(cardContent);
  card.appendChild(cardFooter);

  // Append the card to the column
  column.appendChild(card);

  // Add the event listener for the button
  viewDetailsButton.addEventListener("click", function () {
    console.log("success");
    showBeerModal(beer);
  });

  return column;
}

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

// Function for sorting by Name

let ascendingOrder = false;

function sortByName(pageSize) {
  document.getElementById("sortAsc").addEventListener("click", () => {
    ascendingOrder = !ascendingOrder;
    beers.sort((a, b) => {
      if (ascendingOrder) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    renderBeerCards(pageSize, beers);
  });
}

// Sorting by ABV

function sortByABV(pageSize) {
  document.getElementById("sortAbv").addEventListener("click", () => {
    ascendingOrder = !ascendingOrder;
    beers.sort((a, b) => {
      if (ascendingOrder) {
        return b.abv - a.abv;
      } else {
        return a.abv - b.abv;
      }
    });
    renderBeerCards(pageSize, beers);
  });
}

// Sort by first brewed - TO DO!!!

function sortByBitterness(pageSize) {
  try {
    document
      .getElementById("sortByBitterness")
      .addEventListener("click", () => {
        ascendingOrder = !ascendingOrder;
        beers.sort((a, b) => {
          if (ascendingOrder) {
            return b.ibu - a.ibu;
          } else {
            return a.ibu - b.ibu;
          }
        });
        renderBeerCards(pageSize, beers);
      });
  } catch (error) {
    console.error(error);
  }
}

function sortFirstBrewed(pageSize) {
  try {
    document.getElementById("sortFirstBrewed").addEventListener("click", () => {
      beers.sort((a, b) => {
        let aTimestamp = Date.parse(`01/${a.first_brewed}`);
        let bTimestamp = Date.parse(`01/${b.first_brewed}`);
        return bTimestamp - aTimestamp;
      });
      renderBeerCards(pageSize, beers);
    });
  } catch (error) {
    console.error(error);
  }
}

// Rendering the beer cards depending on the state

function renderBeerCards(pageSize, beers) {
  // Clear existing cards
  // beers.sort((a, b) => a.name.localeCompare(b.name));

  const beerContainer = document.querySelector(".columns");
  beerContainer.innerHTML = "";

  sortByName(pageSize);
  sortByABV(pageSize);
  sortByBitterness(pageSize);
  sortFirstBrewed(pageSize);

  // Render the desired amount of cards
  for (let i = 0; i < pageSize; i++) {
    const beerCard = createBeerCard(beers[i]);
    beerContainer.appendChild(beerCard);
  }
}

// Create a modal and its elements
function showBeerModal(beer) {
  const modal = document.querySelector("#beer-modal");
  modal.classList.add("is-active");

  // Update the modal content with beer details
  const modalTitle = modal.querySelector(".modal-card-title");
  modalTitle.innerHTML = `${beer.name} <br> <span>"${beer.tagline}"</span>`;
  const modalBody = modal.querySelector(".modal-card-body");
  modalBody.classList.add("is-flex", "is-flex-direction-column");
  modalBody.innerHTML = `
   <img id="modalImg" src="${beer.image_url}" alt="${
    beer.name
  }" style="max-width:20%" >

    <p><b>First Brewed:</b> ${beer.first_brewed}</p>
    <p><b>Description:</b> ${beer.description}</p>
    
    <p><b>ABV:</b> ${beer.abv}%</p>
    <p><b>IBU:</b> ${beer.ibu}</p>
    <p><b>Food Pairing:</b> ${beer.food_pairing.join(", ")}</p>
  `;
}

// Hide the modal
function hideBeerModal() {
  const modal = document.querySelector("#beer-modal");
  modal.classList.remove("is-active");
}

// Add event listeners to show/hide the modal
document
  .querySelector("#beer-modal .delete")
  .addEventListener("click", hideBeerModal);
document
  .querySelector("#beer-modal .modal-background")
  .addEventListener("click", hideBeerModal);
document
  .querySelector("#beer-modal .button:last-child")
  .addEventListener("click", hideBeerModal);

// Implement search function - WIP
// Working on a key
// const searchInput = document.getElementById("searchInput");
// const searchBtn = document.getElementById("searchBtn");

// searchBtn.addEventListener("click", () => {
//   const searchTerm = searchInput.value.toLowerCase();

//   const filteredBeers = beers.filter((beer) => {
//     return beer.name.toLowerCase().includes(searchTerm);
//   });

//   renderBeerCards(pageSize, filteredBeers);
// });

// Implement it to render it as you type - DONE!

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.classList.remove("is-danger");
  searchBtn.classList.add("is-primary");
  const filteredBeers = beers.filter((beer) => {
    return (
      beer.name.toLowerCase().includes(searchTerm) ||
      beer.description.toLowerCase().includes(searchTerm)
    );
  });

  if (searchInput.value === "") {
    searchBtn.classList.remove("is-primary");
    searchBtn.classList.add("is-danger");
  }

  renderBeerCards(pageSize, filteredBeers);
});

// Changing the eraser button color based on its content
const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchBtn.classList.add("is-danger");
  renderBeerCards(pageSize, beers);
});
