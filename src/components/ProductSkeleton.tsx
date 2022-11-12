import React from "react";

export default function ProductSkeleton() {
    return (
        <div className="product skeleton">
            <div className="product-image-wrapper loading">
                <div className="product-thumbnail"></div>
            </div>
            <div className="product-text-wrapper">
                <p className={"product-title loading"}></p>
                <p className={"product-price loading"}></p>
            </div>
            <div className="loading"></div>
        </div>
    );
}
