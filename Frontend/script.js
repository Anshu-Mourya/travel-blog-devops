fetch("http://localhost:5001/api/destinations")
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("card-container");

    data.forEach((destination) => {
      const card = document.createElement("div");

      card.innerHTML = `
        <img src="${destination.image}" width="300">
        <h2>${destination.name}</h2>
      `;

      container.appendChild(card);
    });
  });