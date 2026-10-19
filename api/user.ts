import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
        // Preflight
        return res.status(204).end()
    }

    // Aceitar apenas PUT ou PATCH
    if (req.method !== "PUT" && req.method !== "PATCH") {
        return res.status(405).json({
            sucesso: false,
            mensagem: "Método não permitido. Use PUT ou PATCH."
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

        const { nome, email } = body

        // 1. Verificar se nome e email foram enviados (400)
        if (!nome || !email) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Nome e e-mail são obrigatórios."
            })
        }

        const emailNormalizado = String(email).trim().toLowerCase()

        // 2. Regex simples para e-mail válido (400)
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)

        if (!emailValido) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "E-mail inválido."
            })
        }

        // 3. Simulação de conflito de e-mail já em uso por outro usuário (409)
        if (emailNormalizado === 'admin@email.com') {
            return res.status(409).json({
                sucesso: false,
                mensagem: "Este e-mail já está em uso por outro usuário."
            })
        }

        // Sucesso (200)
        return res.status(200).json({
            sucesso: true,
            mensagem: "Dados alterados com sucesso.",
            dados: { nome: String(nome).trim(), email: emailNormalizado }
        })
    } catch (err) {
        console.error('User update error', err)
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno no servidor."
        })
    }
}
