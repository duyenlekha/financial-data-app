import { Route, Routes, useLocation, } from 'react-router-dom';
import StockDataForm from '../Pages/StockDataForm';
import StockTable from '../Pages/StockTable';
import FinancialCalendar from '../Pages/FinancialCalendar';
import {AnimatePresence} from "framer-motion";
import FindTable from '../Pages/FindTable';
import TradesTable from '../Pages/TradesTable';
import TradesCalendar from '../Pages/TradesCalendar';
import TradesForm from '../Pages/TradesForm';




function Content() {
  const location = useLocation();

 

  return (

      <div>

<AnimatePresence>
  <Routes location={location} key={location.pathname}>
    <Route/>
   
          <Route path='' element={<StockTable/>} />
          <Route path='/StockDataForm' element={<StockDataForm/>} />
          <Route path='/FinancialCalendar' element={<FinancialCalendar/>} />
          <Route path='/FindTable' element={<FindTable/>} />
          <Route path='/TradesForm' element={<TradesForm/>} />
          <Route path='/TradesTable' element={<TradesTable/>} />
          <Route path='/TradesCalendar' element={<TradesCalendar/>} />
          
        
    
  </Routes>
</AnimatePresence>



      </div>

  )

}

export default Content;




















