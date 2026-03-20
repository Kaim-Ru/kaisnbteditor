import logo from './assets/logo.svg'
import ChestPreview from './components/ChestPreview'
import TemplateBox from './components/TemplateBox'
import NBTEditor from './components/NBTEditor'

function App() {
  return (
    <>
      {/* <p className="text-2xl font-bai-jamjuree text-primary-100">aaa</p>
      <div className="w-30 h-30 bg-type-1"></div>
      <div className="w-30 h-30 bg-type-2"></div> */}
      <header className="flex items-center justify-start flex-none w-full h-10 bg-type-1">
        <img src={logo} alt="Logo" className="inline w-8 mx-1" />
        <span className="-mb-1 text-[1.6rem] font-bai-jamjuree text-primary-300">
          <span className="text-[1.7rem]">K</span>ais
          <span className="text-[1.7rem]">NBTE</span>ditor
        </span>
      </header>
      <main className="flex items-center justify-center w-full h-[calc(100vh-40px)] bg-primary-800 font-bai-jamjuree text-primary-300">
        <div className="w-[95%] h-[90%] md:w-[85%] md:h-[80%] flex items-center justify-start md:justify-center gap-3 md:gap-10 flex-col md:flex-row">
          <div className="h-full w-[90%] md:w-[50%] flex flex-col justify-between">
            <ChestPreview />
            <div className="w-full h-[30%] md:h-[16%] flex justify-between pt-2">
              <div className="w-[48%] h-full bg-type-1-button flex items-center justify-center">
                <span className="text-3xl">Import</span>
              </div>
              <div className="w-[48%] h-full bg-type-1-button flex items-center justify-center">
                <span className="text-3xl">Export</span>
              </div>
            </div>
          </div>
          <div className="md:h-full w-[90%] md:w-[50%] flex flex-col justify-start md:justify-between">
            <TemplateBox />
            <NBTEditor />
          </div>
        </div>
      </main>
    </>
  )
}

export default App
