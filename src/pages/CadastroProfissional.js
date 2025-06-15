import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CadastroProfissional.css';
import axios from 'axios';

function CadastroProfissional() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (!nome || !especialidade || !telefone || !email || !senha) {
      alert('Preencha todos os campos!');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Digite um email válido');
      return;
    }

    if (senha.length < 6) {
      alert('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'https://projeto-clinica-cscsgyg9gkd4chbx.brazilsouth-01.azurewebsites.net/profissionais/cadastrar',
        {
          nome,
          especialidade,
          telefone,
          email,
          senha,
        }
      );

      console.log('Resposta da API:', response.data);

      const profissional = response.data;

      if (!profissional.id || !profissional.nome) {
        throw new Error('Dados incompletos retornados da API.');
      }

      localStorage.setItem('idProfissional', profissional.id);
      localStorage.setItem('nomeProfissional', profissional.nome);

      alert('Cadastro realizado com sucesso!');
      navigate('/home-profissional');
    } catch (error) {
      console.error('Erro no cadastro:', error);

      if (
        error.response &&
        error.response.status === 400 &&
        typeof error.response.data === 'string'
      ) {
        alert(error.response.data);
      } else {
        alert('Erro ao cadastrar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    'div',
    { className: 'cadastro-profissional-container' },
    React.createElement(
      'div',
      { className: 'header' },
      React.createElement('h1', null, 'Visage Élégant'),
      React.createElement('img', {
        src: '/assets/imagens/hibisco.png',
        alt: 'Logo Hibisco',
        className: 'logo-hibisco',
      })
    ),
    React.createElement(
      'div',
      { className: 'cadastro-card' },
      React.createElement('h2', null, 'Cadastro Profissional'),
      React.createElement(
        'form',
        { onSubmit: handleCadastro },
        React.createElement('input', {
          type: 'text',
          placeholder: 'Nome',
          value: nome,
          onChange: (e) => setNome(e.target.value),
          required: true,
        }),
        React.createElement(
          'select',
          {
            value: especialidade,
            onChange: (e) => setEspecialidade(e.target.value),
            required: true,
          },
          React.createElement('option', { value: '' }, 'Selecione a Especialidade'),
          React.createElement('option', { value: 'Cirurgia Plástica' }, 'Cirurgia Plástica'),
          React.createElement('option', { value: 'Dermatologia' }, 'Dermatologia'),
          React.createElement('option', { value: 'Medicina Estética' }, 'Medicina Estética')
        ),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Telefone',
          value: telefone,
          onChange: (e) => setTelefone(e.target.value),
          required: true,
        }),
        React.createElement('input', {
          type: 'email',
          placeholder: 'Email',
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: true,
        }),
        React.createElement('input', {
          type: 'password',
          placeholder: 'Senha',
          value: senha,
          onChange: (e) => setSenha(e.target.value),
          required: true,
          minLength: 6,
        }),
        React.createElement(
          'button',
          { type: 'submit', disabled: loading },
          loading ? 'Cadastrando...' : 'Cadastrar'
        )
      ),
      React.createElement(
        'p',
        { className: 'link-login' },
        'Já tem cadastro? ',
        React.createElement(
          'span',
          {
            onClick: () => navigate('/login-profissional'),
            style: { cursor: 'pointer', color: 'blue' },
          },
          'Faça login'
        )
      )
    )
  );
}

export default CadastroProfissional;
