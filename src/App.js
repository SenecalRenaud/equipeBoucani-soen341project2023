import React from 'react'
//note to self, to start localhost : npm start

//makes use of the index.js files in both sections, from cleaner looking code 
import { Footer, Blog, Possibility, Features, WhatGPT3, Header } from './containers';
import { CTA, Brand, Navbar} from './components';
import './App.css';


const App = () => {
  return (
    <div className='App'>
        <div className='gradient__bg'>
          <Navbar />
          <Header />
        </div>
        <Brand />
        <WhatGPT3 />
        <Features />
        <Possibility />
        <CTA />
        <Blog />
        <Footer />
    </div>
  )
}
//27.22
export default App