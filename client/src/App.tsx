import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainLayout } from './layouts';
import { CreateModelPage, ModelPage } from './pages';
import './scss/style.scss'

function App() {
  return (
    <Routes>
      <Route path='/model/' element={<ModelPage />} />

      <Route path='/' element={<MainLayout />}>
        <Route path='model/create' element={<CreateModelPage />} />
      </Route>
    </Routes>
  );
}

export default App;
