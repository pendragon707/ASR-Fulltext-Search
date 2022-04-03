export class LoadMoreButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        document
            .getElementById("load-more-button")
            .addEventListener("click", listener)
    }

    getHTML() {
        return (
            `
	    <div class="container">
		<div class="text-center">
	    	<button id="load-more-button" class="btn load-more-button center-block" type="button">Загрузить ещё</button>
		</div>
	    </div>
  	    `
        )
    }

    render(listener) {
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)
        this.addListeners(listener)
    }
}
