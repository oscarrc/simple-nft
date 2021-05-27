import Head from 'next/head'
import Web3 from 'web3';
import { useEffect, useState } from 'react'

export default function Home() {
  const [account, setAccount] = useState(null);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  
  const loadBlockchainData = async () => {
    const web3 = window.web3;
    if(web3){
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    }
  }

  useEffect( async () => {
    await loadWeb3();
    await loadBlockchainData();
  }, [])

  return (
    <div className="page-wrapper is-flex is-flex-direction-column">
      <Head>
        <title>NFToken platform</title>
        <meta name="description" content="NFToken platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item is-size-3">            
              NFToken
            </a>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              { account ? account : '' }
            </div>
          </div>
        </nav>
      </header>

      <main className="is-flex-grow-1">
        <section className="hero container">
          <div className="hero-body">
            <p className="title">
              NFToken
            </p>
            <p className="subtitle">
              Create and sell NFTs
            </p>
          </div>
        </section>
      </main>

      <footer className="footer has-background-primary-light">
        <div className="content has-text-centered">
          <p>
            <strong>NFToken platform</strong>
          </p>
        </div>
      </footer>
    </div>
  )
}
