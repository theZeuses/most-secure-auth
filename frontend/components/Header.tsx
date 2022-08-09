function Header() {
  return (
    <div>
        <nav className="relative w-full flex flex-wrap items-center justify-between py-3 bg-gray-900 text-gray-200 shadow-lg navbar navbar-expand-lg navbar-light" >
            <div className="container-fluid w-full flex flex-wrap items-center justify-between px-6">
                <div className="collapse navbar-collapse flex-grow items-center" id="navbarSupportedContent1">
                <span className="text-xl text-white pr-2 font-semibold">SAuth</span>
                </div>
            </div>
        </nav>
    </div>
  )
}

export default Header