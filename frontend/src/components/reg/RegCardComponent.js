export class RegCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        document
            .getElementById(`reg-button`)
            .addEventListener("click", listener)
    }

    getHTML() {
		    
        return (
            `
	    <div style="margin: 0 auto; margin-top: 50px;">
	    <form id="reg">
	    	  <h1>Регистрация</h1>

		  <div class="form-outline mb-4">
		    <label class="form-label" for="login">Имя</label>
		    <input type="email" id="login" class="form-control" />
		  </div>
		
		  <div class="form-outline mb-3">
		    <label class="form-label" for="password">Пароль</label>
		    <input type="password" id="password" class="form-control" />
		  </div>

		  <div class="form-outline mb-3">
		    <label class="form-label" for="password">Подтвердите пароль</label>
		    <input type="password" id="password-confirm" class="form-control" />
		  </div>

		  <div class="form-outline mb-1">
		    <label id="alert-input"></label>
		  </div>

		  <button type="button" id="reg-button" class="btn auth-button btn-block mb-4">Регистрация</button>
		
		</form>
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
