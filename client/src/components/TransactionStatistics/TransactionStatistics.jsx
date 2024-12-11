import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionStatistics = ({ month }) => {
    const [statistics, setStatistics] = useState({
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0,
    });

    console.log(month);
    

    // Fetch statistics from API
    const fetchStatistics = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/statistics', {
                params: { month },
            });

            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error.message);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, [month]);

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title">
                        Transaction Statistics for {new Date(0, parseInt(month) - 1).toLocaleString('en', { month: 'long' })}
                    </h4>
                    <p className="card-text">Total Sale Amount: ${statistics.totalSaleAmount.toFixed(2)}</p>
                    <p className="card-text">Total Sold Items: {statistics.totalSoldItems}</p>
                    <p className="card-text">Total Not Sold Items: {statistics.totalNotSoldItems}</p>
                </div>
            </div>
        </div>
    );
};

export default TransactionStatistics;
