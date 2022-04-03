// import {LoadMoreButtonComponent} from "../load-more-button/LoadMoreButton.js";
export class FooterComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return (
            `
	    <div class="before-footer">
	    </div>

	    <div>
		<footer class="page-footer font-small special-color-dark pt-4">
		  <div class="footer-copyright text-center py-3">© Улучшенная поддержка древних богов 
		  </div>
		</footer>
	    </div>
            `
        )
    }

    async render(count) {
	if (count === 0) {
        	this.parent.insertAdjacentHTML('beforeend', '<p class="mx-auto" style="text-align: center">Нет файлов</p>')
        }

//        if (next != null ) {
//                 const load_more_button = new LoadMoreButtonComponent(this.parent)
//                 load_more_button.render(this.loadNext.bind(this, next))
//         }

        const html = this.getHTML(count)
        this.parent.insertAdjacentHTML('afterend', html)
    }
}
