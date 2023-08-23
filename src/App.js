import "./App.css"
import { useEffect, useState } from "react"
import axios from "axios"

function App() {
  const [image, setImage] = useState(null)
  useEffect(() => {
    const handleImage = async () => {
      let uri = await downloadImage({
        name: "logo",
      })
      setImage(uri)
    }
    handleImage()
  }, [])
  return (
    <div className="App">
      <img src={image} />
    </div>
  )
}

export default App

const downloadImage = async ({ name }) => {
  try {
    let isInLocalStorage = await localStorage.getItem(name)
    isInLocalStorage = JSON.parse(isInLocalStorage)
    // check is uri work
    await axios
      .get(isInLocalStorage?.localUri)
      .then((res) => {
        if (res.status !== 200) {
          isInLocalStorage = null
        }
      })
      .catch((error) => {
        isInLocalStorage = null
      })
    if (isInLocalStorage) return isInLocalStorage?.localUri
    // if you don't have uri so request here
    let uri = "https://i.ibb.co/j4Nwkw9/4277e417dd1af4c7a32a87100.jpg"
    let resp = await fetch(uri)
    let blob = await resp.blob()
    let img = document.createElement("img")
    img.src = window.URL.createObjectURL(blob)
    // save in localStorage
    await localStorage.setItem(
      name,
      JSON.stringify({ localUri: img.src, originalUri: uri })
    )
    return img.src
  } catch (error) {
    console.log("downloadImage error ", error)
  }
}
