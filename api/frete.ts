import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ erro: 'Método não permitido' })
    }

    const { cep } = req.body

    // Validação simples de CEP (99999-999)
    const cepRegex = /^[0-9]{5}-[0-9]{3}$/

    if (!cep || !cepRegex.test(cep)) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'CEP inválido. Formato esperado: 99999-999'
        })
    }

    // Função helper para gerar valores aleatórios entre 50 e 150
    const gerarValorFrete = () => {
        return Number((Math.random() * (150 - 50) + 50).toFixed(2))
    }

    const opcoesFrete = [
        {
            servico: 'Correios - PAC',
            valor: gerarValorFrete(),
            prazo: '5 a 10 dias úteis'
        },
        {
            servico: 'Correios - Sedex',
            valor: gerarValorFrete(),
            prazo: '2 a 4 dias úteis'
        },
        {
            servico: 'Transportadora XPTO',
            valor: gerarValorFrete(),
            prazo: '3 a 7 dias úteis'
        }
    ]

    return res.status(200).json({
        sucesso: true,
        cep,
        fretes: opcoesFrete
    })
}
