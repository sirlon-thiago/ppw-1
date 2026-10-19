import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
        // Preflight
        return res.status(204).end()
    }

    if (req.method !== 'DELETE') {
        return res.status(405).json({
            sucesso: false,
            mensagem: 'Método não permitido. Use DELETE.'
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

        // Aceita o protocolo tanto via query string (?protocolo=...) quanto via body JSON
        const protocoloRaw = req.query.protocolo || body.protocolo
        const protocolo = String(protocoloRaw || '').trim().toUpperCase()

        // 1. Protocolo obrigatório (400 Bad Request)
        if (!protocolo) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O protocolo do pedido é obrigatório.'
            })
        }

        // 2. Pedido não encontrado (404 Not Found)
        if (protocolo === 'PED-0000') {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Pedido não encontrado.'
            })
        }

        // 3. Pedido já enviado / não pode ser cancelado (422 Unprocessable Entity)
        if (protocolo === 'PED-ENVIADO') {
            return res.status(422).json({
                sucesso: false,
                mensagem: 'Não é possível cancelar um pedido que já foi enviado para a transportadora.'
            })
        }

        // 4. Sucesso (200 OK)
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Pedido cancelado com sucesso.',
            protocolo
        })
    } catch (err) {
        console.error('Delete order error', err)
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno no servidor.'
        })
    }
}
