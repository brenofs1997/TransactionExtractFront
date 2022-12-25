import { SetStateAction, useEffect, useState, FormEvent } from 'react';
import { Transaction } from '../../types/Transaction';
import { api } from '../../lib/axios';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './styles.css'
import { formactCurrency } from '../../utils/formactCurrency';

function TransactionsCard() {


  const [amount, setAmount] = useState(0);
  const [amountByPeriod, setAmountByPeriod] = useState(0);
  const [page,setPage] = useState(0);
  const [pageLimit,setPageLimit] = useState(0);
  const [nameOperator, setNameOperator] = useState('');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  const state= {
    count:0,
  };
  const [transactions, setTransactions] = useState<Transaction[]>([

  ]);

  useEffect(() => {

    api.get(`/transferencias`)
      .then((response) => {
        setTransactions(response.data.content);
        setPageLimit(response.data.totalPages)
      })

    api.get(`/transferencias/amount`)
      .then((response) => {
        setAmount(response.data);
        setAmountByPeriod(response.data);
      })

  }, [minDate, maxDate]);

  async function handleClick(event: FormEvent) {
    event.preventDefault();

    await api.get(`/transferencias/filter?minDate=${minDate}&maxDate=${maxDate}&nomeOperador=${nameOperator}`)
      .then((response) => {
        setTransactions(response.data.content);
      })

    if (minDate != '' && maxDate != '') {
      await api.get(`/transferencias/amountbyperiod?minDate=${minDate}&maxDate=${maxDate}`)
        .then((response) => {
          setAmountByPeriod(response.data);
        })
    }

  }

  async function changePage(move : string) {

    if(page<=pageLimit && move==='next' && page>=0)
    {          
      setPage(page+1)
      
      await api.get(`/transferencias?page=${page}`)
      .then((response) => {
        setTransactions(response.data.content);
      })
    }

  }

  async function changePageDown(move : string) {

    if(move==='previous' && page>=0)
    { 
      setPage(page-1)
      await api.get(`/transferencias?page=${page}`)
      .then((response) => {
        setTransactions(response.data.content);
      })
    }
  }

  return (
    <div className="card">
      <h2 className="transactions-title">Transações</h2>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <div className="form-control-container">
          <h3>Data de início</h3>
          <DatePicker
            value={minDate}
            onChange={(date: Date) => setMinDate(date.toISOString().slice(0, 10))}
            className="form-control"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div className="form-control-container">
          <h3>Data de Fim</h3>
          <DatePicker
            value={maxDate}
            onChange={(date: Date) => setMaxDate(date.toISOString().slice(0, 10))}
            className="form-control"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div className="form-control-container">
          <h3>Nome operador transacionado</h3>
          <input className="form-control" name="nameOperator" id="nameOperator"
            type="text" placeholder="Digite o nome do operador..." value={nameOperator}
            onChange={event => setNameOperator(event.target.value)} />
        </div>
      </div>
      <form onSubmit={handleClick}>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="submit" className="red-btn">
            pesquisar
          </button>
        </div>
      </form>
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 24 }}>
          <div>
            <span style={{ color: 'white' }}>Saldo total: {formactCurrency(amount)}</span>
          </div>
          <div>
            <span style={{ color: 'white' }}>Saldo no periodo: {formactCurrency(amountByPeriod)}</span>
          </div>
        </div>
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
                  <td className="show992">{transaction.nome_operador_transacao}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div>
          <a  href="#" className="previous round" onClick={() => changePageDown("previous") }>&#8249;</a>
            <span style={{ color: 'white' }}>Pagina {page} </span>
          <a  href="#" className="next round"  onClick={() => changePage("next") } >&#8250;</a>
        </div>

      </div>
    </div>

  )
}

export default TransactionsCard;