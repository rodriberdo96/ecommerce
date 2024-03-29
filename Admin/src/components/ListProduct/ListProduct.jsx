// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react'
import "./ListProduct.css"
import { useState } from "react"
import cross_icon from "../../assets/cross_icon.png"

const ListProduct = () => {
    const [allproducts, setAll_Products] = useState([])

    const fetchInfo = async () => {
        await fetch('http://localhost:4000/allproducts')
        .then(res => res.json()) 
        .then(data => {
            setAll_Products(data)
        })
    }

    const remove_Product = async (id) => {
        await fetch('http://localhost:4000/removeproduct', {
            method: 'POST',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id:id}),
        })
        await fetchInfo()
    }

    useEffect(() => {
        fetchInfo()
    }, [])

    return (
        <div className='list-product'>
            <h1>All Products List</h1>
            <div className="listproduct-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Old Price</p>
                <p>New Price</p>
                <p>Category</p>
                <p>Remove</p>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {allproducts.map((product, index) => {
                    return (<>
                        <div key={index} className="listproduct-format-main listproduct-format">
                            <img src={product.image} alt="product" className='listproduct-product-icon' />
                            <p>{product.name}</p>
                            <p>${product.old_price}</p>
                            <p>${product.new_price}</p>
                            <p>{product.category}</p>
                            <img onClick={()=> { remove_Product (product.id)}} className='listproduct-remove-icon' src={cross_icon} alt="" />
                        </div>
                        <hr />
                        </>
                    )
                })}
            </div>
        </div>
    )
}

export default ListProduct