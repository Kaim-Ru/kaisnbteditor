export default function TemplateBox() {
  return (
    <div className="w-full h-20 md:h-[20%] bg-type-1 flex flex-col min-h-22 md:min-h-28">
      <div className="relative flex items-center justify-center w-full h-8">
        <div className="absolute text-[20px] left-1 top-1 bg-type-1-button">
          ◀
        </div>
        <div className="text-[20px] md:text-[24px] relative top-1">
          Templates
        </div>
        <div className="absolute text-[20px] right-1 top-1 bg-type-1-button">
          ▶
        </div>
      </div>
      <div className="z-10 flex-1">
        <div className="grid grid-cols-8 w-full h-full gap-0.5 md:gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-1">
              <div className="flex items-center justify-center w-full h-full">
                <div className="aspect-square w-[min(100%,100vh)] bg-type-2-hover max-w-12 md:max-w-none"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
