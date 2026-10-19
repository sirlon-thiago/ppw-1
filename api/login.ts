import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
    // Headers CORS para permitir consumo via fetch() de qualquer origem
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

        const { email, senha } = body

        if (!email || !senha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'E-mail e senha são obrigatórios.'
            })
        }

        // Regra de validação simples: "admin" + "admin" ou senha "errada" => 401
        if (
            (String(email).toLowerCase() === 'admin' && String(senha) === 'admin') ||
            String(senha) === 'senhaerrada'
        ) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Usuário ou senha inválidos.'
            })
        }

        // Simula um usuário retornado pela API
        const usuario = {
            email: String(email),
            nome: String(email).split('@')[0] || 'Usuário'
        }

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Login realizado com sucesso.',
            usuario
        })
    } catch (err) {
        console.error('Login error', err)
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno no servidor.'
        })
    }
}
