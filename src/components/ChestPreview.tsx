export default function ChestPreview() {
  return (
    <div className="w-full h-[80%] md:h-[75%] min-h-52 flex flex-col justify-between">
      <div className="w-full h-[15%] bg-type-1 flex items-center justify-center">
        <div className="absolute w-3 h-8 mt-8 md:mt-16 md:h-13 md:w-7 bg-type-2"></div>
      </div>
      <div className="w-full h-[82%] bg-type-1 flex items-center justify-center">
        <div className="grid w-full grid-cols-9 grid-rows-3 gap-1 p-0.5 md:p-2 lg:w-full aspect-3/1 md:gap-2 max-w-125 md:max-w-none">
          {Array.from({ length: 27 }).map((_, i) => (
            <div key={i} className="w-full bg-type-2-hover"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
