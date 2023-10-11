import './AccountBtn.css';

import { Link } from 'react-router-dom';

function AccountBtn({ onClose }) {
  return (
    <Link className='account' to="/profile" onClick={onClose ?? undefined}>
    <p className='account-text'>Аккаунт</p>
    <div className="account-btn" ></div>
    </Link>
  );
}

export default AccountBtn;