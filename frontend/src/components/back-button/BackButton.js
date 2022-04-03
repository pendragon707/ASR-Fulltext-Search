export class BackButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        document
            .getElementById("back-button")
            .addEventListener("click", listener)
    }

    getHTML() {
        return (
            `
                <button id="back-button" class="btn btn-outlined-secondary" type="button">Назад</button>
            `
        )
    }

    render(listener) {
        const html = this.getHTML()
//        this.parent.insertAdjacentHTML('beforeend', html)
        this.parent.insertAdjacentHTML('beforebegin', html)
        this.addListeners(listener)
    }
}
