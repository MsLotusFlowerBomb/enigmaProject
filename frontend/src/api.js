const BASE_URL = 'http://localhost:8080/api';

export const api = {
  // Properties
  getProperties: () => fetch(`${BASE_URL}/properties`).then(r => r.json()),
  getAllProperties: () => fetch(`${BASE_URL}/properties/all`).then(r => r.json()),
  checkFraud: (id) => fetch(`${BASE_URL}/properties/${id}/fraud-check`, { method: 'POST' }).then(r => r.json()),

  // Leases
  getLeases: () => fetch(`${BASE_URL}/leases`).then(r => r.json()),
  generateLease: (data) => fetch(`${BASE_URL}/leases/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Invoices
  getInvoices: () => fetch(`${BASE_URL}/invoices`).then(r => r.json()),
  payInvoice: (id) => fetch(`${BASE_URL}/invoices/${id}/pay`, { method: 'PUT' }).then(r => r.json()),

  // Maintenance
  getTickets: () => fetch(`${BASE_URL}/maintenance`).then(r => r.json()),
  createTicket: (data) => fetch(`${BASE_URL}/maintenance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateTicketStatus: (id, status) => fetch(`${BASE_URL}/maintenance/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).then(r => r.json()),

  // Inspections
  analyzeInspection: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${BASE_URL}/inspections/analyze`, { method: 'POST', body: formData }).then(r => r.json());
  }
};
