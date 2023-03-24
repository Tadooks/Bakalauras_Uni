import React from 'react'
  
const Home = () => {
  return (
    <div className="Page">
      <h1 align="center">Welcome to the official Melonter store</h1>
      <h2 align="center" >Latest release</h2>

      <div className="homepage">
      
        <p align="center">
          <iframe width="60%" height="600" 
            src="https://www.youtube.com/embed/smfynONka3k"
            title="YouTube video player" frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </p>

        

        <p align="center">
        <h1 align="center" >My links</h1>
          <div class="container">
            <a className='socials' href="https://www.youtube.com/channel/UCv-LvMa1MzfimOXujdeH1Tw" target="_blank">YOUTUBE</a> 
            <a className='socials' href="https://soundcloud.com/melonter" target="_blank">SOUNDCLOUD</a> 
            <a className='socials' href="https://open.spotify.com/artist/1kqCFEFamOJ8VPkZgKGVQn?si=5bi-B_9IQ02X74XrhAMsIg" target="_blank">SPOTIFY</a> 
          </div>
        </p>

      </div>

    </div>
  )
}

  
export default Home