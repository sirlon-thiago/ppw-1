import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
        // Preflight
        return res.status(204).end()
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            sucesso: false,
            mensagem: 'Método não permitido. Use POST.'
        })
    }

    try {
        let body = req.body || {}
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body)
            } catch {
                body = {}
            }
        }

        const { itens, cep, metodoPagamento, numeroCartao } = body

        // Catálogo de referência para validar existência, preço e estoque
        const catalogo: Record<number, { name: string; price: number; stock: number }> = {
            1: { name: 'Camiseta Premium', price: 79.90, stock: 15 },
            2: { name: 'Notebook XFast 15', price: 4599.00, stock: 5 },
            3: { name: 'Fone de Ouvido Bass+', price: 299.90, stock: 12 },
            4: { name: 'Tênis Runner Pro', price: 499.90, stock: 8 },
            5: { name: 'Cafeteira Automática', price: 899.00, stock: 6 },
            6: { name: 'Smartwatch FitBand', price: 649.90, stock: 10 },
            7: { name: 'Mouse Gamer Ultra', price: 189.90, stock: 20 },
            8: { name: 'Mochila Adventure', price: 229.90, stock: 9 },
            9: { name: 'Cadeira Ergonômica Pro', price: 1299.00, stock: 0 },
            10: { name: 'Monitor WideVision 27', price: 1799.00, stock: 4 }
        }

        // 1. Validar carrinho vazio ou formato inválido (400 Bad Request)
        if (!Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O carrinho está vazio. Adicione pelo menos um item.'
            })
        }

        // 2. Validar CEP e método de pagamento (400 Bad Request)
        const cepRegex = /^[0-9]{5}-[0-9]{3}$/
        const cepStr = String(cep || '').trim()
        if (!cepStr || !cepRegex.test(cepStr)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'CEP inválido ou não informado. Formato esperado: 99999-999'
            })
        }

        const metodosValidos = ['pix', 'boleto', 'cartao']
        const metodoNorm = String(metodoPagamento || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()

        if (!metodosValidos.includes(metodoNorm)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Método de pagamento inválido. Use: pix, boleto ou cartao.'
            })
        }

        // 3. Validar cada item do pedido (400, 404, 422)
        let totalItens = 0
        let valorProdutos = 0

        for (const item of itens) {
            const id = Number(item?.id)
            const quantidade = Number(item?.quantidade)

            if (!id || isNaN(quantidade) || quantidade <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Cada item deve conter um "id" válido e "quantidade" maior que zero.'
                })
            }

            const produto = catalogo[id]
            if (!produto) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: `Produto com ID ${id} não encontrado.`
                })
            }

            if (quantidade > produto.stock) {
                return res.status(422).json({
                    sucesso: false,
                    mensagem: `Estoque insuficiente para "${produto.name}" (disponível: ${produto.stock}).`
                })
            }

            totalItens += quantidade
            valorProdutos += produto.price * quantidade
        }

        // 4. Simulação de pagamento recusado no cartão (402 Payment Required)
        if (metodoNorm === 'cartao') {
            const cartaoStr = String(numeroCartao || '').trim()
            if (!cartaoStr) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Para pagamento com cartão, informe o campo "numeroCartao".'
                })
            }

            if (cartaoStr.endsWith('0000')) {
                return res.status(402).json({
                    sucesso: false,
                    mensagem: 'Pagamento recusado pela operadora do cartão.'
                })
            }
        }

        // 5. Pedido aprovado (201 Created)
        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000)
        const protocolo = `PED-2026-${numeroAleatorio}`

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Pedido realizado com sucesso!',
            pedido: {
                protocolo,
                status: 'Aprovado',
                cep: cepStr,
                metodoPagamento: metodoNorm,
                totalItens,
                valorProdutos: Number(valorProdutos.toFixed(2))
            }
        })
    } catch (err) {
        console.error('Checkout error', err)
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno no servidor.'
        })
    }
}
