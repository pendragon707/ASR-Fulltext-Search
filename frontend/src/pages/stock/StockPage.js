import {SearchPage} from "../search/SearchPage.js";
import {StockComponent} from "../../components/stock/StockComponent.js";
import {BackButtonComponent} from "../../components/back-button/BackButton.js";
import {HeaderComponent} from "../../components/header/Header.js";
import {FooterComponent} from "../../components/footer/Footer.js";
import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";

export class StockPage {
    constructor(parent, id, data, scroll, query="") {
        this.parent = parent
        this.id = id
        this.data = data
	this.scroll = scroll
	this.name = "none"
	this.query=query
    }

    async getData() {
        return ajax.get(urls.stock(this.id))
    }

    async getScribeData(pk, request) {
        return ajax.post(urls.scribe(pk), request)
    }

    async cancelScribe(request) {
        return ajax.post_scribe(urls.cancel_scribe(), request)
    }

    async patchData(pk, request) {
        return ajax.patch(urls.stock(pk), request)
    }

    async deleteData(pk) {
        return ajax.deleteD(urls.stock(pk))
    }

    async getName() {
        return ajax.get(urls.name())
    }

    clickBack() {
	const searchPage = new SearchPage(this.parent)
        searchPage.render(this.data, this.scroll, this.query)
    }

    async deleteCard(e) {
        const cardId = e.target.dataset.id
        await this.deleteData(cardId)

	for( var i = 0; i < this.data.results.length; i++)
	{
             if ( this.data.results[i].file_id === parseInt(this.id)) {
                 this.data.results.splice(i, 1);
              }
        }

	this.clickBack()
    }

    async scribeCard(item, e) {
        const id = item.file_id
        const filename = item.title

        console.log(item)
        console.log(filename)

	if (item.being_transcribed === false) 
	    {
		// Начать расшифровку
		e.target.firstChild.data = "Отмена"
		item.being_transcribed = true 

                const request = {name: this.name}
                console.log( this.name )
                const answer = await this.getScribeData(id, request)

		// без API-сервера    
//		await this.patchData(id, {being_transcribed: true})
//
//		const request = {id: id, name: this.name, filename: filename+".wav"}
//	
//		const answer = await this.getScribeData(request)

		this.render()
	    }
	else
	    {
		// Отменить расшифровку - здесь напрямую к ASR-серверу
		// для целостности лучше добавить метод отмены на API-сервере
		e.target.firstChild.data = "Расшифровать"
		const request = {id: id}
		const answer = await this.cancelScribe(request)
		console.log(answer)

		item.being_transcribed = false
		await this.patchData(id, {being_transcribed: false})
	    }
    }

    async goAuth(e) {
        const response = await this.postOutAuth({})
        console.log( response )

        window.location.href = "auth"
    }

    get page() {
        return document.getElementById('stock-page')
    }

    getHTML() {
        return (
            `
                <div id="stock-page">
                </div>
            `
        )
    }

    async render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        this.name = await this.getName()
	
	const header = new HeaderComponent(this.page)
        header.render(this.name, this.goAuth.bind(this))

        const backButton = new BackButtonComponent(this.page)
        backButton.render(this.clickBack.bind(this))

        const data = await this.getData()
        const stock = new StockComponent(this.page)
        stock.render(data, this.scribeCard.bind(this, data), this.deleteCard.bind(this))

	const count = 1;
	const footer = new FooterComponent(this.page)
        footer.render(count)
    }
}
