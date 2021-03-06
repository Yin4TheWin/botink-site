import React, { useRef, useEffect } from 'react';
import { useLocation, Switch, HashRouter } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';

// Layouts
import LayoutDefault from './layouts/LayoutDefault';

// Views 
import Home from './views/Home';
import Dashboard from './views/Dashboard'
import Edit from './views/Edit'
import NotFound from './views/404'
import Terms from './components/sections/ToC'
import Privacy from './components/sections/Privacy'

const App = () => {

  const childRef = useRef();
  let location = useLocation();

  useEffect(() => {
    const page = location.pathname;
    document.body.classList.add('is-loaded')
    childRef.current.init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <ScrollReveal
    ref={childRef}
    children={() => (
      <HashRouter>
      <Switch>
        <AppRoute path="/edit/:uid/:name" component={Edit} layout={LayoutDefault} />
        <AppRoute exact path="/dashboard" component={Dashboard} layout={LayoutDefault} />
        <AppRoute exact path="/toc" component={Terms} layout={LayoutDefault} />
        <AppRoute exact path="/privacy" component={Privacy} layout={LayoutDefault} />
        <AppRoute exact path="/" component={Home} layout={LayoutDefault} />
        {/* <AppRoute component={NotFound} layout={LayoutDefault} /> */}
      </Switch>
      </HashRouter>
    )} />
  );
}

export default App;