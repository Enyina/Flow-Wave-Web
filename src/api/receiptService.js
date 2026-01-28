const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5600/api';

class ReceiptService {
  // Get Receipt Data
  async getReceipt(referenceId) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/receipts/${referenceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get receipt');
    }

    return response.json();
  }

  // Get Receipt HTML
  async getReceiptHTML(referenceId) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/receipts/${referenceId}/html`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get receipt HTML');
    }

    return response.text();
  }

  // Download Receipt PDF
  async downloadReceiptPDF(referenceId) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/receipts/${referenceId}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to download receipt');
    }

    // Handle file download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `flowwave-receipt-${referenceId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Generate Receipt HTML (Client-side)
  generateReceiptHTML(receiptData) {
    const {
      referenceId,
      amount,
      currency,
      convertedAmount,
      recipientCurrency,
      exchangeRate,
      transferFee,
      total,
      status,
      beneficiaryName,
      beneficiaryBank,
      beneficiaryAccount,
      createdAt,
      completedAt
    } = receiptData;

    const statusColors = {
      'PENDING': '#ff9800',
      'PROCESSING': '#2196f3',
      'COMPLETED': '#4caf50',
      'FAILED': '#f44336'
    };

    const statusIcons = {
      'PENDING': '⏳',
      'PROCESSING': '⟳',
      'COMPLETED': '✓',
      'FAILED': '✗'
    };

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Flowwave Transaction Receipt</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
            color: #333;
          }
          .receipt-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .receipt-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .receipt-header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          .receipt-header p {
            font-size: 18px;
            opacity: 0.9;
          }
          .receipt-body {
            padding: 40px 30px;
          }
          .transaction-details {
            margin-bottom: 30px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #666;
          }
          .detail-value {
            font-weight: 700;
            color: #333;
          }
          .amount-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .amount-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .amount-row.total {
            font-size: 18px;
            font-weight: 700;
            color: #667eea;
            border-top: 2px solid #667eea;
            padding-top: 12px;
            margin-top: 12px;
          }
          .beneficiary-section {
            background: #fff8f0;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .beneficiary-section h3 {
            color: #e65100;
            margin-bottom: 15px;
            font-size: 16px;
          }
          .status-badge {
            display: inline-block;
            padding: 12px 24px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            color: #666;
            font-size: 12px;
          }
          @media print {
            body { padding: 0; }
            .receipt-container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="receipt-header">
            <h1>🌊 Flowwave</h1>
            <p>Transaction Receipt</p>
          </div>
          
          <div class="receipt-body">
            <div class="transaction-details">
              <div class="detail-row">
                <span class="detail-label">Reference ID:</span>
                <span class="detail-value">${referenceId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${new Date(createdAt).toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${new Date(createdAt).toLocaleTimeString()}</span>
              </div>
              ${completedAt ? `
              <div class="detail-row">
                <span class="detail-label">Completed:</span>
                <span class="detail-value">${new Date(completedAt).toLocaleDateString()}</span>
              </div>
              ` : ''}
            </div>

            <div class="amount-section">
              <div class="amount-row">
                <span class="detail-label">Amount Sent:</span>
                <span class="detail-value">${currency} ${amount}</span>
              </div>
              <div class="amount-row">
                <span class="detail-label">Exchange Rate:</span>
                <span class="detail-value">1 ${currency} = ${exchangeRate} ${recipientCurrency}</span>
              </div>
              <div class="amount-row">
                <span class="detail-label">Amount Received:</span>
                <span class="detail-value">${recipientCurrency} ${convertedAmount}</span>
              </div>
              <div class="amount-row">
                <span class="detail-label">Transfer Fee:</span>
                <span class="detail-value">${currency} ${transferFee}</span>
              </div>
              <div class="amount-row total">
                <span class="detail-label">Total Paid:</span>
                <span class="detail-value">${currency} ${total}</span>
              </div>
            </div>

            ${beneficiaryName ? `
            <div class="beneficiary-section">
              <h3>Beneficiary Details</h3>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${beneficiaryName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Bank:</span>
                <span class="detail-value">${beneficiaryBank}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Account:</span>
                <span class="detail-value">${beneficiaryAccount}</span>
              </div>
            </div>
            ` : ''}

            <div class="status-badge" style="background-color: ${statusColors[status]}; color: white;">
              ${statusIcons[status]} ${status}
            </div>
          </div>

          <div class="footer">
            <p>© ${new Date().getFullYear()} Flowwave. All rights reserved.</p>
            <p>This is an electronically generated receipt. No signature is required.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Share Receipt
  async shareReceipt(referenceId, method = 'email') {
    try {
      const receiptData = await this.getReceipt(referenceId);
      
      const shareText = `
        Flowwave Transaction Receipt
        ============================
        Reference ID: ${receiptData.referenceId}
        Amount: ${receiptData.currency} ${receiptData.amount}
        Status: ${receiptData.status}
        Date: ${new Date(receiptData.createdAt).toLocaleDateString()}
        ${receiptData.beneficiaryName ? `Beneficiary: ${receiptData.beneficiaryName}` : ''}
      `.trim();

      if (navigator.share && method === 'native') {
        await navigator.share({
          title: 'Flowwave Transaction Receipt',
          text: shareText,
        });
      } else if (method === 'email') {
        window.location.href = `mailto:?subject=Flowwave Transaction Receipt&body=${encodeURIComponent(shareText)}`;
      } else if (method === 'clipboard') {
        await navigator.clipboard.writeText(shareText);
        return { success: true, message: 'Receipt copied to clipboard' };
      }
      
      return { success: true };
    } catch (error) {
      throw new Error('Failed to share receipt: ' + error.message);
    }
  }

  // Print Receipt
  printReceipt(referenceId) {
    return new Promise(async (resolve, reject) => {
      try {
        const receiptData = await this.getReceipt(referenceId);
        const receiptHTML = this.generateReceiptHTML(receiptData);
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
        
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
          resolve({ success: true });
        };
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new ReceiptService();
