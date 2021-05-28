import Head from 'next/head'
import Web3 from 'web3';
import Color from '../build/contracts/Color.json'; 
import { useEffect, useState } from 'react'

export default function Home() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [colors, setColors] = useState([]);
  const [color, setColor] = useState(null);

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
    
    if(!web3) return;

    const accounts = await web3.eth.getAccounts();
    const netId = await web3.eth.net.getId();
    const netData = Color.networks[netId];

    if(!netData) return;

    const abi = Color.abi;
    const address = netData.address;
    const contract = new web3.eth.Contract(abi, address);

    if(!contract) return;

    const totalSupply = await contract.methods.totalSupply().call();

    for(let i = 0; i < totalSupply; i++){
      let color = await contract.methods.colors(i).call();
      setColors(colors => [...colors, color]);
    }
    
    setAccount(accounts[0] || null);
    setContract(contract);
  }

  const mintToken = (event) => {
    event.preventDefault();
    contract.methods.mint(color).send({ from: account }).once('receipt', () => {
      setColors([...colors, color])
    }).on('error', (e) => {
      console.log(e)
    });
  }

  useEffect( async () => {
    setColors([]);
    await loadWeb3();
    await loadBlockchainData();
  }, [])

  return (
    <div className="page-wrapper is-flex is-flex-direction-column">
      <Head>
        <title>Colored NFTs platform</title>
        <meta name="description" content="Colored NFTs platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item is-size-3">            
              Color NFT
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
        <section className="container mt-4">
          <div className="columns is-flex is-align-items-center">
            <div className="hero column">
              <div className="hero-body">
                <p className="title">
                  Color (CLR)
                </p>
                <p className="subtitle">
                  Colored NFTs
                </p>
              </div>
            </div>
            <div className="column is-flex is-flex-direction-column	is-align-items-center">
              <h2 className="is-size-4">Issue a new token</h2>
              <form className="pt-2" onSubmit={ (event) => mintToken(event) }>
                <div className="field has-addons">
                  <div className="control">
                    <input className="input is-primary" type="text" placeholder="Hex color code (#FFFFFF)" onChange={(event) => setColor(event.target.value) }/>
                  </div>
                  <div className="control">
                    <button type="submit" className="button is-primary">
                      Create
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
        <hr />
        <section className="container is-flex is-items-content-center is-justify-content-center">
          <div className="tags are-large">
            {
              colors.map( (c, k) => {
                return (<div className="tag has-text-white" key={k} style={{ background: c }}>{c}</div>)
              })
            }
          </div>
        </section>
      </main>

      <footer className="footer has-background-primary-light">
        <div className="content has-text-centered">
          <p>
            <strong>Colored NFT platform</strong>
          </p>
        </div>
      </footer>
    </div>
  )
}
