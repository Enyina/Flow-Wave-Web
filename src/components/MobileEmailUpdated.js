import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import BackButton from './BackButton';

const MobileEmailUpdated = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProceedToLogin = () => {
    navigate('/mobile-pin-entry');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      {/* Header */}
      <header className={`flex justify-between items-center px-4 lg:px-20 py-4 lg:py-6 ${hasAnimated ? 'animate-slide-in-down animate-once' : 'opacity-0'}`}>
        {/* Back Button and Logo */}
        <div className="flex items-center">
          <BackButton />
          <Logo className="ml-2" />
          <div className="text-black/80 dark:text-dark-text font-times text-lg lg:text-2xl font-bold ml-3 transition-colors duration-300">
            FLOWWAVE
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4 lg:gap-10">
          {/* Customer Service */}
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface transition-all duration-200">
            <svg width="40" height="40" viewBox="0 0 50 50" fill="none" className="w-8 h-8 lg:w-10 lg:h-10">
              <path d="M35.416 24.5924C35.416 23.8722 35.416 23.5122 35.5243 23.1913C35.8393 22.2588 36.6698 21.8972 37.5016 21.5182C38.4368 21.0922 38.9043 20.8793 39.3677 20.8418C39.8937 20.7992 40.4206 20.9126 40.8702 21.1649C41.4662 21.4993 41.8818 22.1349 42.3075 22.6518C44.2729 25.0388 45.2554 26.2326 45.615 27.5488C45.9052 28.6109 45.9052 29.7218 45.615 30.7838C45.0906 32.7036 43.4337 34.313 42.2073 35.8026C41.58 36.5645 41.2662 36.9455 40.8702 37.1678C40.4206 37.4201 39.8937 37.5334 39.3677 37.4909C38.9043 37.4534 38.4368 37.2405 37.5016 36.8145C36.6698 36.4355 35.8393 36.0738 35.5243 35.1413C35.416 34.8205 35.416 34.4605 35.416 33.7403V24.5924Z" stroke="#3A49A4" strokeWidth="3"/>
              <path d="M14.5827 24.5925C14.5827 23.6859 14.5572 22.8709 13.8242 22.2334C13.5575 22.0015 13.204 21.8404 12.4971 21.5184C11.5619 21.0925 11.0943 20.8796 10.6309 20.8421C9.24083 20.7296 8.49293 21.6784 7.69129 22.6521C5.72591 25.0392 4.74322 26.2327 4.38364 27.549C4.09347 28.6113 4.09347 29.7221 4.38364 30.7842C4.9081 32.704 6.56502 34.3132 7.79145 35.8029C8.56454 36.7419 9.30304 37.5986 10.6309 37.4913C11.0943 37.4538 11.5619 37.2407 12.4971 36.8148C13.204 36.4927 13.5575 36.3317 13.8242 36.0998C14.5572 35.4623 14.5827 34.6475 14.5827 33.7407V24.5925Z" stroke="#3A49A4" strokeWidth="3"/>
              <path d="M41.6673 21.8753V18.7503C41.6673 10.6962 34.2054 4.16699 25.0007 4.16699C15.7959 4.16699 8.33398 10.6962 8.33398 18.7503V21.8753" stroke="#3A49A4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M41.6667 36.458C41.6667 45.833 33.3333 45.833 25 45.833" stroke="#3A49A4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Notifications */}
          <button 
            onClick={() => navigate('/notifications')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface transition-all duration-200"
          >
            <svg width="40" height="40" viewBox="0 0 50 50" fill="none" className="w-8 h-8 lg:w-10 lg:h-10">
              <path d="M32.2923 37.5C32.2923 41.5271 29.0277 44.7917 25.0007 44.7917C20.9736 44.7917 17.709 41.5271 17.709 37.5" stroke="#3A49A4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M40.0648 37.4997H9.93515C7.8999 37.4997 6.25 35.8497 6.25 33.8145C6.25 32.8372 6.63825 31.8999 7.32935 31.2086L8.58608 29.952C9.75819 28.7799 10.4167 27.1901 10.4167 25.5326V19.7913C10.4167 11.7372 16.9459 5.20801 25 5.20801C33.0542 5.20801 39.5833 11.7372 39.5833 19.7913V25.5326C39.5833 27.1901 40.2419 28.7799 41.414 29.952L42.6706 31.2086C43.3617 31.8999 43.75 32.8372 43.75 33.8145C43.75 35.8497 42.1 37.4997 40.0648 37.4997Z" stroke="#3A49A4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 lg:px-6 lg:py-3 border-2 border-primary-blue text-primary-blue rounded-lg font-bold text-sm lg:text-lg hover:bg-primary-blue hover:text-white transition-all duration-300"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center px-4 lg:px-0 pb-32">
        <div className={`w-full max-w-lg ${hasAnimated ? 'animate-fade-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          
          {/* Success Icon and Content */}
          <div className="flex flex-col items-center gap-10 mb-10">
            {/* Success Icon */}
            <div className="w-40 h-36">
              <svg width="150" height="135" viewBox="0 0 150 135" fill="none" className="w-full h-full">
                <g clipPath="url(#clip0_1351_3296)">
                  <path d="M148.683 51.6267C148.63 51.6268 148.577 51.6103 148.533 51.5794L75.7544 0.763046C75.5329 0.609122 75.2697 0.526862 75.0002 0.527323C74.7307 0.527784 74.4678 0.610942 74.2469 0.765622L1.99248 51.5789C1.93533 51.6191 1.8646 51.6349 1.79584 51.6228C1.72708 51.6107 1.66593 51.5717 1.62585 51.5144C1.58576 51.4571 1.57002 51.3862 1.58209 51.3173C1.59416 51.2483 1.63304 51.187 1.69019 51.1468L73.9447 0.333534C74.254 0.117014 74.6221 0.000624144 74.9994 2.5032e-06C75.3767 -0.000619138 75.7451 0.114556 76.0552 0.330055L148.834 51.1463C148.88 51.1784 148.914 51.2244 148.932 51.2776C148.951 51.3308 148.951 51.3884 148.934 51.442C148.918 51.4956 148.884 51.5424 148.839 51.5756C148.794 51.6088 148.739 51.6268 148.683 51.6267Z" fill="#3F3D56"/>
                  <path d="M6.12305 53.4284L75.0736 2.19531L144.547 57.0739L78.6262 96.2541L42.8367 88.0751L6.12305 53.4284Z" fill="#E6E6E6"/>
                  <path d="M75.6176 66.2625C74.0477 66.2654 72.5195 65.7565 71.2634 64.8124L71.1855 64.7538L54.7879 52.1667C54.0285 51.5833 53.3911 50.8557 52.9122 50.0254C52.4333 49.195 52.1221 48.2783 51.9966 47.3274C51.871 46.3765 51.9335 45.4102 52.1805 44.4835C52.4275 43.5568 52.854 42.688 53.4359 41.9266C54.0178 41.1653 54.7435 40.5263 55.5717 40.0461C56.3999 39.5659 57.3143 39.254 58.2627 39.1281C59.2111 39.0022 60.175 39.0649 61.0992 39.3125C62.0235 39.5601 62.8901 39.9878 63.6495 40.5711L74.2706 48.7364L99.3701 15.9183C99.9522 15.1571 100.678 14.5183 101.507 14.0384C102.335 13.5585 103.249 13.2469 104.198 13.1214C105.146 12.9959 106.11 13.0589 107.034 13.3068C107.958 13.5548 108.825 13.9828 109.584 14.5665L109.428 14.7789L109.588 14.5696C111.12 15.7496 112.122 17.4905 112.374 19.4103C112.627 21.3301 112.11 23.2721 110.936 24.8101L81.4135 63.4121C80.7307 64.3016 79.8526 65.0214 78.8475 65.5158C77.8423 66.0101 76.7371 66.2656 75.6176 66.2625Z" fill="#6C63FF"/>
                </g>
                <defs>
                  <clipPath id="clip0_1351_3296">
                    <rect width="150" height="135" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-center text-xl lg:text-2xl font-bold text-black">
                Your email address has been updated
              </h1>
              <p className="text-center text-black text-base">
                Olumide, you have successfully updated your email address
              </p>
            </div>
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceedToLogin}
            className="w-full py-3 bg-primary-blue text-white text-lg font-bold rounded-lg hover:bg-primary-blue/90 transition-all duration-300"
          >
            Proceed to Login
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface shadow-soft dark:shadow-dark-soft px-6 py-6 ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '1.2s' }}>
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-neutral-gray">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" className="w-10 h-10">
              <path d="M6.25 24.978V30.208C6.25 37.0826 6.25 40.5199 8.38569 42.6557C10.5214 44.7913 13.9587 44.7913 20.8333 44.7913H29.1667C36.0412 44.7913 39.4785 44.7913 41.6144 42.6557C43.75 40.5199 43.75 37.0826 43.75 30.208V24.978C43.75 21.4753 43.75 19.7241 43.0085 18.2081C42.2671 16.6921 40.8848 15.6169 38.12 13.4666L33.9533 10.2258C29.6523 6.88061 27.5019 5.20801 25 5.20801C22.4981 5.20801 20.3477 6.88061 16.0467 10.2258L11.88 13.4666C9.11527 15.6169 7.7329 16.6921 6.99146 18.2081C6.25 19.7241 6.25 21.4753 6.25 24.978Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M31.25 35.417C29.5844 36.7137 27.3963 37.5003 25 37.5003C22.6036 37.5003 20.4157 36.7137 18.75 35.417" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>

          <button onClick={() => navigate('/transactions')} className="flex flex-col items-center gap-1 text-neutral-gray">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" className="w-10 h-10">
              <path d="M34.1418 6.25L36.2312 8.28279C37.1646 9.19094 37.6312 9.64502 37.4668 10.0309C37.3027 10.4167 36.6427 10.4167 35.3227 10.4167H19.154C10.8763 10.4167 4.16602 16.9459 4.16602 25C4.16602 28.0983 5.1591 30.9713 6.85247 33.3333" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.8574 43.7503L13.7682 41.7176C12.8349 40.8093 12.3682 40.3553 12.5324 39.9695C12.6967 39.5837 13.3567 39.5837 14.6766 39.5837H30.8454C39.1229 39.5837 45.8333 33.0545 45.8333 25.0003C45.8333 21.902 44.8402 19.0291 43.1469 16.667" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium">Transactions</span>
          </button>

          <button onClick={() => navigate('/recipients')} className="flex flex-col items-center gap-1 text-neutral-gray">
            <svg width="51" height="50" viewBox="0 0 51 50" fill="none" className="w-10 h-10">
              <path d="M25.3375 9.97926C35.2839 6.58844 40.2571 4.89305 42.9321 7.56794C45.6069 10.2428 43.9114 15.2161 40.5208 25.1625L38.2117 31.9358C35.6077 39.5746 34.3056 43.394 32.1592 43.71C31.5823 43.795 30.985 43.744 30.4139 43.5606C28.2906 42.879 27.1681 38.8519 24.9231 30.7979C24.4252 29.0115 24.1762 28.1181 23.6092 27.4358C23.4446 27.2379 23.2621 27.0554 23.0642 26.8908C22.3819 26.3238 21.4885 26.0748 19.7022 25.5769C11.6481 23.3319 7.62112 22.2094 6.93937 20.086C6.75608 19.5151 6.70493 18.9178 6.78991 18.3407C7.10599 16.1944 10.9254 14.8924 18.5642 12.2883L25.3375 9.97926Z" stroke="currentColor" strokeWidth="3"/>
            </svg>
            <span className="text-xs font-medium">Recipients</span>
          </button>

          <button onClick={() => navigate('/account')} className="flex flex-col items-center gap-1 text-primary-blue">
            <svg width="51" height="50" viewBox="0 0 51 50" fill="none" className="w-10 h-10">
              <path d="M35.9173 17.7087C35.9173 11.9557 31.2536 7.29199 25.5007 7.29199C19.7477 7.29199 15.084 11.9557 15.084 17.7087C15.084 23.4616 19.7477 28.1253 25.5007 28.1253C31.2536 28.1253 35.9173 23.4616 35.9173 17.7087Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M40.0827 42.7083C40.0827 34.6542 33.5535 28.125 25.4993 28.125C17.4452 28.125 10.916 34.6542 10.916 42.7083" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default MobileEmailUpdated;
