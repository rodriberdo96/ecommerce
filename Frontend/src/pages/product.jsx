import React from './cjs/react.production.min.js'
import {useContext} from './cjs/react.production.min.js'
import {ShopContext} from '../../../frontend/src/context/shopcontext.jsx '
import './Css/Product.css'
import { useParams } from './umd/react-router-dom.production.min.js'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import ProductDisplay from '../components/ProductDisplay/ProductDisplay'
import DescriptionBox from '../components/DescriptionBox/DescriptionBox'
import RelatedProducts from '../components/RelatedProducts/RelatedProducts'

const Product = () => {
  const {all_product}=useContext(ShopContext);
  const {productId}=useParams();
  const product=all_product.find((e)=>e.id=== Number(productId));
  return (
    <div>
      <Breadcrumb product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox/>
      <RelatedProducts/>
    </div>
  )
}

export default Product