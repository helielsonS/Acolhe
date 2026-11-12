import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, FileText, CheckCircle } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fcfaf7] border border-stone-200 rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#f4efe6] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#134e5e]" />
            <div>
              <h2 className="text-lg font-editorial font-bold text-[#134e5e]">
                Política de Privacidade & Proteção de Identidade
              </h2>
              <p className="text-xs text-stone-500">
                Compromisso com o sigilo, a segurança e a Lei Geral de Proteção de Dados (LGPD)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-700 leading-relaxed">
          <section className="space-y-1.5">
            <h3 className="font-editorial font-bold text-stone-900 text-sm flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-[#52796f]" />
              1. Proteção Rigorosa da Autoria Anônima
            </h3>
            <p>
              Ao escolher a publicação anônima em <strong>Vozes de Crateús</strong>, qualquer vínculo público entre sua
              conta cadastrada e o relato publicado é estritamente ocultado. Leitores, visitantes e o público em geral
              visualizam unicamente a designação "Relato Anônimo".
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-editorial font-bold text-stone-900 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#52796f]" />
              2. Proteção de Senhas e Credenciais de Acesso
            </h3>
            <p>
              Suas senhas são tratadas com sigilo e nunca são armazenadas em texto claro ou compartilhadas com terceiros. O
              sistema de recuperação de senha utiliza verificação via e-mail pessoal registrado.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-editorial font-bold text-stone-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#52796f]" />
              3. Moderação Prévia Protetiva
            </h3>
            <p>
              A moderação existe prioritariamente como escudo de proteção: revisamos relatos para impedir a exposição
              involuntária de endereços de moradia de vítimas, nomes de menores de idade ou dados bancários que poderiam
              colocar pessoas em risco.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-editorial font-bold text-stone-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#52796f]" />
              4. Direitos do Titular (LGPD) e Portabilidade
            </h3>
            <p>
              Em conformidade com a Lei nº 13.709/2018 (LGPD), você pode a qualquer momento atualizar seus dados no Painel
              de Perfil, exportar todos os seus dados em formato JSON ou solicitar a exclusão definitiva de seus relatos.
            </p>
          </section>

          <section className="space-y-1.5 bg-[#f4f7f5] p-3.5 rounded-xl border border-[#84a98c]/30 text-[#1e3b30]">
            <h3 className="font-editorial font-bold text-sm">
              5. Botão de Saída Rápida de Emergência (Tecla Esc)
            </h3>
            <p className="text-[11px] leading-relaxed">
              Para pessoas em ambientes de convivência hostil ou sob vigilância de agressores em Crateús, o botão de "Saída
              Rápida" permite desviar instantaneamente a navegação para um site comum de notícias ou previsão do tempo,
              preservando sua integridade.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#134e5e] hover:bg-[#0f3d4a] text-white font-medium rounded-lg text-xs transition-colors"
          >
            Entendido e Concordo
          </button>
        </div>
      </div>
    </div>
  );
};
