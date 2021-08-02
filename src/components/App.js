import '../assets/css/app.css';
import { Routes } from "../component.general";
import AppProvider from '../store/AppProvider';

const App = () => {
    return (
        <AppProvider>
            <Routes />
        </AppProvider>
    );
};

export default App;
