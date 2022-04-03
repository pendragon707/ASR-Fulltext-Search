export class InputComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        document
            .getElementById("query")
            .addEventListener("keypress", listener)
    }

    getHTML() {
        return (
            `
	    <div class="input-group mb-3">
  		<input id="query" type="text" class="form-control" placeholder="Введите запрос" aria-label="Recipient's username" aria-describedby="basic-addon2">
  		<div class="input-group-append">
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
