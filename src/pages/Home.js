import React from 'react';
import Header from '../components/Header';

const Home = () => {
  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="text-center">
          <img className="img-fluid rounded" width="500" src={`${process.env.PUBLIC_URL}/avto-gorod.jpg`} alt="logo" />
          <h1 className="display-4 mb-4">Главная страница</h1>
          <p className="lead">
            Добро пожаловать в сервис каршеринга! Зарегистрируйтесь, если вы еще этого не сделали.
            Иначе вы не сможете пользоваться данным сервисом.
          </p>
          <div className="alert alert-primary mt-4" role="alert">
            Испытай на себе силу каршеринга!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;