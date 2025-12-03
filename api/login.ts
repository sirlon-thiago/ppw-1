import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
    // headers CORS simples para facilitar testes remotos (ajuste conforme necessário)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        // Preflight
        return res.status(204).end()
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Método não permitido' })
    }

    try {
        // req.body deve ser o JSON enviado (Vercel parseia automaticamente se Content-Type: application/json)
        const { email, senha } = req.body || {}

        if (!email || !senha) {
            return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' })
        }

        // regra de validação simples: "admin" + "admin" => erro (simulação)
        if (String(email).toLowerCase() === 'admin' && String(senha) === 'admin') {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas' })
        }

        // Simula um usuário retornado pela API
        const user = {
            email,
            name: email.split('@')[0] || 'Usuário'
        }

        return res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso',
            user
        })
    } catch (err) {
        console.error('Login error', err)
        return res.status(500).json({ success: false, message: 'Erro interno' })
    }
}
