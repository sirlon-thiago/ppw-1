import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        // Preflight
        return res.status(204).end()
    }

    // Aceitar apenas PUT ou PATCH
    if (req.method !== "PUT" && req.method !== "PATCH") {
        return res.status(405).json({
            sucesso: false,
            mensagem: "Método não permitido. Use PUT ou PATCH."
        });
    }

    const { nome, email } = req.body || {};

    // Verificar se nome e email foram enviados
    if (!nome || !email) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "Nome e e-mail são obrigatórios."
        });
    }

    // Regex simples para e-mail válido
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValido) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "E-mail inválido."
        });
    }

    // Sucesso
    return res.status(200).json({
        sucesso: true,
        mensagem: "Dados alterados com sucesso.",
        dados: { nome, email }
    });
}
