import lazy from '../../utils/lazy';
const Home = lazy(() => import('./pages/Home'));
// import Home from './pages/Home';
export default [
  {
    path: '/home.html',
    component: Home,
    exact: true
  }
];
