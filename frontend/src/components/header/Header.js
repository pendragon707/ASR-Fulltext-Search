import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";

export class HeaderComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        document
            .getElementById("auth-button")
            .addEventListener("click", listener)
    }

    getHTML(name) {
        return (
            `
	    <nav class="navbar navbar-expand-lg fixed-top">
  		<a class="navbar-brand ms-4" href="index">${name}</a>
		<div class="collapse navbar-collapse me-4">
                	<button id="auth-button" class="btn navbar-button" type="button">Выход</button>
		</div>
	    </nav>
		
	    <header class="header">
	    </header>
            `
        )
    }

    async render(name, listener) {
//	const super_name = await ajax.get(urls.name())

        const html = this.getHTML(name)
//        const html = this.getHTML('n')
        this.parent.insertAdjacentHTML('beforebegin', html)
        this.addListeners(listener)
    }
}
