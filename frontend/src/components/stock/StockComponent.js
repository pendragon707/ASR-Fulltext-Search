import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";

export class StockComponent {
    constructor(parent) {
        this.parent = parent
    }

    addListeners(data, listener_scribe) {
        document
            .getElementById(`scribe-card-${data.file_id}`)
            .addEventListener("click", listener_scribe)
    }

    addListeners2(data, listener_delete) {
        document
            .getElementById(`delete-card-${data.file_id}`)
            .addEventListener("click", listener_delete)
    }

    getHTML(data) {
	const PATH_STORAGE = 'http://localhost:8000/media/'
	const path = encodeURI(PATH_STORAGE.concat(data.title, '.wav'))
//	const path = encodeURI(PATH_STORAGE.concat(data.owner, '/', data.title, '.wav'))
	console.log(path)
	
        return (
            `
                <div class="mb-3" style="width: 1000px;">
                    <div class="row g-0">
                        <div class="col-md-2">
                        </div>

                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${data.title}</h5>
				<audio controls="controls">
				  	<source src=${path} type="audio/wav">
				  	Ваш браузер не поддерживает элемент <code>audio</code>.
				</audio>
                                <p id="transcription-${data.file_id}" class="card-text mb-1">${ data.transcription }</p>
                            </div>
			    	<button class="btn btn-outline-secondary" id="scribe-card-${data.file_id}" data-id="${data.file_id}">Расшифровать</button>
				<button class="btn btn-outline-secondary" id="delete-card-${data.file_id}" data-id="${data.file_id}"><i class="bi bi-trash"></i>Удалить</button>
                        </div>

                    </div>
                </div>
            `
        )
    }

    render(data, listener_scribe, listener_delete) {
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
	
	this.addListeners(data, listener_scribe)
	this.addListeners2(data, listener_delete)
    }
}
