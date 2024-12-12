import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';


const Header = () => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(username !== '');
  const [hasActiveRental, setHasActiveRental] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkActiveRental = async () => {
      if (!isAuthenticated) {
        return
      }

      try {
        const rentalResponse = await axiosInstance.get('/rentals/current');
        if (rentalResponse.data) {
          setHasActiveRental(true); // Установить флаг, если аренда активна
        } else {
          setHasActiveRental(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Нет текущей аренды (404 означает отсутствие активной аренды)
          setHasActiveRental(false);
        } else {
          console.error('Error checking active rental:', error);
          alert('Не удалось проверить состояние аренды.');
        }
      }
    };

    checkActiveRental();
    }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    // Дополнительные действия, например, удаление токена
    localStorage.clear();
    navigate('/logout');
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img className='me-2 rounded' width="35" src={`${process.env.PUBLIC_URL}/logo-car.png`} />
            Каршеринг
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  На главную
                </Link>
              </li>
              {!isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Войти
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      Регистрация
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/cars">
                      Автомобили
                    </Link>
                  </li>
                  <li className="nav-item">
                    <span className="navbar-text">Добро пожаловать, {username}!</span>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-light btn-sm ms-2"
                    >
                      Выйти
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {hasActiveRental && (
      <div className="bg-warning text-center p-1">
        <span>У вас есть арендованное авто: </span>
        <Link to="/rental" className="text-dark fw-bold">
          К текущей аренде
        </Link>
      </div>
      )}
    </header>
  );

  // return (
  //   <header className="header">
  //     <nav className="nav">
  //       <ul className="nav-list">
  //         <li className="nav-item">
  //           <Link to="/">На главную</Link>
  //         </li>
  //         {!isAuthenticated ? (
  //           <>
  //             <li className="nav-item">
  //               <Link to="/login">Войти</Link>
  //             </li>
  //             <li className="nav-item">
  //               <Link to="/register">Регистрация</Link>
  //             </li>
  //           </>
  //         ) : (
  //           <>
  //             <li className="nav-item">
  //               <Link to="/cars">Автомобили</Link>
  //             </li>
  //             <li className="nav-item">
  //               <span>Добро пожаловать, {username}!</span>
  //             </li>
  //             <li className="nav-item">
  //               <button onClick={handleLogout} className="logout-button">
  //                 Выйти
  //               </button>
  //             </li>
  //           </>
  //         )}
  //       </ul>
  //     </nav>
  //     {(isAuthenticated && hasActiveRental) ? (
  //           <>
  //             <div className="nav-item">
  //               <Link to="/rental">К текущей аренде</Link>
  //             </div>
  //           </>
  //         ) : (<></>)}
  //   </header>
  // );
};

export default Header;
