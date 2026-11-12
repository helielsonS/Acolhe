import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AVAILABLE_CITIES } from '../data/initialData';
import { X, Lock, Mail, User as UserIcon, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'recovery';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, register, recoverPassword } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'recovery'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Crateús (CE)');
  const [defaultAnonymous, setDefaultAnonymous] = useState(true);

  // Recovery state
  const [recoverySent, setRecoverySent] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMessage(res.error || 'Credenciais inválidas.');
          setIsLoading(false);
          return;
        }
        onClose();
      } else if (mode === 'register') {
        const res = await register(name, email, password, city, defaultAnonymous);
        if (!res.success) {
          setErrorMessage(res.error || 'Erro ao realizar cadastro.');
          setIsLoading(false);
          return;
        }
        onClose();
      } else if (mode === 'recovery') {
        const res = await recoverPassword(email, newPassword || 'NovaSenha2026');
        if (!res.success) {
          setErrorMessage(res.error || 'E-mail não localizado.');
          setIsLoading(false);
          return;
        }
        setRecoverySent(true);
      }
    } catch {
      setErrorMessage('Ocorreu uma falha no processamento seguro.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('senha123');
    setIsLoading(true);
    await login(userEmail, 'senha123');
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fcfaf7] border border-stone-200 rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-200 bg-[#f4efe6] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-editorial font-bold text-[#134e5e]">
              {mode === 'login' && 'Entrar na Plataforma'}
              {mode === 'register' && 'Cadastrar Nova Conta'}
              {mode === 'recovery' && 'Recuperação de Senha'}
            </h2>
            <p className="text-xs text-stone-500">
              Vozes de Crateús · Ambiente com Criptografia e Sigilo
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Login Helpers */}
        {mode === 'login' && (
          <div className="p-3 bg-[#e8efe9]/70 border-b border-stone-200 text-xs">
            <span className="text-[11px] font-semibold text-[#134e5e] block mb-1.5 uppercase tracking-wide">
              Acesso Rápido para Avaliação:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@vozesdecrateus.org')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-50 border border-[#84a98c] rounded text-[11px] font-semibold text-[#134e5e] transition-colors"
              >
                Entrar como Moderador/Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('maria.helena@crateus.ce.gov.br')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-50 border border-stone-300 rounded text-[11px] font-medium text-stone-700 transition-colors"
              >
                Entrar como Cidadã
              </button>
            </div>
          </div>
        )}

        {/* Recovery Success State */}
        {recoverySent ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-editorial font-bold text-stone-900 text-base">
              Link de Redefinição Enviado
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Enviamos as instruções seguras de recuperação para <strong>{email}</strong>. Siga as orientações para definir
              uma nova senha.
            </p>
            <button
              onClick={() => {
                setRecoverySent(false);
                setMode('login');
              }}
              className="mt-3 px-4 py-2 bg-[#134e5e] text-white rounded-lg text-xs font-semibold"
            >
              Voltar ao Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
                {errorMessage}
              </div>
            )}

            {/* Name field (Register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Seu nome ou pseudônimo de escolha"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-[#134e5e]"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="exemplo@crateus.ce.gov.br"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-[#134e5e]"
                />
              </div>
            </div>

            {/* Password field */}
            {mode !== 'recovery' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Senha
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('recovery')}
                      className="text-[11px] text-[#134e5e] hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Sua senha segura"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-[#134e5e]"
                  />
                </div>
              </div>
            )}

            {/* Extra register fields */}
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cidade de Residência
                  </label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-[#134e5e]"
                  >
                    {AVAILABLE_CITIES.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-white border border-stone-200 rounded-lg p-3">
                  <label className="flex items-start gap-2 cursor-pointer text-stone-700 text-xs">
                    <input
                      type="checkbox"
                      checked={defaultAnonymous}
                      onChange={e => setDefaultAnonymous(e.target.checked)}
                      className="mt-0.5 rounded text-[#134e5e] focus:ring-[#134e5e]"
                    />
                    <span>
                      <strong>Manter anonimato por padrão:</strong> Seus relatos futuros não exibirão seu nome publicamente.
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#134e5e] hover:bg-[#0f3d4a] text-white font-semibold rounded-lg text-xs transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>
                {mode === 'login' && 'Entrar na Conta'}
                {mode === 'register' && 'Criar Conta Gratuita'}
                {mode === 'recovery' && 'Enviar Link de Recuperação'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Toggle Modes Footer */}
            <div className="text-center pt-2 text-xs text-stone-600 border-t border-stone-200">
              {mode === 'login' ? (
                <span>
                  Ainda não tem conta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage('');
                    }}
                    className="text-[#134e5e] font-semibold hover:underline"
                  >
                    Cadastre-se aqui
                  </button>
                </span>
              ) : (
                <span>
                  Já possui uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                    }}
                    className="text-[#134e5e] font-semibold hover:underline"
                  >
                    Faça login
                  </button>
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
