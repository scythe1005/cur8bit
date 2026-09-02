let allReleases = [];

fetch("data/releases.json")
  .then(response => response.json())
  .then(releases => {

    allReleases = releases;

    setupFilters(releases);
    applyFilters();

  })
  .catch(error => {
    console.error("Failed to load releases:", error);
  });


function setupFilters(releases) {

  const artistFilter = document.querySelector("#artist-filter");
  const countryFilter = document.querySelector("#country-filter");

  const artists = new Set();
  const countries = new Set();

  releases.forEach(release => {

    release.artists.forEach(artist => {
      artists.add(artist);
    });

    if (release.country) {
      countries.add(release.country);
    }

  });


  Array.from(artists)
    .sort((a, b) => a.localeCompare(b))
    .forEach(artist => {

      const option = document.createElement("option");

      option.value = artist;
      option.textContent = artist;

      artistFilter.appendChild(option);

    });


  Array.from(countries)
    .sort((a, b) => a.localeCompare(b))
    .forEach(country => {

      const option = document.createElement("option");

      option.value = country;
      option.textContent = country;

      countryFilter.appendChild(option);

    });


  document.querySelectorAll("#filters select")
    .forEach(select => {
      select.addEventListener("change", applyFilters);
    });
}


function applyFilters() {

  const artist = document.querySelector("#artist-filter").value;
  const country = document.querySelector("#country-filter").value;
  const vocal = document.querySelector("#vocal-filter").value;
  const sort = document.querySelector("#sort-select").value;


  let filtered = allReleases.filter(release => {

    const artistMatch =
      artist === "all" ||
      release.artists.includes(artist);

    const countryMatch =
      country === "all" ||
      release.country === country;

    const vocalMatch =
      vocal === "all" ||
      release.vocal === vocal;

    return artistMatch && countryMatch && vocalMatch;
  });


  // Added順
  if (sort === "added-newest") {

    filtered.sort((a, b) =>
      (b.added || "").localeCompare(a.added || "")
    );

  } else if (sort === "added-oldest") {

    filtered.sort((a, b) =>
      (a.added || "").localeCompare(b.added || "")
    );


  // Release Date順
  } else if (sort === "release-newest") {

    filtered.sort((a, b) => {

      const dateCompare =
        (b.release_date || "").localeCompare(
          a.release_date || ""
        );

      // Release Dateが同じならAddedの新しい順
      if (dateCompare !== 0) {
        return dateCompare;
      }

      return (b.added || "").localeCompare(
        a.added || ""
      );
    });

  } else if (sort === "release-oldest") {

    filtered.sort((a, b) => {

      const dateCompare =
        (a.release_date || "").localeCompare(
          b.release_date || ""
        );

      // Release Dateが同じならAddedの古い順
      if (dateCompare !== 0) {
        return dateCompare;
      }

      return (a.added || "").localeCompare(
        b.added || ""
      );
    });


  // Artist順
  } else if (sort === "artist") {

    filtered.sort((a, b) =>
      a.artists[0].localeCompare(
        b.artists[0],
        undefined,
        { sensitivity: "base" }
      )
    );


  // Title順
  } else if (sort === "title") {

    filtered.sort((a, b) =>
      a.title.localeCompare(
        b.title,
        undefined,
        { sensitivity: "base" }
      )
    );

  }


  displayReleases(filtered);
}


function displayReleases(releases) {

  const grid = document.querySelector("#release-grid");

  grid.innerHTML = "";

  if (releases.length === 0) {

    grid.innerHTML = `
      <p>No releases found.</p>
    `;

    return;
  }


  releases.forEach(release => {

    const item = document.createElement("article");

    item.className = "release-card";


    const artistLinks = release.artists.map(artist => `
      <a
        class="artist-link"
        href="artist.html?name=${encodeURIComponent(artist)}"
      >
        ${artist}
      </a>
    `).join(", ");


    item.innerHTML = `
      <a href="release.html?id=${encodeURIComponent(release.id)}">

        <img
          src="${release.artwork}"
          alt="${release.artists.join(", ")} - ${release.title}"
        >

        <h3>${release.title}</h3>

      </a>

      <p>${artistLinks}</p>
      <p>${release.year}</p>
    `;


    grid.appendChild(item);

  });
}