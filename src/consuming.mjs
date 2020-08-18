import setText, {appendText, showWaiting, hideWaiting} from "./results.mjs";

export function get() {
    axios.get('/orders/1')
        .then(({data}) => setText(data.orderStatusId));
}

export function getCatch() {
    axios.get('/orders/123')
        .then(({data}) => setText(data.orderStatusId))
        .catch(err => setText(`Error: ${err}`));
}

export function chain() {
    axios.get('/orders/1')
        .then(({data}) => {
            return axios.get(`/addresses/${data.shippingAddress}`);
        })
        .then(({data}) => {
            const {street, city, state, zipCode} = data;
            setText(`${street}, ${city}, ${state}, ${zipCode}`);
        });
}

export function chainCatch() {
    axios.get('/orders/1')
    .then(({data}) => {
        axios.get(`/addresses/${data.shippingAddress}`);
        throw new Error("Erroring cause no return");
    })
    .catch(err => {
        setText(err);
        return {data: {}};
    })
    .then(({data}) => {
        throw new Error('We want to error out');
        const {street, city, state, zipCode} = data;
        setText(`${street}, ${city}, ${state}, ${zipCode}`);
    })
    .catch(err => setText(err));
}

export function final() {
    axios.get('/orders/1')
    .then(({data}) => {
        showWaiting();
        return axios.get(`/addresses/${data.shippingAddress}`);
    })
    .then(({data}) => {
        const {street, city, state, zipCode} = data;
        setText(`${street}, ${city}, ${state}, ${zipCode}`);
    })
    .catch(err => {
        setText(err);
    })
    .finally(() => {
        setTimeout(hideWaiting, 1000);
    });
}