import { isDev } from "./helpers";



 export const Pricingplans = [
    {
        id:'basic',
        name:'Basic',
        price:9,
        description:'perfect for occasional',
        items: ['5 PDF summary per month'],
        paymentLink: isDev ? 'https://buy.stripe.com/test_4gM4gBaaH7fa3Mvfwg18c00': '',
        priceId: isDev ? 'price_1RXgN2QGYQAJ3PFviLLzWynd': '',
    },
    {
        id: 'pro',
        name:'Pro',
        price: 19,
        description:'For proffesional and teams',
        items:['Unlimited PDF summaries','Priority processing','24/7 priority support','markdown export'],
        paymentLink:isDev ? 'https://buy.stripe.com/test_aFa00l5Ur6b6er91Fq18c01': '',
        priceId:isDev ? 'price_1RXgPDQGYQAJ3PFvWPKmectB': '',
    },
];
