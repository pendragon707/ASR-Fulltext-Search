export class CardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return (
            `
                <div class="card" style="width: 300px;">
                    <div class="card-body">
                        <h5 class="card-title">
				<a href="stock-card-${data.id}">${data.title}</a>
			</h5>
                        <p class="card-text">${data.transcription}</p>
                    </div>
                </div>
            `
        )
    }

    render(data) {
        const html = this.getHTML(data)
    	this.parent.insertAdjacentHTML('beforeend', html)
    }
}
