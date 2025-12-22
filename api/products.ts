import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        // Preflight
        return res.status(204).end()
    }

    const baseUrl = "https://ppw-1-tads.vercel.app"

    // Lista de produtos fictícios
    const products = [
        {
            id: 1,
            name: "Camiseta Premium",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet accumsan urna.",
            price: 79.90,
            image: `${baseUrl}/images/camiseta.png`
        },
        {
            id: 2,
            name: "Notebook XFast 15",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultricies nulla at nibh vehicula.",
            price: 4599.00,
            image: `${baseUrl}/images/notebook.jpg`
        },
        {
            id: 3,
            name: "Fone de Ouvido Bass+",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.",
            price: 299.90,
            image: `${baseUrl}/images/fone.png`
        },
        {
            id: 4,
            name: "Tênis Runner Pro",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin gravida dolor sit amet lacus.",
            price: 499.90,
            image: `${baseUrl}/images/tenis.jpg`
        },
        {
            id: 5,
            name: "Cafeteira Automática",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam erat volutpat.",
            price: 899.00,
            image: `${baseUrl}/images/cafeteira.jpg`
        },
        {
            id: 6,
            name: "Smartwatch FitBand",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non nulla sit amet.",
            price: 649.90,
            image: `${baseUrl}/images/smartwatch.jpg`
        },
        {
            id: 7,
            name: "Mouse Gamer Ultra",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porttitor accumsan tincidunt.",
            price: 189.90,
            image: `${baseUrl}/images/mouse.jpg`
        },
        {
            id: 8,
            name: "Mochila Adventure",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis.",
            price: 229.90,
            image: `${baseUrl}/images/mochila.jpg`
        },
        {
            id: 9,
            name: "Cadeira Ergonômica Pro",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
            price: 1299.00,
            image: `${baseUrl}/images/cadeira.jpg`
        },
        {
            id: 10,
            name: "Monitor WideVision 27",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit.",
            price: 1799.00,
            image: `${baseUrl}/images/monitor.jpg`
        }
    ]

    return res.status(200).json({
        success: true,
        total: products.length,
        products
    })
}
