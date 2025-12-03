import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
    // Lista de nomes fictícios para produtos
    const productNames = [
        "Camiseta Premium",
        "Notebook XFast 15",
        "Fone de Ouvido Bass+",
        "Tênis Runner Pro",
        "Cafeteira Automática",
        "Smartwatch FitBand",
        "Mouse Gamer Ultra",
        "Mochila Adventure",
        "Cadeira Ergonômica Pro",
        "Monitor WideVision 27"
    ]

    // Função para gerar preços aleatórios entre min e max
    function randomPrice(min: number, max: number) {
        return parseFloat((Math.random() * (max - min) + min).toFixed(2))
    }

    // Lorem ipsum simples
    const loremIpsum =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet accumsan urna. Donec ultricies nulla at nibh vehicula, a placerat libero dapibus."

    // Gerar lista de produtos
    const products = productNames.map((name, index) => {
        const id = index + 1
        return {
            id,
            name,
            description: loremIpsum,
            price: randomPrice(50, 500),
            image: `https://picsum.photos/seed/product${id}/300/200`
        }
    })

    return res.status(200).json({
        success: true,
        total: products.length,
        products
    })
}
