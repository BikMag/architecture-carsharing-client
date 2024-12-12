import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Header from '../components/Header';

const Rental = () => {
  const [rentalInfo, setRentalInfo] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(''); // Состояние для таймера
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const response = await axiosInstance.get('/rentals/current');

        setRentalInfo(response.data);
      } catch (error) {
        console.error('Error fetching rental info:', error);
        alert('Не удалось загрузить информацию о текущей аренде.');
      }
    };

    fetchRental();
  }, []);


  useEffect(() => {
    if (rentalInfo?.startTime) {
      const startTime = new Date(rentalInfo.startTime);

      const updateElapsedTime = () => {
        const now = new Date();
        const diff = now - startTime; // Разница в миллисекундах        

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      };

      // Обновляем таймер каждую секунду
      const interval = setInterval(updateElapsedTime, 1000);

      // Сразу вычисляем начальное значение
      updateElapsedTime();

      // Очищаем интервал при размонтировании компонента
      return () => clearInterval(interval);
    }
  }, [rentalInfo?.startTime]);


  const handleFinishRental = async () => {
    if (!rentalInfo?.id) {
      alert('Не удалось определить текущую аренду.');
      return;
    }

    try {
      const response = await axiosInstance.post(`/rentals/finish/${rentalInfo.id}`);
      const getResponse = await axiosInstance.get(`/rentals/${rentalInfo.id}`);
      if (response.status === 200) {
        if (getResponse.status === 200) {
          const newRental = getResponse.data;
          alert(`Аренда успешно завершена! К оплате: ${newRental.price}руб.`);
        } else {
          alert(`Аренда завершена, но не удалось получить счет. Посмотрите его в истории аренды`);
        }
        navigate('/'); // Переход на главную страницу
      }
    } catch (error) {
      console.error('Error finishing rental:', error);
      alert('Не удалось завершить аренду. Попробуйте снова.');
    }
  };


  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
    });
  };


  if (!rentalInfo) {
    return (
    <>
      <p>Loading rental information...</p>
      <p>(Maybe you don't have active rentals)</p>
    </>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Текущая аренда</h1>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Информация об аренде</h5>
            <p className="card-text">
              <strong>Автомобиль:</strong> {rentalInfo.car.brand} {rentalInfo.car.model}
            </p>
            <p className="card-text">
              <strong>Начало аренды:</strong> {formatDateTime(rentalInfo.startTime)}
            </p>
            <p className="card-text">
              <strong>Текущая длительность аренды:</strong> {elapsedTime}
            </p>
            <button
              onClick={handleFinishRental}
              className="btn btn-danger mt-3"
            >
              Завершить аренду
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rental;