import React, { useState, useEffect } from 'react';
import '../styles/ModalAgendar.css';
import axios from 'axios';

function ModalAgendar({ procedimento, onClose, onConfirm }) {
  const nomeSalvo = localStorage.getItem('pacienteNome');
  const [especialidade, setEspecialidade] = useState('');
  const [profissional, setProfissional] = useState('');
  const [nome, setNome] = useState(nomeSalvo && nomeSalvo !== 'undefined' ? nomeSalvo : '');
  const [telefone, setTelefone] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [listaDeProfissionais, setListaDeProfissionais] = useState([]);
  const [carregandoProfissionais, setCarregandoProfissionais] = useState(true);

  useEffect(() => {
    setCarregandoProfissionais(true);
    axios.get('https://projeto-clinica-cscsgyg9gkd4chbx.brazilsouth-01.azurewebsites.net/profissionais/todos')
      .then(response => setListaDeProfissionais(response.data))
      .catch(() => alert('Erro ao carregar profissionais'))
      .finally(() => setCarregandoProfissionais(false));
  }, []);

  function handleAgendar() {
    const pacienteIdStr = localStorage.getItem('pacienteId');
    const pacienteId = parseInt(pacienteIdStr, 10);

    if (!pacienteId || isNaN(pacienteId)) {
      alert('ID do paciente inválido. Faça login novamente.');
      return;
    }

    const medicoSelecionado = listaDeProfissionais.find(p => p.nome === profissional);
    if (!medicoSelecionado || !medicoSelecionado.id) {
      alert('Profissional não encontrado ou inválido.');
      return;
    }

    if (!data || !horario) {
      alert('Por favor, selecione data e horário da consulta.');
      return;
    }

    const dataHora = `${data}T${horario}:00.000`;
    const dadosConsulta = {
      dataHora,
      pacienteId,
      profissionalId: medicoSelecionado.id,
      observacoes,
      telefonePaciente: telefone,
      procedimento
    };

    axios.post('https://clinica-axcehzebdvdxd8fa.brazilsouth-01.azurewebsites.net/consultas', dadosConsulta)
      .then(res => {
        alert('Consulta agendada com sucesso');
        if (onConfirm) onConfirm(res.data);
        onClose();
      })
      .catch(error => {
        console.error('Erro ao agendar consulta:', error.response?.data || error.message);
        alert('Erro ao agendar consulta: ' + (error.response?.data?.message || error.message));
      });
  }

  return React.createElement('div', { className: 'modal-overlay' },
    React.createElement('div', { className: 'modal-content' },
      React.createElement('button', { className: 'btn-fechar', onClick: onClose }, '×'),
      React.createElement('h2', null, 'Agendar ' + procedimento),

      // Especialidade
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Especialidade:'),
        React.createElement('select', {
          value: especialidade,
          onChange: e => setEspecialidade(e.target.value)
        },
          React.createElement('option', { value: '' }, 'Selecione'),
          React.createElement('option', { value: 'Preenchimento facial' }, 'Preenchimento facial'),
          React.createElement('option', { value: 'Botox' }, 'Botox'),
          React.createElement('option', { value: 'Laser' }, 'Laser'),
          React.createElement('option', { value: 'Harmonização Facial' }, 'Harmonização Facial'),
          React.createElement('option', { value: 'Limpeza de Pele' }, 'Limpeza de Pele'),
          React.createElement('option', { value: 'Microagulhamento' }, 'Microagulhamento')
        )
      ),

      // Profissional
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Profissional:'),
        React.createElement('select', {
          value: profissional,
          onChange: e => setProfissional(e.target.value),
          disabled: carregandoProfissionais
        },
          React.createElement('option', { value: '' }, carregandoProfissionais ? 'Carregando profissionais...' : 'Selecione'),
          ...listaDeProfissionais.map(p =>
            React.createElement('option', { key: p.id, value: p.nome },
              p.nome + ' - ' + p.especialidade
            )
          )
        )
      ),

      // Nome
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Seu Nome:'),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Digite seu nome',
          value: nome,
          onChange: e => setNome(e.target.value)
        })
      ),

      // Telefone
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Telefone:'),
        React.createElement('input', {
          type: 'tel',
          placeholder: '(00) 00000-0000',
          value: telefone,
          onChange: e => setTelefone(e.target.value)
        })
      ),

      // Data
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Data da Consulta:'),
        React.createElement('input', {
          type: 'date',
          value: data,
          onChange: e => setData(e.target.value)
        })
      ),

      // Horário
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Horário da Consulta:'),
        React.createElement('input', {
          type: 'time',
          value: horario,
          onChange: e => setHorario(e.target.value)
        })
      ),

      // Observações
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Observações:'),
        React.createElement('textarea', {
          placeholder: 'Ex: Quero que seja no período da manhã',
          value: observacoes,
          onChange: e => setObservacoes(e.target.value)
        })
      ),

      // Botão Agendar
      React.createElement('button', {
        className: 'btn-agendar',
        onClick: handleAgendar,
        disabled: !especialidade || !profissional || !nome || !telefone || !data || !horario || carregandoProfissionais
      }, carregandoProfissionais ? 'Carregando...' : 'Agendar')
    )
  );
}

export default ModalAgendar;
