class Urls {
    constructor() {
        this.url = 'http://localhost:8000/';
    }

    stocks() {
        return `${this.url}search/file/`
    }

    page_stocks(limit, offset) {
        return `${this.url}search/file/?limit=${limit}&offset=${offset}`
    }

    stock(id) {
        return `${this.url}search/file/${id}/`
    }

    search_stocks(query) {
        return `${this.url}search2/file/${query}/`
    }

    auth() {
        return `${this.url}search/login`
    }

    out_auth() {
        return `${this.url}search/logout`
    }

    reg() {
        return `${this.url}search/user/`
    }

    name() {
        return `${this.url}search/user/get_username/`
    }

    last() {
        return `${this.url}search/file/get_last_file/`
    }

    are_you_scribed(id) {
        return `${this.url}search/file/${id}/are_you_scribed/`
    }

    scribe(id) {
//        return `http://127.0.0.1:5000/scribe`
        return `http://127.0.0.1:8000/search/file/${id}/transcribe/`
    }

    cancel_scribe() {
        return `http://127.0.0.1:5000/cancel`
    }
}

export const urls = new Urls()
