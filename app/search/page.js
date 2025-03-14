'use client';

import { useState, useEffect } from 'react';
import { searchCustomers, initializeAuth, logout } from '../services/api';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import { XMarkIcon } from '@heroicons/react/24/solid';

const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 p-4 rounded-md border border-red-300 mb-8">
    <p className="text-red-700">{message}</p>
  </div>
);

const SuccessMessage = ({ message }) => (
  <div className="bg-green-50 p-4 rounded-md border border-green-300 mb-8">
    <p className="text-green-700">{message}</p>
  </div>
);

const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  debouncedFetchSuggestions, 
  handleSearch, 
  loading, 
  suggestions,
  setSuggestions 
}) => {
  const clearText = () => {
    setSearchQuery(''); 
    setSuggestions([]); 
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8 relative">
      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="flex-grow relative">
          <input
            id="searchQuery"
            placeholder="Enter name, email, or account number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black pr-10" 
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              debouncedFetchSuggestions(e.target.value);
            }}
          />
          {searchQuery && (
            <button
              type="button" 
              onClick={clearText}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-5 w-5" /> 
            </button>
          )}
          {suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto border border-gray-200 text-gray-700 mb-1">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSearchQuery(suggestion.name || suggestion.email || suggestion.bank_accounts[0]?.account_number);
                    setSuggestions([]); 
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                >
                  {suggestion.name} - {suggestion.email} - {suggestion.bank_accounts[0]?.account_number}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
};

const CustomerDetail = ({ customer, selectedCustomer, setSelectedCustomer, searchQuery, highlightText }) => (
  <div className="mb-6 border-b border-gray-200 pb-6 last:border-b-0">
    <div
      className="cursor-pointer"
      onClick={() => setSelectedCustomer(selectedCustomer === customer ? null : customer)}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {highlightText(customer.name, searchQuery)}
          </h3>
          <p className="text-sm text-gray-600">
            {highlightText(customer.email, searchQuery)}
          </p>
        </div>
        <div className="text-sm text-gray-600">
          {customer.bank_accounts?.[0]?.account_number && (
            <p>Account: {highlightText(customer.bank_accounts[0].account_number, searchQuery)}</p>
          )}
        </div>
      </div>
    </div>

    {selectedCustomer === customer && (
      <div className="mt-4">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Full Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{customer.name || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{customer.email || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Account Number</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {customer.bank_accounts?.[0]?.account_number || 'N/A'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Balance</dt>
            <dd className="mt-1 text-sm text-gray-900">
              ${customer.bank_accounts?.[0]?.balance?.toFixed(2) || '0.00'}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Pockets</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {customer.pockets?.length > 0 ? (
                customer.pockets.map((pocket, index) => (
                  <div key={index}>
                    {pocket.name}: ${pocket.balance?.toFixed(2) || '0.00'}
                  </div>
                ))
              ) : (
                <span>No pockets available</span>
              )}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Term Deposits</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {customer.term_deposits?.length > 0 ? (
                customer.term_deposits.map((deposit, index) => (
                  <div key={index}>
                    Amount: ${deposit.amount?.toFixed(2) || '0.00'}, Duration: {deposit.duration} months
                  </div>
                ))
              ) : (
                <span>No term deposits available</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    )}
  </div>
);

const CustomerList = ({ customers, selectedCustomer, setSelectedCustomer, searchQuery, highlightText }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
      <h2 className="text-xl font-semibold text-gray-800">Search Results</h2>
    </div>
    <div className="p-6">
      {customers.length > 0 ? (
        customers.map((customer, index) => (
          <CustomerDetail
            key={index}
            customer={customer}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            searchQuery={searchQuery}
            highlightText={highlightText}
          />
        ))
      ) : (
        <p className="text-gray-600">No customers found.</p>
      )}
    </div>
  </div>
);

export default function CustomerSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    initializeAuth();
  }, []);

  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      console.log('Fetching suggestions for query:', query); 
      const response = await searchCustomers(query);
      console.log('API Response:', response); 

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setSuggestions(response.data);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error('Failed to fetch suggestions:', err); 
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setCustomers([]);
    setMessage('');
    setSelectedCustomer(null);

    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    try {
      setLoading(true);
      const response = await searchCustomers(searchQuery);

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setCustomers(response.data); 
        setMessage(`Found ${response.data.length} customer(s)`);
      } else {
        setError('No customers found with the provided search query');
      }
    } catch (err) {
      if (err.message === 'Authentication required') {
        router.push('/login');
      } else {
        setError(err.message || 'Failed to fetch customer data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text || 'N/A';

    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Search</h1>
          <button
            onClick={handleLogout}
            className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          debouncedFetchSuggestions={debouncedFetchSuggestions}
          handleSearch={handleSearch}
          loading={loading}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
        />

        {error && <ErrorMessage message={error} />}
        {message && <SuccessMessage message={message} />}
        
        <CustomerList
          customers={customers}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          searchQuery={searchQuery}
          highlightText={highlightText}
        />
      </div>
    </div>
  );
}