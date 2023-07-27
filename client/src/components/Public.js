import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h2>Welcome to <span className="nowrap"><br /> ALTI MINING & CONSTRUCTION SND BHD</span></h2>
            </header>
            <main className="public__main">
                <p></p>
                <address className="public__addr">
                    <br />
                    <br />
                    <br />
                    <a href=""></a>
                </address>
                <br />
                <p></p>
            </main>
            <footer>
                <Link to="/login">Login</Link>
            </footer>
        </section >

    )
    return content
}
export default Public