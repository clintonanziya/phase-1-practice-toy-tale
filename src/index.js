let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Challenge 1: Fetch Andy's Toys and render them to the DOM
  fetchToys();

  function fetchToys() {
      fetch("http://localhost:3000/toys")
          .then(response => response.json())
          .then(toys => {
              toys.forEach(toy => renderToyCard(toy));
          });
  }

  // Challenge 2: Add Toy Info to the Card
  function renderToyCard(toy) {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");

      const h2 = document.createElement("h2");
      h2.textContent = toy.name;

      const img = document.createElement("img");
      img.src = toy.image;
      img.classList.add("toy-avatar");

      const p = document.createElement("p");
      p.textContent = `${toy.likes} Likes`;

      const likeButton = document.createElement("button");
      likeButton.classList.add("like-btn");
      likeButton.textContent = "Like ❤️";
      likeButton.dataset.id = toy.id;
      likeButton.addEventListener("click", likeToy);

      cardDiv.appendChild(h2);
      cardDiv.appendChild(img);
      cardDiv.appendChild(p);
      cardDiv.appendChild(likeButton);

      toyCollection.appendChild(cardDiv);
  }

  // Challenge 3: Add a New Toy
  toyForm.addEventListener("submit", event => {
      event.preventDefault();
      const formData = new FormData(toyForm);
      const name = formData.get("name");
      const image = formData.get("image");

      const newToy = {
          name: name,
          image: image,
          likes: 0
      };

      fetch("http://localhost:3000/toys", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
          },
          body: JSON.stringify(newToy)
      })
      .then(response => response.json())
      .then(toy => {
          renderToyCard(toy);
          toyForm.reset();
      });
  });

  // Challenge 4: Increase a Toy's Likes
  function likeToy(event) {
      const toyId = event.target.dataset.id;
      const likesElement = event.target.previousElementSibling;

      fetch(`http://localhost:3000/toys/${toyId}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
          },
          body: JSON.stringify({
              likes: parseInt(likesElement.textContent) + 1
          })
      })
      .then(response => response.json())
      .then(updatedToy => {
          likesElement.textContent = `${updatedToy.likes} Likes`;
      });
  }
});
