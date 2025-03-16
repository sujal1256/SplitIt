import React, { useState } from "react";
import { useSelector } from "react-redux";

function SettleUp({
  memberTransactions,
  totalTransaction,
  isOpen,
  onClose
}) {
  const user = useSelector(store => store.user.user);
  const [settlingMember, setSettlingMember] = useState(null);
  
  // Helper function to determine text color based on transaction amount
  const getTransactionColor = (amount) => {
    if (amount > 0) return "text-green-400";
    if (amount < 0) return "text-red-400";
    return "text-gray-400";
  };
  
  // Helper function to format transaction with appropriate sign
  const formatTransaction = (amount) => {
    if (amount > 0) return `+₹${amount.toFixed(2)}`;
    if (amount < 0) return `-₹${Math.abs(amount).toFixed(2)}`;
    return `₹${amount.toFixed(2)}`;
  };

  if (!isOpen) return null;
  
  const handleSettleUp = (memberName, transaction) => {
    setSettlingMember(memberName);
    // Simulate settling up process
    setTimeout(() => {
      setSettlingMember(null);
      // Here you would call your API to update the transaction
    }, 1500);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a2030] rounded-lg max-w-md w-full border border-gray-700 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 p-4">
          <h2 className="text-xl font-bold text-white">Settle Up</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Total Amount */}
        <div className="p-4 border-b border-gray-700 bg-[#232a3c]">
          <p className="text-sm text-gray-300 mb-1">Total Group Balance</p>
          <p className="text-2xl font-bold">
            <span className={getTransactionColor(totalTransaction)}>
              {formatTransaction(totalTransaction)}
            </span>
          </p>
        </div>
        
        {/* Transactions */}
        <div className="max-h-80 overflow-y-auto">
          {memberTransactions?.length > 0 ? (
            memberTransactions.map((transaction, index) => {
              const isPositive = transaction.transaction > 0;
              const isSettling = settlingMember === transaction.memberName;
              
              return (
                <div  
                  key={`${transaction.memberName}-${index}`}
                  className="p-3 border-b border-gray-700 last:border-0 hover:bg-[#232a3c] transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        {isPositive ? (
                          <>
                            <span className="text-sm text-gray-300">{transaction.memberName}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            <span className="text-sm text-gray-300">You</span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-gray-300">You</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            <span className="text-sm text-gray-300">{transaction.memberName}</span>
                          </>
                        )}
                      </div>
                      <p className={`font-bold ${getTransactionColor(transaction.transaction)}`}>
                        {formatTransaction(transaction.transaction)}
                      </p>
                    </div>
                    
                    {/* {!isPositive && (
                      <button
                        onClick={() => handleSettleUp(transaction.memberName, transaction.transaction)}
                        disabled={isSettling}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          isSettling 
                            ? "bg-gray-500 text-gray-300" 
                            : "bg-[#ff5733] hover:bg-[#e84c2b] text-white"
                        }`}
                      >
                        {isSettling ? "Processing..." : "Pay"}
                      </button>
                    )} */}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-400">No transactions to settle</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-[#232a3c] text-sm text-gray-400">
          <p>Positive amount means you will receive money</p>
          <p>Negative amount means you need to pay</p>
        </div>
      </div>
    </div>
  );
}

export default SettleUp;