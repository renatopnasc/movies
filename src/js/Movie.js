export class Movie {
  static search(name) {
    const endpoint = `https://api.themoviedb.org/3/search/movie?query=${name}&api_key=2ec2af68b29d4bb7ff593e6e81aa5b66`;

    return fetch(endpoint)
      .then((data) => data.json())
      .then((json) => {
        const { poster_path, title, release_date } = json.results[0];
        return { poster_path, title, release_date };
      });
  }
}

export class ListMovie {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  async add(movie) {
    const movieObj = await Movie.search(movie);

    if (movieObj.poster_path === undefined) {
      return;
    }

    this.entries = [movieObj, ...this.entries];

    this.update();
  }

  load() {
    this.entries = [];
  }
}

export class ListMovieView extends ListMovie {
  constructor(root) {
    super(root);

    this.tbody = document.querySelector("table tbody");

    this.update();
    this.onAdd();
  }

  onAdd() {
    const addMovieBtn = this.root.querySelector(".search button");
    addMovieBtn.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value);
    };
  }

  delete(title) {
    const filteredMovieList = this.entries.filter((movie) => {
      return movie.title !== title;
    });

    this.entries = filteredMovieList;

    this.update();
  }

  update() {
    this.removeAllTr();

    this.entries.forEach(({ poster_path, title, release_date }) => {
      const row = this.createRow(poster_path, title, release_date);

      this.tbody.append(row);

      row.querySelector("button").onclick = () => {
        const isOK = confirm("Deseja remover o filme da lista?");

        if (isOK) this.delete(title);
      };
    });
  }

  createRow(img, title, date) {
    const tr = document.createElement("tr");

    const data = `
    <td>
      <img
      src="https://image.tmdb.org/t/p/w500${img}"
      alt="Imagem do filme ${title}"
      />
    </td>
    <td>${title}</td>
    <td>${date}</td>
    <td>
      <button class="ph ph-trash"></button>
    </td>`;

    tr.innerHTML = data;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => tr.remove());
  }
}
