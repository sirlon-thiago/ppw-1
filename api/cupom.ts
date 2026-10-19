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

        const { codigo, subtotal } = body
        const codigoUpper = String(codigo || '').trim().toUpperCase()

        // 1. Validação: código obrigatório (400 Bad Request)
        if (!codigoUpper) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O código do cupom é obrigatório.'
            })
        }

        // 2. Simulação de cupom expirado (410 Gone)
        if (codigoUpper === 'EXPIRADO') {
            return res.status(410).json({
                sucesso: false,
                mensagem: 'Este cupom já expirou.'
            })
        }

        // 3. Cupom com regra de valor mínimo de compra (422 Unprocessable Entity)
        if (codigoUpper === 'VIP50') {
            const valorSubtotal = Number(subtotal)
            if (isNaN(valorSubtotal) || valorSubtotal < 500) {
                return res.status(422).json({
                    sucesso: false,
                    mensagem: 'Este cupom exige compra mínima de R$ 500,00.'
                })
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Cupom de R$ 50,00 aplicado com sucesso!',
                cupom: {
                    codigo: 'VIP50',
                    tipo: 'fixo',
                    desconto: 50
                }
            })
        }

        // 4. Cupons válidos padrão (200 OK)
        const cuponsValidos: Record<
            string,
            { tipo: 'percentual' | 'frete_gratis'; desconto: number; mensagem: string }
        > = {
            TADS10: {
                tipo: 'percentual',
                desconto: 10,
                mensagem: 'Cupom de 10% de desconto aplicado com sucesso!'
            },
            TADS20: {
                tipo: 'percentual',
                desconto: 20,
                mensagem: 'Cupom de 20% de desconto aplicado com sucesso!'
            },
            FRETEGRATIS: {
                tipo: 'frete_gratis',
                desconto: 100,
                mensagem: 'Cupom de frete grátis aplicado com sucesso!'
            }
        }

        const cupomEncontrado = cuponsValidos[codigoUpper]
        if (cupomEncontrado) {
            return res.status(200).json({
                sucesso: true,
                mensagem: cupomEncontrado.mensagem,
                cupom: {
                    codigo: codigoUpper,
                    tipo: cupomEncontrado.tipo,
                    desconto: cupomEncontrado.desconto
                }
            })
        }

        // 5. Cupom inexistente (404 Not Found)
        return res.status(404).json({
            sucesso: false,
            mensagem: 'Cupom inválido ou não encontrado.'
        })
    } catch (err) {
        console.error('Cupom error', err)
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno no servidor.'
        })
    }
}
