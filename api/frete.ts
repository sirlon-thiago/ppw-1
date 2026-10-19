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

        const { cep } = body

        // 1. Validação de formato de CEP: 99999-999 (400 Bad Request)
        const cepRegex = /^[0-9]{5}-[0-9]{3}$/
        const cepStr = String(cep || '').trim()

        if (!cepStr || !cepRegex.test(cepStr)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'CEP inválido. Formato esperado: 99999-999'
            })
        }

        // 2. Simulação de CEP inexistente (404 Not Found)
        if (cepStr === '00000-000') {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'CEP não encontrado na base de dados.'
            })
        }

        // 3. Simulação de região não atendida (422 Unprocessable Entity)
        if (cepStr.startsWith('99999-')) {
            return res.status(422).json({
                sucesso: false,
                mensagem: 'Não realizamos entregas para esta região.'
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
            cep: cepStr,
            fretes: opcoesFrete
        })
    } catch (err) {
        console.error('Frete error', err)
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno no servidor.'
        })
    }
}
