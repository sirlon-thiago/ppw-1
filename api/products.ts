import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
        // Preflight
        return res.status(204).end()
    }

    if (req.method !== 'GET') {
        return res.status(405).json({
            sucesso: false,
            mensagem: 'Método não permitido. Use GET.'
        })
    }

    const baseUrl = "https://ppw-1-tads.vercel.app"

    // Lista de produtos fictícios com categoria e estoque
    const products = [
        {
            id: 1,
            name: "Camiseta Premium",
            category: "Vestuário",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet accumsan urna.",
            price: 79.90,
            stock: 15,
            image: `${baseUrl}/images/camiseta.png`
        },
        {
            id: 2,
            name: "Notebook XFast 15",
            category: "Eletrônicos",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultricies nulla at nibh vehicula.",
            price: 4599.00,
            stock: 5,
            image: `${baseUrl}/images/notebook.jpg`
        },
        {
            id: 3,
            name: "Fone de Ouvido Bass+",
            category: "Eletrônicos",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.",
            price: 299.90,
            stock: 12,
            image: `${baseUrl}/images/fone.png`
        },
        {
            id: 4,
            name: "Tênis Runner Pro",
            category: "Calçados",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin gravida dolor sit amet lacus.",
            price: 499.90,
            stock: 8,
            image: `${baseUrl}/images/tenis.jpg`
        },
        {
            id: 5,
            name: "Cafeteira Automática",
            category: "Eletrodomésticos",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam erat volutpat.",
            price: 899.00,
            stock: 6,
            image: `${baseUrl}/images/cafeteira.jpg`
        },
        {
            id: 6,
            name: "Smartwatch FitBand",
            category: "Eletrônicos",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non nulla sit amet.",
            price: 649.90,
            stock: 10,
            image: `${baseUrl}/images/smartwatch.jpg`
        },
        {
            id: 7,
            name: "Mouse Gamer Ultra",
            category: "Eletrônicos",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porttitor accumsan tincidunt.",
            price: 189.90,
            stock: 20,
            image: `${baseUrl}/images/mouse.jpg`
        },
        {
            id: 8,
            name: "Mochila Adventure",
            category: "Acessórios",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis.",
            price: 229.90,
            stock: 9,
            image: `${baseUrl}/images/mochila.jpg`
        },
        {
            id: 9,
            name: "Cadeira Ergonômica Pro",
            category: "Móveis",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
            price: 1299.00,
            stock: 0, // Produto esgotado para testes de front-end e checkout
            image: `${baseUrl}/images/cadeira.jpg`
        },
        {
            id: 10,
            name: "Monitor WideVision 27",
            category: "Eletrônicos",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit.",
            price: 1799.00,
            stock: 4,
            image: `${baseUrl}/images/monitor.jpg`
        }
    ]

    const { id, category, categoria, search, busca } = req.query

    // 1. Busca de produto específico por ID (?id=1)
    if (id !== undefined) {
        const productId = Number(id)
        const product = products.find((p) => p.id === productId)

        if (!product) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado."
            })
        }

        return res.status(200).json({
            sucesso: true,
            product
        })
    }

    // Função auxiliar para normalizar strings (sem acentos e minúscula)
    const normalize = (str: string) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()

    let filtered = [...products]

    // 2. Filtro por categoria (?category=... ou ?categoria=...)
    const filtroCategoria = category || categoria
    if (filtroCategoria) {
        const catNorm = normalize(String(filtroCategoria))
        filtered = filtered.filter((p) => normalize(p.category) === catNorm)
    }

    // 3. Filtro por termo de busca (?search=... ou ?busca=...)
    const termoBusca = search || busca
    if (termoBusca) {
        const searchNorm = normalize(String(termoBusca))
        filtered = filtered.filter(
            (p) =>
                normalize(p.name).includes(searchNorm) ||
                normalize(p.category).includes(searchNorm)
        )
    }

    return res.status(200).json({
        sucesso: true,
        total: filtered.length,
        products: filtered
    })
}
