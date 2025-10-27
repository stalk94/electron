import { createRoot } from 'react-dom/client';
import { ThemeProvider } from "mistui-kit";
import App from './App';


const container = document.querySelector('.root');
const root = createRoot(container);
root.render(<ThemeProvider><App /></ThemeProvider>);