import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ModalAgendar.css';

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
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Paciente não autenticado. Faça login.');
      onClose();
      return;
    }

    setCarregandoProfissionais(true);
    axios.get('https://clinica-axcehzebdvdxd8fa.brazilsouth-01.azurewebsites.net/profissionais/todos', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(response => setListaDeProfissionais(response.data))
      .catch(() => alert('Erro ao carregar profissionais'))
      .finally(() => setCarregandoProfissionais(false));
  }, [onClose]);

  function handleAgendar() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Paciente não autenticado. Faça login.');
      return;
    }

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

    // Formato ISO 8601 compatível com LocalDateTime do backend (sem timezone)
    const dataHora = `${data}T${horario}:00.000`;

    const dadosConsulta = {
      dataHora,
      pacienteId: pacienteId, // ✅ Correto
      profissionalId: medicoSelecionado.id, // ✅ Correto
      observacoes,
      telefonePaciente: telefone,
      procedimento
    };
    

    console.log('Dados da consulta:', dadosConsulta);

    axios.post('https://clinica-axcehzebdvdxd8fa.brazilsouth-01.azurewebsites.net/consultas', dadosConsulta, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
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



  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-fechar" onClick={onClose}>×</button>

        <h2>Agendar {procedimento}</h2>

        <div className="form-group">
          <label>Especialidade:</label>
          <select value={especialidade} onChange={e => setEspecialidade(e.target.value)}>
            <option value="">Selecione</option>
            <option value="Preenchimento facial">Preenchimento facial</option>
            <option value="Botox">Botox</option>
            <option value="Laser">Laser</option>
            <option value="Harmonização Facial">Harmonização Facial</option>
            <option value="Limpeza de Pele">Limpeza de Pele</option>
            <option value="Microagulhamento">Microagulhamento</option>
          </select>
        </div>

        <div className="form-group">
          <label>Profissional:</label>
          <select
            value={profissional}
            onChange={e => setProfissional(e.target.value)}
            disabled={carregandoProfissionais}
          >
            <option value="">{carregandoProfissionais ? 'Carregando profissionais...' : 'Selecione'}</option>
            {listaDeProfissionais.map(p => (
              <option key={p.id} value={p.nome}>
                {p.nome} - {p.especialidade}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Seu Nome:</label>
          <input
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Telefone:</label>
          <input
            type="tel"
            placeholder="(00) 00000-0000"
            value={telefone}
            onChange={e => setTelefone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Data da Consulta:</label>
          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Horário da Consulta:</label>
          <input
            type="time"
            value={horario}
            onChange={e => setHorario(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Observações:</label>
          <textarea
            placeholder="Ex: Quero que seja no período da manhã"
            value={observacoes}
            onChange={e => setObservacoes(e.target.value)}
          />
        </div>

        <button
          className="btn-agendar"
          onClick={handleAgendar}
          disabled={
            !especialidade ||
            !profissional ||
            !nome ||
            !telefone ||
            !data ||
            !horario ||
            carregandoProfissionais
          }
        >
          {carregandoProfissionais ? 'Carregando...' : 'Agendar'}
        </button>
      </div>
    </div>
  );
}

export default ModalAgendar;
