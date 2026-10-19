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

        const { nome, email, senha, confirmacaoSenha } = body

        // 1. Validação: campos obrigatórios (400)
        if (!nome || !email || !senha || !confirmacaoSenha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Todos os campos são obrigatórios.'
            })
        }

        const emailNormalizado = String(email).trim().toLowerCase()

        // 2. Validação: e-mail com formato válido (400)
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!regexEmail.test(emailNormalizado)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'E-mail inválido.'
            })
        }

        // 3. Simulação de e-mail já cadastrado (409 Conflict)
        const emailsCadastrados = ['admin@email.com', 'joao@example.com', 'teste@email.com']
        if (emailsCadastrados.includes(emailNormalizado)) {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'Este e-mail já está cadastrado.'
            })
        }

        // 4. Validação: tamanho mínimo da senha (422 Unprocessable Entity)
        if (String(senha).length < 6) {
            return res.status(422).json({
                sucesso: false,
                mensagem: 'A senha deve ter no mínimo 6 caracteres.'
            })
        }

        // 5. Validação: senhas iguais (400)
        if (senha !== confirmacaoSenha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'As senhas não são idênticas.'
            })
        }

        // Sucesso (201 Created)
        return res.status(201).json({
            sucesso: true,
            mensagem: 'Usuário registrado com sucesso.'
        })
    } catch (err) {
        console.error('Register error', err)
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno no servidor.'
        })
    }
}
