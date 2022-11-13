import React from "react";
import "../styles/BeatLoader/BeatLoader.scss";

export default function BeatLoader() {
    return (
        <div className="beat-loader">
            <span className="double"></span>
            <span className="single"></span>
            <span className="double"></span>
        </div>
    );
}
