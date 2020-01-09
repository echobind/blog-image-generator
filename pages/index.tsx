import React from 'react'
import Head from 'next/head'
import { ThemeProvider, CSSReset, Heading, Button, Input, FormControl, FormLabel, FormErrorMessage, FormHelperText, Box, Text } from "@chakra-ui/core";
import { customTheme } from '../utils/theme';

const Home = () => {

  const [title, setTitle] = React.useState('')
  const [tagline, setTagline] = React.useState('')
  const [loading, setIsLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [generatedImage, setGeneratedImage] = React.useState('')
  const canvasRef = React.useRef<null | HTMLCanvasElement>()
  const imgRef = React.useRef<null | HTMLImageElement>()

  function drawImage() {
    console.log('drawing image')
    const canvas = canvasRef.current
    const ctx = canvas && canvas.getContext('2d')
    const img = imgRef.current
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    }
    // Add extra delay to wait for canvas to finish drawing
    setTimeout(() => {
      setIsLoading(false)
      setSuccess(true)
    }, 1000)
  }

  async function handleFormSubmit(e) {
    console.log('submitting form')
    setSuccess(false)
    setIsLoading(true)
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

      drawImage()
    } catch (error) {
      console.error(error, 'oops')

    }
  }

  // Source: https://codepen.io/joseluisq/pen/mnkLu
  function download() {
    /// create an "off-screen" anchor tag
    var lnk = document.createElement('a'), e;

    /// the key here is to set the download attribute of the a tag
    lnk.download = 'social-image.png';

    /// convert canvas content to data-uri for link. When download
    /// attribute is set the content pointed to by link will be
    /// pushed as "download" in HTML5 capable browsers
    lnk.href = canvasRef.current.toDataURL("image/png;base64")

    /// create a "fake" click-event to trigger the download
    if (document.createEvent) {
      e = document.createEvent("MouseEvents")
      e.initMouseEvent("click", true, true, window,
        0, 0, 0, 0, 0, false, false, false,
        false, 0, null);

      lnk.dispatchEvent(e)
    }
  }

  return (
    <ThemeProvider theme={customTheme}>
      <CSSReset />
      <Box className='main-app'>
        <Head>
          <title>Home</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Box marginTop={20}>
          <Box textAlign="center" my={5}>
            <Heading as="h1" marginBottom={3}>Echobind's Blog Image Generator</Heading>
            <Text>Use our template to generate a social media image in no time!</Text>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" marginX="auto">
            <FormControl maxWidth={700}>
              <Box display="flex" flexDirection="row" marginTop={2}>
                <Box marginRight={3}>
                  <FormLabel htmlFor="title">Title:</FormLabel>
                  <Input type="text" placeholder="Finding Joy in Automated Tests" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <FormHelperText id="title-helper-text">The title of the blog post.</FormHelperText>
                </Box>
                <Box marginLeft={3}>
                  <FormLabel htmlFor="tagline">Tagline:</FormLabel>
                  <Input type="text" placeholder="Add joy to your dev process with automated e2e tests." value={tagline} onChange={(e) => setTagline(e.target.value)} />
                  <FormHelperText id="tagline-helper-text">A short tagline describing the blog post.</FormHelperText>
                </Box>
              </Box>
              <Box display="flex" justifyContent="center" marginTop={5}>
                <Button marginTop={2} isLoading={loading} onClick={handleFormSubmit}>Generate image</Button>
              </Box>
            </FormControl>
            <Box marginLeft={2} marginTop={10} position="relative">
              {
                success &&
                <Button position="absolute" zIndex={2} top={0} right={0} onClick={download} marginLeft={2} maxWidth={100}>Download</Button>
              }
              <img style={{ display: 'none' }} ref={imgRef} src={generatedImage} alt="generated social image." />
              <canvas ref={canvasRef} width="640" height="335" />
            </Box>
          </Box>
        </Box>

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
      </Box>
    </ThemeProvider >
  )
}

export default Home
