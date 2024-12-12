import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Header from '../components/Header';

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [hasActiveRental, setHasActiveRental] = useState(false);
    const navigate = useNavigate();
		const userRole = localStorage.getItem('role');


    useEffect(() => {
        const fetchCars = async () => {
            try {                
                const response = await axiosInstance.get('/cars');
                if (response !== null) {
                    setCars(response.data);
                }
            } catch (error) {
                alert('Failed to fetch cars: ' + error.response?.data.message);
            }
        };

        const checkActiveRental = async () => {
          try {
            const rentalResponse = await axiosInstance.get('/rentals/current');
            if (rentalResponse.data) {
              setHasActiveRental(true); // Установить флаг, если аренда активна
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

        fetchCars();
        checkActiveRental();
    }, []);


    const filteredCars = cars.filter((car) => (
        (statusFilter === 'ALL' ||  car.status === statusFilter) &&
        (`${car.brand} ${car.model}`.toLowerCase().includes(nameFilter.toLowerCase()) || nameFilter === '')
        )
    );

    const handleRentCar = async (carId) => {
        try {
            const response = await axiosInstance.post(`/rentals/rent/${carId}`);
    
          if (response.status === 200) {
            console.log(`Car ${carId} successfully rented!`);
            navigate('/rental'); // Переход на страницу аренды
          } else {
            console.error('Failed to rent the car:', response.status);
            alert('Не удалось арендовать автомобиль. Попробуйте снова.');
          }
        } catch (error) {
          console.error('Error while renting the car:', error);
          alert('Произошла ошибка при аренде автомобиля.');
        }
      };


		const handleRepairCar = async (carId, isRepaired) => {
			try {
				const response = await axiosInstance.put(`/cars/${carId}/repair?inRepair=${isRepaired}`);
				
				if (response.status === 200) {
					// Обновляем состояние списка после успешного изменения статуса
					setCars((prevCars) =>
						prevCars.map((car) =>
							car.id === carId
								? { ...car, status: isRepaired ? 'IN_REPAIR' : 'AVAILABLE' }
								: car
						)
					);
					alert('Статус автомобиля успешно обновлен!');
				}
			} catch (error) {
				console.error('Error updating car status:', error);
      	alert('Не удалось обновить статус автомобиля. Попробуйте снова.');
			}
		};


    return (
      <div>
        <Header />
        <div className="container mt-5">
          <h1 className="text-center mb-4">Список автомобилей</h1>
          {hasActiveRental && (
            <p className="alert alert-danger text-center">
              У вас есть активная аренда. Завершите её, чтобы арендовать другой автомобиль.
            </p>
          )}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Поиск авто..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ maxWidth: '200px' }}
            >
              <option value="ALL">Все</option>
              <option value="AVAILABLE">Доступные</option>
              <option value="RENTED">В аренде</option>
              <option value="IN_REPAIR">В ремонте</option>
            </select>
          </div>
          <ul className="list-group">
            {filteredCars.map((car) => (
              <li
                key={car.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{car.brand} {car.model}</strong> -{' '}
                  {car.status === 'AVAILABLE'
                    ? 'Доступен'
                    : car.status === 'RENTED'
                    ? 'Арендован'
                    : 'На ремонте'}
                </div>
                <div>
                  {userRole === 'USER' && car.status === 'AVAILABLE' && (
                    <button
                      onClick={() => handleRentCar(car.id)}
                      disabled={hasActiveRental}
                      className={`btn btn-sm ${
                        hasActiveRental ? 'btn-secondary' : 'btn-primary'
                      }`}
                    >
                      Арендовать
                    </button>
                  )}
                  {userRole === 'MECHANIC' && (
                    <>
                      {car.status === 'AVAILABLE' && (
                        <button
                          onClick={() => handleRepairCar(car.id, true)}
                          className="btn btn-warning btn-sm ms-2"
                        >
                          На ремонт
                        </button>
                      )}
                      {car.status === 'IN_REPAIR' && (
                        <button
                          onClick={() => handleRepairCar(car.id, false)}
                          className="btn btn-success btn-sm ms-2"
                        >
                          Вернуть с ремонта
                        </button>
                      )}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );


    // return (
    //     <div>
    //         <Header />
    //         <h1>Список автомобилей</h1>
    //         {hasActiveRental && (
    //             <p style={{ color: 'red', marginTop: '20px' }}>
    //             У вас есть активная аренда. Завершите её, чтобы арендовать другой автомобиль.
    //             </p>
    //         )}
    //         <input
    //             type="text"
    //             placeholder="Поиск авто..."
    //             value={nameFilter}
    //             onChange={(e) => setNameFilter(e.target.value)}
    //         />
    //         <select onChange={(e) => setStatusFilter(e.target.value)}>
    //             <option value="ALL">Все</option>
    //             <option value="AVAILABLE">Доступные</option>
    //             <option value="RENTED">В аренде</option>
    //             <option value="IN_REPAIR">В ремонте</option>
    //         </select>
    //         <ul>
    //             {filteredCars.map((car) => (
    //                 <li key={car.id}>
    //                     {car.brand} {car.model} - {car.status === 'AVAILABLE' ? 'Доступен' : (car.status === 'RENTED' ? 'Арендован' : 'На ремонте')}
		// 										{userRole === 'USER' && (
		// 											<>
		// 											{car.status === 'AVAILABLE' && (
		// 												<button
		// 														onClick={() => handleRentCar(car.id)}
		// 														disabled={hasActiveRental} // Отключаем кнопку, если есть активная аренда
		// 														style={{
		// 														marginLeft: '10px',
		// 														cursor: hasActiveRental ? 'not-allowed' : 'pointer',
		// 														backgroundColor: hasActiveRental ? '#ccc' : '#007bff',
		// 														color: hasActiveRental ? '#666' : '#fff',
		// 														}}
		// 												>
		// 														Арендовать
		// 												</button>
		// 												)}
		// 												</>
		// 										)}
		// 										{userRole === 'MECHANIC' && (
		// 											<>
		// 											{car.status === 'AVAILABLE' && (
		// 												<button 
		// 													onClick={() => handleRepairCar(car.id, true)}
		// 													style= {{marginLeft: '10px'}}
		// 												>На ремонт</button>
		// 											)}
		// 											{car.status === 'IN_REPAIR' && (
		// 												<button 
		// 													onClick={() => handleRepairCar(car.id, false)}
		// 													style= {{marginLeft: '10px'}}
		// 												>Вернуть с ремонта</button>
		// 											)}
		// 											</>
		// 										)}
    //                 </li>
    //             ))}
    //         </ul>
    //     </div>
    // );
};

export default Cars;
