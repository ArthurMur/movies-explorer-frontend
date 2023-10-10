import './AccountBtn.css';

import { Link } from 'react-router-dom';

function AccountBtn({ onClose }) {
  return (
    <div className='account'>
    <p className='account-text'>Аккаунт</p>
    <Link className="account-btn" to="/profile" onClick={onClose ?? undefined}></Link>
    </div>
  );
}

export default AccountBtn;