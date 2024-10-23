import { createRoot } from 'react-dom/client';
import MainView from './components/MainView/MainView';
import "./index.scss"; // Import your custom SCSS

// Main component (will eventually use all the others)
const MyFlixApplication = () => {
  return <MainView />;
};

// Finds the root of your app
const container = document.getElementById("root"); // Make sure to use "getElementById"
const root = createRoot(container);

// Tells React to render your app in the root DOM element
root.render(<MyFlixApplication />);
