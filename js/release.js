const params = new URLSearchParams(window.location.search);
const releaseId = params.get("id");

fetch("data/releases.json")
  .then(response => response.json())
  .then(releases => {

    const release = releases.find(item => item.id === releaseId);

    if (!release) {
      document.querySelector("#release-detail").innerHTML = `
        <p>Release not found.</p>
      `;
      return;
    }

    displayRelease(release);
  })
  .catch(error => {
    console.error("Failed to load release:", error);

    document.querySelector("#release-detail").innerHTML = `
      <p>Failed to load release data.</p>
    `;
  });


function displayRelease(release) {

  const container = document.querySelector("#release-detail");

  const artistLinks = release.artists.map(artist => `
    <a
      class="artist-link"
      href="artist.html?name=${encodeURIComponent(artist)}"
    >
      ${artist}
    </a>
  `).join(", ");

  const links = [];

  if (release.links?.spotify) {
    links.push(`
      <a href="${release.links.spotify}" target="_blank" rel="noopener noreferrer">
        Spotify
      </a>
    `);
  }

  if (release.links?.bandcamp) {
    links.push(`
      <a href="${release.links.bandcamp}" target="_blank" rel="noopener noreferrer">
        Bandcamp
      </a>
    `);
  }

  if (release.links?.youtube) {
    links.push(`
      <a href="${release.links.youtube}" target="_blank" rel="noopener noreferrer">
        YouTube
      </a>
    `);
  }

  container.innerHTML = `
    <article class="release-detail">

      <img
        class="release-artwork"
        src="${release.artwork}"
        alt="${release.artists.join(", ")} - ${release.title}"
      >

      <div class="release-info">

        <h2>${release.title}</h2>

        <p class="release-artists">
          ${artistLinks}
        </p>

        <p>${release.year}</p>

        <p>${release.country}</p>

        <div class="release-links">
          ${links.join("")}
        </div>

      </div>

    </article>
  `;
}