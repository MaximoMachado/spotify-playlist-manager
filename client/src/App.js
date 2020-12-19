import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import { NotFound } from './pages/NotFound/NotFound';
import { Tools } from './pages/Tools/Tools';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path='/'><HomePage /></Route>
                <Route path='/tools'><Tools /></Route>
                <Route path='*'><NotFound /></Route>
            </Switch>
        </Router>
    );
}
export default App;
