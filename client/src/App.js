import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import { NotFound } from './pages/NotFound/NotFound';
import { Tools } from './pages/Tools/Tools';
import { MultiplePlaylistSearcher } from './pages/MultiplePlaylistSearcher/MultiplePlaylistSearcher';
import { TrueRandomShuffle } from './pages/TrueRandomShuffle/TrueRandomShuffle';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path='/'><HomePage /></Route>
                <Route path='/tools'><Tools /></Route>

                <Route path='/multiple-playlist-searcher'><MultiplePlaylistSearcher /></Route>
                <Route path='/true-random-shuffle'><TrueRandomShuffle /></Route>
                <Route path='/playlist-set-operations'><NotFound /></Route>

                <Route path='*'><NotFound /></Route>
            </Switch>
        </Router>
    );
}
export default App;
