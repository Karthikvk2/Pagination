import React, { useState, useEffect, useCallback } from "react";

const PaginatedDataTable = () => {
  const [startDate, setStartDate] = useState("2024-10-01");
  const [endDate, setEndDate] = useState("2024-11-07");

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState("5");

  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [sortColumn, setSortColumn] = useState("conversation_start_date_time");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = new URL(process.env.REACT_APP_API_URL);

      url.searchParams.append("start_date", startDate);
      url.searchParams.append("end_date", endDate);
      url.searchParams.append("page", currentPage);
      url.searchParams.append("limit", limit);
      url.searchParams.append("sort_column", sortColumn);
      url.searchParams.append("sort_order", "asc");

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setData(result.result.conversations);
      setTotalPages(result.result.totalPages);
      setTotalItems(result.result.totalItems);
      setCurrentPage(result.result.currentPage);
    } catch (error) {
      console.error("Error fetching data:", error);

      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, currentPage, limit, sortColumn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "Not Available";
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  const handleSort = (column) => {
    setSortColumn(column);
    setCurrentPage(1);
  };

  const limitOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 bg-white text-gray-800">
        <div className="flex flex-col items-center mb-8 space-y-6">
          <div className="flex gap-8 items-center justify-center w-full">
            {/* Start Date Input */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2 text-gray-600">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* End Date Input */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2 text-gray-600">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Apply Filters Button */}
            <button
              className="mt-8 px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={fetchData}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Apply Filters"}
            </button>
          </div>

          {/* Total Items Display */}
          <div className="text-sm text-gray-600">Total Items: {totalItems}</div>
        </div>

        {/* Data Table */}
        <div className="rounded-lg border border-gray-200 overflow-x-auto bg-white mb-8 shadow-sm">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-900 text-white">
              <tr>
                {[
                  { key: "id", label: "ID" },
                  { key: "customer_name", label: "Customer Name" },
                  { key: "language", label: "Language" },
                  { key: "bot_identifier", label: "Bot Identifier" },
                  { key: "conversation_start_date_time", label: "Start Time" },
                  { key: "conversation_end_date_time", label: "End Time" },
                  { key: "conversation_end_status", label: "End Status" },
                  { key: "is_query_resolved", label: "Query Resolved" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="p-4 text-left text-sm font-medium cursor-pointer hover:bg-gray-700"
                    onClick={() => handleSort(key)}
                  >
                    {label}
                    {sortColumn === key && <span className="ml-2"></span>}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                      <div
                        className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"
                        style={{ animationDelay: "0s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-600">
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4 text-sm">{item.id}</td>
                    <td className="p-4 text-sm">{item.customer_name}</td>
                    <td className="p-4 text-sm">{item.language}</td>
                    <td className="p-4 text-sm">{item.bot_identifier}</td>
                    <td className="p-4 text-sm">
                      {formatDateTime(item.conversation_start_date_time)}
                    </td>
                    <td className="p-4 text-sm">
                      {formatDateTime(item.conversation_end_date_time)}
                    </td>
                    <td className="p-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.conversation_end_status
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.conversation_end_status || "Pending"}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.is_query_resolved
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.is_query_resolved ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col items-center gap-6">
          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Items per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500"
            >
              {limitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Pagination navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1 || isLoading}
              className={`px-6 py-2 rounded-md border ${
                currentPage === 1 || isLoading
                  ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                  : "bg-gray-900 text-white border-gray-900 hover:bg-gray-800"
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages || isLoading}
              className={`px-6 py-2 rounded-md border ${
                currentPage === totalPages || isLoading
                  ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                  : "bg-gray-900 text-white border-gray-900 hover:bg-gray-800"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginatedDataTable;
