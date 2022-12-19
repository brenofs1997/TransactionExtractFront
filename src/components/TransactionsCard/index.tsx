import { SetStateAction, useEffect, useState } from 'react';
import { Transaction } from '../../types/Transaction';
import { api } from '../../lib/axios';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './styles.css'
import { formactCurrency } from '../../utils/formactCurrency';

function TransactionsCard() {
  const min = new Date(new Date().setDate(new Date().getDate() - 365));
  const max = new Date();

  const [nameOperator, setNameOperator] = useState('');
  const [minDate, setMinDate] = useState(min);
  const [maxDate, setMaxDate] = useState(max);


  const [transactions, setTransactions] = useState<Transaction[]>([

  ]);

  useEffect(() => {

    const dmin = minDate.toISOString().slice(0, 10);

    const dmax = maxDate.toISOString().slice(0, 10);

    api.get(`/transactions`)
      .then((response) => {
        setTransactions(response.data);
      })
  }, [minDate, maxDate]);

  function handleClick(nameOperator: string, minDate: Date, maxDate: Date) {

  }

  return (
    <div className="card">
      <h2 className="transactions-title">Transações</h2>
      <div style={{ display: 'flex', gap: 12 ,justifyContent:'center'}}>
        <div className="form-control-container">
          <h3>Data de início</h3>
          <DatePicker
            selected={minDate}
            onChange={(date: Date) => setMinDate(date)}
            className="form-control"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div className="form-control-container">
          <h3>Data de Fim</h3>
          <DatePicker
            selected={maxDate}
            onChange={(date: Date) => setMaxDate(date)}
            className="form-control"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div className="form-control-container">
          <h3>Nome operador transacionado</h3>
          <input className="form-control" name="nameOperator" id="nameOperator" type="text" placeholder="Digite o nome do operador..." />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12,justifyContent:'flex-end' }}>
        <button type="submit" className="red-btn" onClick={() => handleClick(nameOperator, minDate, maxDate)}>
          pesquisar
        </button>
      </div>

      <div>
        <table className="transactions-table">
          <thead>
            <tr>
              <th className="show576">Dados</th>
              <th>Valentia</th>
              <th>Tipo</th>
              <th className="show992">Nome operador transacionado</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => {
              return (
                <tr key={transaction.id}>
                  <td className="show576">{new Date(transaction.data_transferencia).toLocaleDateString()}</td>
                  <td>{formactCurrency(transaction.valor)}</td>
                  <td className="show992">{transaction.tipo}</td>
                  <td className="show992">{transaction.conta.nome_responsavel}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransactionsCard;