import './Overlay.css';
import { useEffect } from 'react';

function Overlay({ isOpen, onClose, children }) {

  // Обработчик клика по оверлею
  const handleClickByOverlay = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Эффект для слушания клавиши "Escape" при открытом модальном окне
  useEffect(() => {
    const handleKeyEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
  // Добавляем слушатель события клавиши "Escape" при открытом модальном окне
  isOpen && document.addEventListener('keydown', handleKeyEsc);

    // Очищаем слушатель события после размонтирования компонента
  return () => {
    document.removeEventListener('keydown', handleKeyEsc);
    };
  }, [isOpen, onClose]);

  return (
  <div className={`overlay ${isOpen ? 'overlay_is_opened' : ''}`} onClick={handleClickByOverlay}>
    {children}
  </div>
  );
}

export default Overlay;