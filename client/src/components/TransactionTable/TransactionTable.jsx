import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionTable = ({ defaultmonth }) => {

    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState(defaultmonth);  // Set month from props
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const perPage = 10;

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/listTransactions', {
                params: { search, page, perPage, month },
            });

            setTransactions(response.data.transactions);
            setTotalPages(Math.ceil(response.data.total / perPage));
        } catch (error) {
            console.error('Error fetching transactions:', error.message);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [search, month, page]);

    return (
        <div className="container mt-4 mb-5">
            <h2 className="text-center mb-4">Transactions Table</h2>
            <div className="d-flex justify-content-between mb-3">
                {/* Search Box */}
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Search transactions"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1); // Reset to first page on new search
                    }}
                />

                {/* Month Selector */}
                <select
                    className="form-select w-25"
                    value={month}
                    onChange={(e) => {
                        setMonth(e.target.value);
                        setPage(1); // Reset to first page on month change
                    }}
                >
                    {[
                        '01', '02', '03', '04', '05', '06',
                        '07', '08', '09', '10', '11', '12',
                    ].map((m, index) => (
                        <option key={index} value={m}>
                            {new Date(0, index).toLocaleString('en', { month: 'long' })}
                        </option>
                    ))}
                </select>
            </div>

            {/* Transactions Table */}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Date of Sale</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length ? (
                        transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td>{transaction.id}</td>
                                <td>{transaction.title}</td>
                                <td>${transaction.price.toFixed(2)}</td>
                                <td>{transaction.description}</td>
                                <td>{transaction.category}</td>
                                <td>{transaction.sold ? 'Yes' : 'No'}</td>
                                <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                No transactions found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-secondary"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                    className="btn btn-secondary"
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TransactionTable;
