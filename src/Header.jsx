import "./Header.css"

export default function Header(){
    return (
        <header>
            <div className="header-container">
                <div className="logo"><h3>JOBS</h3></div>
                <div className="header-options">
                    <a href="">Home</a>
                    <a href="">About</a>
                    <a href="">Jobs</a>
                    <a href="">Candidates</a>
                    <a href="">Contact Us</a>
                </div>
                <div className="accounts-btn">
                    <button>Sign Up</button>
                    <button>Sign In</button>
                </div>
            </div>
        </header>
    )
}