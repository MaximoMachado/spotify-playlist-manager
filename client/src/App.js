import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';

function App() {
    return (
        <Router>
            <Switch>
                <Route path='/'><HomePage /></Route>
            </Switch>
        </Router>
    );
}
export default App;
