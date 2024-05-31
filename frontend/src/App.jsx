import React from "react"
import Home from "./components/Home"

const App = () => {
  return (
    <div className="bg-slate-100 h-screen w-screen">
      <div className="h-16 w-full flex flex-row px-10 items-center">
        <img src="" alt="LOGO" />
      </div>
      <Home />
      <div className="flex flex-row fixed w-full h-12 text-[18px] bottom-0 items-center justify-center">
        Copyright © 2024 Yana. All Rights Reserved
      </div>
    </div>
  )
}

export default App
