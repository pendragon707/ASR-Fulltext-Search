export class LoadButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        document
//            .getElementById("load-button")
	    .querySelector('.upload')
            .addEventListener("submit", listener)
    }

    addListeners2(listener) {
        document
            .getElementById("fakeFrame")
            .addEventListener("load", listener)
    }

    getHTML() {
	    // <form class="upload">
        return (
            `

	   <form class="upload" method="post" action="http://localhost:8000/search/file/" target="fakeFrame" enctype=multipart/form-data>
		<input id="load-button" type="file" class="file" name="uploadFile" accept=".wav">
		<input type="submit" />
	    </form>
	    <iframe id="fakeFrame" name="fakeFrame" style="display: none"></iframe>
  	    `
//	    <div class="file-loading">
//    		<input id="load-button" name="input-b7[]" multiple type="file" class="file" data-allowed-file-extensions='["mp3", "wav"]'>
//	    </div>
            
//		<div class="mb-3">
//  			<input class="form-control" type="file" id="load-button" multiple>
//		</div>
            
        )
    }

    render(listener, listener_frame) {
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)
        this.addListeners(listener)
        this.addListeners2(listener_frame)
    }
}
