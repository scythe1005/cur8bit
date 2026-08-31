fetch("data/releases.json")
  .then(response => response.json())
  .then(releases => {

    const artistSet = new Set();

    releases.forEach(release => {
      release.artists.forEach(artist => {
        artistSet.add(artist);
      });
    });

    const artists = Array.from(artistSet);

    artists.sort((a, b) =>
      a.localeCompare(b, undefined, {
        sensitivity: "base"
      })
    );

    displayArtists(artists);
  })
  .catch(error => {
    console.error("Failed to load artists:", error);

    document.querySelector("#artist-list").innerHTML = `
      <p>Failed to load artist data.</p>
    `;
  });


function displayArtists(artists) {

  const container = document.querySelector("#artist-list");

  container.innerHTML = "";

  artists.forEach(artist => {

    const item = document.createElement("div");

    item.className = "artist-list-item";

    item.innerHTML = `
      <a href="artist.html?name=${encodeURIComponent(artist)}">
        ${artist}
      </a>
    `;

    container.appendChild(item);
  });
}