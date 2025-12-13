import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        // Preflight
        return res.status(204).end()
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ sucesso: false, erro: 'Método não permitido. Use POST.' })
    }

    const { nome, email, senha, confirmacaoSenha } = req.body || {}

    // Validação: campos obrigatórios
    if (!nome || !email || !senha || !confirmacaoSenha) {
        return res.status(400).json({ sucesso: false, erro: 'Todos os campos são obrigatórios.' })
    }

    // Validação: e-mail simples (regex básica)
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regexEmail.test(email)) {
        return res.status(400).json({ sucesso: false, erro: 'E-mail inválido.' })
    }

    // Validação: senhas iguais
    if (senha !== confirmacaoSenha) {
        return res.status(400).json({ sucesso: false, erro: 'As senhas não são idênticas.' })
    }

    // Se tudo ok → sucesso
    return res.status(200).json({
        sucesso: true,
        mensagem: 'Usuário registrado com sucesso.'
    })
}
