import React, { useState } from 'react';
import DarkModeToggle from './DarkModeToggle';

const Dashboard = ({ onLogout }) => {
  const [sendAmount, setSendAmount] = useState('0.00');
  const [receiveAmount, setReceiveAmount] = useState('0.00');
  const [sendCurrency, setSendCurrency] = useState('NGN');
  const [receiveCurrency, setReceiveCurrency] = useState('USD');
  const [activeTab, setActiveTab] = useState('home');

  const exchangeRate = 1500.00; // NGN to USD rate
  const fee = 0.00;

  const handleSendAmountChange = (value) => {
    setSendAmount(value);
    if (value && !isNaN(value)) {
      const converted = (parseFloat(value) / exchangeRate).toFixed(2);
      setReceiveAmount(converted);
    } else {
      setReceiveAmount('0.00');
    }
  };

  const handleContinue = () => {
    if (parseFloat(sendAmount) > 0) {
      alert('Proceeding to recipient details...');
    }
  };

  const totalPay = parseFloat(sendAmount) + fee;

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center px-20 py-12">
        <div className="flex items-center">
          <div className="w-13 h-9 mr-3">
            <svg width="52" height="37" viewBox="0 0 52 37" fill="none">
              <rect width="52" height="37" fill="#6C63FF" />
            </svg>
          </div>
          <div className="text-black/80 dark:text-dark-text font-times text-2xl font-bold transition-colors duration-300">
            FLOWWAVE
          </div>
        </div>
        
        <div className="flex items-center gap-10">
          <svg className="w-12 h-12 text-primary-blue cursor-pointer hover:text-primary-pink transition-colors duration-200" viewBox="0 0 50 50" fill="none">
            <path d="M35.416 24.5924C35.416 23.8722 35.416 23.5122 35.5243 23.1913C35.8393 22.2588 36.6698 21.8972 37.5016 21.5182C38.4368 21.0922 38.9043 20.8793 39.3677 20.8418C39.8937 20.7992 40.4206 20.9126 40.8702 21.1649C41.4662 21.4993 41.8818 22.1349 42.3075 22.6518C44.2729 25.0388 45.2554 26.2326 45.615 27.5488C45.9052 28.6109 45.9052 29.7218 45.615 30.7838C45.0906 32.7036 43.4337 34.313 42.2073 35.8026C41.58 36.5645 41.2662 36.9455 40.8702 37.1678C40.4206 37.4201 39.8937 37.5334 39.3677 37.4909C38.9043 37.4534 38.4368 37.2405 37.5016 36.8145C36.6698 36.4355 35.8393 36.0738 35.5243 35.1413C35.416 34.8205 35.416 34.4605 35.416 33.7403V24.5924Z" stroke="currentColor" strokeWidth="3"/>
            <path d="M14.5827 24.5925C14.5827 23.6859 14.5572 22.8709 13.8242 22.2334C13.5575 22.0015 13.204 21.8404 12.4971 21.5184C11.5619 21.0925 11.0943 20.8796 10.6309 20.8421C9.24083 20.7296 8.49293 21.6784 7.69129 22.6521C5.72591 25.0392 4.74322 26.2327 4.38364 27.549C4.09347 28.6113 4.09347 29.7221 4.38364 30.7842C4.9081 32.704 6.56502 34.3132 7.79145 35.8029C8.56454 36.7419 9.30304 37.5986 10.6309 37.4913C11.0943 37.4538 11.5619 37.2407 12.4971 36.8148C13.204 36.4927 13.5575 36.3317 13.8242 36.0998C14.5572 35.4623 14.5827 34.6475 14.5827 33.7407V24.5925Z" stroke="currentColor" strokeWidth="3"/>
            <path d="M41.6673 21.8753V18.7503C41.6673 10.6962 34.2054 4.16699 25.0007 4.16699C15.7959 4.16699 8.33398 10.6962 8.33398 18.7503V21.8753" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M41.6667 36.458C41.6667 45.833 33.3333 45.833 25 45.833" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          
          <svg className="w-12 h-12 text-primary-blue cursor-pointer hover:text-primary-pink transition-colors duration-200" viewBox="0 0 50 50" fill="none">
            <path d="M32.2923 37.5C32.2923 41.5271 29.0277 44.7917 25.0007 44.7917C20.9736 44.7917 17.709 41.5271 17.709 37.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M40.0648 37.4997H9.93515C7.8999 37.4997 6.25 35.8497 6.25 33.8145C6.25 32.8372 6.63825 31.8999 7.32935 31.2086L8.58608 29.952C9.75819 28.7799 10.4167 27.1901 10.4167 25.5326V19.7913C10.4167 11.7372 16.9459 5.20801 25 5.20801C33.0542 5.20801 39.5833 11.7372 39.5833 19.7913V25.5326C39.5833 27.1901 40.2419 28.7799 41.414 29.952L42.6706 31.2086C43.3617 31.8999 43.75 32.8372 43.75 33.8145C43.75 35.8497 42.1 37.4997 40.0648 37.4997Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          
          <button 
            onClick={onLogout}
            className="flex px-3 py-3 justify-center items-center gap-2 rounded-lg border-2 border-primary-blue text-primary-blue font-bold text-lg hover:bg-primary-blue hover:text-white transition-all duration-300 min-w-40"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-8">
        {/* Send Money Section */}
        <div className="flex flex-col items-center gap-10 w-full max-w-lg mb-16">
          <h1 className="text-primary-pink text-3xl font-bold">Send Money</h1>
          
          {/* You Send Section */}
          <div className="w-full bg-secondary-light rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col gap-4">
                <label className="text-neutral-dark text-base font-normal">You Send</label>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-neutral-gray" viewBox="0 0 20 20" fill="none">
                    <path d="M3.33398 7.5H5.00065V2.5H6.66732L9.51732 7.5H13.334V2.5H15.0007V7.5H16.6673V9.16667H15.0007V10.8333H16.6673V12.5H15.0007V17.5H13.334L10.4757 12.5H6.66732V17.5H5.00065V12.5H3.33398V10.8333H5.00065V9.16667H3.33398V7.5ZM6.66732 7.5H7.60898L6.66732 5.85833V7.5ZM6.66732 9.16667V10.8333H9.51732L8.56732 9.16667H6.66732ZM13.334 14.1667V12.5H12.3757L13.334 14.1667ZM10.4673 9.16667L11.4257 10.8333H13.334V9.16667H10.4673Z" fill="currentColor"/>
                  </svg>
                  <input
                    type="number"
                    value={sendAmount}
                    onChange={(e) => handleSendAmountChange(e.target.value)}
                    className="text-lg font-bold text-neutral-gray bg-transparent border-none outline-none w-20"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-white rounded-2xl px-3 py-1">
                  <div className="w-5 h-5 rounded-full bg-green-500"></div>
                  <span className="text-neutral-dark text-xs font-normal">NGN</span>
                  <svg className="w-2.5 h-2.5 text-neutral-dark" viewBox="0 0 10 5" fill="none">
                    <path d="M5.35355 4.64645C5.15829 4.84171 4.84171 4.84171 4.64645 4.64645L0.853553 0.853553C0.53857 0.53857 0.761654 0 1.20711 0H8.79289C9.23835 0 9.46143 0.538571 9.14645 0.853553L5.35355 4.64645Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Transaction Details */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex flex-col items-center">
                <div className="w-1.5 h-3 bg-primary-blue"></div>
                <div className="w-3 h-3 bg-primary-blue rounded-full my-1"></div>
                <div className="w-1.5 h-3 bg-primary-blue"></div>
                <div className="w-3 h-3 bg-primary-blue rounded-full my-1"></div>
                <div className="w-1.5 h-3 bg-primary-blue"></div>
                <div className="w-3 h-3 bg-primary-blue rounded-full my-1"></div>
                <div className="w-1.5 h-3 bg-primary-blue"></div>
              </div>
              
              <div className="flex justify-between w-full">
                <div className="flex flex-col gap-3">
                  <span className="text-neutral-dark text-xs">Fee:</span>
                  <span className="text-neutral-dark text-xs">Total Pay:</span>
                  <span className="text-neutral-dark text-xs">Rate:</span>
                </div>
                <div className="flex flex-col gap-3 text-right">
                  <span className="text-neutral-dark text-xs">₦{fee.toFixed(2)}</span>
                  <span className="text-neutral-dark text-xs">₦{totalPay.toFixed(2)}</span>
                  <span className="text-neutral-dark text-xs">₦{exchangeRate.toFixed(2)} = $1.00</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Receiver Gets Section */}
          <div className="w-full bg-secondary-light rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-4">
                <label className="text-neutral-dark text-base font-normal">Receiver Gets</label>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-neutral-gray" viewBox="0 0 18 18" fill="none">
                    <path d="M12 6.375H13.5C13.5 4.24725 11.4337 3.27675 9.75 3.05325V1.5H8.25V3.05325C6.56625 3.27675 4.5 4.24725 4.5 6.375C4.5 8.4045 6.4995 9.45975 8.25 9.6975V13.425C7.164 13.2367 6 12.657 6 11.625H4.5C4.5 13.5667 6.31875 14.7143 8.25 14.952V16.5H9.75V14.9475C11.4337 14.724 13.5 13.7528 13.5 11.625C13.5 9.49725 11.4337 8.52675 9.75 8.30325V4.575C10.7475 4.75425 12 5.28075 12 6.375ZM6 6.375C6 5.28075 7.2525 4.75425 8.25 4.575V8.17425C7.22175 7.9845 6 7.42275 6 6.375ZM12 11.625C12 12.7192 10.7475 13.2457 9.75 13.425V9.825C10.7475 10.0043 12 10.5308 12 11.625Z" fill="currentColor"/>
                  </svg>
                  <span className="text-lg font-bold text-neutral-gray">{receiveAmount}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-white rounded-2xl px-3 py-1">
                  <div className="w-5 h-5 rounded-full bg-blue-500"></div>
                  <span className="text-neutral-dark text-xs font-normal">USD</span>
                  <svg className="w-2.5 h-2.5 text-neutral-dark" viewBox="0 0 10 5" fill="none">
                    <path d="M5.35355 4.64645C5.15829 4.84171 4.84171 4.84171 4.64645 4.64645L0.853553 0.853553C0.53857 0.53857 0.761654 0 1.20711 0H8.79289C9.23835 0 9.46143 0.538571 9.14645 0.853553L5.35355 4.64645Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Continue Button */}
          <button 
            onClick={handleContinue}
            className="flex px-6 py-3 justify-center items-center gap-2 rounded-lg bg-primary-blue text-white font-bold text-lg hover:bg-primary-blue/90 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 w-full max-w-md"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-end gap-30 bg-white dark:bg-dark-surface rounded-3xl px-6 py-6 shadow-soft dark:shadow-dark-soft">
          <div 
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 ${activeTab === 'home' ? 'text-primary-blue' : 'text-neutral-gray hover:text-primary-blue'}`}
            onClick={() => setActiveTab('home')}
          >
            <svg className="w-12 h-12" viewBox="0 0 50 50" fill="none">
              <path d="M6.25 24.978V30.208C6.25 37.0826 6.25 40.5199 8.38569 42.6557C10.5214 44.7913 13.9587 44.7913 20.8333 44.7913H29.1667C36.0412 44.7913 39.4785 44.7913 41.6144 42.6557C43.75 40.5199 43.75 37.0826 43.75 30.208V24.978C43.75 21.4753 43.75 19.7241 43.0085 18.2081C42.2671 16.6921 40.8848 15.6169 38.12 13.4666L33.9533 10.2258C29.6523 6.88061 27.5019 5.20801 25 5.20801C22.4981 5.20801 20.3477 6.88061 16.0467 10.2258L11.88 13.4666C9.11527 15.6169 7.7329 16.6921 6.99146 18.2081C6.25 19.7241 6.25 21.4753 6.25 24.978Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M31.25 35.417C29.5844 36.7137 27.3963 37.5003 25 37.5003C22.6036 37.5003 20.4157 36.7137 18.75 35.417" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-normal">Home</span>
          </div>
          
          <div 
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 ${activeTab === 'transactions' ? 'text-primary-blue' : 'text-neutral-gray hover:text-primary-blue'}`}
            onClick={() => setActiveTab('transactions')}
          >
            <svg className="w-12 h-12" viewBox="0 0 50 50" fill="none">
              <path d="M34.1418 6.25L36.2312 8.28279C37.1646 9.19094 37.6312 9.64502 37.4668 10.0309C37.3027 10.4167 36.6427 10.4167 35.3227 10.4167H19.154C10.8763 10.4167 4.16602 16.9459 4.16602 25C4.16602 28.0983 5.1591 30.9713 6.85247 33.3333" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.8574 43.7503L13.7682 41.7176C12.8349 40.8093 12.3682 40.3553 12.5324 39.9695C12.6967 39.5837 13.3567 39.5837 14.6766 39.5837H30.8454C39.1229 39.5837 45.8333 33.0545 45.8333 25.0003C45.8333 21.902 44.8402 19.0291 43.1469 16.667" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-normal">Transactions</span>
          </div>
          
          <div 
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 ${activeTab === 'recipients' ? 'text-primary-blue' : 'text-neutral-gray hover:text-primary-blue'}`}
            onClick={() => setActiveTab('recipients')}
          >
            <svg className="w-12 h-12" viewBox="0 0 51 50" fill="none">
              <path d="M25.3375 9.97926C35.2839 6.58844 40.2571 4.89305 42.9321 7.56794C45.6069 10.2428 43.9114 15.2161 40.5208 25.1625L38.2117 31.9358C35.6077 39.5746 34.3056 43.394 32.1592 43.71C31.5823 43.795 30.985 43.744 30.4139 43.5606C28.2906 42.879 27.1681 38.8519 24.9231 30.7979C24.4252 29.0115 24.1762 28.1181 23.6092 27.4358C23.4446 27.2379 23.2621 27.0554 23.0642 26.8908C22.3819 26.3238 21.4885 26.0748 19.7022 25.5769C11.6481 23.3319 7.62112 22.2094 6.93937 20.086C6.75608 19.5151 6.70493 18.9178 6.78991 18.3407C7.10599 16.1944 10.9254 14.8924 18.5642 12.2883L25.3375 9.97926Z" stroke="currentColor" strokeWidth="3"/>
            </svg>
            <span className="text-xs font-normal">Recipients</span>
          </div>
          
          <div 
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 ${activeTab === 'profile' ? 'text-primary-blue' : 'text-neutral-gray hover:text-primary-blue'}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg className="w-12 h-12" viewBox="0 0 51 50" fill="none">
              <path d="M35.9173 17.7087C35.9173 11.9557 31.2536 7.29199 25.5007 7.29199C19.7477 7.29199 15.084 11.9557 15.084 17.7087C15.084 23.4616 19.7477 28.1253 25.5007 28.1253C31.2536 28.1253 35.9173 23.4616 35.9173 17.7087Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M40.0827 42.7083C40.0827 34.6542 33.5535 28.125 25.4993 28.125C17.4452 28.125 10.916 34.6542 10.916 42.7083" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-normal">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;