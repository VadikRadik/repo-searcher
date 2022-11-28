
const onInputSearchFieldHandler = function(event) {
    const repoKeyWords = event.target.value;
    if (repoKeyWords.length) {
        fetch(`https://api.github.com/search/repositories?q=${event.target.value}&per_page=5`)
            .then(response => response.json())
            .then(repos => refillAutocompleteList(repos.items))
            .catch(err => console.log(err));
    } else {
        refillAutocompleteList([]);
    }
}

const createDebounceOnInputSearchHandler = function(delay) {
    let timerId;

    return function(event) {
        refillAutocompleteList([]);
        if (timerId !== undefined) {
            clearTimeout(timerId);
        }

        timerId = setTimeout(onInputSearchFieldHandler, delay, event);
    }
}

const createAutocompleteItems = function(repos) {
    const itemTemplate = document.querySelector("#autocomplete-list-item-template").content;
    const templateElement = itemTemplate.querySelector(".autocomplete-list-item");
    let autocompleteItems = [];

    for (let repo of repos) {
        let item = templateElement.cloneNode(true);
        item.textContent = repo.name;
        item.repo = repo;
        autocompleteItems.push(item);
    }

    return autocompleteItems;
}

const refillAutocompleteList = function(repos) {
    const list = document.querySelector(".autocomplete-list");
    const newItems = createAutocompleteItems(repos);
    list.replaceChildren(...newItems);
}

const createRepoCard = function(repo) {
    const cardsContainer = document.querySelector(".repo-list");
    const cardTemplate = document.querySelector("#repo-card-template").content;
    const newCard = cardTemplate.querySelector(".repo-card").cloneNode(true);

    const link = newCard.querySelector(".repo-card__repo-link");
    link.setAttribute("href", repo.html_url);
    link.textContent = repo.name;
    const infoFields = newCard.querySelectorAll(".repo-card__info-line");
    infoFields[1].textContent = `Owner: ${repo.owner.login}`;
    infoFields[2].textContent = `Stars: ${repo.stargazers_count}`;

    cardsContainer.appendChild(newCard);
}

const searchField = document.querySelector(".search-input");
searchField.addEventListener("input", createDebounceOnInputSearchHandler(2000));

const autocompleteList = document.querySelector(".autocomplete-list");
autocompleteList.addEventListener("click", function(event) {
    if (!event.target.matches(".autocomplete-list-item")) {
        return;
    }

    createRepoCard(event.target.repo);
    searchField.value = "";
    refillAutocompleteList([]);
});

const repoList = document.querySelector(".repo-list");
repoList.addEventListener("click", function(event) {
    if (event.target.matches(".repo-card__card-remove")) {
        event.target.closest(".repo-card").remove();
    }
})

