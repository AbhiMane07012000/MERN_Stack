import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TransactionTable from './components/TransactionTable/TransactionTable';
import TransactionStatistics from './components/TransactionStatistics/TransactionStatistics';

function App() {
  const [month, setMonth] = React.useState('03');

  return (
    <div className="App">
      <TransactionTable month={month} setMonth={setMonth} />
      <TransactionStatistics month={month} />
  
    </div>
  );
}

export default App;
