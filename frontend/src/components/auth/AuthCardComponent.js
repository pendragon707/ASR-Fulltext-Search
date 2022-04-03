export class AuthCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        document
            .getElementById(`auth-button`)
            .addEventListener("click", listener)
    }

    addListeners2(listener) {
        document
            .getElementById(`reg-ref`)
            .addEventListener("click", listener)
    }

    getHTML() {
		    
        return (
            `
	    <div style="margin: 0 auto; margin-top: 50px;">
	    <form id="auth">
	    	  <h1>Авторизация</h1>

		  <div class="form-outline mb-4">
		    <label class="form-label" for="login">Имя</label>
		    <input type="email" id="login" class="form-control" />
		  </div>
		
		  <div class="form-outline mb-3">
		    <label class="form-label" for="password">Пароль</label>
		    <input type="password" id="password" class="form-control" />
		  </div>

		  <div class="form-outline mb-1">
		    <label id="alert-input"></label>
		  </div>

		  <button type="button" id="auth-button" class="btn auth-button btn-block mb-4">Войти</button>
		
		  <div class="text-center">
		    <p>Пока нет аккаунта? <a id="reg-ref" href="#">Регистрация</a></p>
		  </div>
		</form>
	    </div>
            `
        )
//		    <p>Пока нет аккаунта? <a id="reg-ref" href="reg">Регистрация</a></p>
    }

    render(listener, listener_reg) {
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)
        this.addListeners(listener)
        this.addListeners2(listener_reg)
    }
}
