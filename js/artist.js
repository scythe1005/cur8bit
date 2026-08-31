const params = new URLSearchParams(window.location.search);
const artistName = params.get("name");

fetch("data/releases.json")
  .then(response => response.json())
  .then(releases => {

    const artistReleases = releases.filter(release =>
      release.artists.includes(artistName)
    );

    displayArtist(artistName, artistReleases);
  })
  .catch(error => {
    console.error("Failed to load releases:", error);

    document.querySelector("#artist-detail").innerHTML = `
      <p>Failed to load artist data.</p>
    `;
  });


function displayArtist(artistName, releases) {

  const container = document.querySelector("#artist-detail");

  if (!artistName) {
    container.innerHTML = `
      <p>Artist not specified.</p>
    `;
    return;
  }

  container.innerHTML = `
    <h2>${artistName}</h2>

    <div id="artist-release-grid"></div>
  `;

  const grid = document.querySelector("#artist-release-grid");

  if (releases.length === 0) {
    grid.innerHTML = `
      <p>No releases found.</p>
    `;
    return;
  }

  releases.forEach(release => {

    const item = document.createElement("article");

    item.className = "release-card";

    item.innerHTML = `
      <a href="release.html?id=${encodeURIComponent(release.id)}">

        <img
          src="${release.artwork}"
          alt="${release.artists.join(", ")} - ${release.title}"
        >

        <h3>${release.title}</h3>
        <p>${release.year}</p>

      </a>
    `;

    grid.appendChild(item);
  });
}