import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPaciente.css';
import axios from 'axios';

function LoginPaciente() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://clinica-axcehzebdvdxd8fa.brazilsouth-01.azurewebsites.net/pacientes/login', { email, senha });

      // Extrai o token e os dados do paciente da resposta
      const token = response.data.token;
      const paciente = response.data.paciente;

      console.log('Resposta login:', response.data);

      if (!paciente.id) {
        alert('ID do paciente não encontrado. Faça login novamente.');
        return;
      }

      // Salva o token e os dados do paciente no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('pacienteId', paciente.id);
      localStorage.setItem('pacienteNome', paciente.nome);

      // Redireciona para a home do paciente
      navigate('/home-paciente');
    } catch (error) {
      alert('Email ou senha inválidos!');
    }
  };

  return React.createElement(
    'div',
    { className: 'login-paciente-container' },
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
      React.createElement('h2', null, 'Login Paciente'),
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
        'Não tem cadastro? ',
        React.createElement(
          'span',
          { onClick: () => navigate('/cadastro-paciente'), style: { cursor: 'pointer', color: 'blue' } },
          'Cadastre-se'
        )
      )
    )
  );
}

export default LoginPaciente;
