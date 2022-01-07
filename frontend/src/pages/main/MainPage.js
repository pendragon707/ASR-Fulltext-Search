import {CardComponent} from "../../components/scard/CardComponent.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    getData() {
    	return ajax.get(urls.stocks())
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

    render() {
	this.parent.innerHTML = ''
    	const html = this.getHTML()
    	this.parent.insertAdjacentHTML('beforeend', html)
	    
	const data = await this.getData()
	data.forEach((item) => {
		const scard = new CardComponent(this.parent)
    		scard.render(data)
	})
    }
}
