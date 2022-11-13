
import arrow from "../assets/dropdown-arrow.svg";
import useScroll from "../hooks/useScroll";
function scrollToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

export default function ScrollToTopButton() {
    let isInitialPosition = useScroll();
    return (
        <button className={"scroll-to-top-button " + (!isInitialPosition ? "hidden-button" : "")} onClick={scrollToTop} >
            <img src={arrow} alt="Dropdown arrow icon" height="11" width="11" />
        </button>
    );
}
