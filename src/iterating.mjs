import setText , {appendText} from './results.mjs';
//import { axios } from './axios.min.js';

export async function get(){
    let {data} = await axios.get('/orders/1');
    setText(JSON.stringify(data));
}

export async function getCatch(){
    try {
        let {data} = await axios.get('/orders/123');
        setText(JSON.stringify(data));
    } catch (error) {
        setText(`Cannot get order. ${error}`);
    }
}

export async function chain(){
    let {data} = await axios.get('/orders/1');
    let {data: address} = await axios.get(`/addresses/${data.shippingAddress}`);
    setText(JSON.stringify(address));
}

export async function concurrent(){
    const orderStatus = axios.get('/orderStatuses');
    const orders = axios.get('/orders');

    setText("");

    const {data: statuses} = await orderStatus;
    const {data: order} = await orders;

    appendText(`Statuses: ${JSON.stringify(statuses)}\n`);
    appendText(`Order 1: ${JSON.stringify(order[0])}\n`);

}

export async function parallel(){
    setText("");

    await Promise.all([
        (async () => {
            const {data} = await axios.get('/orderStatuses');
            appendText(JSON.stringify(data));
        })(),
        (async () => {
            const {data} = await axios.get('/orders');
            appendText(JSON.stringify(data[0]));
        })()
    ])
}