import {StockPage} from "../stock/StockPage.js";
import {SearchPage} from "../search/SearchPage.js";
import {StockCardComponent} from "../../components/stock-card/StockCardComponent.js";
import {LoadButtonComponent} from "../../components/load-button/LoadButton.js";
import {InputComponent} from "../../components/input/Input.js";
import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    async getData() {
        return ajax.get(urls.stocks())
    }

    clickCard(e) {
        const cardId = e.target.dataset.id

        const stockPage = new StockPage(this.parent, cardId)
        stockPage.render()
    }

    scribeCard(e) {
        const id = e.target.dataset.id
        const filename = e.target.dataset.title

	console.log(id)
    }

    loadFile(e) {
    }

    async search(q) {
	if (q.key === 'Enter') {
	    console.log(q.target.value);

	    const response = await fetch(`http://localhost:8000/search2/file/${q.target.value}/`);
            const data = await response.json();
            console.log(data.count)
           
            const searchPage = new SearchPage(this.parent)
            searchPage.render(data)
	}
    }

    get page() {
        return document.getElementById('main-page')
    }

    getHTML() {
        return (
            `
                <div id="main-page" class="d-flex flex-wrap"><div/>
            `
        )
    }

    async render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

	const load_button = new LoadButtonComponent(this.page)
	load_button.render(this.loadFile.bind(this))

	const input = new InputComponent(this.page)
	input.render(this.search.bind(this))

        const data = await this.getData()
	console.log(data.count);

        data.data.results.forEach((item) => {
            const stockCard = new StockCardComponent(this.page)
            stockCard.render(item, this.clickCard.bind(this), this.scribeCard.bind(this))
        })
    }
}
