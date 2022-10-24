// https://github.com/devias-io/material-kit-react
import DefaultAxios from 'axios'
import 'react-toastify/dist/ReactToastify.css'
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'
import { ToastContainer } from 'react-toastify'
import { createEmotionCache } from '../theme/createEmotionCahce'
import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { wrapper } from '../redux/store'
import { theme } from '../theme'

DefaultAxios.defaults.baseURL = process.env.NEXT_PUBLIC_HOST

NProgress.configure({ easing: 'ease', speed: 500 });
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const App = (props) => {

  const clientSideEmotionCache = createEmotionCache()

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  return (
    <>
      <Head>
        <title>
          myaccounts.com
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <style global jsx>
        {`
          * {
            user-select: none;
          }
          
          ::-webkit-scrollbar {
            width: 20px;
          }
          
          ::-webkit-scrollbar-track {
            background-color: transparent;
          }
          
          ::-webkit-scrollbar-thumb {
            background-color: #d6dee1;
          }
          
          ::-webkit-scrollbar-thumb {
            background-color: #d6dee1;
            border-radius: 20px;
          }
          
          ::-webkit-scrollbar-thumb {
            background-color: #d6dee1;
            border-radius: 20px;
            border: 6px solid transparent;
            background-clip: content-box;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background-color: #a8bbbf;
          }
                
          .swal2-container{
            z-index: 99999 !important;
          }
          
          .sc-evZas {
            font-size: 13.5px !important;
            font-weight: 700 !important;
          }
          
          .my-date-picker input,
          .my-search input,
          .my-text-input input {
            font-size: 14px !important;
          }
          
          .MuiAutocomplete-input {
            height: 1.4375em !important;
            padding: 0px 10px !important;
          }
          .css-1pwrkdu-MuiInputBase-root-MuiOutlinedInput-root-MuiSelect-root{
            height:37px !important;
          }
          .MuiSelect-select {
            font-size: 14px !important;
          }
          .MuiPickersToolbar-penIconButton {
            display: none !important;
          }
          #nprogress {
            pointer-events: none;
        }
        #nprogress .bar {
            background: #5048E5;
            position: fixed;
            z-index: 1999;
            top: 0;
            left: 0;
            width: 100%;
            height: 3.5px;
        }
        #nprogress .peg {
            display: block;
            position: absolute;
            right: 0px;
            width: 100px;
            height: 100%;
            box-shadow: 0 0 10px #5048E5, 0 0 5px #5048E5;
            opacity: 1.0;
            -webkit-transform: rotate(3deg) translate(0px, -4px);
            -ms-transform: rotate(3deg) translate(0px, -4px);
            transform: rotate(3deg) translate(0px, -4px);
        }        
        `}
      </style>
      <ToastContainer />
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {Component.getLayout ?? ((page) => page)(<Component {...pageProps} />)}
        </ThemeProvider>
      </CacheProvider>
    </>
  )
}

export default wrapper.withRedux(App)
