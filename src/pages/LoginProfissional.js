import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';
import '../styles/LoginProfissional.css';

function LoginProfissional() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      const response = await axios.post('https://clinica-axcehzebdvdxd8fa.brazilsouth-01.azurewebsites.net/profissionais/login', {
        email,
        senha,
      });

      const { token, profissional } = response.data;

      localStorage.setItem('tokenProfissional', token);
      localStorage.setItem('idProfissional', profissional.id);
      localStorage.setItem('nomeProfissional', profissional.nome);

      navigate('/home-profissional');
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Email ou senha inválidos!');
    }
  };

  return React.createElement(
    'div',
    { className: 'login-profissional-container' },
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
      { className: 'login-card' },
      React.createElement('h2', null, 'Login Profissional'),
      React.createElement(
        'form',
        { onSubmit: handleLogin },
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
        }),
        React.createElement('button', { type: 'submit' }, 'Entrar')
      ),
      React.createElement(
        'p',
        { className: 'link-cadastro' },
        'Não tem conta? ',
        React.createElement(
          'span',
          { onClick: () => navigate('/cadastro-profissional') },
          'Cadastre-se'
        )
      )
    )
  );
}

export default LoginProfissional;
