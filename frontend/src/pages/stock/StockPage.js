export class StockPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
    }

    getData() {
        return {
            id: 1,
            title: "Акция",
            transcription: "Такой акции вы еще не видели"
        }
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

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

	const data = this.getData()
    	const stock = new StockComponent(this.page)
    	stock.render(data)
    }
}
