import {SearchPage} from "./pages/search/SearchPage.js";

import {LoadButtonComponent} from "./components/load-button/LoadButton.js";
import {InputComponent} from "./components/input/Input.js";

import {ajax} from "./modules/ajax.js";
import {urls} from "./modules/urls.js";

const root = document.getElementById('root');

async getSearchData(query) {
    return ajax.get(urls.search_stocks(query))
}

loadFile(e) {
}

async search(q) {
      if (q.key === 'Enter') {
          console.log(q.target.value);

          const data = await getSearchData(q.target.value)
	  const searchPage = new SearchPage(root)
	  searchPage.render(data)
      }
}


const load_button = new LoadButtonComponent(root)
load_button.render(loadFile.bind(root))

const input = new InputComponent(root)
input.render(search.bind(root))

const searchPage = new SearchPage(root)
const data = await ajax.get(urls.stocks())

searchPage.render(data)
