import 'bootstrap/dist/css/bootstrap.min.css'

import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useLocation, BrowserRouter as Router, Route } from 'react-router-dom'

import HomePage from './components/HomePage/HomePage'
import Layout from './components/Layout/Layout'
import DSBlocksPage from './components/ViewAllPages/DSBlocksPage/DSBlocksPage'
import TxBlocksPage from './components/ViewAllPages/TxBlocksPage/TxBlocksPage'
import TxnsPage from './components/ViewAllPages/TxnsPage/TxnsPage'
import DSBlockDetailsPage from './components/DetailsPages/DSBlockDetailsPage/DSBlockDetailsPage'
import TxBlockDetailsPage from './components/DetailsPages/TxBlockDetailsPage/TxBlockDetailsPage'
import TxnDetailsPage from './components/DetailsPages/TxnDetailsPage/TxnDetailsPage'
import AddressDetailsPage from './components/DetailsPages/AddressDetailsPage/AddressDetailsPage'
import * as serviceWorker from './serviceWorker'
import { NetworkProvider } from './services/networkProvider'

import './index.css'

const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const prevLocation = useRef<string>();

  useEffect(() => {
    if (prevLocation.current !== location.pathname) {
      window.scrollTo(0, 0)
      prevLocation.current = location.pathname;
    }
  }, [location])

  return <>{children}</>
}

ReactDOM.render(
  <>
    <Router>
      <NetworkProvider>
        <Layout>
          <React.StrictMode>
            <ScrollToTop>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/dsbk" component={DSBlocksPage} />
              <Route path={`/dsbk/:blockNum`}><DSBlockDetailsPage /></Route>
              <Route exact path="/txbk" component={TxBlocksPage} />
              <Route path={`/txbk/:blockNum`}><TxBlockDetailsPage /></Route>
              <Route exact path="/tx" component={TxnsPage} />
              <Route path={`/tx/:txnHash`}><TxnDetailsPage /></Route>
              <Route path="/address/:addr" component={AddressDetailsPage} />
            </ScrollToTop>
          </React.StrictMode>
        </Layout>
      </NetworkProvider>
    </Router>
  </>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
