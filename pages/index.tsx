import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'

const Home = () => {

  const [title, setTitle] = React.useState('')
  const [tagline, setTagline] = React.useState('')
  const [generatedImage, setGeneratedImage] = React.useState('')
  const canvasRef = React.useRef<null | HTMLCanvasElement>()
  const imgRef = React.useRef<null | HTMLImageElement>()

  function generateImage() {
    console.log('drawing image')
    const canvas = canvasRef.current
    const img = imgRef.current
    console.log('img', img)
    const ctx = canvas && canvas.getContext('2d')
    ctx.drawImage(img, 0, 0);
  }

  return (
    <div className='main-app'>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />

      <div className="hero">
        <h1 className="title">Welcome to Next.js!</h1>
        <p className="description">
          To get started, edit <code>pages/index.js</code> and save to reload.
      </p>

        <div className="row">
          {generatedImage &&
            <a href={generatedImage} download="test.png">
              <img ref={imgRef} src={generatedImage} alt="generated social image." />
            </a>
          }
          <canvas ref={canvasRef} width="762" height="402" />
          <form onSubmit={async (e) => {
            e.preventDefault()
            try {
              // make call to api
              const response = await fetch('/api/generateSocialImage', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, tagline })
              })

              const data = await response.json();
              // set image url
              await setGeneratedImage(data.url)
              generateImage()

            } catch (error) {
              console.error(error, 'oops')

            }

          }}>
            <input type="text" placeholder="hello" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="hello" value={tagline} onChange={(e) => setTagline(e.target.value)} />
            <button type="submit">Generate image</button>
          </form>
        </div>
      </div>

      <style jsx>{`
      .main-app {
        background-color: black;
        height: 100vh;
      }
      .hero {
        width: 100%;
        color: #fff;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
      .row {
        max-width: 880px;
        margin: 80px auto 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .card {
        padding: 18px 18px 24px;
        width: 220px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9b9b9b;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card h3 {
        margin: 0;
        color: #067df7;
        font-size: 18px;
      }
      .card p {
        margin: 0;
        padding: 12px 0 0;
        font-size: 13px;
        color: #333;
      }
    `}</style>
    </div>
  )
}

export default Home
