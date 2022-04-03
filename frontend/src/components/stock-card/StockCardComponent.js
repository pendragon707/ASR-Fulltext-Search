import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";

export class StockCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(data, listener) {
        document
            .getElementById(`click-card-${data.file_id}`)
            .addEventListener("click", listener)
    }

    addListeners2(data, listener_scribe) {
        document
            .getElementById(`scribe-card-${data.file_id}`)
            .addEventListener("click", listener_scribe)
    }

    addListeners3(data, listener_delete) {
        document
            .getElementById(`delete-card-${data.file_id}`)
            .addEventListener("click", listener_delete)
    }

    getHTML(data) {
//			<div class="col">
//  				<div class="row-5 text-truncate">
//                        		<p class="card-text">${data.transcription}</p>
//				</div>
//			</div>

//                        <p class="card-text mb-1 text-truncate" style="min-width: 2px">${data.transcription}</p>
//			<a href="#" class="stretched-link">Иди куда-нибудь</a>
		    
        return (
            `
	      <div class="audio-card">
                <div class="card" style="width: 300px;">
                    <div class="card-body">
                        <h5 class="card-title">${data.title}</h5>
                        <p id="transcription-${data.file_id}" class="card-text mb-1" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;overflow: hidden; text-overflow: ellipsis;">${data.transcription}</p>
                        	<button class="btn btn-link" id="click-card-${data.file_id}" data-id="${data.file_id}">Читать далее</button>
			<div class="row g-2">
                        	<button class="btn btn-outline-secondary" id="scribe-card-${data.file_id}" data-id="${data.file_id}">Расшифровать</button>
				<button class="btn btn-outline-secondary" id="delete-card-${data.file_id}" data-id="${data.file_id}"><i class="bi bi-trash"></i>Удалить</button>
			</div>
                    </div>
                </div>
	      </div>
            `
        )
    }

    render(data, listener, listener_scribe, listener_delete) {
        const html = this.getHTML(data)
        this.parent.insertAdjacentHTML('beforeend', html)

        if (data.being_transcribed === true) {
		console.log(data.being_transcribed)
                document.getElementById("scribe-card-"+data.file_id).textContent = "Отмена"
                var refreshT = setInterval(async function() {
                        const answer = await ajax.get(urls.are_you_scribed(data.file_id))
                        console.log(answer)
                        console.log( !(answer.Status === "Success") )
                        if ( answer.Status === "Success" ) {
                                clearInterval(refreshT);
				data.being_transcribed = false
                		document.getElementById("scribe-card-"+data.file_id).textContent = "Расшифровать"
				data.transcription = answer.transcription
                		document.getElementById("transcription-"+data.file_id).textContent = answer.transcription

                        }
                }, 5000);
        }
	else {
                document.getElementById("scribe-card-"+data.file_id).textContent = "Расшифровать"
	}

        if (!(data.highlight === '')) {
		const new_text = data.highlight.toString().replace( '<em>', '<u>').replace( '</em>', '</u>');
		const new_new_text = new_text.replace( '<em>', '<u>').replace( '</em>', '</u>');
		document.getElementById("transcription-"+data.file_id).textContent = new_new_text
		document.getElementById("transcription-"+data.file_id).innerHTML = new_new_text
	}

        this.addListeners(data, listener)
        this.addListeners2(data, listener_scribe)
	this.addListeners3(data, listener_delete)
    }
}
