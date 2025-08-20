import { Route, Routes, useLocation, } from 'react-router-dom';
import {AnimatePresence} from "framer-motion";
import FindTable from '../find/FindTable';
import TradesTable from '../Pages/TradesTable';
import TradesCalendar from '../Pages/TradesCalendar';
import SecTable from '../Pages/SecTable';
import RulesTable from '../Pages/RulesTable';
import CriteriaTable from '../Pages/CriteriaTable';
import NoteTable from '../Pages/NoteTable';
import Home from '../Pages/Home'
import LearningItemTable from '../Pages/LearningItemTable';





function Content() {
  const location = useLocation();

 

  return (

      <div>

<AnimatePresence>
  <Routes location={location} key={location.pathname}>
    <Route/>
   
          
          <Route path='' element={<Home/>} />
          <Route path='/Home' element={<Home/>} />
          <Route path='/FindTable' element={<FindTable/>} />
          <Route path='/TradesTable' element={<TradesTable/>} />
          <Route path='/TradesCalendar' element={<TradesCalendar/>} />
          <Route path='/SecTable' element={<SecTable/>} />
          <Route path='/RulesTable' element={<RulesTable/>} />
          <Route path='/CriteriaTable' element={<CriteriaTable/>} />
          <Route path='/NoteTable' element={<NoteTable/>} />
          <Route path='/LearningItemTable' element={<LearningItemTable/>} />
          

          
        
    
  </Routes>
</AnimatePresence>



      </div>

  )

}

export default Content;




















