import {StockPage} from "../stock/StockPage.js";
import {AuthPage} from "../auth/AuthPage.js";
import {StockCardComponent} from "../../components/stock-card/StockCardComponent.js";
import {LoadButtonComponent} from "../../components/load-button/LoadButton.js";
import {HeaderComponent} from "../../components/header/Header.js";
import {FooterComponent} from "../../components/footer/Footer.js";
import {LoadMoreButtonComponent} from "../../components/load-more-button/LoadMoreButton.js";
import {InputComponent} from "../../components/input/Input.js";
import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";

export class SearchPage {
    constructor(parent) {
        this.parent = parent;
	this.did_first_listing = false;
	this.loading = false;
	this.data = {status: 404, data: {status: 404, results: []}} 
	this.name = 'none';
	this.next = null;
	this.query = ""
    }

    async getData() {
        return ajax.get(urls.stocks())
//        return ajax.get(urls.page_stocks(10,0))
    }

    async postData(request) {
        return ajax.post(urls.stocks(), request)
    }

    async patchData(pk, request) {
        return ajax.patch(urls.stock(pk), request)
    }

    async deleteData(pk) {
        return ajax.deleteD(urls.stock(pk))
    }

    async getSearchData(query) {
        return ajax.get(urls.search_stocks(query))
    }

    async getScribeData(pk, request) {
        return ajax.post(urls.scribe(pk), request)
//        return ajax.post_scribe(urls.scribe(pk, request))
    }

    async cancelScribe(request) {
        return ajax.post_scribe(urls.cancel_scribe(), request)
    }

    async postOutAuth(request) {
        return ajax.post(urls.out_auth(), request)
    }

    async getName() {
        return ajax.get(urls.name())
    }

    async getLastFile() {
        return ajax.get(urls.last())
    }

    async getStatus(id) {
        return ajax.get(urls.are_you_scribed(id))
    }

    async goAuth(e) {
	const response = await this.postOutAuth({})
	console.log( response )

//        const authPage = new AuthPage(this.parent)
//        authPage.render()
	window.location.href = "auth"
    }

    clickCard(e) {
        const cardId = e.target.dataset.id

	const scroll = document.documentElement.scrollTop;
	console.log( scroll )

        const stockPage = new StockPage(this.parent, cardId, this.data, scroll, this.query)
        stockPage.render()
    }

    async deleteCard(e) {
        const cardId = e.target.dataset.id
	console.log( cardId )
	await this.deleteData(cardId)

	for( var i = 0; i < this.data.results.length; i++){ 
            if ( this.data.results[i].file_id === parseInt(cardId)) { 
            	this.data.results.splice(i, 1); 
            }
    	}

	if (!(this.next === null)) {
		const new_data = await ajax.get(this.next)
		if (new_data.results.length === 0) {
			this.next = null;
		}
	}

        this.data.count -= 1
//	this.next = this.data.next

	this.render(this.data)
    }

    async scribeCard(item, e) {
        const id = item.file_id
        const filename = item.title

	if (item.being_transcribed === false) {
		// Начать расшифровку
		e.target.firstChild.data = "Отмена"
		item.being_transcribed = true  


		// API сервер
		const request = {name: this.name}
		console.log( this.name )
		const answer = await this.getScribeData(id, request)

		// вручную, без API-сервера
//		await this.patchData(id, {being_transcribed: true})
//
//		const request = {id: id, name: this.name, filename: filename+".wav"}
//
//		const answer = await this.getScribeData(id, request)
//		console.log(answer)

		this.render(this.data)


// старое ненужное но вдруг
//		item.being_transcribed = false
//		await this.patchData(id, {being_transcribed: false})
//		e.target.firstChild.data = "Расшифровать"
	
//		for( var i = 0; i < this.data.results.length; i++){ 
//	            if ( this.data.results[i].file_id === parseInt(id)) { 
//	            	this.data.results[i].transcription = answer.transcription; 
//	            }
//	    	}
	}

	else
	    {
		// Отменить расшифровку
		// напрямую, не через API-сервер - надо доделать метод на API-сервере
		e.target.firstChild.data = "Расшифровать"
		const request = {id: id}
		const answer = await this.cancelScribe(request)
		console.log(answer)

		item.being_transcribed = false
		await this.patchData(id, {being_transcribed: false})
	    }
    }

    async loadNext(next_page, e) {
	console.log(next_page)
	const new_data = await ajax.get(next_page)

	new_data.results.forEach((item) => {
		this.data.results.push(item)
	})
	
	this.data.next = new_data.next
	this.data.previous = new_data.previous

	this.next = this.data.next

	this.render(this.data)
    }

    loadFile(e) {
	let file = e.target.uploadFile.files[0]
	console.log(file)
	
	this.loading = true;

//	let formData = new FormData()
//   	formData.append('uploadFile', file)
//
//           fetch('http://localhost:8000/search/file/', {
//              method: 'POST',
//              body: formData
//           })
//           .then(resp => resp.json())
//           .then(data => {
//              if (data.errors) {
//                 alert(data.errors)
//              }
//              else {
//                 console.log(data)
//              }
//           })	
    }

    async loadFrame(e) {
	if (this.loading === true) {
    	//	const new_item = await this.getLastFile()
	//	this.data.results.push(new_item)
		this.data = await this.getData()
		this.next = this.data.next
		this.render(this.data)
	}
	this.loading = false;
    }

    async search(q) {
	const query = q.target.value

	if (q.key === 'Enter') {
              console.log(q.target.value);

	      if (q.target.value === '') {
	          // загружать то, что было по умочланию
	          this.data = await this.getData()
		  this.next = this.data.next
	      }
	      else {	
//	    	  this.did_first_listing = true;
	    	  this.data = await this.getSearchData(q.target.value)
		  this.next = this.data.next
		  console.log( this.data )
	      }

	      this.render(this.data, 0, query)
	
	      document.getElementById("query").value = query
	      this.query = query
          }
    }

    get page() {
        return document.getElementById('main-page')
    }

    getHTML() {
        return (
            `<div class="mx-auto" style="width: 940px;">
                <div id="main-page" class="d-flex flex-wrap gap-3"><div/>
	    </div>
            `
        )
    }

    async render(data, scroll=0, query="") {
//	if (this.did_first_listing === false) {
	if (data.status === 404) {
		this.data = await this.getData()
		this.next = this.data.next
		this.name = await this.getName()
	}
	else {
		this.data = data
		this.next = this.data.next
		this.name = await this.getName()
	}
	
//	this.did_first_listing = true

	console.log( this.data )

//	this.data = data

        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

//	console.log(scroll)
//	document.documentElement.scrollTop = scroll
//	document.body.scrollTop = scroll
//	this.page.scrollTop += scroll
//	window.scrollTo(0, scroll)
//	window.scrollBy(0, scroll)
//
	const header = new HeaderComponent(this.page)
        header.render(this.name, this.goAuth.bind(this))
//        header.render(this.goAuth.bind(this))

	const load_button = new LoadButtonComponent(this.page)
        load_button.render(this.loadFile.bind(this), this.loadFrame.bind(this))

	const input = new InputComponent(this.page)
	input.render(this.search.bind(this))
	this.query = query
	document.getElementById("query").value = this.query

        this.data.results.forEach((item) => {
            const stockCard = new StockCardComponent(this.page)
            stockCard.render(item, this.clickCard.bind(this), this.scribeCard.bind(this, item), this.deleteCard.bind(this))
        })
	
//        if (this.data.count === 0) {
//		this.page.insertAdjacentHTML('afterend', '<p style="text-align: center">Нет файлов</p>')
//	}
	
	if (this.next != null ) {
		const load_more_button = new LoadMoreButtonComponent(this.page)
        	load_more_button.render(this.loadNext.bind(this, this.next))
	}

	const footer = new FooterComponent(this.page)
        footer.render(this.data.count)
    }
}
